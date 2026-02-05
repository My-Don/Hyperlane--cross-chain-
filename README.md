# 接入hyperlane实现跨链

---

## 前提

### 1）安装 nodejs

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 18
nvm --version
nvm use 18
node -v
```

---

### 2）安装 foudry

```bash
export http_proxy=http://127.0.0.1:7890
export https_proxy=http://127.0.0.1:7890
curl -L https://foundry.paradigm.xyz | bash
source ~/.bashrc
foundryup
cast --version
```

---

### 3）安装 cli 工具

```bash
npm uninstall -g @hyperlane-xyz/cli
npm i -g @hyperlane-xyz/cli@latest
```

---

### 4）安装 git 与 unzip

```bash
sudo apt update
sudo apt install -y git
sudo apt install -y unzip
unzip -v
git --version
```

---

### 5）测试 registry 访问

```bash
node -e "fetch('https://raw.githubusercontent.com/hyperlane-xyz/hyperlane-registry/main/chains.yaml').then(()=>console.log('ok')).catch(console.error)"
```

必须打印 `ok`，才能下一步。

---

### 6）克隆注册表并解压

```bash
git clone https://github.com/hyperlane-xyz/hyperlane-registry
```

ps：如果 git 拉取报错，那么手动下载下来。

```bash
unzip hyperlane-registry-main
cd hyperlane-registry-main
```

---

### 7）配置自己的链信息

👉 本质是：  
“我要维护一个 registry（给别人/自己用）”

```bash
hyperlane registry init
```

终端打印信息：

```text
Hyperlane CLI
Creating a new chain config
? Enter http or https rpc url: https://rpc.beechain.ai
? Enter chain name (one word, lower case) bee
? Enter chain display name Bee
? Using chain id as 3188 from JSON RPC provider, is this correct? yes
? Is this chain a testnet (a chain used for testing & development)? no
? Select the chain technical stack other
? Do you want to add a block explorer config for this chain yes
? Enter a human readable name for the explorer: https://scan.beechain.ai
? Enter the base URL for the explorer: https://scan.beechain.ai
? Enter the base URL for requests to the explorer API: https://scan.beechain.ai/api
? Select the type (family) of block explorer: other
? Optional: Provide an API key for the explorer, or press 'enter' to skip. Please be sure to remove this field if you intend to add your config to the Hyperlane registry: empty
? Do you want to set block or gas properties for this chain config no
? Do you want to set native token properties for this chain config (defaults to ETH) yes
? Enter the native token's symbol: BKC
? Enter the native token's name: BKC Token
? Enter the native token's decimals: 18
```

---

### 8）配置并部署 Core 合约

```bash
export HYP_KEY='私钥不带0x'
hyperlane core init
```

hyperlane core init 的意义：

- 初始化这条链的 Core 部署配置
- 生成 `.hyperlane/` 目录
- 记录 RPC / chainId / domain / owner / ISM 类型

👉 本质是：  
“我要在某条链上部署 Hyperlane Core”

---

### 9）部署 Core 合约

```bash
hyperlane core deploy
```

先在 bee 链部署，再在 sepolia 部署。

---

### 10）配置 warp 路由

```bash
hyperlane warp init
```

按提示依次配置 bee / sepolia。

---

### 12）部署 Warp Route

```bash
mkdir -p ~/.hyperlane/configs
cat > ~/.hyperlane/configs/warp-route-deployment.yaml << 'EOF'
bee:
  type: synthetic
  owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
  proxyAdmin:
    address: "0x20B3B53145B426f8b9e5D7a7c71140c2415d79e7"
    owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"

sepolia:
  type: collateral
  token: "0x777494cD0d3556c08efCE64eeC10b5842434F5c0"
  owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
  proxyAdmin:
    address: "0x5A4b212c4691DCCf2D1F3B5fA1063dAbFfA05EAA"
    owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
EOF
```

```bash
hyperlane warp deploy --config ~/.hyperlane/configs/warp-route-deployment.yaml
```

ps：文件位置：`$HOME/.hyperlane/deployments/warp_routes/`

---

### 13）测试跨链转账

#### 前置步骤：授权 Token（仅 Collateral 类型）

```bash
cast send 0x777494cD0d3556c08efCE64eeC10b5842434F5c0 \
  "approve(address,uint256)" \
  0x4f41f6f6d060b7C9Fb8274c84a8807d96d7925d8 \
  115792089237316195423570985008687907853269984665640564039457584007913129639935 \
  --rpc-url https://sepolia.infura.io/v3/e463f6ea90ed48c69b353530d89babb9 \
  --private-key $HYP_KEY
