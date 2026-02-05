接入hyperlane教程

前提
1)安装nodejs
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 18
nvm --version
nvm use 18
node -v

2)安装foudry
export http_proxy=http://127.0.0.1:7890
export https_proxy=http://127.0.0.1:7890
curl -L https://foundry.paradigm.xyz | bash
source ~/.bashrc
foundryup
cast --version


3)安装cli工具
npm uninstall -g @hyperlane-xyz/cli
npm i -g @hyperlane-xyz/cli@latest


4)安装git与unzip
sudo apt update
sudo apt install -y git
sudo apt install -y unzip
unzip -v
git --version

5)测试 registry 访问
node -e "fetch('https://raw.githubusercontent.com/hyperlane-xyz/hyperlane-registry/main/chains.yaml').then(()=>console.log('ok')).catch(console.error)"
必须打印ok，才能下一步

6)克隆注册表并解压
git clone  https://github.com/hyperlane-xyz/hyperlane-registry
ps:如果git拉取报错,那么手动下载下来
unzip hyperlane-registry-main
cd hyperlane-registry-main

7)配置自己的链信息
👉 本质是：
“我要维护一个 registry（给别人/自己用）”
hyperlane registry init
ps终端打印信息
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
Chain config is valid, writing unsorted to registry:
    blockExplorers:
      - apiKey: empty
        apiUrl: https://scan.beechain.ai/api
        family: other
        name: https://scan.beechain.ai
        url: https://scan.beechain.ai
    chainId: 3188
    displayName: Bee
    domainId: 3188
    isTestnet: false
    name: bee
    nativeToken:
      decimals: 18
      name: BKC Token
      symbol: BKC
    protocol: ethereum
    rpcUrls:
      - http: https://rpc.beechain.ai
    technicalStack: other

Skipping updating chain bee at github registry (not supported)
Now updating chain bee at filesystem registry at /root/.hyperlane
Done updating chain bee at filesystem registry

8）配置，部署核心合约
export HYP_KEY='私钥不带0x'
hyperlane core init   
终端打印如下
Hyperlane CLI
Hyperlane Core Configure
________________________
Creating a new core deployment config...
? Using owner address as 0x5159eA8501d3746bB07c20B5D0406bD12844D7ec from signer, is this correct? yes
Creating trustedRelayerIsm...
Created trustedRelayerIsm!
Creating merkleTreeHook...
Created merkleTreeHook!
Creating protocolFee...
? Use this same address (0x5159eA8501d3746bB07c20B5D0406bD12844D7ec) for the beneficiary? yes
Created protocolFee!
Core config is valid, writing to file ./configs/core-config.yaml:

    owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
    defaultIsm:
      type: trustedRelayerIsm
      relayer: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
    defaultHook:
      type: merkleTreeHook
    requiredHook:
      owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
      type: protocolFee
      beneficiary: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
      maxProtocolFee: "100000000000000000"
      protocolFee: "0"
    proxyAdmin:
      owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"

✅ Successfully created new core deployment config.


hyperlane core init的意义
作用：初始化 “这条链的 Core 部署配置”

生成：

.hyperlane/ 目录

core deployment 的本地配置

记录：

RPC

chainId

domain

owner

ISM 类型 / validators

👉 本质是：
“我要在某条链上部署 Hyperlane Core”


9)部署合同
hyperlane core deploy
终端打印如下，代表成功，这是在bee链部署合约，我们还得去sepolia部署合约
Hyperlane CLI
? Select network type Testnet
✔ Select chain to connect: bee
Hyperlane Core deployment
_________________________

Deployment plan
===============
Transaction signer and owner of new contracts: 0x5159eA8501d3746bB07c20B5D0406bD12844D7ec
Deploying core contracts to network: bee
┌────────────────────────┬───────────────────────────┐
│        (index)         │          Values           │
├────────────────────────┼───────────────────────────┤
│          Name          │           'bee'           │
│      Display Name      │           'Bee'           │
│        Chain ID        │           3188            │
│       Domain ID        │           3188            │
│        Protocol        │        'ethereum'         │
│      JSON RPC URL      │ 'https://rpc.beechain.ai' │
│  Native Token: Symbol  │           'BKC'           │
│   Native Token: Name   │        'BKC Token'        │
│ Native Token: Decimals │            18             │
└────────────────────────┴───────────────────────────┘
Note: There are several contracts required for each chain, but contracts in your provided registries will be skipped.
? Is this deployment plan correct? yes
Running pre-flight checks for chains...
✅ Bee signer is valid
✅ Chains are valid
✅ Balances are sufficient
🚀 All systems ready, captain! Beginning deployment...
Deploying to bee from https://scan.beechain.ai/address/0x5159eA8501d3746bB07c20B5D0406bD12844D7ec
Deploying staticMerkleRootMultisigIsmFactory on bee with constructor args ()...
Pending https://scan.beechain.ai/tx/0xb3a23d60532596df85618e8af5ce8e803363499cfc2cbfb06bf7f98639c47ecd (waiting 1 blocks for confirmation)
Deploying staticMessageIdMultisigIsmFactory on bee with constructor args ()...
Pending https://scan.beechain.ai/tx/0x4c0894f7a0c3ef4f875a7631a5c2645a4b20e8dd57d4ef45ee0e74f859a49d4c (waiting 1 blocks for confirmation)
Deploying staticAggregationIsmFactory on bee with constructor args ()...
Pending https://scan.beechain.ai/tx/0xb569fbe2b544ed949ede14df1ddd2207f2f650f298fd979a7367a4ae928d54ef (waiting 1 blocks for confirmation)
Deploying staticAggregationHookFactory on bee with constructor args ()...
Pending https://scan.beechain.ai/tx/0xdadaf5ddd9e8322074b8c6ff9213c42017fc45443f893d816c84e6a1bdc5aa8c (waiting 1 blocks for confirmation)
Deploying domainRoutingIsmFactory on bee with constructor args ()...
Pending https://scan.beechain.ai/tx/0x867c3d4083c18732ae21355a9525d037f7bb15c7fe8a2406d761c85c2a32b574 (waiting 1 blocks for confirmation)
Deploying staticMerkleRootWeightedMultisigIsmFactory on bee with constructor args ()...
Pending https://scan.beechain.ai/tx/0xbf5b34452658c755016020a3e8395c00ca0debf6034a80d1d04bf084957d5e35 (waiting 1 blocks for confirmation)
Deploying staticMessageIdWeightedMultisigIsmFactory on bee with constructor args ()...
Pending https://scan.beechain.ai/tx/0x7fd02681ba9a30de5d07a325c2d0e6bb626b9c6a9d8234e7e8e96ca89202e4c0 (waiting 1 blocks for confirmation)
Successfully deployed contracts on bee
Deploying proxyAdmin on bee with constructor args ()...
Pending https://scan.beechain.ai/tx/0x34c22b2c60c86939651c5c2820eeb416671bdccd67659c33595e5b5c4020f05d (waiting 1 blocks for confirmation)
Deploying mailbox on bee with constructor args (3188)...
Pending https://scan.beechain.ai/tx/0xf05310a911aa6af9ca7a00348cd102766f2f17aa4ce9cf7c3fb03409d94f213b (waiting 1 blocks for confirmation)
Deploying TransparentUpgradeableProxy on bee with constructor args (0x1aBdA508c3988DFC7be5f0152eC365eF5E239bcF, 0xd0F50d31a81fd7Daea53d0dE1BD8a798D325e339, 0x)...
Pending https://scan.beechain.ai/tx/0x512ff1909baa62564426777aabe9362161c22fc46c5709c0f18e72fd2823c94c (waiting 1 blocks for confirmation)
Deploying trustedRelayerIsm on bee with constructor args (0xaA062B9eC80EC1777928804dF55511e29BE53Abc, 0x5159eA8501d3746bB07c20B5D0406bD12844D7ec)...
Pending https://scan.beechain.ai/tx/0x9f01f89faa452eb1d5cb33a8e8d41c793dc53a7d3ef31b35ba49c0a36cdb8b1e (waiting 1 blocks for confirmation)
Deploying merkleTreeHook on bee with constructor args (0xaA062B9eC80EC1777928804dF55511e29BE53Abc)...
Pending https://scan.beechain.ai/tx/0x48bfdd5c1ba01ec776dbee54f34a0b37fb3c412150f329aa632bff26aa735316 (waiting 1 blocks for confirmation)
Deploying protocolFee on bee with constructor args (100000000000000000, 0, 0x5159eA8501d3746bB07c20B5D0406bD12844D7ec, 0x5159eA8501d3746bB07c20B5D0406bD12844D7ec)...
Pending https://scan.beechain.ai/tx/0xe82a6aa00d0849755a77bf46b117b17ba15b9ae2bf202c925de64412d2ff10f0 (waiting 1 blocks for confirmation)
Pending https://scan.beechain.ai/tx/0xe27611165dbb25bfebdf4dd102f8222580ccc269c38a8eeb51e319d5c848defc (waiting 1 blocks for confirmation)
Deploying interchainAccountRouter on bee with constructor args (0xaA062B9eC80EC1777928804dF55511e29BE53Abc, 0x0000000000000000000000000000000000000000, 0x5159eA8501d3746bB07c20B5D0406bD12844D7ec, 50000, https://commitment-read-ism.hyperlane.xyz)...
Pending https://scan.beechain.ai/tx/0x14ea87885d4f3f834440d17fd0c6e19644be1d01d86c818e2c1b7d8b6b4d4ea9 (waiting 1 blocks for confirmation)
Deploying validatorAnnounce on bee with constructor args (0xaA062B9eC80EC1777928804dF55511e29BE53Abc)...
Pending https://scan.beechain.ai/tx/0x17f5766b840c55473d057996969f17f199e7a3020236fc45fcea8d8b32241df3 (waiting 1 blocks for confirmation)
Deploying testRecipient on bee with constructor args ()...
Pending https://scan.beechain.ai/tx/0x6e3322512c3bff6f3153c0adac88c0bd4259c52f2d644b4d3944a1542071bd18 (waiting 1 blocks for confirmation)
Sent tx 0x058268a6f0719294163be3927210123a5b28fc327f90f44ed8ee81160e7c0c9e
Pending https://scan.beechain.ai/tx/0x058268a6f0719294163be3927210123a5b28fc327f90f44ed8ee81160e7c0c9e (waiting 1 blocks for confirmation)
⛽️ Gas Usage Statistics
        - Gas required for core deploy on bee: 2.808238908 BKC
Skipping updating chain bee at github registry (not supported)
Now updating chain bee at filesystem registry at /root/.hyperlane
Done updating chain bee at filesystem registry
✅ Core contract deployments complete:

    staticMerkleRootMultisigIsmFactory: "0x24373F676723Aae467475DbF287F9d7d0F98dF81"
    staticMessageIdMultisigIsmFactory: "0x7f7a9443272ad5C1F970efaa607735D242074528"
    staticAggregationIsmFactory: "0x4dB465930cDda11D4C681666d0F8BbCB828ff01f"
    staticAggregationHookFactory: "0xdBda5305028b2a75956baF2740BbB699Ac24c312"
    domainRoutingIsmFactory: "0xDBE7C78d333c300801cA88Fbf36Afc3d2EA30773"
    staticMerkleRootWeightedMultisigIsmFactory: "0x10Cd98b7DDaB859754AB67dD26fb3110609cCD03"
    staticMessageIdWeightedMultisigIsmFactory: "0xC7d0D69ECFd6c7861f31cD176878E7B08362dFE7"
    proxyAdmin: "0xd0F50d31a81fd7Daea53d0dE1BD8a798D325e339"
    mailbox: "0xaA062B9eC80EC1777928804dF55511e29BE53Abc"
    interchainAccountRouter: "0x339993a36319eA6Bc2A0260dF5Cf12123333F5f5"
    validatorAnnounce: "0x87ef6FAe84C6322b907D3F07754276dDED94C501"
    testRecipient: "0x044Ed509FfD11ff8B5eA85a1D2d8ea5C0652CCc6"
    merkleTreeHook: "0xA1bF75ac1699110985020ffB134354f5A0C23439"


hyperlane core deploy
终端打印如下
Hyperlane CLI
? Select network type Testnet
? Select chain to connect:
✔ Select chain to connect: sepolia
Hyperlane Core deployment
_________________________

Deployment plan
===============
Transaction signer and owner of new contracts: 0x5159eA8501d3746bB07c20B5D0406bD12844D7ec
Deploying core contracts to network: sepolia
┌────────────────────────┬───────────────────────────────────────────┐
│        (index)         │                  Values                   │
├────────────────────────┼───────────────────────────────────────────┤
│          Name          │                 'sepolia'                 │
│      Display Name      │                 'Sepolia'                 │
│        Chain ID        │                 11155111                  │
│       Domain ID        │                 11155111                  │
│        Protocol        │                'ethereum'                 │
│      JSON RPC URL      │ 'https://ethereum-sepolia.publicnode.com' │
│  Native Token: Symbol  │                   'ETH'                   │
│   Native Token: Name   │                  'Ether'                  │
│ Native Token: Decimals │                    18                     │
└────────────────────────┴───────────────────────────────────────────┘

10)配置warp路由
root@ubuntu:~# hyperlane warp init
Hyperlane CLI
Hyperlane Warp Configure
________________________
Creating a new warp route deployment config...
? Select network type Testnet
? Select chains to connect bee, sepolia
? Is this chain selection correct?: bee, sepolia yes
bee: Configuring warp route...
? Enter the desired owner address: 0x5159eA8501d3746bB07c20B5D0406bD12844D7ec
? Use an existing Proxy Admin contract for the warp route deployment on chain "bee"? yes
? Please enter the address of the Proxy Admin contract to be used on chain "bee": 0x20B3B53145B426f8b9e5D7a7c71140c2415d79e7
? Do you want to use a trusted ISM for warp route? yes
? Select bee's token type synthetic
sepolia: Configuring warp route...
? Enter the desired owner address: 0x5159eA8501d3746bB07c20B5D0406bD12844D7ec
? Use an existing Proxy Admin contract for the warp route deployment on chain "sepolia"? yes
? Please enter the address of the Proxy Admin contract to be used on chain "sepolia": 0x5A4b212c4691DCCf2D1F3B5fA1063dAbFfA05EAA
? Do you want to use a trusted ISM for warp route? yes
? Select sepolia's token type collateral
? Enter the existing token address on chain sepolia 0x777494cD0d3556c08efCE64eeC10b5842434F5c0
Warp Route config is valid, writing to file undefined:

    bee:
      isNft: false
      type: synthetic
      owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
      interchainSecurityModule:
        type: staticAggregationIsm
        modules:
          - type: trustedRelayerIsm
            relayer: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
          - owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
            type: defaultFallbackRoutingIsm
            domains: {}
        threshold: 1
      proxyAdmin:
        owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
        address: "0x20B3B53145B426f8b9e5D7a7c71140c2415d79e7"
    sepolia:
      type: collateral
      token: "0x777494cD0d3556c08efCE64eeC10b5842434F5c0"
      owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
      interchainSecurityModule:
        type: staticAggregationIsm
        modules:
          - type: trustedRelayerIsm
            relayer: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
          - owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
            type: defaultFallbackRoutingIsm
            domains: {}
        threshold: 1
      proxyAdmin:
        owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
        address: "0x5A4b212c4691DCCf2D1F3B5fA1063dAbFfA05EAA"
    
