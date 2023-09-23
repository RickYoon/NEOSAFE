import { useState, useEffect } from "react";
import { useDispatch , useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import {connectAddress} from 'redux/reducers/WalletActions'

// Cards
import BasicDetail from "./component/Cards/BasicDetail.jsx"; // basic wallet
import SecurityDetail from "./component/Cards/securityDetail"; // smart wallet
import SmartDetail from "./component/Cards/SmartDetail"; // smart wallet

import LoadingCard from "./component/Cards/loadingCard"
import BasicDetailLogin from "./component/Cards/BasicDetailLogin.jsx"; // basic wallet

// Modal
import LoadingCreate from "./component/Modals/LoadingCreate.js";
import SelectSignerModal from "./component/Modals/SelectSigners.js";

// support functions
import { initNeoLine } from './utils/neolineConnector.js';
import { trimAddress } from './utils/shortAddress.js';
import { createMultiSig } from "./utils/createMultiSig.js";

function WalletManager() {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoadingModalOpen, setLoadingIsModalOpen] = useState(false)
  const [isNeolineSelected, setIsNeolineSelected] = useState(false)
  const [isBasicSelected, setIsBasicSelected] = useState(true)
  const [isSmartSelected, setIsSmartSelected] = useState(false)
  const [isLoading, setIsloading] = useState(false)
  const [isSecondAddressLoading, setIsSecondAddressLoading] = useState(false)
  const [createSW, setCreateSW] = useState(false)

  const [neolineAddress, setNeolineAddress] = useState("")
  const [secondAddress, setSecondAddress] = useState("")
  const [smartWallet, setSmartWallet] = useState({
    isExist : false,
    address : "",
    firstSigner : "",
    secondSigner : ""
  })

  const userAccount = useSelector(state => state.account) // main wallet address
  const publicKey = useSelector(state => state.publicKey) // main wallet public key
  const chainProvider = useSelector(state => state.chainProvider) // main wallet public key
  const baseAddress = useSelector(state => state.baseAddress) // main wallet public key

  const [basicWallet, setBasicWallet] = useState({
    authrization : "",
    address : "",
    securityLevel : 1,
    securityFactorOne : "Google Auth"
  })

  useEffect(() => {

    loadWallets()

    if(userAccount === "") {
      // console.log("userAccount",userAccount)
      navigate("/")
    }

  }, []);

  useEffect(() => {

    loadWallets()

  }, [createSW]);

  

  useEffect(() => {

    if(userAccount === "") {
      navigate("/")
    }

  }, [userAccount]);

  

  const loadWallets = async () => {

    try {

      setIsloading(true)

      if(baseAddress !== ""){

        var config = {
          method: 'get',
          url: `https://blqkysq4r3.execute-api.ap-northeast-2.amazonaws.com/production/walletlist?address=${baseAddress}&chain=${chainProvider}`,
          headers: { }
        };
        
        const walletInfo = await axios(config)
        .then(function (response) {
          // console.log(JSON.stringify(response.data));
          return response.data
        })
        .catch(function (error) {
          console.log(error);
        });

        setBasicWallet({
          authrization : "google",
          address : userAccount,
          securityLevel : 1,
          securityFactorOne : "Google Auth"      
        })


        if(walletInfo.Count === 0){



        } else {
    
        const isSmartWallet = walletInfo.Items[0].smartWallets.length === 0 ? false : true;
        
        setSmartWallet({
          isExist : isSmartWallet,
          address : walletInfo.Items[0].smartWallets[0]._address,
          firstSigner : baseAddress,
          secondSigner : ""
        })      

        if(userAccount !== baseAddress){
          setIsBasicSelected(false)
          setIsSmartSelected(true)    
        }

        }

 

      }

      setIsloading(false)

        
    } catch (error) {
      console.log('error', error)
    }

  }

  const handleModal = () => {
    console.log("clicked!")
    setIsModalOpen(!isModalOpen)
  }

  const handleLoadingModal = async () => {

    setIsSecondAddressLoading(true)    
    const multiSigAccout = await createMultiSig([publicKey, secondAddress], userAccount, chainProvider)
    setIsSecondAddressLoading(false)
    setIsModalOpen(!isModalOpen)
    setCreateSW(true)
    // console.log("multiSigAccout",multiSigAccout)

  }

  const handleFinalClose = () => {
    setLoadingIsModalOpen(false)
  }

  const handleCredential = async () => {

    try {

      setIsSecondAddressLoading(true)
      const { publicKey } = await initNeoLine();
      console.log("publicKey neoline : ", publicKey)
      setNeolineAddress(publicKey.publicKey);
      setSecondAddress(publicKey.publicKey);
      setIsNeolineSelected(true);
      setIsSecondAddressLoading(false)

    } catch (error) {
      console.error(error);
    }

  };  

  const handleInputChange = (event) => {
    setSecondAddress(event.target.value);
  }

  const handleAccountSelect = () => {

    if (isBasicSelected === false) {
      setIsBasicSelected(!isBasicSelected)
      setIsSmartSelected(!isSmartSelected)
    }

    dispatch(connectAddress(baseAddress))
    localStorage.setItem("lastSelectAccount", JSON.stringify({baseAddress : baseAddress, selectedAddress : baseAddress}))
  }

  const handleSmartSelect = () => {

    if (isSmartSelected === false ) {
      setIsBasicSelected(!isBasicSelected)
      setIsSmartSelected(!isSmartSelected)
    }

    dispatch(connectAddress(smartWallet.address))
    localStorage.setItem("lastSelectAccount", JSON.stringify({baseAddress : baseAddress, selectedAddress : smartWallet.address}))

  }

  return (
    
    <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">     

    <div className="sm:flex sm:justify-between sm:items-center mt-10">
      <div className="mb-4 sm:mb-0">
        <h1 className="text-1xl md:text-2xl text-slate-800 dark:text-slate-100 font-bold">Account Management</h1>
      </div>
    </div>

    <div className="flex items-center">
      <div className="w-1/2 mr-10">
        {baseAddress === "" ? 
        <BasicDetailLogin />
        :
        <BasicDetail isBasicSelected={isBasicSelected} baseAddress={baseAddress} handleAccountSelect={handleAccountSelect}/> 
         }
      </div>
        {isLoading ?
          <> 
            <div className="w-1/2">
              <LoadingCard userAccount={userAccount}/> 
            </div> 
          </> 
          :
          smartWallet.isExist ?
          <>
          <div className="w-1/2">
            <SmartDetail isSmartSelected={isSmartSelected} smartWallet={smartWallet} handleSmartSelect={handleSmartSelect}/> 
            </div>
          </> 
          :
          <>
            <div className="w-1/2" onClick={handleModal}>
            <SecurityDetail userAccount={userAccount}/> 
            </div>
          </>
        }
      </div>

    <SelectSignerModal
      isModalOpen={isModalOpen}
      handleModal={() => setIsModalOpen(false)}
      handleInputChange= {handleInputChange}
      handleLoadingModal={handleLoadingModal}
      isNeolineSelected={isNeolineSelected}
      secondAddress={secondAddress}
      trimAddress={trimAddress}
      publicKey={publicKey}
      handleCredential={handleCredential}
      isSecondAddressLoading={isSecondAddressLoading}
    />

    {isLoadingModalOpen ? (
      <>
      <LoadingCreate />
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
      </>
    ) : null}

    </div>
  );
}


export default WalletManager;