```

---

### 14）跨链转账

#### sepolia ➜ bee

```bash
hyperlane warp send \
  --symbol SNC \
  --origin sepolia \
  --destination bee \
  --amount 1000000000000000000 \
  --relay
```

#### bee ➜ sepolia

```bash
hyperlane warp send \
  --symbol SNC \
  --origin bee \
  --destination sepolia \
  --amount 1000000000000000000 \
  --relay
```

---

### 前端执行跨链操作

```js
// 1. 授权 Token
await tokenContract.approve(warpRouteAddress, ethers.MaxUint256);

// 2. 跨链转账
const tx = await warpRouteContract.transferRemote(
  destinationDomainId,
  recipientBytes32,
  amountWei,
  { value: gasPayment }
);
```


---

### 前端操作步骤

#### 1. 用户授权 USDT 给 Warp Route 合约

```javascript
// 前端代码（ethers.js 示例）
const USDT_ADDRESS = '0x...';  // Bee 链上的 USDT 地址
const WARP_ROUTE = '0xdce906c2195c3c25b1bc42dbe1df2ade45791b49';  // Bee 链上的 Warp Route

// ERC20 approve
const usdtContract = new ethers.Contract(USDT_ADDRESS, ['function approve(address,uint256)'], signer);
await usdtContract.approve(WARP_ROUTE, amount);
```

---

#### 2. 调用 Warp Route 的 transferRemote

```javascript
const WARP_ROUTE_ABI = [
  'function transferRemote(uint32 destination, bytes32 recipient, uint256 amount) external payable returns (bytes32)'
];

const warpRoute = new ethers.Contract(WARP_ROUTE, WARP_ROUTE_ABI, signer);

// 目标链 chainId（BSC = 56）
const destinationChain = 56;

// 收款人地址（转换为 bytes32 格式）
const recipientAddress = ethers.zeroPadValue(userAddress, 32);

// 转账金额
const amount = ethers.parseUnits('100', 18);  // 100 USDT

// 执行跨链转账
const tx = await warpRoute.transferRemote(destinationChain, recipientAddress, amount);
await tx.wait();
console.log('跨链消息已发送，等待中继...');
```

---

### 后端 Relayer 服务

您需要持续运行 

auto-relayer-final.js

来自动中继消息：

```bash
# 在服务器上持续运行（可用 pm2 或 systemd 管理）
export HYP_KEY=relayer的私钥
pm2 start auto-relayer-final.js --name hyperlane-relayer
```

---

### 完整前端示例

```javascript
async function crossChainTransfer(signer, amount, recipientAddress) {
  const BEE_USDT = '0x...';  // Bee 链 USDT 地址
  const WARP_ROUTE = '0xdce906c2195c3c25b1bc42dbe1df2ade45791b49';
  const BSC_CHAIN_ID = 56;

  // 1. 授权
  const usdt = new ethers.Contract(BEE_USDT, ['function approve(address,uint256)'], signer);
  const approveTx = await usdt.approve(WARP_ROUTE, amount);
  await approveTx.wait();

  // 2. 跨链转账
  const warpRoute = new ethers.Contract(WARP_ROUTE, [
    'function transferRemote(uint32,bytes32,uint256) payable returns (bytes32)'
  ], signer);

  const recipient = ethers.zeroPadValue(recipientAddress, 32);
  const transferTx = await warpRoute.transferRemote(BSC_CHAIN_ID, recipient, amount);
  const receipt = await transferTx.wait();

  // 从日志中获取 message ID（可选，用于追踪）
  console.log('交易成功，消息将被自动中继到 BSC');
  return receipt.hash;
}
```

---

### 关键点

```text
项目        说明
用户操作    授权 + transferRemote（在 Bee 链上支付 gas）
Relayer     自动监听并中继（在 BSC 链上支付 gas）
用户体验    用户只需等待几秒到几分钟，USDT 就会到达 BSC
```


