import {useState, useEffect, useCallback} from "react";
import { useDispatch , useSelector } from 'react-redux';

import AccountCard from './components/AccountCard.jsx'
import BasicDetail from "./rightcomponent/BasicDetail.jsx";
import AddConnection from "./rightcomponent/AddConnection.jsx"

import { connectProposalBoxOpen, walletManageModalClose} from 'redux/reducers/WalletActions';
import useWalletConnectEventsManager from 'hooks/useWalletConnectEventsManager'

import { initWalletConnect, signClient } from 'utils/WalletConnectUtil'


function WalletManager() {

  const dispatch = useDispatch();

  const [initstate, setInitstate] = useState(false)

  const userAccount = useSelector(state => state.account) // 지갑주소
  const proposalBox = useSelector(state => state.proposalBox) // 체인 연결 모달 상태
  const walletManageModal = useSelector(state => state.walletManage) // 지갑 관리 모달 상태
  const requesetInfo = useSelector(state => state.requesetInfo) // 지갑 관리 모달 상태
  
  const [sessionList, setSessionList] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(0)

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

    // fetchData()

  }, [])

  // sessionList
  
  async function initWC (){
    const init = await initWalletConnect()
    init ? setInitstate(true) : setInitstate(false)
  }

  // useWalletConnectEventsManager(initstate)

  async function updateSessionList () {
    const aa = await signClient.session.getAll()
    setSessionList(aa)    
  }

  const updateParentState = (newValue) => {
    setSelectedIndex(newValue);
  };


  return (

    <div class="max-w-screen-xl items-center justify-between mx-auto p-4">     

      <div className="sm:flex sm:justify-between sm:items-center mt-10">
        <div className="mb-4 sm:mb-0">
          <h1 className="py-2.5 text-1xl md:text-2xl text-slate-800 dark:text-slate-100 font-bold">Connections</h1>
        </div>
        <button onClick={()=>setSelectedIndex(100)} class="px-5 py-2.5 w-40 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
          + Add Connection
        </button>
      </div>

      

      <div style={{height:"30px"}}/>
      <Index />

        <main className="">
          <div className="">
            <div className="">  
              {/* <div className="sm:flex sm:justify-between sm:items-center mb-5"> */}
                              
              {/* </div> */}
              
              

              
              {/* {sessionList.length === 0 ?
                <div class="border border-100 flex items-center justify-center items-start p-4 rounded-xl transition duration-300 ease-in-out">
                  <span style={{fontSize:"16px", marginLeft:"10px"}}>No Connections</span>
                </div> 
                : 
                <></>
              } */}
{/* 
              {sessionList.map((session, idx) => (
                   <AccountCard updateParentState={updateParentState} sessionList={session} selected={selectedIndex===idx} idx={idx}/>
              ))} */}

            </div>

            {/* {sessionList.length === 0 ?
              <AddConnection proposalState={proposalBox} onClick={updateSessionList}/>
              : selectedIndex < 100 ?
              <BasicDetail sessionlist={sessionList} selectedNum={selectedIndex} onClick={updateSessionList}/> 
              : 
              <AddConnection proposalState={proposalBox} onClick={updateSessionList}/>
            } */}


          </div>
        </main>
        

        
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