? Using warp route ID as SNC/bee from warp deployment config, is this correct? yes
Skipping adding warp route deploy config at github registry (not supported)
Now adding warp route deploy config at filesystem registry at /root/.hyperlane
Done adding warp route deploy config at filesystem registry
✅ Successfully created new warp route deployment config with warp route id: SNC/bee


12)部署 Warp Route
# 创建配置目录
mkdir -p ~/.hyperlane/configs
# 创建配置文件
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


root@ubuntu:~# hyperlane warp deploy --config ~/.hyperlane/configs/warp-route-deployment.yaml
Hyperlane CLI
Using warp route deployment config at /root/.hyperlane/configs/warp-route-deployment.yaml
Hyperlane Warp Route Deployment
_______________________________

Warp Route Deployment Plan
==========================
📋 Token Standard: ERC20
📋 Warp Route Config:
┌─────────┬───────┬──────────────┬──────────────────────────────────────────────┬──────────────────────────────────────────────┬───────────────────────────────┐
│ (index) │ NFT?  │     Type     │                    Owner                     │                   Mailbox                    │         ISM Config(s)         │
├─────────┼───────┼──────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼───────────────────────────────┤
│   bee   │ false │ 'synthetic'  │ '0x5159eA8501d3746bB07c20B5D0406bD12844D7ec' │ '0x21ef2f69165348754c44AbB1327a565Aeea102ca' │ 'No ISM config(s) specified.' │
│ sepolia │ false │ 'collateral' │ '0x5159eA8501d3746bB07c20B5D0406bD12844D7ec' │ '0xF87962c581F15Ae4B0aa51977A52710c224655dF' │ 'No ISM config(s) specified.' │
└─────────┴───────┴──────────────┴──────────────────────────────────────────────┴──────────────────────────────────────────────┴───────────────────────────────┘
? Is this deployment plan correct? yes
Running pre-flight checks for chains...
✅ Bee signer is valid
✅ Sepolia signer is valid
✅ Chains are valid
✅ Balances are sufficient
🚀 All systems ready, captain! Beginning deployment...
Config Ism is empty, skipping deployment.
Config Ism is empty, skipping deployment.
Config Hook is empty, skipping deployment.
Config Hook is empty, skipping deployment.
Deploying to bee from https://scan.beechain.ai/address/0x5159eA8501d3746bB07c20B5D0406bD12844D7ec
Deploying to sepolia from https://sepolia.etherscan.io/address/0x5159eA8501d3746bB07c20B5D0406bD12844D7ec
Deploying HypERC20 on bee with constructor args (18, 1, 0x21ef2f69165348754c44AbB1327a565Aeea102ca)...
Pending https://scan.beechain.ai/tx/0x72b1b62667f57474b59b9db156f3bf6ea48840ea0169f729b931215c74e2111a (waiting 1 blocks for confirmation)
Deploying HypERC20Collateral on sepolia with constructor args (0x777494cD0d3556c08efCE64eeC10b5842434F5c0, 1, 0xF87962c581F15Ae4B0aa51977A52710c224655dF)...
Pending https://scan.beechain.ai/tx/0x569fb63ffa0cb30cda891e1d8a327aef925492f11b33df03c01b7646c5e6173e (waiting 1 blocks for confirmation)
Pending https://sepolia.etherscan.io/tx/0x35ef38d24b0a8a0549bb74a6c68e6b857e62ca250128b574c7338de88ba56104 (waiting 1 blocks for confirmation)
Deploying TransparentUpgradeableProxy on bee with constructor args (0xCA1746546fF43E09fa6e9D0B25A6E17E8F4C4BE8, 0x20B3B53145B426f8b9e5D7a7c71140c2415d79e7, 0xe80a7c79000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005159ea8501d3746bb07c20b5d0406bd12844d7ec0000000000000000000000000000000000000000000000000000000000000009534e4320546f6b656e00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003534e430000000000000000000000000000000000000000000000000000000000)...
Pending https://scan.beechain.ai/tx/0xf2999a042aa97d619679823dc156c7c5b23a7ab5276809a9d53be444ef756567 (waiting 1 blocks for confirmation)
Successfully deployed contracts on bee
Pending https://sepolia.etherscan.io/tx/0x2cfc652969d89f060d55f667fc1c8b204e72b9a572ed815b1bf959f532760fd4 (waiting 1 blocks for confirmation)
Deploying TransparentUpgradeableProxy on sepolia with constructor args (0xEB7492A0971e131A2b3991DD0a840BD8f5Fd71aa, 0x5A4b212c4691DCCf2D1F3B5fA1063dAbFfA05EAA, 0xc0c53b8b000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005159ea8501d3746bb07c20b5d0406bd12844d7ec)...
Pending https://sepolia.etherscan.io/tx/0x8fab63b654b0427a7a0315b72a9725c837a5e8abed2ede3e9c3754a90c9512fc (waiting 1 blocks for confirmation)
Successfully deployed contracts on sepolia
Pending https://scan.beechain.ai/tx/0x95642a7f7f6ee08e34dd9c6dd543d32380f0385a358a295c46d2328f61d17e05 (waiting 1 blocks for confirmation)
Pending https://sepolia.etherscan.io/tx/0xe2c19b96c6294086123754df99ce8049e4f9338526c6ba3e0e5b6b7a0685d262 (waiting 1 blocks for confirmation)
Pending https://scan.beechain.ai/tx/0xd0dacd7ba0ef2ed67a2ab05bd9555a76a456399ca9d6a14c5fa7a3a98c1b1b4d (waiting 1 blocks for confirmation)
Pending https://sepolia.etherscan.io/tx/0xc45cd4a3b6af012a2d93526e7c610e1538ba663841bc34adc67f977e026679ac (waiting 1 blocks for confirmation)
✅ Warp contract deployments complete
Start enrolling cross chain routers
Comparing target Hook config with current one for bee chain
Comparing target Hook config with current one for sepolia chain
Writing deployment artifacts...
Skipping adding warp route at github registry (not supported)
Now adding warp route at filesystem registry at /root/.hyperlane
Done adding warp route at filesystem registry
    tokens:
      - chainName: bee
        standard: EvmHypSynthetic
        decimals: 18
        symbol: SNC
        name: SNC Token
        addressOrDenom: "0x6837928d6D971d5e766c5E1481cE41537d0771e7"
        connections:
          - token: ethereum|sepolia|0x4f41f6f6d060b7C9Fb8274c84a8807d96d7925d8
      - chainName: sepolia
        standard: EvmHypCollateral
        decimals: 18
        symbol: SNC
        name: SNC Token
        addressOrDenom: "0x4f41f6f6d060b7C9Fb8274c84a8807d96d7925d8"
        collateralAddressOrDenom: "0x777494cD0d3556c08efCE64eeC10b5842434F5c0"
        connections:
          - token: ethereum|bee|0x6837928d6D971d5e766c5E1481cE41537d0771e7
    
⛽️ Gas Usage Statistics
	- Gas required for warp deploy on bee: 0.542674476 BKC Token 
	- Gas required for warp deploy on sepolia: 0.00634390617770584 ETH

ps:文件位置：`$HOME/.hyperlane/deployments/warp_routes/`


13) 测试跨链转账

### 前置步骤：授权 Token（仅 Collateral 类型）

**如果你使用的是 Collateral 类型的 Warp Route，需要先授权 Token 给 Warp Route 合约。**

查看 Warp Route 合约地址：

