import { Web3AuthNoModal } from "@web3auth/no-modal";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { CHAIN_NAMESPACES } from "@web3auth/base";

const clientId = "BODWZ6bS1HF4cxbj98vCyrqGNZbx2xh9tO4PC9kq7pV7p6mEkLWmA5VzCYYtt5okZ_5_xUzgbE26r1rhD9j_xLs"; // get from https://dashboard.web3auth.io

const configureWeb3Auth = async () => {

  const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x5",
    rpcTarget: "https://rpc.ankr.com/eth_goerli",
    displayName: "Ethereum Testnet",
    blockExplorer: "https://goerli.etherscan.io",
    ticker: "ETH",
    tickerName: "Ethereum",
  };

  const web3auth = new Web3AuthNoModal({
    clientId: clientId,
    chainConfig: {
      chainNamespace: CHAIN_NAMESPACES.EIP155,
      chainId: "0x5",
      rpcTarget: "https://rpc.ankr.com/eth_goerli",
      // rpcTarget: "https://rpc.ankr.com/eth", // This is the public RPC we have added, please pass on your own endpoint while creating an app
    },
    uiConfig: {
      appName: "Linkrypto",
      appLogo: "https://res.cloudinary.com/travary/image/upload/c_fill,h_400,w_400/v1/prd-akindo-public/communities/icon/rg714Qq68sqxGL3L.jpg", // Your App Logo Here
      theme: "light",
      loginMethodsOrder: ["google", "apple", "kakao"],
      defaultLanguage: "en", // en, de, ja, ko, zh, es, fr, pt, nl
      loginGridCol: 1,
      primaryButton: "externalLogin", // "externalLogin" | "socialLogin" | "emailLogin"
    },
    web3AuthNetwork: "cyan",
  });

    const privateKeyProvider = new EthereumPrivateKeyProvider({
      config: { chainConfig },
    });
    
      const openloginAdapter = new OpenloginAdapter({
      loginSettings: {
        mfaLevel: "mandatory",
      },
      adapterSettings: {
        uxMode: "popup", // "redirect" | "popup"
        whiteLabel: {
          name: "Linkrypto",
          logoLight: "https://web3auth.io/images/w3a-L-Favicon-1.svg",
          logoDark: "https://web3auth.io/images/w3a-D-Favicon-1.svg",
          defaultLanguage: "en", // en, de, ja, ko, zh, es, fr, pt, nl
          dark: false, // whether to enable dark mode. defaultValue: false
        },
        mfaSettings: {
          deviceShareFactor: {
            enable: true,
            priority: 1,
            mandatory: true,
          },
          backUpShareFactor: {
            enable: true,
            priority: 2,
            mandatory: false,
          },
          socialBackupFactor: {
            enable: false,
            priority: 3,
            mandatory: false,
          },
          passwordFactor: {
            enable: false,
            priority: 4,
            mandatory: false,
          },
        },
      },
      privateKeyProvider
    });
  
    web3auth.configureAdapter(openloginAdapter);

    return web3auth;
  };
  
  export default configureWeb3Auth;