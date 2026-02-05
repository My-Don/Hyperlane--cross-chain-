#!/usr/bin/env node

/**
 * 自动中继器：bee → bsc
 * 支持扫描历史消息和持续监听新消息
 */

const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

// 配置
const CONFIG = {
  bee: {
    rpc: 'https://rpc.beechain.ai',
    mailbox: '0x21ef2f69165348754c44AbB1327a565Aeea102ca',  // warp route 实际使用的 mailbox
    chainId: 3188,
  },
  bsc: {
    rpc: 'https://bsc-dataseed.binance.org/',
    mailbox: '0x2971b9Aec44bE4eb673DF1B88cDB57b96eefe8a4',
    chainId: 56,
  },
  relayerAddress: '0x5159eA8501d3746bB07c20B5D0406bD12844D7ec',
  checkInterval: 5000, // 5秒检查一次
  stateFile: 'logs/relayer-state.json',
  processedFile: 'logs/processed-messages.json',
  // 历史扫描配置
  scanBatchSize: 1000, // 每次扫描的区块数量
  maxRetries: 3,       // 最大重试次数
};

// Mailbox ABI
const MAILBOX_ABI = [
  'event Dispatch(address indexed sender, uint32 indexed destination, bytes32 indexed recipient, bytes message)',
  'function process(bytes metadata, bytes message) external',
  'function delivered(bytes32 messageId) external view returns (bool)',
];

// 日志函数
function log(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}

// 加载已处理的消息
function loadProcessedMessages() {
  try {
    if (fs.existsSync(CONFIG.processedFile)) {
      return JSON.parse(fs.readFileSync(CONFIG.processedFile, 'utf8'));
    }
  } catch (error) {
    log(`⚠️  加载已处理消息失败: ${error.message}`);
  }
  return {};
}

// 保存已处理的消息
function saveProcessedMessage(messageId, txHash, beeBlock) {
  const processed = loadProcessedMessages();
  processed[messageId] = {
    txHash,
    beeBlock,
    timestamp: new Date().toISOString(),
  };

  fs.mkdirSync(path.dirname(CONFIG.processedFile), { recursive: true });
  fs.writeFileSync(CONFIG.processedFile, JSON.stringify(processed, null, 2));
}

// 加载 relayer 状态（记录已扫描到的区块）
function loadState() {
  try {
    if (fs.existsSync(CONFIG.stateFile)) {
      return JSON.parse(fs.readFileSync(CONFIG.stateFile, 'utf8'));
    }
  } catch (error) {
    log(`⚠️  加载状态失败: ${error.message}`);
  }
  return { lastScannedBlock: null };
}

// 保存 relayer 状态
function saveState(state) {
  fs.mkdirSync(path.dirname(CONFIG.stateFile), { recursive: true });
  fs.writeFileSync(CONFIG.stateFile, JSON.stringify(state, null, 2));
}

// 计算消息ID
function calculateMessageId(message) {
  return ethers.keccak256(message);
}

