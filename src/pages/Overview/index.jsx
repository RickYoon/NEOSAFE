import { rpc } from "@cityofzion/neon-js"
import React, {useState, useEffect, useCallback} from "react";
import WalletStatus from './components/WalletStatus';
import WalletInout from './components/WalletInout';
import axios from 'axios'

// import Unclaimed from './components/Unclaimed';
// import Trade from './components/swap'

// Unclaimed
// import { sendNeoToken } from './util/createMultiSigTransferMy';
// import { invokeContract } from './util/createManualInvoke';
import { useDispatch , useSelector } from 'react-redux';
// import { TurnkeySigner } from "@turnkey/ethers"
// import { ethers } from "ethers";
// import { TurnkeyClient } from "@turnkey/http";
// import { ApiKeyStamper } from "@turnkey/api-key-stamper";
// import { startRegistration, startAuthentication } from "@simplewebauthn/browser";

// import SelectSignerModal from "./components/Modals/SelectSigners";
// import ReviewTransactionModal from "./components/Modals/ReviewTransaction" 
// import UnClaimedGas from "../../utils/getUnclaimedGas.js"

// const { rpc } = require('@cityofzion/neon-js');


function Overview() {

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsloading] = useState(false)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [selmode, setSelmode] = useState("balance")

  const [price, setPrice] = useState({ NEO: 0, GAS: 0 });
  // const [unclaimedGas, setUnclaimedGas] = useState("0");
  const [sendStatus, setSendStatus] = useState({
    "symbol": "",
    "maxAmount": 0
  })
  const [history, setHistory] = useState([
    {
      from: '',
      to: '',
      amount: '',
      symbol: '',
      name: '',
      contract: '',
      block_time_kst: '',
      type: 'receive',
      hash: ''
    }
  ])



  const [walletBalance, setWalletBalance] = useState({
    address: 'NiTMkcH22qcLaFN4ZGaRmyPojYv2Dokz3x',
    balance: [
      {
        assethash: '0xd2a4cff31913016155e38e474a2c06d08be276cf',
        name: 'GasToken',
        symbol: 'GAS',
        decimals: '8',
        amount: '',
        lastupdatedblock: 2655559
      },
      {
        assethash: '0xef4073a0f2b305a38ec4050e4d3d28bc40ea63f5',
        name: 'NeoToken',
        symbol: 'NEO',
        decimals: '0',
        amount: '',
        lastupdatedblock: 2655559
      }
    ]
  })

  const userAccount = useSelector(state => state.account) // main wallet address
  const publicKey = useSelector(state => state.publicKey) // main wallet public key
  const chainProvider = useSelector(state => state.chainProvider) // main wallet public key
  const baseAddress = useSelector(state => state.baseAddress) // main wallet public key


  useEffect(() => {

    async function getBalance() {

    setIsloading(true)

    let rpcURL = ""

    if(chainProvider === "NEO-N3-TEST"){
      rpcURL="http://seed3t4.neo.org:20332"
    } else if (chainProvider === "NEO-N3-MAIN") {
      rpcURL="http://seed3.neo.org:10332"
    }

    // http://seed3.neo.org:10332


    console.log("rpcURL",rpcURL)
    const client = new rpc.RPCClient(rpcURL);
    
    try {  
        const blockCount = await client.getNep17Balances(userAccount);
        // console.log("blockCount",blockCount)
        setWalletBalance(blockCount)

        // const ucGas = await getUnclaimedGas(userAccount,rpcURL);
        // console.log("ucGas",ucGas)
        // setUnclaimedGas(ucGas)
        setIsloading(false)

        await updateHistory()
    
    
    } catch (error) {
  
      console.error("Error:", error);
    
    }
  }

  async function updateHistory () {

    const tokenHistory = await axios.get(
      `https://blqkysq4r3.execute-api.ap-northeast-2.amazonaws.com/production/wallethistory?address=${userAccount}`
    );

    setHistory(tokenHistory.data)
    
  }

  async function getUnclaimedGas(address,rpcURL){
    // const unClaimedGas = await UnClaimedGas(address,rpcURL)
    // return unClaimedGas.total
    // console.log("unClaimedGas",unClaimedGas)
  }


  async function fetchPrices() {
    try {
      // API 호출
      // const response = await fetch(
      //   "https://min-api.cryptocompare.com/data/pricemulti?fsyms=NEO,GAS&tsyms=USD"
      // );

      // JSON 데이터 추출
      // const data = await response.json();

      // console.log("data.NEO.USD",data.NEO.USD)

      // 데이터에서 NEO 및 GAS 가격을 추출하여 상태 변수에 설정
      setPrice({
        NEO: 8.17,
        GAS: 3.12
      });


    } catch (error) {
      console.error("API 호출 중 오류 발생:", error);
    }
  }

  // 컴포넌트가 마운트될 때 API 호출
  fetchPrices();
  getBalance()

  console.log("userAccount",userAccount)

  }, []);

  // Create Burner Wallet by registering on WebAuthn

  async function createWebauthn() {
    fetch("/generate-registration-options")
      .then(async (res) => {
        const resp = await fetch('/generate-authentication-options');

        let attResp;
        try {
          console.log("resp",resp)
          // const opts = await resp.json();
          // attResp = await startRegistration(opts);
        } catch (error) {
          throw error;
        }

        // const verificationResp = await fetch('/verify-registration', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify(attResp),
        // });

        // const verificationJSON = await verificationResp.json();
        // console.log(verificationJSON);

    
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      }); 
  }


  // async function createWebauthn() {


    // const network = "goerli";
    // const provider = new ethers.providers.InfuraProvider(network);

    // const turnkeyClient = new TurnkeyClient(
    //   {
    //     baseUrl: "https://api.turnkey.com",
    //   },
    //   // This uses API key credentials.
    //   // If you're using passkeys, use `@turnkey/webauthn-stamper` to collect webauthn signatures:
    //   // new WebauthnStamper({...options...})
    //   new ApiKeyStamper({
    //     apiPublicKey: process.env.API_PUBLIC_KEY,
    //     apiPrivateKey: process.env.API_PRIVATE_KEY,
    //   })
    // );

    //     // Initialize a Turnkey Signer
    // const turnkeySigner = new TurnkeySigner({
    //   client: turnkeyClient,
    //   organizationId: process.env.ORGANIZATION_ID,
    //   privateKeyId: process.env.PRIVATE_KEY_ID,
    // });

    // // Connect it with a Provider (https://docs.ethers.org/v5/api/providers/)
    // const connectedSigner = turnkeySigner.connect(provider);
    // console.log("connectedSigner",connectedSigner)


    // const turnkeySigner = new TurnkeySigner({
    //   apiPublicKey: process.env.API_PUBLIC_KEY,
    //   apiPrivateKey: process.env.API_PRIVATE_KEY,
    //   baseUrl: process.env.BASE_URL,
    //   organizationId: process.env.ORGANIZATION_ID,
    //   privateKeyId: process.env.PRIVATE_KEY_ID,
    // })

    // let credential = await navigator.credentials.create({
    //   publicKey: {
    //     challenge: new Uint8Array([117, 61, 252, 231, 191, 241]),
    //     rp: { id: "localhost", name: "ACME Corporation" },
    //     user: {
    //       id: new Uint8Array([79, 252, 83, 72, 214, 7, 89, 26]),
    //       name: "jamiedoe",
    //       displayName: "Jamie Doe"
    //     },
    //     pubKeyCredParams: [ {type: "public-key", alg: -7} ]
    //   }
    // });

    //   console.log("credential",credential)

      // console.log("turnkeySigner",turnkeySigner)
      // Return authenticator data ArrayBuffer
      // const authenticatorData = credential.response.getAuthenticatorData();
      // console.log("authenticatorData",authenticatorData)

      // // Return public key ArrayBuffer
      // const pk = credential.response.getPublicKey();
      // console.log("pk",pk)

      // // Return public key algorithm identifier
      // const pkAlgo = credential.response.getPublicKeyAlgorithm();
      // console.log("pkAlgo",pkAlgo)

      // // Return permissible transports array
      // const transports = credential.response.getTransports();
      // console.log("transports",transports)
  // }

    // https://min-api.cryptocompare.com/data/pricemulti?fsyms=NEO,GAS&tsyms=USD

    const handleModal = () => {
      setIsModalOpen(!isModalOpen)
    }

    const handleReviewModal = () => {
      setIsReviewModalOpen(false)
    }

    const makeSendModal = (param) => {
      setSendStatus(param)
      setIsModalOpen(!isModalOpen)
    }

    const openReviewModal = () => {
      setIsModalOpen(false)
      setIsReviewModalOpen(true)
    }


  return (
    
    <div class="max-w-screen-xl items-center justify-between mx-auto p-4">     

      <div className="sm:flex sm:justify-between sm:items-center mt-10">
        <div className="mb-4 sm:mb-0">
          <h1 className="py-2.5 text-1xl md:text-2xl text-slate-800 dark:text-slate-100 font-bold">Portfolio</h1>
        </div>
      </div>

      {selmode === "balance" ? 
      <ul className="pl-2 pt-5 text-sl font-medium flex flex-nowrap -mx-4 sm:-mx-6 lg:-mx-8">
        <li className="pb-3 mr-6 last:mr-0 first:pl-4 sm:first:pl-6 lg:first:pl-8 last:pr-4 sm:last:pr-6 lg:last:pr-8">
          <div onClick={() => setSelmode("balance")} className="cursor-pointer text-indigo-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-slate-300 whitespace-nowrap flex items-center" href="#0">
            <svg className="w-4 h-4 shrink-0 fill-current text-indigo-400 dark:text-slate-500 mr-2" viewBox=" 0 0 16 16">
              <path d="M15 4c.6 0 1 .4 1 1v10c0 .6-.4 1-1 1H3c-1.7 0-3-1.3-3-3V3c0-1.7 1.3-3 3-3h7c.6 0 1 .4 1 1v3h4zM2 3v1h7V2H3c-.6 0-1 .4-1 1zm12 11V6H2v7c0 .6.4 1 1 1h11zm-3-5h2v2h-2V9z" />
            </svg>
            <span>Balance</span>
          </div>
        </li>
        <li className="pb-3 mr-6 last:mr-0 first:pl-4 sm:first:pl-6 lg:first:pl-8 last:pr-4 sm:last:pr-6 lg:last:pr-8">
          <div onClick={() => setSelmode("history")} className="cursor-pointer text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-slate-300 whitespace-nowrap flex items-center" href="#0">
            <svg className="w-4 h-4 shrink-0 fill-current text-slate-400 dark:text-slate-500 mr-2" viewBox=" 0 0 16 16">
              <path d="M5 9h11v2H5V9zM0 9h3v2H0V9zm5 4h6v2H5v-2zm-5 0h3v2H0v-2zm5-8h7v2H5V5zM0 5h3v2H0V5zm5-4h11v2H5V1zM0 1h3v2H0V1z" />
            </svg>
            <span>History</span>
          </div>
        </li>
      </ul>
      :
      <ul className="pl-2 pt-5 text-sl font-medium flex flex-nowrap -mx-4 sm:-mx-6 lg:-mx-8">
        <li className="pb-3 mr-6 last:mr-0 first:pl-4 sm:first:pl-6 lg:first:pl-8 last:pr-4 sm:last:pr-6 lg:last:pr-8">
          <div onClick={() => setSelmode("balance")} className="cursor-pointer text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-slate-300 whitespace-nowrap flex items-center" href="#0">
            <svg className="w-4 h-4 shrink-0 fill-current text-slate-400 dark:text-slate-500 mr-2" viewBox=" 0 0 16 16">
              <path d="M15 4c.6 0 1 .4 1 1v10c0 .6-.4 1-1 1H3c-1.7 0-3-1.3-3-3V3c0-1.7 1.3-3 3-3h7c.6 0 1 .4 1 1v3h4zM2 3v1h7V2H3c-.6 0-1 .4-1 1zm12 11V6H2v7c0 .6.4 1 1 1h11zm-3-5h2v2h-2V9z" />
            </svg>
            <span>Balance</span>
          </div>
        </li>
        <li className="pb-3 mr-6 last:mr-0 first:pl-4 sm:first:pl-6 lg:first:pl-8 last:pr-4 sm:last:pr-6 lg:last:pr-8">
          <div onClick={() => setSelmode("history")} className="cursor-pointer text-indigo-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-slate-300 whitespace-nowrap flex items-center" href="#0">
            <svg className="w-4 h-4 shrink-0 fill-current text-indigo-400 dark:text-slate-500 mr-2" viewBox=" 0 0 16 16">
              <path d="M5 9h11v2H5V9zM0 9h3v2H0V9zm5 4h6v2H5v-2zm-5 0h3v2H0v-2zm5-8h7v2H5V5zM0 5h3v2H0V5zm5-4h11v2H5V1zM0 1h3v2H0V1z" />
            </svg>
            <span>History</span>
          </div>
        </li>
      </ul>
    }

      <div style={{height:"30px"}}/>


      {selmode === "balance" ?
      <>
        <WalletStatus isLoading={isLoading} walletBalance={walletBalance} priceList={price} makeSendModal={makeSendModal} />
        <div style={{height:"30px"}}/>
        {/* <Unclaimed unclaimedGas={unclaimedGas}/> */}
      </>
      :
      <WalletInout isLoading={isLoading} history={history} walletBalance={walletBalance} priceList={price} makeSendModal={makeSendModal} />
      }

      {/* <SelectSignerModal
        isModalOpen={isModalOpen}
        handleModal={handleModal}
        sendStatus={sendStatus}
        openReviewModal={openReviewModal}
      /> */}

      {/* <ReviewTransactionModal
        isReviewModalOpen={isReviewModalOpen}
        handleReviewModal={handleReviewModal}
      /> */}

    </div>
    
  );
}

export default Overview;
