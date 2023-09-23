import {useState, useEffect, useCallback} from "react";
import { useDispatch , useSelector } from 'react-redux';
import AccountCard from './components/AccountCard.jsx'
import BasicDetail from "./rightcomponent/BasicDetail.jsx";

import AddConnection from "./rightcomponent/AddConnection.jsx"

import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import { Client, Presets, UserOperationBuilder, UserOperationMiddlewareCtx } from "userop";
import RPC from "./executors/web3RPC.ts";
import {
  Wallet,
  ethers
} from "ethers";
import config from "../../configure/config.json"

import { connectProposalBoxOpen, walletManageModalClose} from 'redux/reducers/WalletActions';
import useWalletConnectEventsManager from 'hooks/useWalletConnectEventsManager'

import { initWalletConnect, signClient } from 'utils/WalletConnectUtil'
import { formatJsonRpcError, formatJsonRpcResult } from '@json-rpc-tools/utils'




function WalletManager() {
  const dispatch = useDispatch();

  const [initstate, setInitstate] = useState(false)
  const userAccount = useSelector(state => state.account) // 지갑주소
  const proposalBox = useSelector(state => state.proposalBox) // 체인 연결 모달 상태
  const walletManageModal = useSelector(state => state.walletManage) // 지갑 관리 모달 상태
  const requesetInfo = useSelector(state => state.requesetInfo) // 지갑 관리 모달 상태
  
  const [sessionList, setSessionList] = useState([])
  const [provider, setProvider] = useState(null);
  const [isloading, setIsloading] = useState(false);
  const [web3auth, setWeb3auth] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    const init = async () => {
      try {
        setIsloading(true)

        const web3auth = new Web3Auth({
            clientId: "BODWZ6bS1HF4cxbj98vCyrqGNZbx2xh9tO4PC9kq7pV7p6mEkLWmA5VzCYYtt5okZ_5_xUzgbE26r1rhD9j_xLs",
            chainConfig: {
              chainNamespace: CHAIN_NAMESPACES.EIP155,
              chainId: "0x5",
              rpcTarget: "https://rpc.ankr.com/eth_goerli"
              // rpcTarget: "https://rpc.ankr.com/eth", // This is the public RPC we have added, please pass on your own endpoint while creating an app
            },
            uiConfig: {
              appName: "Linkrypto",
              appLogo: "https://goclubhouse.s3.ap-northeast-2.amazonaws.com/logo.jpeg", // Your App Logo Here
              theme: "light",
              loginMethodsOrder: ["google", "apple", "kakao"],
              defaultLanguage: "en", // en, de, ja, ko, zh, es, fr, pt, nl
              loginGridCol: 3,
              primaryButton: "externalLogin", // "externalLogin" | "socialLogin" | "emailLogin"
            },
            web3AuthNetwork: "cyan",
          });

        setWeb3auth(web3auth);
        // console.log("web3auth",web3auth)

        await web3auth.initModal();

        if (web3auth.provider) {
          setProvider(web3auth.provider);

          if (!provider) {
            // loadAccountInfosProvider(web3auth.provider)
          } else {
            if(userAccount !== ""){
              loadAccountInfos()
            }
          }
  
        };

      } catch (error) {
        console.error(error);
      }
    };

    init();

}, [userAccount, selectedIndex]);

