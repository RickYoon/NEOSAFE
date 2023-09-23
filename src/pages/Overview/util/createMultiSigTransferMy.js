const { Account, CONST, api,tx,wallet, rpc,sc, logging, u } = require("@cityofzion/neon-js")







async function checkToken (rpcClient, inputs, vars) {

    try {
      const tokenNameResponse = await rpcClient.invokeFunction(
        inputs.tokenScriptHash,
        "symbol"
      );
      // 스마트 계약 함수 호출에 대한 응답 처리
      console.log('Smart contract response:', tokenNameResponse)
      console.log("tokenNameResponse",tokenNameResponse)
      console.log("\u001b[32m  ✓ Token found \u001b[0m")
    
      if (tokenNameResponse.state !== "HALT") {
        throw new Error(
          "Token not found! Please check the provided tokenScriptHash is correct."
        );
      }
    
      vars.tokenName = u.HexString.fromBase64(
        tokenNameResponse.stack[0].value
      ).toAscii();
    
      console.log("\u001b[32m  ✓ Token found \u001b[0m");
    } catch (error) {
      // 오류 처리
      console.error('Error:', error);
    }

  }

  async function createTransaction(rpcClient,inputs, vars) {
    console.log("\n\n --- Today's Task ---");
    console.log(
      `Sending ${inputs.amountToTransfer} token \n` +
        `from ${inputs.fromAccount.address} \n` +
        `to ${inputs.toAccount.address}`
    );
  
    // Since the token is now an NEP-17 token, we transfer using a VM script.
    const script = sc.createScript({
      scriptHash: inputs.tokenScriptHash,
      operation: "transfer",
      args: [
        sc.ContractParam.hash160(inputs.fromAccount.address),
        sc.ContractParam.hash160(inputs.toAccount.address),
        inputs.amountToTransfer,
        sc.ContractParam.any(),
      ],
    });

    console.log("script",script)
  
    // We retrieve the current block height as we need to
    const currentHeight = await rpcClient.getBlockCount();
    vars.tx = new tx.Transaction({
      signers: [
        {
          account: inputs.fromAccount.scriptHash,
          scopes: tx.WitnessScope.CalledByEntry,
        },
      ],
      validUntilBlock: currentHeight + 1000,
      script: script,
    });

    console.log("vars.tx",vars.tx)
    
    console.log("\u001b[32m  ✓ Transaction created \u001b[0m");

    return {
      signers: [
        {
          account: inputs.fromAccount.scriptHash,
          scopes: tx.WitnessScope.CalledByEntry,
        },
      ],
      validUntilBlock: currentHeight + 1000,
      script: script,
      nonce: vars.tx.nonce
    }
  }

  async function checkNetworkFee(rpcClient,inputs, vars) {

    const feePerByteInvokeResponse = await rpcClient.invokeFunction(
      CONST.NATIVE_CONTRACT_HASH.PolicyContract,
      "getFeePerByte"
    );
  
    if (feePerByteInvokeResponse.state !== "HALT") {
      if (inputs.networkFee === 0) {
        throw new Error("Unable to retrieve data to calculate network fee.");
      } else {
        console.log(
          "\u001b[31m  ✗ Unable to get information to calculate network fee.  Using user provided value.\u001b[0m"
        );
        vars.tx.networkFee = u.BigInteger.fromNumber(inputs.networkFee);
      }
    }
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

    if (inputs.networkFee && inputs.networkFee >= networkFeeEstimate.toNumber()) {
      vars.tx.networkFee = u.BigInteger.fromNumber(inputs.networkFee);
      console.log(
        `  i Node indicates ${networkFeeEstimate.toDecimal(
          8
        )} networkFee but using user provided value of ${inputs.networkFee}`
      );
    } else {
      vars.tx.networkFee = networkFeeEstimate;
    }    

    console.log(
      `\u001b[32m  ✓ Network Fee set: ${vars.tx.networkFee.toDecimal(
        8
      )} \u001b[0m`
    );

    return vars.tx.networkFee.toDecimal(8)
  }

  async function checkSystemFee(rpcClient,inputs, vars) {
    const invokeFunctionResponse = await rpcClient.invokeScript(
      u.HexString.fromHex(vars.tx.script),
      [
        {
          account: inputs.fromAccount.scriptHash,
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
    if (inputs.systemFee && inputs.systemFee >= requiredSystemFee) {
      vars.tx.systemFee = u.BigInteger.fromNumber(inputs.systemFee);
      console.log(
        `  i Node indicates ${requiredSystemFee} systemFee but using user provided value of ${inputs.systemFee}`
      );
    } else {
      vars.tx.systemFee = requiredSystemFee;
    }
    console.log(
      `\u001b[32m  ✓ SystemFee set: ${vars.tx.systemFee.toDecimal(8)}\u001b[0m`
    );
  }

  async function checkBalance(rpcClient,inputs, vars) {
    let balanceResponse;
    try {
      balanceResponse = await rpcClient.execute(
        new rpc.Query({
          method: "getnep17balances",
          params: [inputs.fromAccount.address],
        })
      );
    } catch (e) {
      console.log(e);
      console.log(
        "\u001b[31m  ✗ Unable to get balances as plugin was not available. \u001b[0m"
      );
      return;
    }
    // Check for token funds
    const balances = balanceResponse.balance.filter((bal) =>
      bal.assethash.includes(inputs.tokenScriptHash)
    );
    const balanceAmount =
      balances.length === 0 ? 0 : parseInt(balances[0].amount);
    if (balanceAmount < inputs.amountToTransfer) {
      throw new Error(`Insufficient funds! Found ${balanceAmount}`);
    } else {
      console.log("\u001b[32m  ✓ Token funds found \u001b[0m");
    }
  
    // Check for gas funds for fees
    const gasRequirements = vars.tx.networkFee.add(vars.tx.systemFee);
    const gasBalance = balanceResponse.balance.filter((bal) =>
      bal.assethash.includes(CONST.NATIVE_CONTRACT_HASH.GasToken)
    );
    const gasAmount =
      gasBalance.length === 0
        ? u.BigInteger.fromNumber(0)
        : u.BigInteger.fromNumber(gasBalance[0].amount);
  
    if (gasAmount.compare(gasRequirements) === -1) {
      throw new Error(
        `Insufficient gas to pay for fees! Required ${gasRequirements.toString()} but only had ${gasAmount.toString()}`
      );
    } else {
      console.log(
        `\u001b[32m  ✓ Sufficient GAS for fees found (${gasRequirements.toString()}) \u001b[0m`
      );
    }
  }



  async function performTransfer(rpcClient,inputs, vars,walletAccount) {
    
    // const signedTransaction = vars.tx.sign(
    //   inputs.fromAccount,
    //   inputs.networkMagic
    // );

    vars.tx.sign({
      "addressVersion": 53,
      "label": "NWGMZv3gA4prdZcGUt8xomzj643AKMuobx",
      "isDefault": false,
      "lock": false,
      "contract": {
          "script": "DCECdRX68F0bdHXbnI5lsCekEnItp5tsNWAJ3usuiwx9pexBVuezJw==",
          "parameters": [
              {
                  "name": "signature",
                  "type": "Signature"
              }
          ],
          "deployed": false
      },
      "privateKey": "2f154a95e815a759f0215e8c119042fd0e6f74f6104de416d9571ce8bea04256",
      "publicKey": "027515faf05d1b7475db9c8e65b027a412722da79b6c356009deeb2e8b0c7da5ec",
      "scriptHash": "55750689a835aae41f0020c6721452a9bb428c71",
      "address": "NWGMZv3gA4prdZcGUt8xomzj643AKMuobx"
    }, CONST.MAGIC_NUMBER.TestNet)


    // // eslint-disable-next-line no-undef
    // const instance = new NEOLineN3.Init();
    // // eslint-disable-next-line no-undef
    // const instance2 = new NEOLine.Init();
    // const network = await instance2.getNetworks();
    // const account = await instance.getAccount();

    // console.log("vars.tx",vars.tx)

    // const signedTransaction = await instance.signTransaction({
    //   transaction: vars.tx,
    //   magicNumber: CONST.MAGIC_NUMBER.TestNet
    // })
    
    const signedTransaction = vars.tx.sign({
      addressVersion: 53,
      label: 'NV6b5AbWRDzbg4esbAdigWnG73ytcUJapm',
      isDefault: false,
      lock: false,
      contract: {
        script: 'DCECNKYLtl1/w0cHUvsFGJKQkmjSpcj1gBOl/zdzBDYq0wRBVuezJw==',
        parameters: [ [Object] ],
        deployed: false
      },
      privateKey: '80ba6adc90677497ba5093a22d90dc1cf70db352700fac3bdd9a6bdf5e92c13c',
      WIF: 'L1Xwa2DcKV1pEK68ARGdPy5SEcNtnuhtPaT89V8X1chMYZASjSZV',
      publicKey: '0234a60bb65d7fc3470752fb051892909268d2a5c8f58013a5ff377304362ad304',
      scriptHash: '04440257a3b8b84979ecbcb8d583b598843fbb64',
      address: 'NV6b5AbWRDzbg4esbAdigWnG73ytcUJapm'
    }, CONST.MAGIC_NUMBER.TestNet)

    // neolineN3.signTransaction({
    //   transaction: {
    //     version: 0,
    //     nonce: 1262108766,
    //     systemFee: 997775,
    //     networkFee: 122862,
    //     validUntilBlock: 667132,
    //     attributes: [],
    //     signers: [{ account: "8ddd95c4b5aa2b049abae570cf9bd4476e9b7667", scopes: 1 }],
    //     witnesses: [],
    //     script: "0b110c1467769b6e47d49bcf70e5ba9a042baab5c495dd8d0c1467769b6e47d49bcf70e5ba9a042baab5c495dd8d14c01f0c087472616e736665720c14f563ea40bc283d4d0e05c48ea305b3f2a07340ef41627d5b52"
    //   },
    //   magicNumber: 877933390
    // })
    // .then(signedTx => {
    //   console.log('Signed Transaction:', signedTx);
    // })

    // console.log("signedTransaction",signedTransaction)

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
  
    console.log("\n\n--- Transaction hash ---");
    console.log(result);

    // console.log("var.tx", {
    //   transaction: vars.tx,
    //   magicNumber: CONST.MAGIC_NUMBER.TestNet
    // })
    
    // vars.tx.sign({
    //   "addressVersion": 53,
    //   "label": "NWGMZv3gA4prdZcGUt8xomzj643AKMuobx",
    //   "isDefault": false,
    //   "lock": false,
    //   "contract": {
    //       "script": "DCECdRX68F0bdHXbnI5lsCekEnItp5tsNWAJ3usuiwx9pexBVuezJw==",
    //       "parameters": [
    //           {
    //               "name": "signature",
    //               "type": "Signature"
    //           }
    //       ],
    //       "deployed": false
    //   },
    //   "privateKey": "2f154a95e815a759f0215e8c119042fd0e6f74f6104de416d9571ce8bea04256",
    //   "publicKey": "027515faf05d1b7475db9c8e65b027a412722da79b6c356009deeb2e8b0c7da5ec",
    //   "scriptHash": "55750689a835aae41f0020c6721452a9bb428c71",
    //   "address": "NWGMZv3gA4prdZcGUt8xomzj643AKMuobx"
    // }, CONST.MAGIC_NUMBER.TestNet)

    // const initNeoLine = async () => {
    //   try {
    //     // eslint-disable-next-line no-undef
        // const instance = new NEOLineN3.Init();
        // // eslint-disable-next-line no-undef
        // const instance2 = new NEOLine.Init();
        // const network = await instance2.getNetworks();
        // const account = await instance.getAccount();
    
    //     return {
    //       instance,
    //       account,
    //       network
    //     };
    //   } catch (e) {
    //     throw new Error("Failed to connect NeoLine.");
    //   }
    // };

    // // await initNeoLine()

    // // eslint-disable-next-line no-undef
    // const instance = new NEOLineN3.Init();
    // // eslint-disable-next-line no-undef
    // const instance2 = new NEOLine.Init();
    // const network = await instance2.getNetworks();
    // const account = await instance.getAccount();
    // const result = await rpcClient.sendRawTransaction(tx);

      // console.log("var123s",vars)

    // neolineN3.signTransaction({
    //   transaction: {
    //     version: 0,
    //     nonce: 1262108766,
    //     systemFee: 997775,
    //     networkFee: 122862,
    //     validUntilBlock: 667132,
    //     attributes: [],
    //     signers: [{ account: "8ddd95c4b5aa2b049abae570cf9bd4476e9b7667", scopes: 1 }],
    //     witnesses: [],
    //     script: "0b110c1467769b6e47d49bcf70e5ba9a042baab5c495dd8d0c1467769b6e47d49bcf70e5ba9a042baab5c495dd8d14c01f0c087472616e736665720c14f563ea40bc283d4d0e05c48ea305b3f2a07340ef41627d5b52"
    //   },
    //   magicNumber: 877933390
    // })
    // .then(signedTx => {
    //   console.log('Signed Transaction:', signedTx);
    // })

  }
  


async function sendNeoToken () {

  const rpcClient = new rpc.RPCClient("https://testnet2.neo.coz.io/");
  const vars = {}

  const walletAccount = {
    "addressVersion": 53,
    "contract": {
    "deployed": false,
    "parameters": [
      null,
      null
    ],
    "script": "EgwhAnUV+vBdG3R125yOZbAnpBJyLaebbDVgCd7rLosMfaXsDCECNKYLtl1/w0cHUvsFGJKQkmjSpcj1gBOl/zdzBDYq0wQSQZ7Q3Do="
    },
    "isDefault": false,
    "label": "NPtG3HrNV6Wj2CpuZ4MmnU5H3KSAEtxD79",
    "lock": false,
    "address": "NPtG3HrNV6Wj2CpuZ4MmnU5H3KSAEtxD79",
    "scriptHash": "b02f1d8c7da61afadca643a8d2442d6a82bd8d2b"
 }

 const inputs = {
    fromAccount: walletAccount,
    toAccount: new wallet.Account(
    "L1Xwa2DcKV1pEK68ARGdPy5SEcNtnuhtPaT89V8X1chMYZASjSZV"
    ),
    tokenScriptHash: CONST.NATIVE_CONTRACT_HASH.NeoToken,
    amountToTransfer: 1,
    systemFee: 0,
    networkFee: 0,
    networkMagic: CONST.MAGIC_NUMBER.TestNet, //CONST.MAGIC_NUMBER.TestNet,
    nodeUrl: "https://testnet2.neo.coz.io/ " //"http://seed2t.neo.org:20332",
  };   

  let trx = {}

  await checkToken (rpcClient, inputs, vars)
  console.log("vars", vars)

  const aa = await createTransaction (rpcClient, inputs, vars)

  trx.nonce = aa.nonce;
  trx.script = aa.script;
  trx.signers = aa.signers;
  trx.validUntilBlock = aa.validUntilBlock;

  const networkFee = await checkNetworkFee (rpcClient, inputs, vars)
  const decimalValue =  Number(networkFee);
  const integerRepresentation = Math.round(decimalValue * 1e8); // Convert to 8 decimal places
  const bigInteger = new u.BigInteger(integerRepresentation.toString());
  console.log("bigInteger",bigInteger)

  trx.networkFee = 1024890;

  const systemFee = await checkSystemFee (rpcClient, inputs, vars)
  trx.systemFee = 997775
  trx.attributes = []
  trx.witnesses = []
  trx.version = 0

  // await performTransfer (rpcClient, inputs, trx, walletAccount)

  console.log("vars.tx",vars.tx)

  // eslint-disable-next-line no-undef
  const instance = new NEOLineN3.Init();
  // eslint-disable-next-line no-undef
  const instance2 = new NEOLine.Init();
  const network = await instance2.getNetworks();
  const account = await instance.getAccount();

  console.log("vars.tx",vars.tx)

  // console.log("dd", {
  //   transaction: trx,
  //   magicNumber: CONST.MAGIC_NUMBER.TestNet
  // })

  const signedReturn = (await instance.signTransaction({
    transaction: trx,
    magicNumber: CONST.MAGIC_NUMBER.TestNet
  }))

  vars.tx = new tx.Transaction(signedReturn);

  // console.log("signedReturn",signedReturn)

  // vars.tx.witnesses.push(signedReturn.witnesses[0])

  const signedTransaction = vars.tx.sign({
    "addressVersion": 53,
    "label": "NWGMZv3gA4prdZcGUt8xomzj643AKMuobx",
    "isDefault": false,
    "lock": false,
    "contract": {
        "script": "DCECdRX68F0bdHXbnI5lsCekEnItp5tsNWAJ3usuiwx9pexBVuezJw==",
        "parameters": [
            {
                "name": "signature",
                "type": "Signature"
            }
        ],
        "deployed": false
    },
    "privateKey": "2f154a95e815a759f0215e8c119042fd0e6f74f6104de416d9571ce8bea04256",
    "publicKey": "027515faf05d1b7475db9c8e65b027a412722da79b6c356009deeb2e8b0c7da5ec",
    "scriptHash": "55750689a835aae41f0020c6721452a9bb428c71",
    "address": "NWGMZv3gA4prdZcGUt8xomzj643AKMuobx"
  }, CONST.MAGIC_NUMBER.TestNet)

  console.log("vars.tx",vars.tx)




  // var.tx = signedTransaction
  
  // const signedTransaction = vars.tx.sign({
  //   addressVersion: 53,
  //   label: 'NV6b5AbWRDzbg4esbAdigWnG73ytcUJapm',
  //   isDefault: false,
  //   lock: false,
  //   contract: {
  //     script: 'DCECNKYLtl1/w0cHUvsFGJKQkmjSpcj1gBOl/zdzBDYq0wRBVuezJw==',
  //     parameters: [ [Object] ],
  //     deployed: false
  //   },
  //   privateKey: '80ba6adc90677497ba5093a22d90dc1cf70db352700fac3bdd9a6bdf5e92c13c',
  //   WIF: 'L1Xwa2DcKV1pEK68ARGdPy5SEcNtnuhtPaT89V8X1chMYZASjSZV',
  //   publicKey: '0234a60bb65d7fc3470752fb051892909268d2a5c8f58013a5ff377304362ad304',
  //   scriptHash: '04440257a3b8b84979ecbcb8d583b598843fbb64',
  //   address: 'NV6b5AbWRDzbg4esbAdigWnG73ytcUJapm'
  // }, CONST.MAGIC_NUMBER.TestNet)

  // neolineN3.signTransaction({
  //   transaction: {
  //     version: 0,
  //     nonce: 1262108766,
  //     systemFee: 997775,
  //     networkFee: 122862,
  //     validUntilBlock: 667132,
  //     attributes: [],
  //     signers: [{ account: "8ddd95c4b5aa2b049abae570cf9bd4476e9b7667", scopes: 1 }],
  //     witnesses: [],
  //     script: "0b110c1467769b6e47d49bcf70e5ba9a042baab5c495dd8d0c1467769b6e47d49bcf70e5ba9a042baab5c495dd8d14c01f0c087472616e736665720c14f563ea40bc283d4d0e05c48ea305b3f2a07340ef41627d5b52"
  //   },
  //   magicNumber: 877933390
  // })
  // .then(signedTx => {
  //   console.log('Signed Transaction:', signedTx);
  // })

  // console.log("signedTransaction",signedTransaction)

  console.log("vars.tx.witnesses",vars.tx.witnesses)

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

  console.log("\n\n--- Transaction hash ---");
  console.log(result);



    // 2. check Token (rpcClient, inputs, vars)


    // // // check Network fee

    // // // check system fee

    // await checkBalance (rpcClient, inputs, vars)
    // console.log("vars2", vars)

    // // // Perform transaction

}

// sendNeoToken()
module.exports = {
  sendNeoToken, // 필요한 다른 함수도 필요에 따라 내보낼 수 있습니다.
};




// const script = sc.createScript({
//   scriptHash: CONST.NATIVE_CONTRACT_HASH.NeoToken,
//   operation: "transfer",
//   args: [
//     sc.ContractParam.hash160(walletAccount._address),
//     sc.ContractParam.hash160("NfScrtKDZFefNjVotBfrhEQR6GWhe8SXkH"),
//     sc.ContractParam.integer(1),
//     sc.ContractParam.any(),
//   ],
// });

// console.log("script",script)


// // const rpcClient = new rpc.RPCClient("https://testnet2.neo.coz.io/");


// const currentHeight = await rpcClient.getBlockCount();

// const txa = new tx.Transaction({
//   signers: [
//     {
//       account: walletAccount.scriptHash,
//       scopes: tx.WitnessScope.CalledByEntry,
//     },
//   ],
//   validUntilBlock: currentHeight + 1000,
//   systemFee: 100000001,
//   networkFee: 100000001,
//   script,
// }).sign({
//     addressVersion: 53,
//     label: 'NPTmAHDxo6Pkyic8Nvu3kwyXoYJCvcCB6i',
//     isDefault: false,
//     lock: false,
//     contract: {
//       script: 'DCECAoqZgm7cDJfRjiK2kyNz2QjTI6p/kmVqd+wm6IYWme9BVuezJw==',
//       parameters: [],
//       deployed: false
//     },
//     privateKey: '7d128a6d096f0c14c3a25a2b0c41cf79661bfcb4a8cc95aaaea28bde4d732344',
//     WIF: 'L1QqQJnpBwbsPGAuutuzPTac8piqvbR1HRjrY5qHup48TBCBFe4g',
//     publicKey: '02028a99826edc0c97d18e22b6932373d908d323aa7f92656a77ec26e8861699ef',
//     scriptHash: 'a7cbfee3f01f89d58c042644b0b6df2d59a6eb26',
//     address: 'NPTmAHDxo6Pkyic8Nvu3kwyXoYJCvcCB6i'
//   }, CONST.MAGIC_NUMBER.TestNet)
//   .sign({
//     addressVersion: 53,
//     label: 'NMBfzaEq2c5zodiNbLPoohVENARMbJim1r',
//     isDefault: false,
//     lock: false,
//     contract: {
//       script: 'DCEDHY4WMM5kCWaWe8bZUiPSH0QwQTMAMUDDtSAE3JgTSclBVuezJw==',
//       parameters: [Array],
//       deployed: false
//     },
//     privateKey: '9ab7e154840daca3a2efadaf0df93cd3a5b51768c632f5433f86909d9b994a69',
//     WIF: 'L2QTooFoDFyRFTxmtiVHt5CfsXfVnexdbENGDkkrrgTTryiLsPMG',
//     publicKey: '031d8e1630ce640966967bc6d95223d21f44304133003140c3b52004dc981349c9',
//     scriptHash: '118ba6f59931a56ec469770f7fc790ece96df00d',
//     address: 'NMBfzaEq2c5zodiNbLPoohVENARMbJim1r'
//   }, CONST.MAGIC_NUMBER.TestNet)

//   console.log("txa",txa)
