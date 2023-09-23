import { Core } from "@walletconnect/core";
import { SignClientTypes } from '@walletconnect/types'
import { IWeb3Wallet, Web3Wallet } from "@walletconnect/web3wallet";
import { buildApprovedNamespaces } from '@walletconnect/utils'
import SignClient from '@walletconnect/sign-client'
import { RELAYER_EVENTS } from '@walletconnect/core'
import { useDispatch , useSelector } from 'react-redux';
import { useCallback, useEffect } from 'react'
import store from '../redux/store';
import { connectProposalBoxOpen, chainManageModalOpen, walletManageModalOpen, requestUpdateInfo } from '../redux/reducers/WalletActions';

export let signClient

export async function initWalletConnect() {

  try {

    signClient = await SignClient.init({
      logger: 'debug',
      projectId: "ec72811053639fcca0be670eefbd8c3c",
      relayUrl: "wss://relay.walletconnect.com",
      metadata: {
        name: 'React Wallet',
        description: 'React Wallet for WalletConnect',
        url: 'https://walletconnect.com/',
        icons: ['https://avatars.githubusercontent.com/u/37784886']
      }
    })

    const clientId = await signClient.core.crypto.getClientId()

    signClient.core.pairing.events.on("pairing_delete", ({ id, topic }) => {
      // clean up after the pairing for `topic` was deleted.
      console.log("id", id)
      console.log("id", topic)
    });

    const init = await _onFunc()
  

    signClient.core.relayer.on(RELAYER_EVENTS.connect, () => {
      console.log('Network connection is restored!', 'success')
    })

    return true

  } catch (error) {
    console.error('Failed to init wallet connect : ', error)
  }
  
}


async function _onFunc() {


  // const dispatch = useDispatch();

  signClient.on('session_proposal', async proposal => {
    
    localStorage.setItem('context', proposal.verifyContext)
    localStorage.setItem('context', JSON.stringify(proposal))
    store.dispatch(connectProposalBoxOpen());

  })

  signClient.on('session_request', async request => {

    console.log("request",request)
    store.dispatch(chainManageModalOpen());
    store.dispatch(requestUpdateInfo(request));

  })

  signClient.on('session_ping', data => console.log('ping', data))
  signClient.on('session_event', data => console.log('event', data))
  signClient.on('session_update', data => console.log('update', data))
  signClient.on('session_delete', data => console.log('delete', data))
  signClient.on('expirer_created', data => console.log('expirer_created', data))
}


export async function createWeb3Wallet() {

  signClient = await SignClient.init({
    logger: 'debug',
    projectId: "ec72811053639fcca0be670eefbd8c3c",
    relayUrl: "wss://relay.walletconnect.com",
    metadata: {
      name: 'React Wallet',
      description: 'React Wallet for WalletConnect',
      url: 'https://walletconnect.com/',
      icons: ['https://avatars.githubusercontent.com/u/37784886']
    }
  })

  

  async function onFunc() {


    // const dispatch = useDispatch();

    signClient.on('session_proposal', async proposal => {
      
      localStorage.setItem('context', proposal.verifyContext)
      localStorage.setItem('context', proposal)

      store.dispatch(connectProposalBoxOpen());
      // console.log('SessionProposalModal', { proposal })
      // dispatch(connectProposalBoxOpen())
    })

    signClient.on('session_request', async payload => {
            console.log('payload', payload)
            store.dispatch(chainManageModalOpen());
            store.dispatch(requestUpdateInfo(payload));
        
    })
    
      signClient.on('session_ping', data => console.log('ping', data))
    signClient.on('session_event', data => console.log('event', data))
    signClient.on('session_update', data => console.log('update', data))
    signClient.on('session_delete', data => console.log('delete', data))
    signClient.on('expirer_created', data => console.log('expirer_created', data))
  }

  try {
    const clientId = await signClient.core.crypto.getClientId()
    signClient.core.pairing.events.on("pairing_delete", ({ id, topic }) => {
      // clean up after the pairing for `topic` was deleted.
      console.log("id", id)
      console.log("id", topic)
    });

    const init = await onFunc()
  

    signClient.core.relayer.on(RELAYER_EVENTS.connect, () => {
      console.log('Network connection is restored!', 'success')
    })

  } catch (error) {
    console.error('Failed to set WalletConnect clientId in localStorage: ', error)
  }
}

export async function namespaceBuild(wcuri) {

  const pair = await signClient.core.pairing.pair({ uri : wcuri })
  return pair

}


