// modals : connect wallet, manage wallet
export const WALLET_CONNECT_MODAL_OPEN = "WALLET_CONNECT_MODAL_OPEN";
export const WALLET_CONNECT_MODAL_CLOSE = "WALLET_CONNECT_MODAL_CLOSE";
export const WALLET_MANAGE_MODAL_OPEN = "WALLET_MANAGE_MODAL_OPEN";
export const WALLET_MANAGE_MODAL_CLOSE = "WALLET_MANAGE_MODAL_CLOSE";
export const CHAIN_MANAGE_MODAL_OPEN = "CHAIN_MANAGE_MODAL_OPEN";
export const CHAIN_MANAGE_MODAL_CLOSE = "CHAIN_MANAGE_MODAL_CLOSE";

// modals : connec
export const PUBLICKEY_CONNECT = "PUBLICKEY_CONNECT"
export const ADDRESS_CONNECT = "ADDRESS_CONNECT"
export const METAMASK_CONNECT = "METAMASK_CONNECT";
export const WALLET_KAIKAS_CONNECT = "WALLET_KAIKAS_CONNECT";
export const WALLET_DISCONNECT = "WALLET_DISCONNECT";
export const CONNECT_REFRESH = "CONNECT_REFRESH";
export const WALLET_MODAL = "WALLET_MODAL";

// proposal
export const PROPOSAL_CONNECT_BOX = "PROPOSAL_CONNECT_BOX";
export const UPDATE_REQUEST_INFO = "UPDATE_REQUEST_INFO";

// smart Account
export const UPDATE_SMARTWALLET_ADDRESS = "UPDATE_SMARTWALLET_ADDRESS";
export const CHANGE_CHAIN_PROVIDER = "CHANGE_CHAIN_PROVIDER";
export const BASEADDRESS_CONNECT = "BASEADDRESS_CONNECT";

export const changeChainProvider = (newProvider) => ({
  type: CHANGE_CHAIN_PROVIDER,
  payload: {
    newProvider,
  },
});

// const updateSmartwalletAddress = payload => {
//   return {
//       type: UPDATE_SMARTWALLET_ADDRESS,
//       payload
//   };
// };

const updateSmartwalletAddress = payload => {
  return {
      type: UPDATE_SMARTWALLET_ADDRESS,
      payload,
  };
};


// wallet connect modal open
export const smartWalletUpdateAddress = (address) => async dispatch => {
  dispatch(updateSmartwalletAddress({ account: address}));
};


const updateRequestInfo = payload => {
  return {
      type: UPDATE_REQUEST_INFO,
      payload
  };
};

// wallet connect modal open
export const requestUpdateInfo = (req) => async dispatch => {
  dispatch(updateRequestInfo({reqInfo : req}));
}

const proposalConnectBoxOpen = payload => {
  return {
      type: PROPOSAL_CONNECT_BOX,
      payload
  };
};

// wallet connect modal open
export const connectProposalBoxOpen = () => async dispatch => {
  dispatch(proposalConnectBoxOpen({ proposalBox: true }));
}



// MODAL 상태관리
// wallet connect modal open
const connectWalletModalOpen = payload => {
    return {
        type: WALLET_CONNECT_MODAL_OPEN,
        payload
    };
};


// wallet connect modal close
const connectWalletModalClose = payload => {
    return {
        type: WALLET_CONNECT_MODAL_CLOSE,
        payload
    };
};

// wallet manage modal open
const manageWalletModalOpen = payload => {
    return {
        type: WALLET_MANAGE_MODAL_OPEN,
        payload
    };
};

// wallet manage modal close
const manageWalletModalClose = payload => {
    return {
        type: WALLET_MANAGE_MODAL_CLOSE,
        payload
    };
};

// wallet manage modal open
const manageChainModalOpen = payload => {
  return {
      type: CHAIN_MANAGE_MODAL_OPEN,
      payload
  };
};

// wallet manage modal close
const manageChainModalClose = payload => {
  return {
      type: CHAIN_MANAGE_MODAL_CLOSE,
      payload
  };
};

// matamask connect
const metamaskConnect = payload => {
    return {
        type: METAMASK_CONNECT,
        payload,
    };
};

// kaikas connect
const walletKaikasConnect = payload => {
    return {
        type: WALLET_KAIKAS_CONNECT,
        payload,
    };
};

// kaikas connect
const addressConnect = payload => {
    return {
        type: ADDRESS_CONNECT,
        payload,
    };
};


// wallet 초기화
const connectRefresh = payload => {
  return {
    type: CONNECT_REFRESH,
    payload,
  };
};


// wallet connect modal open
export const walletConnectModalOpen = () => async dispatch => {
    dispatch(connectWalletModalOpen({ walletConnectModal: true }));
}

// wallet connect modal open
export const walletConnectModalClose = () => async dispatch => {
    dispatch(connectWalletModalClose({ walletConnectModal: false }));
}

// wallet manage modal open
export const walletManageModalOpen = () => async dispatch => {
    dispatch(manageWalletModalOpen({ walletManageModal: true }));
}

// wallet manage modal open
export const walletManageModalClose = () => async dispatch => {
    dispatch(manageWalletModalClose({ walletManageModal: false }));
}

// chain manage modal open
export const chainManageModalOpen = () => async dispatch => {
  dispatch(manageChainModalOpen({ chainManageModal: true }));
}

// chain manage modal open
export const chainManageModalClose = () => async dispatch => {
  dispatch(manageChainModalClose({ chainManageModal: false }));
}

// metamask connect
export const connectMetamask = () => async dispatch => {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      dispatch(metamaskConnect({ account: accounts[0] }));
      localStorage.setItem("address", accounts[0])
      localStorage.setItem("wallet", "metamask")
} catch (error) {
      console.error(error);
    }
  }
};

export const connectPublickey = (publicKey) => async dispatch => {
  dispatch(addressPublickey({ publicKey: publicKey}));
};

// kaikas connect
const addressPublickey = payload => {
  return {
      type: PUBLICKEY_CONNECT,
      payload,
  };
};

export const connectBaseAddress = (baseAddress) => async dispatch => {
  dispatch(addressBaseAddress({ baseAddress: baseAddress}));
};

const addressBaseAddress = payload => {
  return {
      type: BASEADDRESS_CONNECT,
      payload,
  };
};




export const connectAddress = (address) => async dispatch => {
    dispatch(addressConnect({ account: address}));
};

export const connectKaikas = () => async dispatch => {
    
    const { klaytn } = window

    if (klaytn) {
        try {
            await klaytn.enable()
            klaytn.on('accountsChanged', () => console.log("account changed"))
            const accounts = klaytn.selectedAddress
            dispatch(walletKaikasConnect({ account: accounts }));
            localStorage.setItem("address", klaytn.selectedAddress)
            localStorage.setItem("wallet", "kaikas")
        } catch (error) {
            console.log(error)
        }
    } else {
        console.log('Non-Kaikas browser detected. You should consider trying Kaikas!')
    }

};

export const disconnect = () => async dispatch => {
    dispatch(connectRefresh({ account: "", walletProvider: ""}));
  };


export const getAddress = () => async dispatch => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (addressArray.length > 0) {
        dispatch(connectRefresh({ account: addressArray[0] }));
      }
    } catch (error) {
      console.error(error);
    }
  }
};