const loadAccountInfos = async () => {

  if(userAccount === ""){
    console.log("no set")

  } else {

      if (!provider) {

      } else {
        console.log("here", userAccount)
          // setSelectedIndex(0)
          const PrivateKey = await getPrivateKey()
          // // console.log("PrivateKey",PrivateKey)

          // const PrivateKey = "5d910da3fb34008623c674034a57075a39d788aa576ae7a77ddc38302a9c9ba2"
  
          const simpleAccount = await Presets.Builder.SimpleAccount.init(
              new Wallet(PrivateKey),
              config.rpcUrl,
              config.entryPoint,
              config.simpleAccountFactory,
              config.paymaster
          );

          const address = simpleAccount.getSender();

          console.log("address",address)
  
          // window.web3 = new Web3(window.ethereum)
          // const weiBalance = await window.web3.eth.getBalance(address)
          // const ethBalance = window.web3.utils.fromWei(weiBalance)
  
          // setCaAddress(address)
          // setEthBalance(ethBalance)

      }

  }

}

  useEffect(() => {

    async function fetchData() {
      try {
        const response = await initWC()
        const jsonData = await updateSessionList()
        const sessionList = await updateSessionList()

        connectProposalBoxOpen()
        if(localStorage.getItem('context')){
          connectProposalBoxOpen()
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData()

  }, [])

  // sessionList
  
  async function initWC (){
    const init = await initWalletConnect()
    init ? setInitstate(true) : setInitstate(false)
  }

  useWalletConnectEventsManager(initstate)

  async function updateSessionList () {
    const aa = await signClient.session.getAll()
    setSessionList(aa)    
  }

  const updateParentState = (newValue) => {
    console.log("newValue",newValue)
    setSelectedIndex(newValue);
  };
  const getPrivateKey = async () => {
    if (!provider) {
        console.log("provider not initialized yet");
        return;
    }  
    const rpc = new RPC(provider);
    const privateKey = await rpc.getPrivateKey();
    console.log("privateKey", privateKey)
    return privateKey
  };

  const sendUO = async () => {

    const PrivateKey = await getPrivateKey()

    const simpleAccount = await Presets.Builder.SimpleAccount.init(
      new Wallet(PrivateKey),
      config.rpcUrl,
      config.entryPoint,
      config.simpleAccountFactory,
      config.paymaster
    );

    const { params, id, topic } = requesetInfo
    const { chainId, request } = params

    // console.log("params", params)
    // console.log("id", id)
    // console.log("chainId", chainId)
    // console.log("request", request)

    const target = request.params[0].to
    const value = request.params[0].value
    const data = request.params[0].data

    const client = await Client.init(config.rpcUrl);
    
    const res = await client.buildUserOperation(
      simpleAccount.execute(target, value, data)
    );

    const userOpsHash = new UserOperationMiddlewareCtx(
      res,
      config.entryPoint,
      5
    ).getUserOpHash()

    console.log(`UserOpHash: ${userOpsHash}`);

    const response = formatJsonRpcResult(id, userOpsHash);
    console.log("response",response)

    const wow = await signClient.respond({
      topic,
      response
    }).then((res)=>{
      console.log("signClient.respond.res", res)
    })

  }  

  return (
    
    <div class="max-w-screen-xl flex flex-wrap mx-auto">   
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden dark:bg-slate-900">
        <main className="grow">
          <div className="lg:relative lg:flex">

            {/* Left Side */}
            <div className="px-4 py-6 w-full mx-auto" style={{paddingRight:"50px"}}>  
            

              {/* Title Section */}
              <div className="sm:flex sm:justify-between sm:items-center mb-5">
                <div className="mb-4 sm:mb-0">
                  <h1 className="text-1xl md:text-2xl text-slate-800 dark:text-slate-100 font-bold">Manage Connection</h1>
                </div>
                <button onClick={()=>setSelectedIndex(100)} class="mt-5 w-40 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                  + Add Connection
                </button>                
              </div>
              
              {/* {sessionList.length === 0 ?
                <div class="border border-100 flex items-center justify-center items-start p-4 rounded-xl transition duration-300 ease-in-out">
                  <span style={{fontSize:"16px", marginLeft:"10px"}}>No Connections</span>
                </div> 
                : 
                <></>
              }

              {sessionList.map((session, idx) => (
                   <AccountCard updateParentState={updateParentState} sessionList={session} selected={selectedIndex===idx} idx={idx}/>
              ))} */}

            </div>

            
            {sessionList.length === 0 ?
              <AddConnection proposalState={proposalBox} onClick={updateSessionList}/>
              : selectedIndex < 100 ?
              <BasicDetail sessionlist={sessionList} selectedNum={selectedIndex} onClick={updateSessionList}/> 
              : 
              <AddConnection proposalState={proposalBox} onClick={updateSessionList}/>
            }
            {/* {proposalBox ? <div>open</div>: <>close</>} */}

          </div>
        </main>
      </div>
      {walletManageModal ? (
            <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative w-full max-w-md max-h-full">
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    
                    <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                    <h3 className="text-2xl font-semibold">
                        Transaction Review
                        {console.log("abc",requesetInfo)}
                    </h3>
                    <button onClick={() => dispatch(walletManageModalClose())}>
                        <span className="bg-transparent text-black opacity-1 h-6 w-6 text-2xl block outline-none focus:outline-none">
                        ×
                        </span>
                    </button>
                    </div>
                    
                    <div class="p-6">
                    
                    <p class="text-sm font-normal text-gray-500 dark:text-gray-400">Connection State</p>
                        <ul class="my-4 space-y-3">
                            <li>
                                <a href="#" class="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                                    <svg aria-hidden="true" class="h-5" viewBox="0 0 40 38" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M39.0728 0L21.9092 12.6999L25.1009 5.21543L39.0728 0Z" fill="#E17726"/><path d="M0.966797 0.0151367L14.9013 5.21656L17.932 12.7992L0.966797 0.0151367Z" fill="#E27625"/><path d="M32.1656 27.0093L39.7516 27.1537L37.1004 36.1603L27.8438 33.6116L32.1656 27.0093Z" fill="#E27625"/><path d="M7.83409 27.0093L12.1399 33.6116L2.89876 36.1604L0.263672 27.1537L7.83409 27.0093Z" fill="#E27625"/><path d="M17.5203 10.8677L17.8304 20.8807L8.55371 20.4587L11.1924 16.4778L11.2258 16.4394L17.5203 10.8677Z" fill="#E27625"/><path d="M22.3831 10.7559L28.7737 16.4397L28.8067 16.4778L31.4455 20.4586L22.1709 20.8806L22.3831 10.7559Z" fill="#E27625"/><path d="M12.4115 27.0381L17.4768 30.9848L11.5928 33.8257L12.4115 27.0381Z" fill="#E27625"/><path d="M27.5893 27.0376L28.391 33.8258L22.5234 30.9847L27.5893 27.0376Z" fill="#E27625"/><path d="M22.6523 30.6128L28.6066 33.4959L23.0679 36.1282L23.1255 34.3884L22.6523 30.6128Z" fill="#D5BFB2"/><path d="M17.3458 30.6143L16.8913 34.3601L16.9286 36.1263L11.377 33.4961L17.3458 30.6143Z" fill="#D5BFB2"/><path d="M15.6263 22.1875L17.1822 25.4575L11.8848 23.9057L15.6263 22.1875Z" fill="#233447"/><path d="M24.3739 22.1875L28.133 23.9053L22.8184 25.4567L24.3739 22.1875Z" fill="#233447"/><path d="M12.8169 27.0049L11.9606 34.0423L7.37109 27.1587L12.8169 27.0049Z" fill="#CC6228"/><path d="M27.1836 27.0049L32.6296 27.1587L28.0228 34.0425L27.1836 27.0049Z" fill="#CC6228"/><path d="M31.5799 20.0605L27.6165 24.0998L24.5608 22.7034L23.0978 25.779L22.1387 20.4901L31.5799 20.0605Z" fill="#CC6228"/><path d="M8.41797 20.0605L17.8608 20.4902L16.9017 25.779L15.4384 22.7038L12.3988 24.0999L8.41797 20.0605Z" fill="#CC6228"/><path d="M8.15039 19.2314L12.6345 23.7816L12.7899 28.2736L8.15039 19.2314Z" fill="#E27525"/><path d="M31.8538 19.2236L27.2061 28.2819L27.381 23.7819L31.8538 19.2236Z" fill="#E27525"/><path d="M17.6412 19.5088L17.8217 20.6447L18.2676 23.4745L17.9809 32.166L16.6254 25.1841L16.625 25.1119L17.6412 19.5088Z" fill="#E27525"/><path d="M22.3562 19.4932L23.3751 25.1119L23.3747 25.1841L22.0158 32.1835L21.962 30.4328L21.75 23.4231L22.3562 19.4932Z" fill="#E27525"/><path d="M27.7797 23.6011L27.628 27.5039L22.8977 31.1894L21.9414 30.5138L23.0133 24.9926L27.7797 23.6011Z" fill="#F5841F"/><path d="M12.2373 23.6011L16.9873 24.9926L18.0591 30.5137L17.1029 31.1893L12.3723 27.5035L12.2373 23.6011Z" fill="#F5841F"/><path d="M10.4717 32.6338L16.5236 35.5013L16.4979 34.2768L17.0043 33.8323H22.994L23.5187 34.2753L23.48 35.4989L29.4935 32.641L26.5673 35.0591L23.0289 37.4894H16.9558L13.4197 35.0492L10.4717 32.6338Z" fill="#C0AC9D"/><path d="M22.2191 30.231L23.0748 30.8354L23.5763 34.8361L22.8506 34.2234H17.1513L16.4395 34.8485L16.9244 30.8357L17.7804 30.231H22.2191Z" fill="#161616"/><path d="M37.9395 0.351562L39.9998 6.53242L38.7131 12.7819L39.6293 13.4887L38.3895 14.4346L39.3213 15.1542L38.0875 16.2779L38.8449 16.8264L36.8347 19.1742L28.5894 16.7735L28.5179 16.7352L22.5762 11.723L37.9395 0.351562Z" fill="#763E1A"/><path d="M2.06031 0.351562L17.4237 11.723L11.4819 16.7352L11.4105 16.7735L3.16512 19.1742L1.15488 16.8264L1.91176 16.2783L0.678517 15.1542L1.60852 14.4354L0.350209 13.4868L1.30098 12.7795L0 6.53265L2.06031 0.351562Z" fill="#763E1A"/><path d="M28.1861 16.2485L36.9226 18.7921L39.7609 27.5398L32.2728 27.5398L27.1133 27.6049L30.8655 20.2912L28.1861 16.2485Z" fill="#F5841F"/><path d="M11.8139 16.2485L9.13399 20.2912L12.8867 27.6049L7.72971 27.5398H0.254883L3.07728 18.7922L11.8139 16.2485Z" fill="#F5841F"/><path d="M25.5283 5.17383L23.0847 11.7736L22.5661 20.6894L22.3677 23.4839L22.352 30.6225H17.6471L17.6318 23.4973L17.4327 20.6869L16.9139 11.7736L14.4707 5.17383H25.5283Z" fill="#F5841F"/></svg>
                                    {/* <span class="flex-1 ml-3 whitespace-nowrap" onClick={conMetamask}>
                                        MetaMask
                                    </span> */}
                                    {/* {walletProvider === "metamask" ?
                                    <span class="inline-flex items-center justify-center px-2 py-0.5 ml-3 text-xs font-medium text-gray-500 bg-green-100 rounded dark:bg-gray-700 dark:text-gray-400">
                                        연결됨
                                    </span> :
                                    <></>
                                    } */}
                                </a>
                            </li>

                        </ul>
                    <p class="text-sm font-normal text-gray-500 dark:text-gray-400">disconnect</p>
                    <div onClick={sendUO} class="border border-black-600 cursor-pointer flex items-center justify-center items-start p-4 rounded-xl shadow-lg bg-white transition duration-300 ease-in-out">
                {/* <img src={plusIcon} alt="Add Wallet" className="h-5 w-5 text-blue-800" /> */}
                <span style={{fontSize:"16px", marginLeft:"10px"}}> client.sendUserOperation</span>
              </div>
                    
                    <div class="mt-3"></div>
                        {/* <button class="w-full items-center p-3 text-white font-bold text-gray-900 rounded-lg bg-primary-100 hover:bg-primary-700 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                            <div style={{textAlign:"center"}} onClick={walletDisconnect}>disconnect</div>
                        </button>                     */}
                    </div>
                </div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
            </>
        ) : null}
    </div>
    
  );
}

const Index = () => {

  return (
      <div className="w-full">
          <div className="lg:flex flex-wrap items-center justify-start">            
              <div className="m-2 lg:w-[25rem] hover:bg-blue-50 hover:border-primary-700 cursor-pointer border p-5 rounded-xl shadow-lg bg-white transition duration-300 ease-in-out" style={{height:"250px"}}>    
                  <div className="flex items-center border-b border-gray-200 pb-6">
                      <img src="https://flamingo.finance/img/tokens/circle/FLM.svg" alt className="w-12 h-12 rounded-full" />
                      <div className="flex items-start justify-between w-full">
                          <div className="pl-3 w-full">
                              <p className="text-xl font-medium leading-5 text-gray-800">Flamingo Finance</p>
                              <p className="text-sm leading-normal pt-2 text-gray-500">flamingo.finance</p>
                          </div>
                          Connected
                      </div>
                  </div>
                  <div className="px-2">
                      <p className="text-xm leading-5 py-4 text-gray-600">The Flamingo DeFi platform helps you convert tokens, provide liquidity, and earn yield through staking.</p>
                      <div className="flex">
                          <div className="py-2 px-4 text-xs leading-3 text-indigo-700 rounded-full bg-indigo-100">#DEX</div>
                          <div className="py-2 px-4 ml-3 text-xs leading-3 text-indigo-700 rounded-full bg-indigo-100">#CDP</div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );
};

export default WalletManager;
