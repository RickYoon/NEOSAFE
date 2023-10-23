import 'App.css'; 
import React, {useEffect} from "react";
import {Link} from "react-router-dom"
import { useNavigate } from 'react-router-dom';
import { useDispatch , useSelector } from 'react-redux';
import { useState } from "react";
import "./detail.css";
import { invokeWC } from "../../utils/InvokeWC"
import { formatJsonRpcError, formatJsonRpcResult } from '@json-rpc-tools/utils'
import { initWalletConnect, signClient } from 'utils/WalletConnectUtil'

import {connectAddress,
  walletManageModalClose,
  walletManageModalOpen,
  chainManageModalOpen,
  chainManageModalClose,
  changeChainProvider,
  connectPublickey,
  connectBaseAddress
} from 'redux/reducers/WalletActions'

import Example from './subComponent/DropdownProfile';
import configureWeb3Auth from './web3auth/configureWeb3Auth';
import RPC from "./web3RPC.ts";
import { wallet, u, sc } from "@cityofzion/neon-js"
import ChainSelector from "./subComponent/ChainSelector"

import {
  CHAIN_NAMESPACES,
  SafeEventEmitterProvider,
  WALLET_ADAPTERS,
} from "@web3auth/base";

function Topnav () {

    const navigate = useNavigate();

    const [web3auth, setWeb3auth] = useState(null);
    const [provider, setProvider] = useState(null);  
    const [modalstate, setModalstate] = useState(false)
    const [isLogined, setIsLogined] = useState(false);
    const [signNumber, setSignNumber] = useState(0)

    const dispatch = useDispatch();

    const userAccount = useSelector(state => state.account) 
    const walletManageModal = useSelector(state => state.walletManage)
    const requesetInfo = useSelector(state => state.requesetInfo) 
    const chainProvider = useSelector(state => state.chainProvider) 
    const baseAddress = useSelector(state => state.baseAddress)
    const chainManageModal = useSelector(state => state.chainManageModal) 

    useEffect(() => {

      if(userAccount !== ""){
        web3Login()
      }

    }, []);

    
    const walletOpen = async () => {
      dispatch(walletManageModalOpen())
    }

    const handleChangeChainProvider = (newProvider) => {
      dispatch(changeChainProvider(newProvider));
    };

    const web3Login = async () => {

      try {
        
        const web3auth = await configureWeb3Auth();

        await web3auth.init();

        let web3authProvider = {}

        if(web3auth.connected){
          web3authProvider = web3auth.provider
          setIsLogined(true)
        } else {
          web3authProvider = await web3auth.connectTo(
            WALLET_ADAPTERS.OPENLOGIN,
            {
              loginProvider: "google",
            }
          );
        }

        const rpc = new RPC(web3authProvider);
        const address = await rpc.getAccounts();

        setProvider(web3authProvider);
        setWeb3auth(web3auth);

        const privateKey = await rpc.getPrivateKey();
        const user = await web3auth.getUserInfo();
        localStorage.setItem("LoginInfo", JSON.stringify(user))

        if(chainProvider === "NEO-N3-MAIN" || chainProvider === "NEO-N3-TEST"){
          //for Neo Chain
          const neoWallet = new wallet.Account(privateKey)
          // console.log("neoWallet",neoWallet)
          dispatch(connectAddress(neoWallet._address))
          dispatch(connectBaseAddress(neoWallet._address))
          dispatch(connectPublickey(neoWallet._publicKey))

          localStorage.setItem("lastLoginAccount", neoWallet._address)
          const lastObject = JSON.parse(localStorage.getItem("lastSelectAccount"))

          if(lastObject.baseAddress === neoWallet._address) {
            dispatch(connectAddress(lastObject.selectedAddress))
          }

        } else {

          dispatch(connectAddress(address))

        }

        dispatch(walletManageModalClose())

        setModalstate(true)

      } catch (error) {
        console.log("error", error)
      }

    }


    const logout = async () => {
      if (!web3auth) {
        console.log("web3auth not initialized yet");
        return;
      }
      await web3auth.logout();
      setProvider(null);
      dispatch(connectAddress(""))
      dispatch(connectBaseAddress(""))
      dispatch(connectPublickey(""))
      localStorage.removeItem("LoginInfo")
      navigate("/wallet")
    };

    const approve = async () => {

        setSignNumber(1)

        const signedTxHash = await invokeWC(requesetInfo, baseAddress, chainProvider)

        setSignNumber(2)

        const response = formatJsonRpcResult(signedTxHash.id, signedTxHash.sign);

        const topic = signedTxHash.topic
    
        const wow = await signClient.respond({
          topic: topic,
          response,
        });

    }  

    const modalCloseHandle = () => {
      setSignNumber(0)
      dispatch(chainManageModalClose())
    }

    return (
        <>        
          <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <div class="flex items-center">
              <Link to="/">
                <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                  <span style={{color:"#03A688"}}>NEO</span>
                  SAFE</span>
              </Link>

                <div class="pl-20 items-center justify-between hidden w-full md:flex md:w-auto">
                  <ul class="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700" style={{marginRight:"20px"}}>
                    <li>{userAccount === "" ?
                        <div onClick={walletOpen} class="flex items-center cursor-pointer">
                          <span class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
                          Portfolio
                          </span>
                        </div>
                        :                  
                        <Link to="/Overview" class="flex items-center">
                          <span class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
                          Portfolio
                          </span>
                        </Link>
                        }
                    </li>

                    <li>{userAccount === "" ?
                        <div onClick={walletOpen} class="flex items-center cursor-pointer">
                          <span class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
                          Connect
                          </span>
                        </div>
                        :                  
                        <Link to="/connect" class="flex items-center">
                          <span class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
                          Connect
                          </span>
                        </Link>
                        }
                    </li>

                
                    
                  </ul>
                </div> 
            </div>
        
            <div class="flex md:order-2">   
            <div className="relative inline-block text-left">
            <ChainSelector chainProvider={chainProvider} handleChangeChainProvider={handleChangeChainProvider}/>

          </div>       

            {provider === null ?
            <button onClick={walletOpen} type="button" data-modal-target="crypto-modal" data-modal-toggle="crypto-modal" class="text-white ml-1 bg-primary-700 hover:bg-gray-100 border border-gray-200 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center">
                <svg aria-hidden="true" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                Login
            </button>
            :
            <>
            <Example logout={logout} userAccount={userAccount} baseAddress={baseAddress}/>
            </>
            }   
            </div>
            </div>
        
        {walletManageModal ? (
            <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative w-full max-w-md max-h-full">
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    
                    <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                    <h3 className="text-2xl font-semibold">
                        Login
                    </h3>
                    <button onClick={() => dispatch(walletManageModalClose())}>
                        <span className="bg-transparent text-black opacity-1 h-6 w-6 text-2xl block outline-none focus:outline-none">
                        ×
                        </span>
                    </button>
                    </div>
                    
                    <div class="p-6">
                    
                    {/* <p class="text-sm font-normal text-gray-500 dark:text-gray-400">Social</p> */}
                        <ul class="my-4 space-y-3">
                            <li>
                            <li>
                                <div onClick={web3Login} class="cursor-pointer flex items-center p-3 text-base text-gray-900 rounded-lg bg-gray-50 text-left">
                                  <img src="https://static-00.iconduck.com/assets.00/google-icon-2048x2048-czn3g8x8.png" alt="Google Auth Icon" class="ml-3 h-5" />
                                  <div class="ml-5">Google </div>
                                </div>
                              </li>
                            </li>

                        </ul>
                    {/* <p class="text-sm font-normal text-gray-500 dark:text-gray-400">Wallet</p>
                    
                    <ul class="my-4 space-y-3">
                            <li>
                            <li>
                                <div class="flex items-center p-3 text-base text-gray-900 rounded-lg bg-gray-50 text-left">
                                <img src="https://play-lh.googleusercontent.com/TObkXJ6AbaWuE-oEYnfxH4fT6wsZvZTxa2O0hD4AHt2AQnAz6U9qFQ6CHqtijA7aaA" alt="Google Auth Icon" class="ml-3 h-5" />
                                <span class="ml-5">neoline</span>
                                </div>
                              </li>
                            </li>

                        </ul> */}
                    
                    </div>
                </div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
            </>
        ) : null}

      {chainManageModal ? (
            <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative w-full max-w-md max-h-full">
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    
                    <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                    <h3 className="text-2xl font-semibold">
                        Review and Sign Transaction
                    </h3>
                    <button onClick={modalCloseHandle}>
                        <span className="bg-transparent text-black opacity-1 h-6 w-6 text-2xl block outline-none focus:outline-none">
                        ×
                        </span>
                    </button>
                    </div>
                    
                    <div class="p-6">
                      <div class="pb-5" style={{fontSize:"15px"}}>Sign detail</div>
                      <div class="p-3 text-base text-gray-900 rounded-lg bg-gray-50 text-left" style={{fontSize:"13px"}}>

                        {JSON.stringify(requesetInfo.params.request.params.invocations[0].scriptHash)}<br/>
                        {JSON.stringify(requesetInfo.params.request.params.invocations[0].operation)}<br/>
                        {JSON.stringify(requesetInfo.params.request.params.invocations[0].args[0].value)}<br/>
                        {JSON.stringify(requesetInfo.params.request.params.invocations[0].args[1].value)}<br/>
                        {JSON.stringify(requesetInfo.params.request.params.invocations[0].args[2].value)}<br/>

                      </div>
                    </div>

                    <div className="pt-5 pb-5">
                      <div className="max-w-md mx-auto w-80">
                        <div className="relative">
                          <div className="absolute left-0 top-1/2 -mt-px w-full h-0.5 bg-slate-200 dark:bg-slate-700" aria-hidden="true"></div>
                          <ul className="relative flex justify-between w-full">
                            <li>
                              <div className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold bg-indigo-500 text-white">
                                1
                              </div>
                            </li>
                            {signNumber > 0 ?
                            <li>
                              <div className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold bg-indigo-500 text-white">
                                2
                              </div>
                            </li>
                            :
                            <li>
                              <div className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold bg-slate-500 text-white">
                                2
                              </div>
                            </li>
                            }
                            {signNumber > 1 ?
                            <li>
                              <div className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold bg-indigo-500 text-white">
                                3
                              </div>
                            </li>
                            :
                            <li>
                              <div className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold bg-slate-500 text-white">
                                3
                              </div>
                            </li>
                            }
                          </ul>
                        </div>
                      </div>
                    </div>

                    
                        {signNumber === 0 ?
                        <button 
                          class="m-5 w-50 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                          onClick={() => approve()}>1. Sign First Signer
                        </button>
                        :signNumber === 1 ?
                          <div 
                            class="m-5 w-50 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                            >2. Sign Second Signer
                          </div>
                        :
                          <button 
                            class="m-5 w-50 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                            onClick={modalCloseHandle}>3. Transaction finish
                          </button>
                        }
                </div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
            </>
        ) : null}


    </>
  );
}

export default Topnav;

