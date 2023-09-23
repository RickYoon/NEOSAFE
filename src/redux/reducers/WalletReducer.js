import { 
    PROPOSAL_CONNECT_BOX,
    WALLET_CONNECT_MODAL_OPEN,
    WALLET_CONNECT_MODAL_CLOSE, 
    WALLET_MANAGE_MODAL_OPEN,
    WALLET_MANAGE_MODAL_CLOSE,
    CHAIN_MANAGE_MODAL_OPEN,
    CHAIN_MANAGE_MODAL_CLOSE,
    METAMASK_CONNECT,
    WALLET_KAIKAS_CONNECT,
    ADDRESS_CONNECT,
    CONNECT_REFRESH,
    UPDATE_REQUEST_INFO,
    UPDATE_SMARTWALLET_ADDRESS,
    CHANGE_CHAIN_PROVIDER,
    PUBLICKEY_CONNECT,
    BASEADDRESS_CONNECT
  } from "./WalletActions";

const initialState = {
  account: "",
  walletProvider: "",
  smartAddress: "",
  baseAddress: "",
  chainProvider: "NEO-N3-TEST",
  walletConnectModal: false,
  walletManageModal: false,
  chainManageModal: false,
  proposalBox: false,
  requesetInfo: {},
  publicKey: ""
};

const WalletReducer = (state = initialState, action) => {
  switch (action.type) {

    case WALLET_CONNECT_MODAL_OPEN:
    return {
        ...state,
        walletConnect: action.payload.walletConnectModal
        };

    case WALLET_CONNECT_MODAL_CLOSE:
    return {
        ...state,
        walletConnect: action.payload.walletConnectModal
        };

    case WALLET_MANAGE_MODAL_OPEN:
    return {
        ...state,
        walletManage: action.payload.walletManageModal
        };

    case WALLET_MANAGE_MODAL_CLOSE:
    return {
        ...state,
        walletManage: action.payload.walletManageModal
        };
        
    case CHAIN_MANAGE_MODAL_OPEN:
      return {
          ...state,
          chainManageModal: action.payload.chainManageModal
          };
  
    case CHAIN_MANAGE_MODAL_CLOSE:
    return {
        ...state,
        chainManageModal: action.payload.chainManageModal
        };
            
      case METAMASK_CONNECT:
      return {
        ...state,
        walletProvider: "metamask",
        account: action.payload.account
      };

    case WALLET_KAIKAS_CONNECT:
    return {
        ...state,
        walletProvider: "kaikas",
        account: action.payload.account
    };        

    case ADDRESS_CONNECT:
    return {
        ...state,
        walletProvider: "noProvider",
        account: action.payload.account
    };   

    case PUBLICKEY_CONNECT:
    return {
        ...state,
        publicKey: action.payload.publicKey
    };   

    case BASEADDRESS_CONNECT:
    return {
        ...state,
        baseAddress: action.payload.baseAddress
    };      
  
    case UPDATE_REQUEST_INFO:
      return {
          ...state,
          requesetInfo: action.payload.reqInfo
      }; 
    
    case CONNECT_REFRESH:
    return {
        account: "",
        walletProvider: "",
        walletConnectModal: false,
        walletManageModal: false
    };
    
    case UPDATE_SMARTWALLET_ADDRESS:
      console.log("aaa")
    return {
      ...state,
      smartAddress: action.payload.account
    };    

    case CHANGE_CHAIN_PROVIDER:
      return {
        ...state,
        chainProvider: action.payload.newProvider,
      };

    
    case PROPOSAL_CONNECT_BOX:
      return {
        ...state,
        proposalBox: true
        };


    default:
    return state;
  }
};

export default WalletReducer;