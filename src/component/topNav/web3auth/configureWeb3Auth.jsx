import { Web3AuthNoModal } from "@web3auth/no-modal";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";

import { Web3Auth } from "@web3auth/modal";
import {
  WalletConnectV2Adapter,
  getWalletConnectV2Settings,
} from "@web3auth/wallet-connect-v2-adapter";

import {
  CHAIN_NAMESPACES,
  SafeEventEmitterProvider,
  WALLET_ADAPTERS,
} from "@web3auth/base";
import { MetamaskAdapter } from "@web3auth/metamask-adapter";

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

  const web3auth = new Web3Auth({
    clientId: "BODWZ6bS1HF4cxbj98vCyrqGNZbx2xh9tO4PC9kq7pV7p6mEkLWmA5VzCYYtt5okZ_5_xUzgbE26r1rhD9j_xLs",
    chainConfig: chainConfig,
    uiConfig: {
      appName: "Linkrypto",
      appLogo: "https://res.cloudinary.com/travary/image/upload/c_fill,h_400,w_400/v1/prd-akindo-public/communities/icon/rg714Qq68sqxGL3L.jpg", // Your App Logo Here
      theme: "light",
      loginMethodsOrder: ["google", "apple", "kakao"],
      defaultLanguage: "en", // en, de, ja, ko, zh, es, fr, pt, nl
      loginGridCol: 3,
      primaryButton: "externalLogin", // "externalLogin" | "socialLogin" | "emailLogin"
    },
    web3AuthNetwork: "testnet",
  });

  const openloginAdapter = new OpenloginAdapter({
    loginSettings: {
      mfaLevel: "optional",
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
          enable: true,
          priority: 3,
          mandatory: false,
        },
        passwordFactor: {
          enable: true,
          priority: 4,
          mandatory: false,
        },
      },
    },
  });

  web3auth.configureAdapter(openloginAdapter);

  const defaultWcSettings = await getWalletConnectV2Settings(
    "eip155",
    [1, 137, 5],
    "04309ed1007e77d1f119b85205bb779d"
  );
  const walletConnectV2Adapter = new WalletConnectV2Adapter({
    adapterSettings: { ...defaultWcSettings.adapterSettings },
    loginSettings: { ...defaultWcSettings.loginSettings },
  });

  web3auth.configureAdapter(walletConnectV2Adapter);

  // adding metamask adapter
  const metamaskAdapter = new MetamaskAdapter({
    clientId : "BODWZ6bS1HF4cxbj98vCyrqGNZbx2xh9tO4PC9kq7pV7p6mEkLWmA5VzCYYtt5okZ_5_xUzgbE26r1rhD9j_xLs",
    sessionTime: 3600, // 1 hour in seconds
    web3AuthNetwork: "testnet",
    chainConfig: {
      chainNamespace: CHAIN_NAMESPACES.EIP155,
      chainId: "0x5",
      rpcTarget: "https://rpc.ankr.com/eth_goerli", // This is the public RPC we have added, please pass on your own endpoint while creating an app
    },
  });
  // we can change the above settings using this function
  metamaskAdapter.setAdapterSettings({
    sessionTime: 86400, // 1 day in seconds
    chainConfig: {
      chainNamespace: CHAIN_NAMESPACES.EIP155,
      chainId: "0x5",
      rpcTarget: "https://rpc.ankr.com/eth_goerli", // This is the public RPC we have added, please pass on your own endpoint while creating an app
    },
    web3AuthNetwork: "testnet",
  });

  web3auth.configureAdapter(metamaskAdapter);

    return web3auth;
  };
  
  export default configureWeb3Auth;