// 中继消息
async function relayMessage(bscMailbox, messageId, message, beeBlock, retryCount = 0) {
  try {
    log(`📨 准备中继消息: ${messageId}`);
    log(`   来源区块: ${beeBlock}`);

    // 检查是否已处理
    const processed = loadProcessedMessages();
    if (processed[messageId]) {
      log(`⏭️  消息已处理过 (TX: ${processed[messageId].txHash})`);
      return true;
    }

    // 检查是否已在目标链上delivered
    const delivered = await bscMailbox.delivered(messageId);
    if (delivered) {
      log(`✅ 消息已在BSC上delivered（可能被其他中继器处理）`);
      saveProcessedMessage(messageId, 'already-delivered', beeBlock);
      return true;
    }

    // 构造 metadata (TrustedRelayerIsm 只需要 relayer 地址，放在32字节的后20字节)
    const relayerAddressHex = CONFIG.relayerAddress.slice(2).toLowerCase();
    const metadata = '0x' + '0'.repeat(24) + relayerAddressHex;

    log(`🔄 发送中继交易...`);
    log(`   Message 长度: ${(message.length - 2) / 2} bytes`);

    // 估算 gas
    let gasLimit = 500000n;
    try {
      const gasEstimate = await bscMailbox.process.estimateGas(metadata, message);
      gasLimit = gasEstimate * 120n / 100n; // 增加20%余量
      log(`   Gas estimate: ${gasEstimate.toString()}`);
    } catch (estimateError) {
      log(`   ⚠️  Gas 估算失败，使用固定值: ${gasLimit}`);
    }

    // 发送交易
    const tx = await bscMailbox.process(metadata, message, {
      gasLimit: gasLimit,
    });

    log(`   TX sent: ${tx.hash}`);
    log(`   等待确认...`);

    const receipt = await tx.wait();

    if (receipt.status === 1) {
      log(`✅ 中继成功!`);
      log(`   BSC TX: https://bscscan.com/tx/${tx.hash}`);
      log(`   Gas used: ${receipt.gasUsed.toString()}`);

      saveProcessedMessage(messageId, tx.hash, beeBlock);
      return true;
    } else {
      log(`❌ 交易失败`);
      return false;
    }

  } catch (error) {
    log(`❌ 中继失败: ${error.message}`);
    if (error.reason) {
      log(`   Reason: ${error.reason}`);
    }

    // 重试逻辑
    if (retryCount < CONFIG.maxRetries) {
      log(`   ⏳ ${3}秒后重试 (${retryCount + 1}/${CONFIG.maxRetries})...`);
      await new Promise(resolve => setTimeout(resolve, 3000));
      return relayMessage(bscMailbox, messageId, message, beeBlock, retryCount + 1);
    }

    return false;
  }
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  const fromBlockArg = args.find(arg => arg.startsWith('--from='));
  const scanOnlyArg = args.includes('--scan-only');

  log('🚀 启动自动中继器：bee → bsc');
  log('================================');
  log('');

  // 检查私钥
  const privateKey = process.env.HYP_KEY;
  if (!privateKey) {
    log('❌ 请设置环境变量 HYP_KEY（中继器私钥）');
    process.exit(1);
  }

  // 初始化 providers
  const beeProvider = new ethers.JsonRpcProvider(CONFIG.bee.rpc);
  const bscProvider = new ethers.JsonRpcProvider(CONFIG.bsc.rpc);

  // 初始化 wallets
  const bscWallet = new ethers.Wallet(privateKey, bscProvider);

  // 初始化合约
  const beeMailbox = new ethers.Contract(CONFIG.bee.mailbox, MAILBOX_ABI, beeProvider);
  const bscMailbox = new ethers.Contract(CONFIG.bsc.mailbox, MAILBOX_ABI, bscWallet);

  log(`✅ 配置加载完成`);
  log(`   Bee Mailbox: ${CONFIG.bee.mailbox}`);
  log(`   BSC Mailbox: ${CONFIG.bsc.mailbox}`);
  log(`   中继器地址: ${CONFIG.relayerAddress}`);
  log(`   BSC Wallet: ${bscWallet.address}`);
  log('');

  // 验证中继器地址
  if (bscWallet.address.toLowerCase() !== CONFIG.relayerAddress.toLowerCase()) {
    log(`⚠️  警告: 钱包地址 (${bscWallet.address}) 与配置的中继器地址不匹配`);
    log('');
  }

  // 获取当前区块
  const currentBlock = await beeProvider.getBlockNumber();
  log(`   当前 Bee 链区块: ${currentBlock}`);

  // 确定起始区块
  let state = loadState();
  let startBlock;

  if (fromBlockArg) {
    // 命令行指定起始区块
    startBlock = parseInt(fromBlockArg.split('=')[1]);
    log(`   命令行指定起始区块: ${startBlock}`);
  } else if (state.lastScannedBlock) {
    // 从上次扫描的位置继续
    startBlock = state.lastScannedBlock + 1;
    log(`   从上次位置继续: ${startBlock}`);
  } else {
    // 首次运行，从当前区块开始
    startBlock = currentBlock;
    log(`   首次运行，从当前区块开始: ${startBlock}`);
  }

  log('');

  // 扫描历史消息
  if (startBlock < currentBlock) {
    log(`🔍 扫描历史消息 (区块 ${startBlock} 到 ${currentBlock})...`);
    log('');

    let scanBlock = startBlock;
    while (scanBlock <= currentBlock) {
      const endBlock = Math.min(scanBlock + CONFIG.scanBatchSize - 1, currentBlock);

      log(`   扫描区块 ${scanBlock} - ${endBlock}...`);

      try {
        const filter = beeMailbox.filters.Dispatch();
        const events = await beeMailbox.queryFilter(filter, scanBlock, endBlock);

        log(`   找到 ${events.length} 个 Dispatch 事件`);

        if (events.length > 0) {
          for (const event of events) {
            const { sender, destination, message } = event.args;

            // 只处理发往 BSC 的消息
            if (Number(destination) !== CONFIG.bsc.chainId) {
              continue;
            }

            log('');
            log(`📨 处理 bee → bsc 消息:`);
            log(`   Sender: ${sender}`);
            log(`   Block: ${event.blockNumber}`);
            log(`   TX: ${event.transactionHash}`);

            const messageId = calculateMessageId(message);
            log(`   Message ID: ${messageId}`);

            await relayMessage(bscMailbox, messageId, message, event.blockNumber);
            log('');
          }
        }

        // 更新状态
        state.lastScannedBlock = endBlock;
        saveState(state);

        scanBlock = endBlock + 1;
      } catch (error) {
        log(`   ❌ 扫描失败: ${error.message}`);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }

    log(`✅ 历史消息扫描完成`);
    log('');
  }

  // 如果只是扫描模式，退出
  if (scanOnlyArg) {
    log('📊 扫描完成（--scan-only 模式）');
    return;
  }

  // 开始持续监听
  let lastCheckedBlock = currentBlock;

  log(`🎯 开始监听新消息...`);
  log(`   起始区块: ${lastCheckedBlock}`);
  log('');
  log('✅ 中继器已启动，按 Ctrl+C 停止');
  log('');

  // 轮询检查新事件
  async function pollEvents() {
    try {
      const currentBlock = await beeProvider.getBlockNumber();

      if (currentBlock > lastCheckedBlock) {
        log(`🔍 检查区块 ${lastCheckedBlock + 1} 到 ${currentBlock}...`);

        // 查询 Dispatch 事件
        const filter = beeMailbox.filters.Dispatch();

        try {
          const events = await beeMailbox.queryFilter(
            filter,
            lastCheckedBlock + 1,
            currentBlock
          );

          if (events.length > 0) {
            log(`🔔 发现 ${events.length} 个新 Dispatch 事件!`);

            for (const event of events) {
              const { sender, destination, message } = event.args;

              // 只处理发往 BSC 的消息
              if (Number(destination) !== CONFIG.bsc.chainId) {
                log(`⏭️  跳过非BSC消息 (destination: ${destination})`);
                continue;
              }

              log('');
              log(`📨 处理 bee → bsc 消息:`);
              log(`   Sender: ${sender}`);
              log(`   Destination: ${destination}`);
              log(`   Block: ${event.blockNumber}`);
              log(`   TX: ${event.transactionHash}`);

              const messageId = calculateMessageId(message);
              log(`   Message ID: ${messageId}`);

              await relayMessage(bscMailbox, messageId, message, event.blockNumber);
              log('');
            }
          } else {
            // 没有新事件，静默
          }
        } catch (queryError) {
          log(`❌ 查询事件失败: ${queryError.message}`);
        }

        // 更新状态
        lastCheckedBlock = currentBlock;
        state.lastScannedBlock = currentBlock;
        saveState(state);
      }

    } catch (error) {
      log(`❌ 轮询出错: ${error.message}`);
    }
  }

  // 立即执行一次
  await pollEvents();

  // 定期轮询
  setInterval(pollEvents, CONFIG.checkInterval);

  // 定期输出心跳
  setInterval(() => {
    log('💓 中继器运行中...');
  }, 60000); // 每分钟
}

// 错误处理
process.on('unhandledRejection', (error) => {
  log(`❌ 未处理的Promise拒绝: ${error.message}`);
  console.error(error);
});

process.on('SIGINT', () => {
  log('');
  log('👋 收到停止信号，正在关闭...');
  process.exit(0);
});

// 启动
main().catch((error) => {
  log(`❌ 启动失败: ${error.message}`);
  console.error(error);
  process.exit(1);
});
