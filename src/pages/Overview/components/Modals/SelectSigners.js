import React, {useState, useEffect} from 'react';
import Styled, { keyframes } from 'styled-components';
import Swal from 'sweetalert2'
import { sendCustomToken } from "utils/sendCustomToken"
import { useDispatch , useSelector } from 'react-redux';
import axios from 'axios';
import configureWeb3Auth from 'component/topNav/web3auth/configureWeb3Auth';
import RPC from "./web3RPC.ts";

const { CONST, tx, rpc, sc, u, wallet } = require("@cityofzion/neon-js")



function SelectSignerModal({ isModalOpen, handleModal, sendStatus}) {

  const [amount, setAmount] = useState(); 
  const [amountVerify, setAmountVerify] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [recipientVerify, setRecipientVerify] = useState(false);

  const [txgasfee, setTxgasfee] = useState()
  const [feeLoading, setFeeLoading] = useState(false)

  const userAccount = useSelector(state => state.account)
  const chainProvider = useSelector(state => state.chainProvider) // main wallet public key
  const baseAddress = useSelector(state => state.baseAddress) // main wallet public key


  useEffect(() => {
    
    checkRecipient()
    // console.log("sendStatus",sendStatus)

  }, [recipient]);

  useEffect(() => {
    
    checkAmount()
    // console.log("sendStatus",sendStatus)

  }, [amount]);


  useEffect(() => {
    
    if(recipientVerify === true && amountVerify === true){
      console.log("both verify")
      updateTxgasfee()
      // update gas fee 함수 만들고, 해당 내용 업데이트 한다.
      // 
    }

  }, [recipientVerify,amountVerify]);


  let assethash = ""

  if(sendStatus.token !== undefined ) {

    assethash = sendStatus.token

  }

  async function updateTxgasfee () {

    setFeeLoading(true)

    const rpcAddress = "https://testnet2.neo.coz.io/";
    const rpcClient = new rpc.RPCClient(rpcAddress)

    const tokenScript = sendStatus.token.assethash
    // console.log("tokenScript",tokenScript)

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

    const accountHash = walletInfo.Items[0].smartWallets[0]._scriptHash

    // const inputs = {
    //   fromAccount: walletAccount,
    //   toAccount: new wallet.Account(
    //   "L1Xwa2DcKV1pEK68ARGdPy5SEcNtnuhtPaT89V8X1chMYZASjSZV"
    //   ),
    //   tokenScriptHash: CONST.NATIVE_CONTRACT_HASH.NeoToken,
    //   amountToTransfer: 1,
    //   systemFee: 0,
    //   networkFee: 0,
    //   networkMagic: CONST.MAGIC_NUMBER.TestNet, //CONST.MAGIC_NUMBER.TestNet,
    //   nodeUrl: "https://testnet2.neo.coz.io/ " //"http://seed2t.neo.org:20332",
    // };  

    const vars = {}

    await createTransaction (rpcClient, tokenScript, userAccount, recipient, amount, vars,accountHash)
    const systemFee = await checkSystemFee(rpcClient, accountHash, vars)
    const networkFee = await checkNetworkFee (rpcClient,vars)

    // console.log("systemFee",Number(systemFee) + Number(networkFee))

    setTxgasfee(Number(systemFee) + Number(networkFee))
    setFeeLoading(false)


  }

  async function createTransaction (rpcClient, tokenScript, userAccount, recipient, amount, vars,accountHash) {
  
    // Since the token is now an NEP-17 token, we transfer using a VM script.
    let transAmount = amount

    if(sendStatus.token.decimals === '8'){
      transAmount = transAmount * Math.pow(10, 8);
    }

    const script = sc.createScript({
      scriptHash: tokenScript,
      operation: "transfer",
      args: [
        sc.ContractParam.hash160(userAccount),
        sc.ContractParam.hash160(recipient),
        sc.ContractParam.integer(transAmount),
        sc.ContractParam.any(),
      ],
    });

    console.log("script",script)
  
    // We retrieve the current block height as we need to
    const currentHeight = await rpcClient.getBlockCount();

    vars.tx = new tx.Transaction({
      signers: [
        {
          account: accountHash,
          scopes: tx.WitnessScope.CalledByEntry,
        },
      ],
      validUntilBlock: currentHeight + 1000,
      script: script,
    });

    console.log("\u001b[32m  ✓ Transaction created \u001b[0m");

    return {
      signers: [
        {
          account: accountHash,
          scopes: tx.WitnessScope.CalledByEntry,
        },
      ],
      validUntilBlock: currentHeight + 1000,
      script: script,
      nonce: vars.tx.nonce
    }
    
  }

  async function checkNetworkFee(rpcClient, vars) {

    const feePerByteInvokeResponse = await rpcClient.invokeFunction(
      CONST.NATIVE_CONTRACT_HASH.PolicyContract,
      "getFeePerByte"
    );
  
    // if (feePerByteInvokeResponse.state !== "HALT") {
    //   if (inputs.networkFee === 0) {
    //     throw new Error("Unable to retrieve data to calculate network fee.");
    //   } else {
    //     console.log(
    //       "\u001b[31m  ✗ Unable to get information to calculate network fee.  Using user provided value.\u001b[0m"
    //     );
    //     vars.tx.networkFee = u.BigInteger.fromNumber(inputs.networkFee);
    //   }
    // }

    const feePerByte = u.BigInteger.fromNumber(
      feePerByteInvokeResponse.stack[0].value
    );
    // Account for witness size
    const transactionByteSize = vars.tx.serialize().length / 2 + 109;
    // Hardcoded. Running a witness is always the same cost for the basic account.
    const witnessProcessingFee = u.BigInteger.fromNumber(1000390);
    const networkFeeEstimate = feePerByte
      .mul(transactionByteSize)
      .add(witnessProcessingFee);

    vars.tx.networkFee = networkFeeEstimate;
    return vars.tx.networkFee.toDecimal(8)

  }


  async function checkSystemFee(rpcClient, accountHash, vars) {

    const invokeFunctionResponse = await rpcClient.invokeScript(
      u.HexString.fromHex(vars.tx.script),
      [
        {
          account: accountHash,
          scopes: tx.WitnessScope.CalledByEntry,
        },
      ]
    );
    if (invokeFunctionResponse.state !== "HALT") {
      throw new Error(
        `Transfer script errored out: ${invokeFunctionResponse.exception}`
      );
    }
    const requiredSystemFee = u.BigInteger.fromNumber(
      invokeFunctionResponse.gasconsumed
    );

      vars.tx.systemFee = requiredSystemFee;

      return vars.tx.systemFee.toDecimal(8)

    //   console.log(
    //   `\u001b[32m  ✓ SystemFee set: ${vars.tx.systemFee.toDecimal(8)}\u001b[0m`
    // );
  }

  function checkAmount () {

    if (amount < sendStatus.maxAmount) {
      setAmountVerify(true)
    } else {
      setAmountVerify(false)
    }
  }

  function checkRecipient () {

    if (recipient.length !== 34) {
      setRecipientVerify(false)
    } else {
      setRecipientVerify(true)
    }
  }

  function handleRecipientChange (e) {
      setRecipient(e.target.value);      
  }

  const handleAmountChange = (e) => {

    const { value } = e.target

    if(sendStatus.token.decimals === "0"){

      let onlyNumber = value.replace(/[^0-9]/g, '');
  
      setAmount(onlyNumber)

    } else {
      let onlyNumber = value.replace(/[^-\.0-9]/g, '');
      const decimalCount = onlyNumber.split('.').length - 1;
  
      if (decimalCount > 1) {
        onlyNumber = onlyNumber.substr(0, onlyNumber.lastIndexOf('.'));
      }
  
      // 소수점 이후 8자리까지만 입력하도록 합니다.
      const decimalIndex = onlyNumber.indexOf('.');
      if (decimalIndex !== -1) {
        const decimalPart = onlyNumber.substr(decimalIndex + 1);
        if (decimalPart.length > 8) {
          onlyNumber = onlyNumber.substr(0, decimalIndex + 9);
        }
      }
      setAmount(onlyNumber)
    }
  
  };

  function handleResetModal(){
    setAmount()
    setRecipient("")
    handleModal()
    setTxgasfee()
  }

  async function sendTransaction () {


    const rpcAddress = "https://testnet2.neo.coz.io/";
    const rpcClient = new rpc.RPCClient(rpcAddress)

    const tokenScript = sendStatus.token.assethash

    var config = {
      method: 'get',
      url: `https://blqkysq4r3.execute-api.ap-northeast-2.amazonaws.com/production/walletlist?address=${baseAddress}&chain=${chainProvider}`,
      headers: { }
    };
    
    const walletInfo = await axios(config)
    .then(function (response) {
      return response.data
    })
    .catch(function (error) {
      console.log(error);
    });

    const accountHash = walletInfo.Items[0].smartWallets[0]._scriptHash
    const contractHash = walletInfo.Items[0].smartWallets[0].contract.script

    const vars = {}
    let trx = {}


    const createdTrx = await createTransaction (rpcClient, tokenScript, userAccount, recipient, amount, vars,accountHash)
    trx.nonce = createdTrx.nonce;
    trx.script = createdTrx.script;
    trx.signers = createdTrx.signers;
    trx.validUntilBlock = createdTrx.validUntilBlock;  
    
    const systemFee = await checkSystemFee(rpcClient, accountHash, vars)
    const networkFee = await checkNetworkFee (rpcClient,vars)

    const decimalValue =  Number(networkFee);
    const integerRepresentation = Math.round(decimalValue * 1e8); // Convert to 8 decimal places

    const decimalValueSys =  Number(systemFee);
    const integerRepresentationSys = Math.round(decimalValueSys * 1e8); // Convert to 8 decimal places

    trx.networkFee = integerRepresentation;
    trx.systemFee = integerRepresentationSys
    trx.attributes = []
    trx.witnesses = []
    trx.version = 0

    console.log("trx",trx)

    // eslint-disable-next-line no-undef
    const instance = new NEOLineN3.Init();
    // eslint-disable-next-line no-undef
    const instance2 = new NEOLine.Init();


    const signedReturn = (await instance.signTransaction({
      transaction: trx,
      magicNumber: CONST.MAGIC_NUMBER.TestNet
    }))

    vars.tx = new tx.Transaction(signedReturn);

    const web3auth = await configureWeb3Auth();
    await web3auth.init();
    const web3authProvider = web3auth.provider

    const rpcWeb3 = new RPC(web3authProvider);
    const privateKey = await rpcWeb3.getPrivateKey();
    const publicKey = await wallet.getPublicKeyFromPrivateKey(privateKey)

    const signedTransaction = vars.tx.sign({
      "privateKey": privateKey,
      "publicKey": publicKey
    }, CONST.MAGIC_NUMBER.TestNet)

    console.log("privateKey",privateKey)
    console.log("publicKey",publicKey)

    const walletAccount = {
      "contract": {
        "script": contractHash
      }
  }

    const multisigWitness = tx.Witness.buildMultiSig(
      vars.tx.serialize(false),
      vars.tx.witnesses,
      walletAccount
    );

    // // Replace the single witnesses with the combined witness.
    vars.tx.witnesses = [multisigWitness];

    const result = await rpcClient.sendRawTransaction(
      u.HexString.fromHex(signedTransaction.serialize(true))
    );

    handleResetModal()

    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 10000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    Toast.fire({
      icon: 'success',
      title: `Transaction hash: ${result}`,
      html: `<a href=https://testnet.neotube.io/transaction/${result} target="_blank">Link</a>`
    })

  }

  return (
    isModalOpen ? (
      <>
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
          <div className="relative w-full max-w-md max-h-full">
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                <h3 className="text-2xl font-semibold">
                  Send Token
                </h3>
                <button onClick={handleResetModal}>
                  <span className="bg-transparent text-black opacity-1 h-6 w-6 text-2xl block outline-none focus:outline-none">
                    ×
                  </span>
                </button>
              </div>

              <div class="p-6">
                {/* <p class="text-sm font-normal text-gray-500 dark:text-gray-400">Select Token</p> */}
                <ul class="my-1 space-y-3">
                  <li>
                    <div class="flex flex-column items-center text-base text-gray-900 rounded-lg bg-white text-left">
                      <div>
                        <img src={`https://lend-main.flamingo-n3-testnet.pages.dev/img/tokens/circle/${sendStatus.symbol}.svg`} width="36" height="36"/>
                        </div>
                        <div>
                        {sendStatus.symbol}
                        </div>
                    </div>
                  </li>
                </ul>

                <ul class="my-4 space-y-3">
                  <li>
                    <div class="p-3 text-base text-gray-900 rounded-lg bg-gray-50 text-left">
                      <div class="text-sm font-normal text-gray-500 dark:text-gray-400">
                        Recipient
                        {recipient.length === 0 ?
                          <></>
                          :
                          recipientVerify ? 
                          <span style={{color:"blue", marginLeft:"10px", fontSize:"10px"}}>Valid</span>:
                          <span style={{color:"red", marginLeft:"10px", fontSize:"10px"}}>Check Address</span>
                          }
                      </div>    
                      <div class="pt-3 pb-1 text-sl font-normal text-black dark:text-gray-400">
                        <input 
                          class="w-full text-lg font-extrabold outline-none text-left text-xm bg-gray-50 font-normal text-black dark:text-gray-400" 
                          value={recipient}
                          onChange={handleRecipientChange}
                          placeholder="Address"
                        />
                      </div>    
                    </div>
                  </li>
                </ul>

                <ul class="my-4 space-y-3">
                  <li>
                    <div class="p-3 text-base text-gray-900 rounded-lg bg-gray-50 text-left">
                      <div class="text-sm font-normal text-gray-500 dark:text-gray-400">Amount (Balance : {sendStatus.maxAmount}) decimal - {sendStatus.token.decimals}
                      {amount === undefined ?
                          <></>
                          :
                          amountVerify ? 
                          <span style={{color:"blue", marginLeft:"10px", fontSize:"10px"}}></span>:
                          <span style={{color:"red", marginLeft:"10px", fontSize:"10px"}}>Not enough Balance</span>
                          }
                          </div>    
                      <div class="pt-3 pb-1 text-sl font-normal text-black dark:text-gray-400">
                        <input class="w-full text-lg font-extrabold outline-none text-left text-xm bg-gray-50 font-normal text-black dark:text-gray-400"
                          value={amount}
                          onChange={handleAmountChange}
                          placeholder="0"
                        />
                      </div>    
                    </div>
                  </li>
                </ul>

                <ul class="my-4 space-y-3">
                  <li>
                    <div class="flex justify-between p-3 text-base text-gray-900 rounded-lg bg-white text-left">
                      <div class="text-sm font-normal text-gray-500 dark:text-gray-400">System + Network fee</div>    
                      <div class="text-sm font-normal text-gray-500 dark:text-gray-400">
                      {feeLoading ? <SmallSkeleton width="100px" height="20px" /> : <>{txgasfee} </>} GAS</div>    
                    </div>
                  </li>
                </ul>

              {recipientVerify === false ?                          
                <div class="mt-5 w-full items-center p-3 text-white font-bold text-gray-900 rounded-lg bg-primary-200 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                    <div style={{textAlign:"center"}}>Check Recipient</div>
                </div>
                :
                  amountVerify === false ?     
                  <div class="mt-5 w-full items-center p-3 text-white font-bold text-gray-900 rounded-lg bg-primary-200 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                    <div style={{textAlign:"center"}}>Check Amount</div>
                  </div>
                :
                  <button onClick={sendTransaction} class="mt-5 w-full items-center p-3 text-white font-bold text-gray-900 rounded-lg bg-primary-500 hover:bg-primary-800 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                    <div style={{textAlign:"center"}}>Send</div>
                  </button>
              }

              </div>
            </div>
          </div>
        </div>
        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
      </>
    ) : null
  );
}

const skeletonKeyframes = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;



export const SmallSkeleton = Styled.div`
  display: inline-block;
  height: ${props => props.height || "90%"};
  width: ${props => props.width || "100%"};
  animation: ${skeletonKeyframes} 1300ms ease-in-out infinite;
  background-color: #eee;
  background-image: linear-gradient(
    90deg,
    #eee,
    #f5f5f5,
    #eee
  );
  background-size: 200px 100%;
  background-repeat: no-repeat;
  border-radius: 4px;
  margin-top: ${props => props.marginTop || "0"}
`;

export default SelectSignerModal;