```bash
root@ubuntu:~# cat ~/.hyperlane/deployments/warp_routes/SNC/*
bee:
  interchainSecurityModule:
    modules:
      - relayer: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
        type: trustedRelayerIsm
      - domains: {}
        owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
        type: defaultFallbackRoutingIsm
    threshold: 1
    type: staticAggregationIsm
  isNft: false
  owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
  proxyAdmin:
    address: "0x20B3B53145B426f8b9e5D7a7c71140c2415d79e7"
    owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
  type: synthetic
sepolia:
  interchainSecurityModule:
    modules:
      - relayer: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
        type: trustedRelayerIsm
      - domains: {}
        owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
        type: defaultFallbackRoutingIsm
    threshold: 1
    type: staticAggregationIsm
  owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
  proxyAdmin:
    address: "0x5A4b212c4691DCCf2D1F3B5fA1063dAbFfA05EAA"
    owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
  token: "0x777494cD0d3556c08efCE64eeC10b5842434F5c0"
  type: collateral
sepolia:
  interchainSecurityModule:
    modules:
      - relayer: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
        type: trustedRelayerIsm
      - domains: {}
        owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
        type: defaultFallbackRoutingIsm
    threshold: 1
    type: staticAggregationIsm
  owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
  proxyAdmin:
    address: "0x5A4b212c4691DCCf2D1F3B5fA1063dAbFfA05EAA"
    owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
  token: "0x777494cD0d3556c08efCE64eeC10b5842434F5c0"
  type: collateral
# yaml-language-server: $schema=../schema.json
tokens:
  - addressOrDenom: "0x6837928d6D971d5e766c5E1481cE41537d0771e7"
    chainName: bee
    connections:
      - token: ethereum|sepolia|0x4f41f6f6d060b7C9Fb8274c84a8807d96d7925d8
    decimals: 18
    name: SNC Token
    standard: EvmHypSynthetic
    symbol: SNC
  - addressOrDenom: "0x4f41f6f6d060b7C9Fb8274c84a8807d96d7925d8"
    chainName: sepolia
    collateralAddressOrDenom: "0x777494cD0d3556c08efCE64eeC10b5842434F5c0"
    connections:
      - token: ethereum|bee|0x6837928d6D971d5e766c5E1481cE41537d0771e7
    decimals: 18
    name: SNC Token
    standard: EvmHypCollateral
    symbol: SNC

以上就能得到
Sepolia（源链 - Collateral）
Warp Route 地址: 0x4f41f6f6d060b7C9Fb8274c84a8807d96d7925d8
原始 Token 地址: 0x777494cD0d3556c08efCE64eeC10b5842434F5c0
类型: EvmHypCollateral（锁定原始 Token）
Bee（目标链 - Synthetic）
Warp Route 地址: 0x6837928d6D971d5e766c5E1481cE41537d0771e7
包装 Token 地址: 0x6837928d6D971d5e766c5E1481cE41537d0771e7（同一个地址）
类型: EvmHypSynthetic（铸造包装 Token）
Token 信息:
Name: SNC Token
Symbol: SNC
Decimals: 18

下一步授权
root@ubuntu:~# cast send 0x777494cD0d3556c08efCE64eeC10b5842434F5c0 \
  "approve(address,uint256)" \
  0x4f41f6f6d060b7C9Fb8274c84a8807d96d7925d8 \
  115792089237316195423570985008687907853269984665640564039457584007913129639935 \
  --rpc-url https://sepolia.infura.io/v3/e463f6ea90ed48c69b353530d89babb9 \
  --private-key $HYP_KEY
终端打印信息如下：

blockHash            0x5ae29dbdaa44c51085ff8a7b3e73c1843a1a9bb8b7e1e04116e68b128373b4a2
blockNumber          10126343
contractAddress      
cumulativeGasUsed    8083080
effectiveGasPrice    1057493784
from                 0x5159eA8501d3746bB07c20B5D0406bD12844D7ec
gasUsed              46309
logs                 [{"address":"0x777494cd0d3556c08efce64eec10b5842434f5c0","topics":["0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925","0x0000000000000000000000005159ea8501d3746bb07c20b5d0406bd12844d7ec","0x0000000000000000000000004f41f6f6d060b7c9fb8274c84a8807d96d7925d8"],"data":"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff","blockHash":"0x5ae29dbdaa44c51085ff8a7b3e73c1843a1a9bb8b7e1e04116e68b128373b4a2","blockNumber":"0x9a8407","blockTimestamp":"0x697726d4","transactionHash":"0xb93820f6bc5f6c2c831412e0fe37ed75f38724fc35822f8de2ab7a42cc6f54e4","transactionIndex":"0x2e","logIndex":"0x60","removed":false}]
logsBloom            0x00000000000000000040000000000000000000000000022000000000000000000002020000000000000000000020000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000020000000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000
root                 
status               1 (success)
transactionHash      0xb93820f6bc5f6c2c831412e0fe37ed75f38724fc35822f8de2ab7a42cc6f54e4
transactionIndex     46
type                 2
blobGasPrice         
blobGasUsed          
to                   0x777494cD0d3556c08efCE64eeC10b5842434F5c0


转账erc20
sepolia->bee
root@ubuntu:~# hyperlane warp send \
  --symbol SNC \
  --origin sepolia \
  --destination bee \
  --amount 1000000000000000000 \
  --relay
Hyperlane CLI
🚀 Sending a message for chains: sepolia ➡️ bee
Running pre-flight checks for chains...
✅ Sepolia signer is valid
✅ Bee signer is valid
✅ Chains are valid
✅ Balances are sufficient
Sending a message from sepolia to bee
Pending https://sepolia.etherscan.io/tx/0x5fa35df82a3451427711f12592f2cea34f86b0099aaebd01408fccc34f35dafa (waiting 1 blocks for confirmation)
Sent transfer from sender (0x5159eA8501d3746bB07c20B5D0406bD12844D7ec) on sepolia to recipient (0x5159eA8501d3746bB07c20B5D0406bD12844D7ec) on bee.
Message ID: 0x202af40c09495c9e0c2bf5a142d20bf37a1016911edccc1aa7c73543e264e73b
Explorer Link: https://explorer.hyperlane.xyz/message/0x202af40c09495c9e0c2bf5a142d20bf37a1016911edccc1aa7c73543e264e73b
Message:
    id: "0x202af40c09495c9e0c2bf5a142d20bf37a1016911edccc1aa7c73543e264e73b"
    message: "0x030000000100aa36a70000000000000000000000004f41f6f6d060b7c9fb8274c84\
      a8807d96d7925d800000c740000000000000000000000006837928d6d971d5e766c5e1481ce41\
      537d0771e70000000000000000000000005159ea8501d3746bb07c20b5d0406bd12844d7ec000\
      0000000000000000000000000000000000000000000000de0b6b3a7640000"
    parsed:
      version: 3
      nonce: 1
      origin: 11155111
      sender: "0x0000000000000000000000004f41f6f6d060b7c9fb8274c84a8807d96d7925d8"
      destination: 3188
      recipient: "0x0000000000000000000000006837928d6d971d5e766c5e1481ce41537d0771e7"
      body: "0x0000000000000000000000005159ea8501d3746bb07c20b5d0406bd12844d7ec000000\
        0000000000000000000000000000000000000000000de0b6b3a7640000"
    
Body:
    recipient: "0x0000000000000000000000005159ea8501d3746bb07c20b5d0406bd12844d7ec"
    amount: 1000000000000000000
    
Attempting self-relay of message...
Preparing to relay message 0x202af40c09495c9e0c2bf5a142d20bf37a1016911edccc1aa7c73543e264e73b
Relaying message 0x202af40c09495c9e0c2bf5a142d20bf37a1016911edccc1aa7c73543e264e73b
Pending https://scan.beechain.ai/tx/0x5f17962f6235ad35f982ceab8038aa242cc3a06b5b87378f2c75b823552cc959 (waiting 1 blocks for confirmation)
Transfer was self-relayed!
✅ Successfully sent messages for chains: sepolia ➡️ bee

14)又跨回去
bee->sepolia
root@ubuntu:~# hyperlane warp send \
  --symbol SNC \
  --origin bee \
  --destination sepolia \
  --amount 1000000000000000000 \
  --relay
Hyperlane CLI
🚀 Sending a message for chains: bee ➡️ sepolia
Running pre-flight checks for chains...
✅ Bee signer is valid
✅ Sepolia signer is valid
✅ Chains are valid
✅ Balances are sufficient
Sending a message from bee to sepolia
Pending https://scan.beechain.ai/tx/0xc190e6d11919b56b407addbe2cfbe110fb8ca1c3a7a4527a53b95342d87cae75 (waiting 1 blocks for confirmation)
Sent transfer from sender (0x5159eA8501d3746bB07c20B5D0406bD12844D7ec) on bee to recipient (0x5159eA8501d3746bB07c20B5D0406bD12844D7ec) on sepolia.
Message ID: 0x1bf781c056d179733b9118e29afaee987866c24fe0e5c64daa451c423e167873
Explorer Link: https://explorer.hyperlane.xyz/message/0x1bf781c056d179733b9118e29afaee987866c24fe0e5c64daa451c423e167873
Message:
    id: "0x1bf781c056d179733b9118e29afaee987866c24fe0e5c64daa451c423e167873"
    message: "0x030000000100000c740000000000000000000000006837928d6d971d5e766c5e148\
      1ce41537d0771e700aa36a70000000000000000000000004f41f6f6d060b7c9fb8274c84a8807\
      d96d7925d80000000000000000000000005159ea8501d3746bb07c20b5d0406bd12844d7ec000\
      0000000000000000000000000000000000000000000000de0b6b3a7640000"
    parsed:
      version: 3
      nonce: 1
      origin: 3188
      sender: "0x0000000000000000000000006837928d6d971d5e766c5e1481ce41537d0771e7"
      destination: 11155111
      recipient: "0x0000000000000000000000004f41f6f6d060b7c9fb8274c84a8807d96d7925d8"
      body: "0x0000000000000000000000005159ea8501d3746bb07c20b5d0406bd12844d7ec000000\
        0000000000000000000000000000000000000000000de0b6b3a7640000"
    
Body:
    recipient: "0x0000000000000000000000005159ea8501d3746bb07c20b5d0406bd12844d7ec"
    amount: 1000000000000000000
    
Attempting self-relay of message...
Preparing to relay message 0x1bf781c056d179733b9118e29afaee987866c24fe0e5c64daa451c423e167873
Relaying message 0x1bf781c056d179733b9118e29afaee987866c24fe0e5c64daa451c423e167873
Pending https://sepolia.etherscan.io/tx/0x988ebfd0cbe43b47b90d5392f2fe9852175c18d2a9277e0d31e775c4cd34801a (waiting 1 blocks for confirmation)
Transfer was self-relayed!
✅ Successfully sent messages for chains: bee ➡️ sepolia


前端执行跨链操作
// 1. 授权 Token
await tokenContract.approve(warpRouteAddress, ethers.MaxUint256);

合约是SNC

// 2. 跨链转账
const tx = await warpRouteContract.transferRemote(
  destinationDomainId,
  recipientBytes32,
  amountWei,
  { value: gasPayment }
);

// 3. 等待确认
await tx.wait();


继续增加bscTestnet
cd hyperlane-registry
hyperlane core deploy
终端打印如下
Skipping updating chain bsctestnet at github registry (not supported)
Now updating chain bsctestnet at filesystem registry at /root/.hyperlane
Done updating chain bsctestnet at filesystem registry
✅ Core contract deployments complete:

    staticMerkleRootMultisigIsmFactory: "0xaF2A3822F52d43f09F80eBe61A829b3b4565fd35"
    staticMessageIdMultisigIsmFactory: "0x946B51D0Ce14dc0e66F79dfEC086E9c618eFe41D"
    staticAggregationIsmFactory: "0xe1c02df62Ed0A25D08b90169cAec6319fd8e9c98"
    staticAggregationHookFactory: "0x2CE745237CFeF71f5E2e334130D041706f0b6f52"
    domainRoutingIsmFactory: "0x46D13Be0c2eF685CDD4D67dBA53FFA53fAd5f9a2"
    staticMerkleRootWeightedMultisigIsmFactory: "0x3E058e7c662843f46bf683EBDA17c7009FC8876D"
    staticMessageIdWeightedMultisigIsmFactory: "0x1e8feCF0e52DC5b54F606520043b58526EEF1e6e"
    proxyAdmin: "0x56E2C0D1Fd0b06892eFBbEc69922A933790736e1"
    mailbox: "0xD1C58f4082394C746D423189c3f55096A88b3B80"
    interchainAccountRouter: "0x44Cdd6021C4F60D46dCE8Ac92378b574802ac7F1"
    validatorAnnounce: "0x327434B189809714968E94C53E6c46b49F8C0fCB"
    testRecipient: "0xA4DF152D2aCE958804B6352572749F5354B74E18"
    merkleTreeHook: "0x47Dd32e4FCEb1de8e2c9D6eda3e1b2D8d06d5928"


hyperlane wrap init
选bee,bscTestbet
usdc合约地址0x691976771B5cb38ea0aabDb5CdB02a20916B6114
终端打印如下
root@ubuntu:~/hyperlane-registry# hyperlane warp init
Hyperlane CLI
Hyperlane Warp Configure
________________________
Creating a new warp route deployment config...
? Select network type Testnet
? Select chains to connect bee, bsctestnet
? Is this chain selection correct?: bee, bsctestnet yes
bee: Configuring warp route...
? Using owner address as 0x5159eA8501d3746bB07c20B5D0406bD12844D7ec from signer, is this correct? yes
? Use an existing Proxy Admin contract for the warp route deployment on chain "bee"? yes
? Please enter the address of the Proxy Admin contract to be used on chain "bee": 0x20B3B53145B426f8b9e5D7a7c71140c2415d79e7
? Do you want to use a trusted ISM for warp route? yes
? Select bee's token type synthetic
bsctestnet: Configuring warp route...
? Using owner address as 0x5159eA8501d3746bB07c20B5D0406bD12844D7ec from signer, is this correct? yes
? Use an existing Proxy Admin contract for the warp route deployment on chain "bsctestnet"? yes
? Please enter the address of the Proxy Admin contract to be used on chain "bsctestnet": 0x56E2C0D1Fd0b06892eFBbEc69922A933790736e1
? Do you want to use a trusted ISM for warp route? yes
? Select bsctestnet's token type collateral
? Enter the existing token address on chain bsctestnet 0x691976771B5cb38ea0aabDb5CdB02a20916B6114
Warp Route config is valid, writing to file undefined:

    bee:
      isNft: false
      type: synthetic
      owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
      interchainSecurityModule:
        type: staticAggregationIsm
        modules:
          - type: trustedRelayerIsm
            relayer: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
          - owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
            type: defaultFallbackRoutingIsm
            domains: {}
        threshold: 1
      proxyAdmin:
        owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
        address: "0x20B3B53145B426f8b9e5D7a7c71140c2415d79e7"
    bsctestnet:
      type: collateral
      token: "0x691976771B5cb38ea0aabDb5CdB02a20916B6114"
      owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
      interchainSecurityModule:
        type: staticAggregationIsm
        modules:
          - type: trustedRelayerIsm
            relayer: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
          - owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
            type: defaultFallbackRoutingIsm
            domains: {}
        threshold: 1
      proxyAdmin:
        owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
        address: "0x56E2C0D1Fd0b06892eFBbEc69922A933790736e1"
    
? Using warp route ID as USDC/bee from warp deployment config, is this correct? yes
Skipping adding warp route deploy config at github registry (not supported)
Now adding warp route deploy config at filesystem registry at /root/.hyperlane
Done adding warp route deploy config at filesystem registry
✅ Successfully created new warp route deployment config with warp route id: USDC/bee


hyperlane wrap init
选bee,bscTestbet
usdt合约地址0x24340A8432BBC8c425e645A6cF49c36992eefE62
终端打印如下
root@ubuntu:~/hyperlane-registry# hyperlane warp init
Hyperlane CLI
Hyperlane Warp Configure
________________________
Creating a new warp route deployment config...
? Select network type Testnet
? Select chains to connect bee, bsctestnet
? Is this chain selection correct?: bee, bsctestnet yes
bee: Configuring warp route...
? Using owner address as 0x5159eA8501d3746bB07c20B5D0406bD12844D7ec from signer, is this correct? yes
? Use an existing Proxy Admin contract for the warp route deployment on chain "bee"? yes
? Please enter the address of the Proxy Admin contract to be used on chain "bee": 0x20B3B53145B426f8b9e5D7a7c71140c2415d79e7
? Do you want to use a trusted ISM for warp route? yes
? Select bee's token type synthetic
bsctestnet: Configuring warp route...
? Using owner address as 0x5159eA8501d3746bB07c20B5D0406bD12844D7ec from signer, is this correct? yes
? Use an existing Proxy Admin contract for the warp route deployment on chain "bsctestnet"? yes
? Please enter the address of the Proxy Admin contract to be used on chain "bsctestnet": 0x56E2C0D1Fd0b06892eFBbEc69922A933790736e1
? Do you want to use a trusted ISM for warp route? yes
? Select bsctestnet's token type collateral
? Enter the existing token address on chain bsctestnet 0x24340A8432BBC8c425e645A6cF49c36992eefE62
Warp Route config is valid, writing to file undefined:

    bee:
      isNft: false
      type: synthetic
      owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
      interchainSecurityModule:
        type: staticAggregationIsm
        modules:
          - type: trustedRelayerIsm
            relayer: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
          - owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
            type: defaultFallbackRoutingIsm
            domains: {}
        threshold: 1
      proxyAdmin:
        owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
        address: "0x20B3B53145B426f8b9e5D7a7c71140c2415d79e7"
    bsctestnet:
      type: collateral
      token: "0x24340A8432BBC8c425e645A6cF49c36992eefE62"
      owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
      interchainSecurityModule:
        type: staticAggregationIsm
        modules:
          - type: trustedRelayerIsm
            relayer: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
          - owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
            type: defaultFallbackRoutingIsm
            domains: {}
        threshold: 1
      proxyAdmin:
        owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
        address: "0x56E2C0D1Fd0b06892eFBbEc69922A933790736e1"
    
? Using warp route ID as USDT/bee from warp deployment config, is this correct? yes
Skipping adding warp route deploy config at github registry (not supported)
Now adding warp route deploy config at filesystem registry at /root/.hyperlane
Done adding warp route deploy config at filesystem registry
✅ Successfully created new warp route deployment config with warp route id: USDT/bee


hyperlane wrap init
选bee,bscTestbet
现在是bnb
终端打印如下
root@ubuntu:~/hyperlane-registry# hyperlane warp init
Hyperlane CLI
Hyperlane Warp Configure
________________________
Creating a new warp route deployment config...
? Select network type Testnet
? Select chains to connect bee, bsctestnet
? Is this chain selection correct?: bee, bsctestnet yes
bee: Configuring warp route...
? Enter the desired owner address: 0x5159eA8501d3746bB07c20B5D0406bD12844D7ec
? Use an existing Proxy Admin contract for the warp route deployment on chain "bee"? yes
? Please enter the address of the Proxy Admin contract to be used on chain "bee": 0x20B3B53145B426f8b9e5D7a7c71140c2415d79e7
? Do you want to use a trusted ISM for warp route? yes
? Select bee's token type synthetic
bsctestnet: Configuring warp route...
? Enter the desired owner address: 0x5159eA8501d3746bB07c20B5D0406bD12844D7ec
? Use an existing Proxy Admin contract for the warp route deployment on chain "bsctestnet"? yes
? Please enter the address of the Proxy Admin contract to be used on chain "bsctestnet": 0x56E2C0D1Fd0b06892eFBbEc69922A933790736e1
? Do you want to use a trusted ISM for warp route? yes
? Select bsctestnet's token type native
Warp Route config is valid, writing to file undefined:

    bee:
      isNft: false
      type: synthetic
      owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
      interchainSecurityModule:
        type: staticAggregationIsm
        modules:
          - type: trustedRelayerIsm
            relayer: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
          - owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
            type: defaultFallbackRoutingIsm
            domains: {}
        threshold: 1
      proxyAdmin:
        owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
        address: "0x20B3B53145B426f8b9e5D7a7c71140c2415d79e7"
    bsctestnet:
      isNft: false
      type: native
      owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
      interchainSecurityModule:
        type: staticAggregationIsm
        modules:
          - type: trustedRelayerIsm
            relayer: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
          - owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
            type: defaultFallbackRoutingIsm
            domains: {}
        threshold: 1
      proxyAdmin:
        owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
        address: "0x56E2C0D1Fd0b06892eFBbEc69922A933790736e1"
    
? Using warp route ID as BNB/bee from warp deployment config, is this correct? yes
Skipping adding warp route deploy config at github registry (not supported)
Now adding warp route deploy config at filesystem registry at /root/.hyperlane
Done adding warp route deploy config at filesystem registry
✅ Successfully created new warp route deployment config with warp route id: BNB/bee


配置warp-route-config.yaml
因为有多个token,所以我们得配置多个warp-route-deploy-config.yaml
我们在 ~/.hyperlane/configs目录下touch warp-route-usdt-deploy-config.yaml,warp-route-usdc-deploy-config.yaml,warp-route-bnb-deploy-config.yaml


warp-route-usdt-deploy-config.yaml如下
bee:
  type: synthetic
  owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
  proxyAdmin:
    address: "0x20B3B53145B426f8b9e5D7a7c71140c2415d79e7"
    owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"

bsctestnet:
  type: collateral
  token: "0x24340A8432BBC8c425e645A6cF49c36992eefE62"
  owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
  proxyAdmin:
    address: "0x56E2C0D1Fd0b06892eFBbEc69922A933790736e1"
    owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"

warp-route-usdc-deploy-config.yaml如下
bee:
  type: synthetic
  owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
  proxyAdmin:
    address: "0x20B3B53145B426f8b9e5D7a7c71140c2415d79e7"
    owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"

bsctestnet:
  type: collateral
  token: "0x691976771B5cb38ea0aabDb5CdB02a20916B6114"
  owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
  proxyAdmin:
    address: "0x56E2C0D1Fd0b06892eFBbEc69922A933790736e1"
    owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"


warp-route-bnb-deploy-config.yaml如下
bee:
  type: synthetic
  owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
  proxyAdmin:
    address: "0x20B3B53145B426f8b9e5D7a7c71140c2415d79e7"
    owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"

bsctestnet:
  type: native
  owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
  proxyAdmin:
    address: "0x56E2C0D1Fd0b06892eFBbEc69922A933790736e1"
    owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"


执行部署
# 部署 Token 1
hyperlane warp deploy --config ~/.hyperlane/configs/warp-route-usdt-deploy-config.yaml
终端打印如下
、✅ Warp contract deployments complete
Start enrolling cross chain routers
Comparing target Hook config with current one for bee chain
Comparing target Hook config with current one for bsctestnet chain
Writing deployment artifacts...
Skipping adding warp route at github registry (not supported)
Now adding warp route at filesystem registry at /root/.hyperlane
Done adding warp route at filesystem registry
    tokens:
      - chainName: bee
        standard: EvmHypSynthetic
        decimals: 18
        symbol: USDT
        name: Tether USD
        addressOrDenom: "0x2650254F43F6b7BA0C0bCECBAAD31F00D95CB8C9"
        connections:
          - token: ethereum|bsctestnet|0x4BE287EB7F8b42C1a49E0747a8248f60eb41aCB0
      - chainName: bsctestnet
        standard: EvmHypCollateral
        decimals: 18
        symbol: USDT
        name: Tether USD
        addressOrDenom: "0x4BE287EB7F8b42C1a49E0747a8248f60eb41aCB0"
        collateralAddressOrDenom: "0x24340A8432BBC8c425e645A6cF49c36992eefE62"
        connections:
          - token: ethereum|bee|0x2650254F43F6b7BA0C0bCECBAAD31F00D95CB8C9
    
⛽️ Gas Usage Statistics
	- Gas required for warp deploy on bee: 0.542674884 BKC Token 
	- Gas required for warp deploy on bsctestnet: 0.0006210657 BNB


# 部署 Token 2
hyperlane warp deploy --config ~/.hyperlane/configs/warp-route-usdc-deploy-config.yaml
终端打印入如下
✅ Warp contract deployments complete
Start enrolling cross chain routers
Comparing target Hook config with current one for bee chain
Comparing target Hook config with current one for bsctestnet chain
Writing deployment artifacts...
Skipping adding warp route at github registry (not supported)
Now adding warp route at filesystem registry at /root/.hyperlane
Done adding warp route at filesystem registry
    tokens:
      - chainName: bee
        standard: EvmHypSynthetic
        decimals: 18
        symbol: USDC
        name: USD Coin
        addressOrDenom: "0x25Ed83ce5f6f20Aebf6b5A40E9ef47ECC0371523"
        connections:
          - token: ethereum|bsctestnet|0x44Bd4d222d67B66D7048cDA991AC84DA2F72a210
      - chainName: bsctestnet
        standard: EvmHypCollateral
        decimals: 18
        symbol: USDC
        name: USD Coin
        addressOrDenom: "0x44Bd4d222d67B66D7048cDA991AC84DA2F72a210"
        collateralAddressOrDenom: "0x691976771B5cb38ea0aabDb5CdB02a20916B6114"
        connections:
          - token: ethereum|bee|0x25Ed83ce5f6f20Aebf6b5A40E9ef47ECC0371523
    
⛽️ Gas Usage Statistics
	- Gas required for warp deploy on bee: 0.542669274 BKC Token 
	- Gas required for warp deploy on bsctestnet: 0.0006220285 BNB

# 部署 原生bnb
hyperlane warp deploy --config ~/.hyperlane/configs/warp-route-bnb-deploy-config.yaml
终端打印如下
✅ Warp contract deployments complete
Start enrolling cross chain routers
Comparing target Hook config with current one for bee chain
Comparing target Hook config with current one for bsctestnet chain
Writing deployment artifacts...
Skipping adding warp route at github registry (not supported)
Now adding warp route at filesystem registry at /root/.hyperlane
Done adding warp route at filesystem registry
    tokens:
      - chainName: bee
        standard: EvmHypSynthetic
        decimals: 18
        symbol: BNB
        name: BNB
        addressOrDenom: "0x897e914031C27F679eD54910015453Cdbb9aE162"
        connections:
          - token: ethereum|bsctestnet|0x637189c5c4027259e98c9eEA6A393AeF1f3a4bcC
      - chainName: bsctestnet
        standard: EvmHypNative
        decimals: 18
        symbol: BNB
        name: BNB
        addressOrDenom: "0x637189c5c4027259e98c9eEA6A393AeF1f3a4bcC"
        connections:
          - token: ethereum|bee|0x897e914031C27F679eD54910015453Cdbb9aE162
    
⛽️ Gas Usage Statistics
	- Gas required for warp deploy on bee: 0.542651934 BKC Token 
	- Gas required for warp deploy on bsctestnet: 0.0005982075 BNB

执行授权
root@ubuntu:~/hyperlane-registry# export HYP_KEY='私钥不带0x'
root@ubuntu:~/hyperlane-registry# cast send 0x691976771B5cb38ea0aabDb5CdB02a20916B6114   "approve(address,uint256)"   0x44Bd4d222d67B66D7048cDA991AC84DA2F72a210   115792089237316195423570985008687907853269984665640564039457584007913129639935   --rpc-url https://bsc-testnet.infura.io/v3/e463f6ea90ed48c69b353530d89babb9   --private-key $HYP_KEY

blockHash            0x7c42cf928aec07188ea2b984d711b14598ec2716343bda55ad7ddf9b4ddfaa83
blockNumber          86825864
contractAddress      
cumulativeGasUsed    307278
effectiveGasPrice    100000000
from                 0x5159eA8501d3746bB07c20B5D0406bD12844D7ec
gasUsed              51457
logs                 [{"address":"0x691976771b5cb38ea0aabdb5cdb02a20916b6114","topics":["0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925","0x0000000000000000000000005159ea8501d3746bb07c20b5d0406bd12844d7ec","0x00000000000000000000000044bd4d222d67b66d7048cda991ac84da2f72a210"],"data":"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff","blockHash":"0x7c42cf928aec07188ea2b984d711b14598ec2716343bda55ad7ddf9b4ddfaa83","blockNumber":"0x52cdb88","blockTimestamp":"0x69786532","transactionHash":"0x0a4bf3bf47e3a389da8532e69e5b252943ff2ec4d382911083d83bd58bd33d26","transactionIndex":"0x1","logIndex":"0x4","removed":false}]
logsBloom            0x00000000000000000040000000000000000400000000000100000000000000000000000000000000000000000020000000000000000000000000000000200000000000000000000000002000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000001000000000000020000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000
root                 
status               1 (success)
transactionHash      0x0a4bf3bf47e3a389da8532e69e5b252943ff2ec4d382911083d83bd58bd33d26
transactionIndex     1
type                 2
blobGasPrice         
blobGasUsed          
to                   0x691976771B5cb38ea0aabDb5CdB02a20916B6114

执行转账
root@ubuntu:~/hyperlane-registry# hyperlane warp send \
  --symbol USDC  \
  --origin bsctestnet \
  --destination bee \
  --amount 8000000000000000000 \
  --relay
终端打印如下
Hyperlane CLI
Multiple warp routes found for symbol USDC
? Select from matching warp routes USDC/warp-route-usdc-deploy-config
🚀 Sending a message for chains: bsctestnet ➡️ bee
Running pre-flight checks for chains...
✅ BSC Testnet signer is valid
✅ Bee signer is valid
✅ Chains are valid
✅ Balances are sufficient
Sending a message from bsctestnet to bee
Pending https://testnet.bscscan.com/tx/0x32493917decee0a9d37289922f2d54bd40e14fce87c7ea37e62b447534caa0a8 (waiting 1 blocks for confirmation)
Sent transfer from sender (0x5159eA8501d3746bB07c20B5D0406bD12844D7ec) on bsctestnet to recipient (0x5159eA8501d3746bB07c20B5D0406bD12844D7ec) on bee.
Message ID: 0x4ce9df867582441bbaf3558383348bd078875912ef67cd3beff5681a9b72f2a2
Explorer Link: https://explorer.hyperlane.xyz/message/0x4ce9df867582441bbaf3558383348bd078875912ef67cd3beff5681a9b72f2a2
Message:
    id: "0x4ce9df867582441bbaf3558383348bd078875912ef67cd3beff5681a9b72f2a2"
    message: "0x03000000000000006100000000000000000000000044bd4d222d67b66d7048cda99\
      1ac84da2f72a21000000c7400000000000000000000000025ed83ce5f6f20aebf6b5a40e9ef47\
      ecc03715230000000000000000000000005159ea8501d3746bb07c20b5d0406bd12844d7ec000\
      0000000000000000000000000000000000000000000006f05b59d3b200000"
    parsed:
      version: 3
      nonce: 0
      origin: 97
      sender: "0x00000000000000000000000044bd4d222d67b66d7048cda991ac84da2f72a210"
      destination: 3188
      recipient: "0x00000000000000000000000025ed83ce5f6f20aebf6b5a40e9ef47ecc0371523"
      body: "0x0000000000000000000000005159ea8501d3746bb07c20b5d0406bd12844d7ec000000\
        0000000000000000000000000000000000000000006f05b59d3b200000"
    
Body:
    recipient: "0x0000000000000000000000005159ea8501d3746bb07c20b5d0406bd12844d7ec"
    amount: 8000000000000000000
    
Attempting self-relay of message...
Preparing to relay message 0x4ce9df867582441bbaf3558383348bd078875912ef67cd3beff5681a9b72f2a2
Relaying message 0x4ce9df867582441bbaf3558383348bd078875912ef67cd3beff5681a9b72f2a2
Pending https://scan.beechain.ai/tx/0xc05cebfa7d0a2ee97d2f8a841d53fb2ae8d46c38e43013a5df520a05df21d532 (waiting 1 blocks for confirmation)
Transfer was self-relayed!
✅ Successfully sent messages for chains: bsctestnet ➡️ bee


usdt
授权给wrapRouter
root@ubuntu:~/hyperlane-registry# cast send 0x24340A8432BBC8c425e645A6cF49c36992eefE62 \
  "approve(address,uint256)" \
  0x4BE287EB7F8b42C1a49E0747a8248f60eb41aCB0 \
  115792089237316195423570985008687907853269984665640564039457584007913129639935 \
  --rpc-url https://bsc-testnet.infura.io/v3/e463f6ea90ed48c69b353530d89babb9 \
  --private-key $HYP_KEY
-bash: lcast: command not found
root@ubuntu:~/hyperlane-registry# cast send 0x24340A8432BBC8c425e645A6cF49c36992eefE62 \
  "approve(address,uint256)" \
  0x4BE287EB7F8b42C1a49E0747a8248f60eb41aCB0 \
  115792089237316195423570985008687907853269984665640564039457584007913129639935 \
  --rpc-url https://bsc-testnet.infura.io/v3/e463f6ea90ed48c69b353530d89babb9 \
  --private-key $HYP_KEY

blockHash            0x14260393ef16589c9b01a0c424c8e64dc880bb6eba87685f691c39ad0721dafb
blockNumber          86827533
contractAddress      
cumulativeGasUsed    102227
effectiveGasPrice    100000000
from                 0x5159eA8501d3746bB07c20B5D0406bD12844D7ec
gasUsed              46609
logs                 [{"address":"0x24340a8432bbc8c425e645a6cf49c36992eefe62","topics":["0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925","0x0000000000000000000000005159ea8501d3746bb07c20b5d0406bd12844d7ec","0x0000000000000000000000004be287eb7f8b42c1a49e0747a8248f60eb41acb0"],"data":"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff","blockHash":"0x14260393ef16589c9b01a0c424c8e64dc880bb6eba87685f691c39ad0721dafb","blockNumber":"0x52ce20d","blockTimestamp":"0x69786821","transactionHash":"0x44fbefff8a7ae9761dcb551013ab904a4f730ec795ad1478c15d8eb0cfd8e43b","transactionIndex":"0x2","logIndex":"0x1","removed":false}]
logsBloom            0x00000000000000000040000000000000000000000000000000000000000000000080000040000000000000000020000000000000000000800000000000200000000000000000000000000000000000000000000000000000000000000000000000000000001000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000080000000000000000000000000000000000400000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000
root                 
status               1 (success)
transactionHash      0x44fbefff8a7ae9761dcb551013ab904a4f730ec795ad1478c15d8eb0cfd8e43b
transactionIndex     2
type                 2
blobGasPrice         
blobGasUsed          
to                   0x24340A8432BBC8c425e645A6cF49c36992eefE62

执行usdt转账
Hyperlane CLI
Multiple warp routes found for symbol USDT
? Select from matching warp routes USDT/warp-route-usdt-deploy-config
🚀 Sending a message for chains: bsctestnet ➡️ bee
Running pre-flight checks for chains...
✅ BSC Testnet signer is valid
✅ Bee signer is valid
✅ Chains are valid
✅ Balances are sufficient
Sending a message from bsctestnet to bee
Pending https://testnet.bscscan.com/tx/0x1ba3860fecc5a8130bf6aa2b471ff9475408a7ae1cac286c0ca3bb5d39a92ddf (waiting 1 blocks for confirmation)
Sent transfer from sender (0x5159eA8501d3746bB07c20B5D0406bD12844D7ec) on bsctestnet to recipient (0x5159eA8501d3746bB07c20B5D0406bD12844D7ec) on bee.
Message ID: 0x79f1ed2f509cd3903b0672ff1398e508e52e741a80d83785da3aa3fb2279ab60
Explorer Link: https://explorer.hyperlane.xyz/message/0x79f1ed2f509cd3903b0672ff1398e508e52e741a80d83785da3aa3fb2279ab60
Message:
    id: "0x79f1ed2f509cd3903b0672ff1398e508e52e741a80d83785da3aa3fb2279ab60"
    message: "0x0300000001000000610000000000000000000000004be287eb7f8b42c1a49e0747a\
      8248f60eb41acb000000c740000000000000000000000002650254f43f6b7ba0c0bcecbaad31f\
      00d95cb8c90000000000000000000000005159ea8501d3746bb07c20b5d0406bd12844d7ec000\
      00000000000000000000000000000000000000000000053444835ec580000"
    parsed:
      version: 3
      nonce: 1
      origin: 97
      sender: "0x0000000000000000000000004be287eb7f8b42c1a49e0747a8248f60eb41acb0"
      destination: 3188
      recipient: "0x0000000000000000000000002650254f43f6b7ba0c0bcecbaad31f00d95cb8c9"
      body: "0x0000000000000000000000005159ea8501d3746bb07c20b5d0406bd12844d7ec000000\
        00000000000000000000000000000000000000000053444835ec580000"
    
Body:
    recipient: "0x0000000000000000000000005159ea8501d3746bb07c20b5d0406bd12844d7ec"
    amount: 6000000000000000000
    
Attempting self-relay of message...
Preparing to relay message 0x79f1ed2f509cd3903b0672ff1398e508e52e741a80d83785da3aa3fb2279ab60
Relaying message 0x79f1ed2f509cd3903b0672ff1398e508e52e741a80d83785da3aa3fb2279ab60
Pending https://scan.beechain.ai/tx/0x8c22a37dcd948701e741e25e8e30fef6cd48363d9bb06f53f0f2a9b24a0cc7f8 (waiting 1 blocks for confirmation)
Transfer was self-relayed!
✅ Successfully sent messages for chains: bsctestnet ➡️ bee


bnb转账到bee
ps：bnb原生token不需要授权 
# 使用 Hyperlane CLI
root@ubuntu:~/hyperlane-registry# hyperlane warp send \
  --symbol BNB \
  --origin bsctestnet \
  --destination bee \
  --amount 10000000000000000 \
  --relay
Hyperlane CLI
Multiple warp routes found for symbol BNB
? Select from matching warp routes BNB/warp-route-bnb-deploy-config
🚀 Sending a message for chains: bsctestnet ➡️ bee
Running pre-flight checks for chains...
✅ BSC Testnet signer is valid
✅ Bee signer is valid
✅ Chains are valid
✅ Balances are sufficient
Sending a message from bsctestnet to bee
Pending https://testnet.bscscan.com/tx/0x86279d9666d6ad9e6165ada1dea20d0f1a4a62a48a02abd99d5bf47355b6e114 (waiting 1 blocks for confirmation)
Sent transfer from sender (0x5159eA8501d3746bB07c20B5D0406bD12844D7ec) on bsctestnet to recipient (0x5159eA8501d3746bB07c20B5D0406bD12844D7ec) on bee.
Message ID: 0xa2f0034ee8abd34cd2f2226149a03553230c93d7b9c3590b96e9e1d23a994c7e
Explorer Link: https://explorer.hyperlane.xyz/message/0xa2f0034ee8abd34cd2f2226149a03553230c93d7b9c3590b96e9e1d23a994c7e
Message:
    id: "0xa2f0034ee8abd34cd2f2226149a03553230c93d7b9c3590b96e9e1d23a994c7e"
    message: "0x030000000200000061000000000000000000000000637189c5c4027259e98c9eea6\
      a393aef1f3a4bcc00000c74000000000000000000000000897e914031c27f679ed54910015453\
      cdbb9ae1620000000000000000000000005159ea8501d3746bb07c20b5d0406bd12844d7ec000\
      000000000000000000000000000000000000000000000002386f26fc10000"
    parsed:
      version: 3
      nonce: 2
      origin: 97
      sender: "0x000000000000000000000000637189c5c4027259e98c9eea6a393aef1f3a4bcc"
      destination: 3188
      recipient: "0x000000000000000000000000897e914031c27f679ed54910015453cdbb9ae162"
      body: "0x0000000000000000000000005159ea8501d3746bb07c20b5d0406bd12844d7ec000000\
        000000000000000000000000000000000000000000002386f26fc10000"
    
Body:
    recipient: "0x0000000000000000000000005159ea8501d3746bb07c20b5d0406bd12844d7ec"
    amount: 10000000000000000
    
Attempting self-relay of message...
Preparing to relay message 0xa2f0034ee8abd34cd2f2226149a03553230c93d7b9c3590b96e9e1d23a994c7e
Relaying message 0xa2f0034ee8abd34cd2f2226149a03553230c93d7b9c3590b96e9e1d23a994c7e
Pending https://scan.beechain.ai/tx/0x441d444ca5cbcf68ff3867aa5ba03de12fd7621eb9b56c893ab53743c0421bd8 (waiting 1 blocks for confirmation)
Transfer was self-relayed!
✅ Successfully sent messages for chains: bsctestnet ➡️ bee


bee->bsctestnet  将usdc跨回
root@ubuntu:~/hyperlane-registry# hyperlane warp send   --symbol USDC   --origin bee   --destination bsctestnet   --amount 3000000000000000000   --relay
Hyperlane CLI
Multiple warp routes found for symbol USDC
? Select from matching warp routes USDC/warp-route-usdc-deploy-config
🚀 Sending a message for chains: bee ➡️ bsctestnet
Running pre-flight checks for chains...
✅ Bee signer is valid
✅ BSC Testnet signer is valid
✅ Chains are valid
✅ Balances are sufficient
Sending a message from bee to bsctestnet
Pending https://scan.beechain.ai/tx/0x8bed13ef30dc6df17ce08227d5aa942bbefd33ab7069c232fc73f5d5d7088375 (waiting 1 blocks for confirmation)
Sent transfer from sender (0x5159eA8501d3746bB07c20B5D0406bD12844D7ec) on bee to recipient (0x5159eA8501d3746bB07c20B5D0406bD12844D7ec) on bsctestnet.
Message ID: 0x163545041e8ec9adb7094adeef2f506a4f83e76d3ca0310c5f6449fc868ce4a2
Explorer Link: https://explorer.hyperlane.xyz/message/0x163545041e8ec9adb7094adeef2f506a4f83e76d3ca0310c5f6449fc868ce4a2
Message:
    id: "0x163545041e8ec9adb7094adeef2f506a4f83e76d3ca0310c5f6449fc868ce4a2"
    message: "0x030000000300000c7400000000000000000000000025ed83ce5f6f20aebf6b5a40e\
      9ef47ecc03715230000006100000000000000000000000044bd4d222d67b66d7048cda991ac84\
      da2f72a2100000000000000000000000005159ea8501d3746bb07c20b5d0406bd12844d7ec000\
      00000000000000000000000000000000000000000000029a2241af62c0000"
    parsed:
      version: 3
      nonce: 3
      origin: 3188
      sender: "0x00000000000000000000000025ed83ce5f6f20aebf6b5a40e9ef47ecc0371523"
      destination: 97
      recipient: "0x00000000000000000000000044bd4d222d67b66d7048cda991ac84da2f72a210"
      body: "0x0000000000000000000000005159ea8501d3746bb07c20b5d0406bd12844d7ec000000\
        00000000000000000000000000000000000000000029a2241af62c0000"
    
Body:
    recipient: "0x0000000000000000000000005159ea8501d3746bb07c20b5d0406bd12844d7ec"
    amount: 3000000000000000000
    
Attempting self-relay of message...
Preparing to relay message 0x163545041e8ec9adb7094adeef2f506a4f83e76d3ca0310c5f6449fc868ce4a2
Relaying message 0x163545041e8ec9adb7094adeef2f506a4f83e76d3ca0310c5f6449fc868ce4a2
Pending https://testnet.bscscan.com/tx/0x51b7759ae08b0f21c75efbbfd81a74115e2e4ffc60ac25751dedd71280d0eae9 (waiting 1 blocks for confirmation)
Transfer was self-relayed!
✅ Successfully sent messages for chains: bee ➡️ bsctestnet


BEE->BSCTESTNET   将bee链的bnb跨回bsctestnet
root@ubuntu:~/hyperlane-registry# hyperlane warp send   --symbol  BNB   --origin bee   --destination bsctestnet   --amount 1000000000000000   --relay
Hyperlane CLI
Multiple warp routes found for symbol BNB
? Select from matching warp routes BNB/warp-route-bnb-deploy-config
🚀 Sending a message for chains: bee ➡️ bsctestnet
Running pre-flight checks for chains...
✅ Bee signer is valid
✅ BSC Testnet signer is valid
✅ Chains are valid
✅ Balances are sufficient
Sending a message from bee to bsctestnet
Pending https://scan.beechain.ai/tx/0xb880c2d7500084757285ea7c437925104744589f65e1864cc81031a378a4adca (waiting 1 blocks for confirmation)
Sent transfer from sender (0x5159eA8501d3746bB07c20B5D0406bD12844D7ec) on bee to recipient (0x5159eA8501d3746bB07c20B5D0406bD12844D7ec) on bsctestnet.
Message ID: 0x57d8a6836968183c3d0ba355bb9b1b0a24bf630f2e189644aa61e6cf1c481d2b
Explorer Link: https://explorer.hyperlane.xyz/message/0x57d8a6836968183c3d0ba355bb9b1b0a24bf630f2e189644aa61e6cf1c481d2b
Message:
    id: "0x57d8a6836968183c3d0ba355bb9b1b0a24bf630f2e189644aa61e6cf1c481d2b"
    message: "0x030000000400000c74000000000000000000000000897e914031c27f679ed549100\
      15453cdbb9ae16200000061000000000000000000000000637189c5c4027259e98c9eea6a393a\
      ef1f3a4bcc0000000000000000000000005159ea8501d3746bb07c20b5d0406bd12844d7ec000\
      00000000000000000000000000000000000000000000000038d7ea4c68000"
    parsed:
      version: 3
      nonce: 4
      origin: 3188
      sender: "0x000000000000000000000000897e914031c27f679ed54910015453cdbb9ae162"
      destination: 97
      recipient: "0x000000000000000000000000637189c5c4027259e98c9eea6a393aef1f3a4bcc"
      body: "0x0000000000000000000000005159ea8501d3746bb07c20b5d0406bd12844d7ec000000\
        00000000000000000000000000000000000000000000038d7ea4c68000"
    
Body:
    recipient: "0x0000000000000000000000005159ea8501d3746bb07c20b5d0406bd12844d7ec"
    amount: 1000000000000000
    
Attempting self-relay of message...
Preparing to relay message 0x57d8a6836968183c3d0ba355bb9b1b0a24bf630f2e189644aa61e6cf1c481d2b
Relaying message 0x57d8a6836968183c3d0ba355bb9b1b0a24bf630f2e189644aa61e6cf1c481d2b
Pending https://testnet.bscscan.com/tx/0x7172577421758e09a24fea06d085a7978526fc7ad9826976901d59f1b4525cd8 (waiting 1 blocks for confirmation)
Transfer was self-relayed!
✅ Successfully sent messages for chains: bee ➡️ bsctestnet


bee主网接入
修改数据
vim  ~/.hyperlane/chains/bee/metadata.yaml ,输入如下:
# yaml-language-server: $schema=../schema.json
blockExplorers:
  - apiKey: empty
    apiUrl: https://scan.beechain.ai/api
    family: etherscan
    name: BeeScan
    url: https://scan.beechain.ai
chainId: 3188
displayName: Bee
domainId: 3188
isTestnet: false
name: bee
nativeToken:
  decimals: 18
  name: BKC
  symbol: "BKC Token "
protocol: ethereum
rpcUrls:
  - http: https://rpc.beechain.ai
technicalStack: other


下一步增加bsc链
由于官方已经部署了bsc链的core，所以我们不用部署了
下一步
root@ubuntu:~/hyperlane-registry# hyperlane warp init
Hyperlane CLI
Hyperlane Warp Configure
________________________
Creating a new warp route deployment config...
? Select network type Mainnet
? Select chains to connect bee, bsc
? Is this chain selection correct?: bee, bsc yes
bee: Configuring warp route...
? Enter the desired owner address: 0x5159eA8501d3746bB07c20B5D0406bD12844D7ec
? Use an existing Proxy Admin contract for the warp route deployment on chain "bee"? yes
? Please enter the address of the Proxy Admin contract to be used on chain "bee": 0x20B3B53145B426f8b9e5D7a7c71140c2415d79e7
? Do you want to use a trusted ISM for warp route? yes
? Select bee's token type synthetic
bsc: Configuring warp route...
? Enter the desired owner address: 0x5159eA8501d3746bB07c20B5D0406bD12844D7ec
? Use an existing Proxy Admin contract for the warp route deployment on chain "bsc"? yes
? Please enter the address of the Proxy Admin contract to be used on chain "bsc": 0x65993Af9D0D3a64ec77590db7ba362D6eB78eF70
? Do you want to use a trusted ISM for warp route? yes
? Select bsc's token type collateral
? Enter the existing token address on chain bsc 0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d
Warp Route config is valid, writing to file undefined:

    bee:
      isNft: false
      type: synthetic
      owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
      interchainSecurityModule:
        type: staticAggregationIsm
        modules:
          - type: trustedRelayerIsm
            relayer: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
          - owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
            type: defaultFallbackRoutingIsm
            domains: {}
        threshold: 1
      proxyAdmin:
        owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
        address: "0x20B3B53145B426f8b9e5D7a7c71140c2415d79e7"
    bsc:
      type: collateral
      token: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d"
      owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
      interchainSecurityModule:
        type: staticAggregationIsm
        modules:
          - type: trustedRelayerIsm
            relayer: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
          - owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
            type: defaultFallbackRoutingIsm
            domains: {}
        threshold: 1
      proxyAdmin:
        owner: "0x7379D7bB2ccA68982E467632B6554fD4e72e9431"
        address: "0x65993Af9D0D3a64ec77590db7ba362D6eB78eF70"
    
? Using warp route ID as USDC/bee from warp deployment config, is this correct? yes
Skipping adding warp route deploy config at github registry (not supported)
Now adding warp route deploy config at filesystem registry at /root/.hyperlane
Done adding warp route deploy config at filesystem registry
✅ Successfully created new warp route deployment config with warp route id: USDC/bee

下一步
root@ubuntu:~/hyperlane-registry# hyperlane warp init
Hyperlane CLI
Hyperlane Warp Configure
________________________
Creating a new warp route deployment config...
? Select network type Mainnet
? Select chains to connect bee, bsc
? Is this chain selection correct?: bee, bsc yes
bee: Configuring warp route...
? Enter the desired owner address: 0x5159eA8501d3746bB07c20B5D0406bD12844D7ec
? Use an existing Proxy Admin contract for the warp route deployment on chain "bee"? yes
? Please enter the address of the Proxy Admin contract to be used on chain "bee": 0x20B3B53145B426f8b9e5D7a7c71140c2415d79e7
? Do you want to use a trusted ISM for warp route? yes
? Select bee's token type synthetic
bsc: Configuring warp route...
? Enter the desired owner address: 0x5159eA8501d3746bB07c20B5D0406bD12844D7ec
? Use an existing Proxy Admin contract for the warp route deployment on chain "bsc"? yes
? Please enter the address of the Proxy Admin contract to be used on chain "bsc": 0x65993Af9D0D3a64ec77590db7ba362D6eB78eF70
? Do you want to use a trusted ISM for warp route? yes
? Select bsc's token type collateral
? Enter the existing token address on chain bsc 0x55d398326f99059fF775485246999027B3197955
Warp Route config is valid, writing to file undefined:

    bee:
      isNft: false
      type: synthetic
      owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
      interchainSecurityModule:
        type: staticAggregationIsm
        modules:
          - type: trustedRelayerIsm
            relayer: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
          - owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
            type: defaultFallbackRoutingIsm
            domains: {}
        threshold: 1
      proxyAdmin:
        owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
        address: "0x20B3B53145B426f8b9e5D7a7c71140c2415d79e7"
    bsc:
      type: collateral
      token: "0x55d398326f99059fF775485246999027B3197955"
      owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
      interchainSecurityModule:
        type: staticAggregationIsm
        modules:
          - type: trustedRelayerIsm
            relayer: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
          - owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
            type: defaultFallbackRoutingIsm
            domains: {}
        threshold: 1
      proxyAdmin:
        owner: "0x7379D7bB2ccA68982E467632B6554fD4e72e9431"
        address: "0x65993Af9D0D3a64ec77590db7ba362D6eB78eF70"
    
? Using warp route ID as USDT/bee from warp deployment config, is this correct? yes
Skipping adding warp route deploy config at github registry (not supported)
Now adding warp route deploy config at filesystem registry at /root/.hyperlane
Done adding warp route deploy config at filesystem registry
✅ Successfully created new warp route deployment config with warp route id: USDT/bee



root@ubuntu:~/hyperlane-registry# hyperlane warp init
Hyperlane CLI
Hyperlane Warp Configure
________________________
Creating a new warp route deployment config...
? Select network type Mainnet
? Select chains to connect bee, bsc
? Is this chain selection correct?: bee, bsc yes
bee: Configuring warp route...
? Enter the desired owner address: 0x5159eA8501d3746bB07c20B5D0406bD12844D7ec
? Use an existing Proxy Admin contract for the warp route deployment on chain "bee"? yes
? Please enter the address of the Proxy Admin contract to be used on chain "bee": 0x20B3B53145B426f8b9e5D7a7c71140c2415d79e7
? Do you want to use a trusted ISM for warp route? yes
? Select bee's token type synthetic
bsc: Configuring warp route...
? Enter the desired owner address: 0x5159eA8501d3746bB07c20B5D0406bD12844D7ec
? Use an existing Proxy Admin contract for the warp route deployment on chain "bsc"? yes
? Please enter the address of the Proxy Admin contract to be used on chain "bsc": 0x65993Af9D0D3a64ec77590db7ba362D6eB78eF70
? Do you want to use a trusted ISM for warp route? yes
? Select bsc's token type native
Warp Route config is valid, writing to file undefined:

    bee:
      isNft: false
      type: synthetic
      owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
      interchainSecurityModule:
        type: staticAggregationIsm
        modules:
          - type: trustedRelayerIsm
            relayer: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
          - owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
            type: defaultFallbackRoutingIsm
            domains: {}
        threshold: 1
      proxyAdmin:
        owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
        address: "0x20B3B53145B426f8b9e5D7a7c71140c2415d79e7"
    bsc:
      isNft: false
      type: native
      owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
      interchainSecurityModule:
        type: staticAggregationIsm
        modules:
          - type: trustedRelayerIsm
            relayer: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
          - owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"
            type: defaultFallbackRoutingIsm
            domains: {}
        threshold: 1
      proxyAdmin:
        owner: "0x7379D7bB2ccA68982E467632B6554fD4e72e9431"
        address: "0x65993Af9D0D3a64ec77590db7ba362D6eB78eF70"
    
? Using warp route ID as BNB/bee from warp deployment config, is this correct? yes
Skipping adding warp route deploy config at github registry (not supported)
Now adding warp route deploy config at filesystem registry at /root/.hyperlane
Done adding warp route deploy config at filesystem registry
✅ Successfully created new warp route deployment config with warp route id: BNB/bee



添加配置文件
cd ~/.hyperlane/configs
touch warp-route-usdt-mainnet-deploy-config.yaml
touch warp-route-usdc-mainnet-deploy-config.yaml
touch warp-route-bnb-mainnet-deploy-config.yaml
vim warp-route-usdt-mainnet-deploy-config.yaml,数据如下
bee:
  type: synthetic
  owner: "0x574B09A63a6B8436CC3eEB23414b7f59d43B5883"
  proxyAdmin:
    address: "0x20B3B53145B426f8b9e5D7a7c71140c2415d79e7"
    owner: "0x574B09A63a6B8436CC3eEB23414b7f59d43B5883"

bsc:
  type: collateral
  token: "0x55d398326f99059fF775485246999027B3197955"
  owner: "0x574B09A63a6B8436CC3eEB23414b7f59d43B5883"
  proxyAdmin:
    address: "0x65993Af9D0D3a64ec77590db7ba362D6eB78eF70"
    owner: "0x574B09A63a6B8436CC3eEB23414b7f59d43B5883"

vim warp-route-usdc-mainnet-deploy-config.yaml,数据如下 
bee:
  type: synthetic
  owner: "0x574B09A63a6B8436CC3eEB23414b7f59d43B5883"
  proxyAdmin:
    address: "0x20B3B53145B426f8b9e5D7a7c71140c2415d79e7"
    owner: "0x574B09A63a6B8436CC3eEB23414b7f59d43B5883"

bsc:
  type: collateral
  token: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d"
  owner: "0x574B09A63a6B8436CC3eEB23414b7f59d43B5883"
  proxyAdmin:
    address: "0x65993Af9D0D3a64ec77590db7ba362D6eB78eF70"
    owner: "0x574B09A63a6B8436CC3eEB23414b7f59d43B5883"


vim warp-route-bnb-mainnet-deploy-config.yaml,数据如下 
bee:
  type: synthetic
  owner: "0x574B09A63a6B8436CC3eEB23414b7f59d43B5883"
  proxyAdmin:
    address: "0x20B3B53145B426f8b9e5D7a7c71140c2415d79e7"
    owner: "0x5159eA8501d3746bB07c20B5D0406bD12844D7ec"

bsc:
  type: native
  owner: "0x574B09A63a6B8436CC3eEB23414b7f59d43B5883"
  proxyAdmin:
    address: "0x65993Af9D0D3a64ec77590db7ba362D6eB78eF70"
    owner: "0x574B09A63a6B8436CC3eEB23414b7f59d43B5883"

hyperlane warp deploy --config ~/.hyperlane/configs/warp-route-bnb-mainnet-deploy-config.yaml
hyperlane warp deploy --config ~/.hyperlane/configs/warp-route-usdc-mainnet-deploy-config.yaml
hyperlane warp deploy --config ~/.hyperlane/configs/warp-route-usdt-mainnet-deploy-config.yaml


root@ubuntu:~/hyperlane-registry# cast send 0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d \
  "approve(address,uint256)" \
  0xF8555aBd618640AEC6c244a41a870693e3Ed89F2 \
  115792089237316195423570985008687907853269984665640564039457584007913129639935 \
  --rpc-url https://bsc-mainnet.infura.io/v3/e463f6ea90ed48c69b353530d89babb9 \
  --private-key $HYP_KEY

blockHash            0xbb0e457837e359beda8e3be5998ab742eb386cbab275cbc61d84b224d48dcd55
blockNumber          77875096
contractAddress      
cumulativeGasUsed    8082210
effectiveGasPrice    50000000
from                 0x5159eA8501d3746bB07c20B5D0406bD12844D7ec
gasUsed              53752
logs                 [{"address":"0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d","topics":["0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925","0x0000000000000000000000005159ea8501d3746bb07c20b5d0406bd12844d7ec","0x000000000000000000000000f8555abd618640aec6c244a41a870693e3ed89f2"],"data":"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff","blockHash":"0xbb0e457837e359beda8e3be5998ab742eb386cbab275cbc61d84b224d48dcd55","blockNumber":"0x4a44798","blockTimestamp":"0x6979c991","transactionHash":"0x888dd2f917db06b7d57e1b42e8316e53d50f6e228b2dcb989b14cd5ccc8a5d93","transactionIndex":"0x43","logIndex":"0xd8","removed":false}]
logsBloom            0x00000000000000000040000800000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000200080000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000010000002004000000000000000000000000000000000000000000000000000
root                 
status               1 (success)
transactionHash      0x888dd2f917db06b7d57e1b42e8316e53d50f6e228b2dcb989b14cd5ccc8a5d93
transactionIndex     67
type                 2
blobGasPrice         
blobGasUsed          
to                   0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d
root@ubuntu:~/hyperlane-registry# cast send 0x55d398326f99059fF775485246999027B3197955 \
  "approve(address,uint256)" \
  0x946B51D0Ce14dc0e66F79dfEC086E9c618eFe41D \
  115792089237316195423570985008687907853269984665640564039457584007913129639935 \
  --rpc-url https://bsc-mainnet.infura.io/v3/e463f6ea90ed48c69b353530d89babb9 \
  --private-key $HYP_KEY

blockHash            0x786a7ff466aecfa72aadbbc85ddbcfb1da8b231d5761a7db930880277f62c415
blockNumber          77876021
contractAddress      
cumulativeGasUsed    14789867
effectiveGasPrice    50000001
from                 0x5159eA8501d3746bB07c20B5D0406bD12844D7ec
gasUsed              46506
logs                 [{"address":"0x55d398326f99059ff775485246999027b3197955","topics":["0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925","0x0000000000000000000000005159ea8501d3746bb07c20b5d0406bd12844d7ec","0x000000000000000000000000946b51d0ce14dc0e66f79dfec086e9c618efe41d"],"data":"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff","blockHash":"0x786a7ff466aecfa72aadbbc85ddbcfb1da8b231d5761a7db930880277f62c415","blockNumber":"0x4a44b35","blockTimestamp":"0x6979cb33","transactionHash":"0x3385cb56ac37684ef31734e5b255fe5f1290e124da3fd348c275e3dc66b29507","transactionIndex":"0x74","logIndex":"0x1bd","removed":false}]
logsBloom            0x00000000000000000040000000000000000000000000000000000000000000400000000000000000000000000020000000000000000000000000000000200000000000000000000001000000000000000000008000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000008000000000000000000004000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000
root                 
status               1 (success)
transactionHash      0x3385cb56ac37684ef31734e5b255fe5f1290e124da3fd348c275e3dc66b29507
transactionIndex     116
type                 2
blobGasPrice         
blobGasUsed          
to                   0x55d398326f99059fF775485246999027B3197955
root@ubuntu:~/hyperlane-registry# hyperlane warp send \
  --symbol USDC \
  --origin bsc \
  --destination bee \
  --amount 1000000000000000000 \
  --relay
Hyperlane CLI
Multiple warp routes found for symbol USDC
? Select from matching warp routes USDC/warp-route-usdc-mainnet-deploy-config
🚀 Sending a message for chains: bsc ➡️ bee
Running pre-flight checks for chains...
✅ Binance Smart Chain signer is valid
✅ Bee signer is valid
✅ Chains are valid
✅ Balances are sufficient
Sending a message from bsc to bee
Pending https://bscscan.com/tx/0xca7ea1c57865b054272cf0b98fed01e974ccdc426f9ae08c7a47ad6b878500ce (waiting 1 blocks for confirmation)
Sent transfer from sender (0x5159eA8501d3746bB07c20B5D0406bD12844D7ec) on bsc to recipient (0x5159eA8501d3746bB07c20B5D0406bD12844D7ec) on bee.
Message ID: 0x07221524a42e77f65c9226d5222887c04e02fed9f4701b1c632cd86c79dae14a
Explorer Link: https://explorer.hyperlane.xyz/message/0x07221524a42e77f65c9226d5222887c04e02fed9f4701b1c632cd86c79dae14a
Message:
    id: "0x07221524a42e77f65c9226d5222887c04e02fed9f4701b1c632cd86c79dae14a"
    message: "0x030005890200000038000000000000000000000000f8555abd618640aec6c244a41\
      a870693e3ed89f200000c7400000000000000000000000062e6d4737b20c6cd53254c036b170a\
      5c1a448bc00000000000000000000000005159ea8501d3746bb07c20b5d0406bd12844d7ec000\
      0000000000000000000000000000000000000000000000de0b6b3a7640000"
    parsed:
      version: 3
      nonce: 362754
      origin: 56
      sender: "0x000000000000000000000000f8555abd618640aec6c244a41a870693e3ed89f2"
      destination: 3188
      recipient: "0x00000000000000000000000062e6d4737b20c6cd53254c036b170a5c1a448bc0"
      body: "0x0000000000000000000000005159ea8501d3746bb07c20b5d0406bd12844d7ec000000\
        0000000000000000000000000000000000000000000de0b6b3a7640000"
    
Body:
    recipient: "0x0000000000000000000000005159ea8501d3746bb07c20b5d0406bd12844d7ec"
    amount: 1000000000000000000
    
Attempting self-relay of message...
Preparing to relay message 0x07221524a42e77f65c9226d5222887c04e02fed9f4701b1c632cd86c79dae14a
Relaying message 0x07221524a42e77f65c9226d5222887c04e02fed9f4701b1c632cd86c79dae14a
Pending https://scan.beechain.ai/tx/0xfa5e727b7cbe54ace61eab39167014e518044c2c5d8a22a164750403f7add3d8 (waiting 1 blocks for confirmation)
Transfer was self-relayed!
✅ Successfully sent messages for chains: bsc ➡️ bee
root@ubuntu:~/hyperlane-registry#   hyperlane warp send \
  --symbol USDT \
  --origin bsc \
  --destination bee \
  --amount 1500000000000000000 \
  --relay
Hyperlane CLI 
Multiple warp routes found for symbol USDT
? Select from matching warp routes USDT/warp-route-usdt-mainnet-deploy-config
🚀 Sending a message for chains: bsc ➡️ bee
Running pre-flight checks for chains...
✅ Binance Smart Chain signer is valid
✅ Bee signer is valid
✅ Chains are valid
✅ Balances are sufficient
Sending a message from bsc to bee
Pending https://bscscan.com/tx/0xf2b47dda2f1bf4b423196708218cecd2ab8ce3f62133c848948006f07a7e697f (waiting 1 blocks for confirmation)
Sent transfer from sender (0x5159eA8501d3746bB07c20B5D0406bD12844D7ec) on bsc to recipient (0x5159eA8501d3746bB07c20B5D0406bD12844D7ec) on bee.
Message ID: 0xbd4a53bcd526c4b15b7e0297af25dc9ad4a259523ca9d5d168190b841a3f61d8
Explorer Link: https://explorer.hyperlane.xyz/message/0xbd4a53bcd526c4b15b7e0297af25dc9ad4a259523ca9d5d168190b841a3f61d8
Message:
    id: "0xbd4a53bcd526c4b15b7e0297af25dc9ad4a259523ca9d5d168190b841a3f61d8"
    message: "0x030005890300000038000000000000000000000000946b51d0ce14dc0e66f79dfec\
      086e9c618efe41d00000c74000000000000000000000000dce906c2195c3c25b1bc42dbe1df2a\
      de45791b490000000000000000000000005159ea8501d3746bb07c20b5d0406bd12844d7ec000\
      00000000000000000000000000000000000000000000014d1120d7b160000"
    parsed:
      version: 3
      nonce: 362755
      origin: 56
      sender: "0x000000000000000000000000946b51d0ce14dc0e66f79dfec086e9c618efe41d"
      destination: 3188
      recipient: "0x000000000000000000000000dce906c2195c3c25b1bc42dbe1df2ade45791b49"
      body: "0x0000000000000000000000005159ea8501d3746bb07c20b5d0406bd12844d7ec000000\
        00000000000000000000000000000000000000000014d1120d7b160000"
    
Body:
    recipient: "0x0000000000000000000000005159ea8501d3746bb07c20b5d0406bd12844d7ec"
    amount: 1500000000000000000
    
Attempting self-relay of message...
Preparing to relay message 0xbd4a53bcd526c4b15b7e0297af25dc9ad4a259523ca9d5d168190b841a3f61d8
Relaying message 0xbd4a53bcd526c4b15b7e0297af25dc9ad4a259523ca9d5d168190b841a3f61d8
Pending https://scan.beechain.ai/tx/0xb750815040137deb36f6549cabcb4bbe57ebe35ed2cc22ff13d00181d69b1149 (waiting 1 blocks for confirmation)
Transfer was self-relayed!
✅ Successfully sent messages for chains: bsc ➡️ bee
root@ubuntu:~/hyperlane-registry# hyperlane warp send \
  --symbol BNB \
  --origin bsc \
  --destination bee \
  --amount 1000000000000000 \
  --relay
Hyperlane CLI
Multiple warp routes found for symbol BNB
? Select from matching warp routes BNB/warp-route-bnb-mainnet-deploy-config
🚀 Sending a message for chains: bsc ➡️ bee
Running pre-flight checks for chains...
✅ Binance Smart Chain signer is valid
✅ Bee signer is valid
✅ Chains are valid
✅ Balances are sufficient
Sending a message from bsc to bee
Pending https://bscscan.com/tx/0xcd734656ba29178086602d4850cd922ccaf6a923c498ca6a602648453a053c3b (waiting 1 blocks for confirmation)
Sent transfer from sender (0x5159eA8501d3746bB07c20B5D0406bD12844D7ec) on bsc to recipient (0x5159eA8501d3746bB07c20B5D0406bD12844D7ec) on bee.
Message ID: 0x7b8cdee22916d6b50e741d19da1b524f1a7aa93c05de80e9170c4f3ebba18eb8
Explorer Link: https://explorer.hyperlane.xyz/message/0x7b8cdee22916d6b50e741d19da1b524f1a7aa93c05de80e9170c4f3ebba18eb8
Message:
    id: "0x7b8cdee22916d6b50e741d19da1b524f1a7aa93c05de80e9170c4f3ebba18eb8"
    message: "0x030005890400000038000000000000000000000000fd886807575709490b3ae27d3\
      69372c288b99bac00000c7400000000000000000000000083f6132e81730069ea4e13bb2e5eb3\
      a41fad74070000000000000000000000005159ea8501d3746bb07c20b5d0406bd12844d7ec000\
      00000000000000000000000000000000000000000000000038d7ea4c68000"
    parsed:
      version: 3
      nonce: 362756
      origin: 56
      sender: "0x000000000000000000000000fd886807575709490b3ae27d369372c288b99bac"
      destination: 3188
      recipient: "0x00000000000000000000000083f6132e81730069ea4e13bb2e5eb3a41fad7407"
      body: "0x0000000000000000000000005159ea8501d3746bb07c20b5d0406bd12844d7ec000000\
        00000000000000000000000000000000000000000000038d7ea4c68000"
    
Body:
    recipient: "0x0000000000000000000000005159ea8501d3746bb07c20b5d0406bd12844d7ec"
    amount: 1000000000000000
    
Attempting self-relay of message...
Preparing to relay message 0x7b8cdee22916d6b50e741d19da1b524f1a7aa93c05de80e9170c4f3ebba18eb8
Relaying message 0x7b8cdee22916d6b50e741d19da1b524f1a7aa93c05de80e9170c4f3ebba18eb8
Pending https://scan.beechain.ai/tx/0x4e7471cb76d957964f6dbb778f4f65f917696568914278ae9c68494dce100dc6 (waiting 1 blocks for confirmation)
Transfer was self-relayed!
✅ Successfully sent messages for chains: bsc ➡️ bee


启动中继服务
不使用 --relay 的情况:

✅ 消息会成功发送到源链 (Bee 链)
❌ 但不会自动送达目标链 (BSC 链)
⏳ 消息会处于 Pending 状态,等待有人中继


首先配置bsc
# 创建 BSC 主网配置目录
mkdir -p ~/.hyperlane/chains/bsc
cp -r cp -r  ~/hyperlane-registry/chains/bsc  ~/.hyperlane/chains/

部署新的合约
合约
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IInterchainSecurityModule {
    enum Types {
        UNUSED,
        ROUTING,
        AGGREGATION,
        LEGACY_MULTISIG,
        MERKLE_ROOT_MULTISIG,
        MESSAGE_ID_MULTISIG,
        NULL,
        CCIP_READ,
        ARB_L2_TO_L1,
        WEIGHTED_MERKLE_ROOT_MULTISIG,
        WEIGHTED_MESSAGE_ID_MULTISIG,
        OP_STACK,
        TRUSTED_RELAYER
    }

    function moduleType() external view returns (uint8);
    function verify(bytes calldata _metadata, bytes calldata _message) external returns (bool);
}

contract TrustedRelayerIsm is IInterchainSecurityModule {
    address public relayer;
    address public owner;
    
    constructor(address _relayer) {
        relayer = _relayer;
        owner = msg.sender;
    }
    
    function moduleType() external pure returns (uint8) {
        return uint8(Types.TRUSTED_RELAYER); // 返回 12
    }
    
    function verify(bytes calldata _metadata, bytes calldata _message) external view returns (bool) {
        // 从 metadata 中提取中继器地址
        require(_metadata.length >= 20, "Invalid metadata");
        address actualRelayer = address(bytes20(_metadata[_metadata.length - 20:]));
        return actualRelayer == relayer;
    }
    
    function setRelayer(address _relayer) external {
        require(msg.sender == owner, "Only owner");
        relayer = _relayer;
    }
}
部署构造函数参数是部署者地址,合约地址是bee在bsc链的BSC Warp Route 现在使用你的自定义 ISM：0x347f8790045cD623d2DC75adA3e22aa945DB03A5


设置新的ISM地址
root@ubuntu:~/hyperlane-registry# cast send 0x946B51D0Ce14dc0e66F79dfEC086E9c618eFe41D \

  "setInterchainSecurityModule(address)" \

  0x347f8790045cD623d2DC75adA3e22aa945DB03A5 \

  --rpc-url https://bsc-dataseed.binance.org/ \

  --private-key $HYP_KEY

blockHash            0xc309eef56f2a584da3e1faee6a9be2722399abcd87d8a2c9aaeeed334364e6c9

blockNumber          77892060

contractAddress      

cumulativeGasUsed    16601654

effectiveGasPrice    50000000

from                 0x5159eA8501d3746bB07c20B5D0406bD12844D7ec

gasUsed              56928

logs                 [{"address":"0x946b51d0ce14dc0e66f79dfec086e9c618efe41d","topics":["0xc47cbcc588c67679e52261c45cc315e56562f8d0ccaba16facb9093ff9498799"],"data":"0x000000000000000000000000347f8790045cd623d2dc75ada3e22aa945db03a5","blockHash":"0xc309eef56f2a584da3e1faee6a9be2722399abcd87d8a2c9aaeeed334364e6c9","blockNumber":"0x4a489dc","blockTimestamp":"0x6979e766","transactionHash":"0xbc986453930064d3c8988631703c626555ac22cca0e1882d9f3584a9bc430231","transactionIndex":"0x8c","logIndex":"0x1de","removed":false}]

logsBloom            0x00000000000001000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010020000000000000000000000000000000000000000000080000000000000000000000

root                 

status               1 (success)

transactionHash      0xbc986453930064d3c8988631703c626555ac22cca0e1882d9f3584a9bc430231

transactionIndex     140

type                 2

blobGasPrice         

blobGasUsed          

to                   0x946B51D0Ce14dc0e66F79dfEC086E9c618eFe41D


自己启动中继服务
hyperlane relayer --chains bee bsc

终端执行下面的
解决方案：手动中继消息
我们需要直接调用 BSC Mailbox 的 process 方法。创建手动中继脚本如下并执行
cat > manual-relay.sh << 'EOF'
#!/bin/bash

echo "🔄 手动中继消息到 BSC"
echo ""

MESSAGE_ID="0x49800316e5b0b22365c5140c714613b92710c49bce109c4d401072ad3d53f2f2"
BSC_MAILBOX="0x2971b9Aec44bE4eb673DF1B88cDB57b96eefe8a4"
MESSAGE="0x030000000900000c74000000000000000000000000dce906c2195c3c25b1bc42dbe1df2ade45791b4900000038000000000000000000000000946b51d0ce14dc0e66f79dfec086e9c618efe41d0000000000000000000000005159ea8501d3746bb07c20b5d0406bd12844d7ec00000000000000000000000000000000000000000000000006f05b59d3b20000"

# Metadata 格式：中继器地址（20 字节）
METADATA="0x0000000000000000000000005159ea8501d3746bb07c20b5d0406bd12844d7ec"

echo "Message ID: $MESSAGE_ID"
echo "Mailbox: $BSC_MAILBOX"
echo ""

# 调用 Mailbox.process(metadata, message)
export HYP_KEY='不带0x的私钥'
cast send $BSC_MAILBOX \
  "process(bytes,bytes)" \
  $METADATA \
  $MESSAGE \
  --rpc-url https://bsc-dataseed.binance.org/ \
  --private-key $HYP_KEY \
  --gas-limit 500000

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 消息中继成功!"
    echo "查看交易: https://bscscan.com/"
else
    echo ""
    echo "❌ 中继失败"
fi
EOF

chmod +x manual-relay.sh
./manual-relay.sh
这个脚本会：

直接调用 BSC Mailbox 的 process 方法
传入正确的 metadata（你的中继器地址）
传入完整的消息内容
运行这个脚本来手动完成中继。


上面的脚本方式需要手动中继,并不好,所以继续优化
oot@ubuntu:~# hyperlane warp send --symbol USDT --origin bee --destination bsc --amount 30000000000000000
Hyperlane CLI
? Please enter the private key for chain bee (will be re-used for other chains with the same protocol type)
Multiple warp routes found for symbol USDT
? Select from matching warp routes USDT/warp-route-usdt-mainnet-deploy-config
🚀 Sending a message for chains: bee ➡️ bsc
Running pre-flight checks for chains...
✅ Bee signer is valid
✅ Binance Smart Chain signer is valid
✅ Chains are valid
✅ Balances are sufficient
Sending a message from bee to bsc
Pending https://scan.beechain.ai/tx/0x62ee504a403ffc75976547ec64b4d0da94f5c6eca74ae028923ddd3c5299e676 (waiting 1 blocks for confirmation)
Sent transfer from sender (0x5159eA8501d3746bB07c20B5D0406bD12844D7ec) on bee to recipient (0x5159eA8501d3746bB07c20B5D0406bD12844D7ec) on bsc.
Message ID: 0xfe852a2fb7c4d57260ac3b4f9b7893fbec0cdc82ea310adc6108c89e86a98454
Explorer Link: https://explorer.hyperlane.xyz/message/0xfe852a2fb7c4d57260ac3b4f9b7893fbec0cdc82ea310adc6108c89e86a98454
Message:
    id: "0xfe852a2fb7c4d57260ac3b4f9b7893fbec0cdc82ea310adc6108c89e86a98454"
    message: "0x030000001600000c74000000000000000000000000dce906c2195c3c25b1bc42dbe\
      1df2ade45791b4900000038000000000000000000000000946b51d0ce14dc0e66f79dfec086e9\
      c618efe41d0000000000000000000000005159ea8501d3746bb07c20b5d0406bd12844d7ec000\
      000000000000000000000000000000000000000000000006a94d74f430000"
    parsed:
      version: 3
      nonce: 22
      origin: 3188
      sender: "0x000000000000000000000000dce906c2195c3c25b1bc42dbe1df2ade45791b49"
      destination: 56
      recipient: "0x000000000000000000000000946b51d0ce14dc0e66f79dfec086e9c618efe41d"
      body: "0x0000000000000000000000005159ea8501d3746bb07c20b5d0406bd12844d7ec000000\
        000000000000000000000000000000000000000000006a94d74f430000"
    
Body:
    recipient: "0x0000000000000000000000005159ea8501d3746bb07c20b5d0406bd12844d7ec"
    amount: 30000000000000000
    
Message 0xfe852a2fb7c4d57260ac3b4f9b7893fbec0cdc82ea310adc6108c89e86a98454 was processed
All messages processed for tx 0x62ee504a403ffc75976547ec64b4d0da94f5c6eca74ae028923ddd3c5299e676
Transfer sent to bsc chain!
✅ Successfully sent messages for chains: bee ➡️ bsc



# 方法 2：自动中继器扫描历史 + 持续监听
mkdir hyperlane-relyer
cd  hyperlane-relyer
npm init
npm install  ethers 
npm install pm2 -g
export HYP_KEY='你的私钥不带0x'
node auto-relayer-final.js 
或者pm2 start auto-relayer-final.js --name hyperlane-relayer

前端操作步骤
1. 用户授权 USDT 给 Warp Route 合约
javascript
// 前端代码（ethers.js 示例）
const USDT_ADDRESS = '0x...';  // Bee 链上的 USDT 地址
const WARP_ROUTE = '0xdce906c2195c3c25b1bc42dbe1df2ade45791b49';  // Bee 链上的 Warp Route
// ERC20 approve
const usdtContract = new ethers.Contract(USDT_ADDRESS, ['function approve(address,uint256)'], signer);
await usdtContract.approve(WARP_ROUTE, amount);
2. 调用 Warp Route 的 transferRemote
javascript
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
后端 Relayer 服务
您需要持续运行 
auto-relayer-final.js
 来自动中继消息：


# 在服务器上持续运行（可用 pm2 或 systemd 管理）
export HYP_KEY=relayer的私钥
pm2 start auto-relayer-final.js --name hyperlane-relayer

完整前端示例
javascript
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
关键点
项目	说明
用户操作	授权 + transferRemote（在 Bee 链上支付 gas）
Relayer	自动监听并中继（在 BSC 链上支付 gas）
用户体验	用户只需等待几秒到几分钟，USDT 就会到达 BSC
