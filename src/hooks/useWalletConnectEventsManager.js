import { useCallback, useEffect } from 'react';
import { signClient } from 'utils/WalletConnectUtil';
import store from '../redux/store';
import { connectProposalBoxOpen } from '../redux/reducers/WalletActions';


// import { COSMOS_SIGNING_METHODS } from '@/data/COSMOSData';
// import { EIP155_SIGNING_METHODS } from '@/data/EIP155Data';
// import { SOLANA_SIGNING_METHODS } from '@/data/SolanaData';
// import { POLKADOT_SIGNING_METHODS } from '@/data/PolkadotData';
// import { MULTIVERSX_SIGNING_METHODS } from '@/data/MultiversxData';
// import { TRON_SIGNING_METHODS } from '@/data/TronData';
// import ModalStore from '@/store/ModalStore';
// import SettingsStore from '@/store/SettingsStore';
// import { useSnapshot } from 'valtio';
// import { NEAR_SIGNING_METHODS } from '@/data/NEARData';
// import { approveNearRequest } from '@/utils/NearRequestHandlerUtil';
// import { TEZOS_SIGNING_METHODS } from '@/data/TezosData';
// import { KADENA_SIGNING_METHODS } from '@/data/KadenaData';

export default function useWalletConnectEventsManager(initialized) {
  /******************************************************************************
   * 1. Open session proposal modal for confirmation / rejection
   *****************************************************************************/
  const onSessionProposal = useCallback(
    (proposal) => {
      // set the verify context so it can be displayed in the projectInfoCard
      store.dispatch(connectProposalBoxOpen());
      console.log("proposal",proposal)
    },
    []
  );

  /******************************************************************************
   * Set up WalletConnect event listeners
   *****************************************************************************/
  useEffect(() => {
    if (initialized) {

      console.log("initialized",initialized)
      // signClient.on('session_proposal', onSessionProposal);
      // signClient.on('session_request', onSessionRequest);
      // // TODOs
      // signClient.on('session_ping', data => console.log('ping', data));
      // signClient.on('session_event', data => console.log('event', data));
      // signClient.on('session_update', data => console.log('update', data));
      // signClient.on('session_delete', data => console.log('delete', data));
    }
  }, [initialized]);
}
