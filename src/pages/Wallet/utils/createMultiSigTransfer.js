const { Account, CONST, api,tx,wallet, rpc,sc, logging, u } = require("@cityofzion/neon-js")

async function checkToken (rpcClient, inputs, vars) {

    try {
      const tokenNameResponse = await rpcClient.invokeFunction(
        inputs.tokenScriptHash,
        "symbol"
      );
      // 스마트 계약 함수 호출에 대한 응답 처리
      console.log('Smart contract response:', tokenNameResponse);
      console.log("tokenNameResponse",tokenNameResponse)
      console.log("\u001b[32m  ✓ Token found \u001b[0m");

    
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
    console.log("\u001b[32m  ✓ Transaction created \u001b[0m");
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

    const signedTransaction = vars.tx.sign({
        addressVersion: 53,
        label: 'NPTmAHDxo6Pkyic8Nvu3kwyXoYJCvcCB6i',
        isDefault: false,
        lock: false,
        contract: {
          script: 'DCECAoqZgm7cDJfRjiK2kyNz2QjTI6p/kmVqd+wm6IYWme9BVuezJw==',
          parameters: [],
          deployed: false
        },
        privateKey: '7d128a6d096f0c14c3a25a2b0c41cf79661bfcb4a8cc95aaaea28bde4d732344',
        WIF: 'L1QqQJnpBwbsPGAuutuzPTac8piqvbR1HRjrY5qHup48TBCBFe4g',
        publicKey: '02028a99826edc0c97d18e22b6932373d908d323aa7f92656a77ec26e8861699ef',
        scriptHash: 'a7cbfee3f01f89d58c042644b0b6df2d59a6eb26',
        address: 'NPTmAHDxo6Pkyic8Nvu3kwyXoYJCvcCB6i'
      }, CONST.MAGIC_NUMBER.TestNet)
      .sign({
        addressVersion: 53,
        label: 'NMBfzaEq2c5zodiNbLPoohVENARMbJim1r',
        isDefault: false,
        lock: false,
        contract: {
          script: 'DCEDHY4WMM5kCWaWe8bZUiPSH0QwQTMAMUDDtSAE3JgTSclBVuezJw==',
          parameters: [Array],
          deployed: false
        },
        privateKey: '9ab7e154840daca3a2efadaf0df93cd3a5b51768c632f5433f86909d9b994a69',
        WIF: 'L2QTooFoDFyRFTxmtiVHt5CfsXfVnexdbENGDkkrrgTTryiLsPMG',
        publicKey: '031d8e1630ce640966967bc6d95223d21f44304133003140c3b52004dc981349c9',
        scriptHash: '118ba6f59931a56ec469770f7fc790ece96df00d',
        address: 'NMBfzaEq2c5zodiNbLPoohVENARMbJim1r'
      }, CONST.MAGIC_NUMBER.TestNet)

      const multisigWitness = tx.Witness.buildMultiSig(
        vars.tx.serialize(false),
        vars.tx.witnesses,
        walletAccount
      );
  
      // // Replace the single witnesses with the combined witness.
      vars.tx.witnesses = [multisigWitness];
  
      // const result = await rpcClient.sendRawTransaction(tx);
  
    // console.log(vars.tx.toJson());
    const result = await rpcClient.sendRawTransaction(
      u.HexString.fromHex(signedTransaction.serialize(true))
    );
  
    console.log("\n\n--- Transaction hash ---");
    console.log(result);
  }
  


async function sendNeoToken () {

    // 1. Multisig wallet 설정값 넣고 생성

    const threshold = 2;
    const publicKeys = [
      "02028a99826edc0c97d18e22b6932373d908d323aa7f92656a77ec26e8861699ef",
      "031d8e1630ce640966967bc6d95223d21f44304133003140c3b52004dc981349c9",
      "02232ce8d2e2063dce0451131851d47421bfc4fc1da4db116fca5302c0756462fa"
    ];
  
    const walletAccount = wallet.Account.createMultiSig(threshold, publicKeys)
    const rpcClient = new rpc.RPCClient("https://testnet2.neo.coz.io/");
    const vars = {}

    console.log("walletAccount",walletAccount)

    const inputs = {
      fromAccount: walletAccount,
      toAccount: new wallet.Account(
      "L2QTooFoDFyRFTxmtiVHt5CfsXfVnexdbENGDkkrrgTTryiLsPMG"
      ),
      tokenScriptHash: CONST.NATIVE_CONTRACT_HASH.NeoToken,
      amountToTransfer: 1,
      systemFee: 0,
      networkFee: 0,
      networkMagic: CONST.MAGIC_NUMBER.TestNet, //CONST.MAGIC_NUMBER.TestNet,
      nodeUrl: "https://testnet2.neo.coz.io/ " //"http://seed2t.neo.org:20332",
    };    

    // 2. check Token (rpcClient, inputs, vars)
    await checkToken (rpcClient, inputs, vars)
    console.log("vars", vars)

    // 3. create transaction
    await createTransaction (rpcClient, inputs, vars)
    console.log("vars", vars)

    // // check Network fee
    await checkNetworkFee (rpcClient, inputs, vars)
    console.log("vars", vars)

    // // check system fee
    await checkSystemFee (rpcClient, inputs, vars)
    console.log("vars", vars)

    await checkBalance (rpcClient, inputs, vars)
    console.log("vars2", vars)

    // check Balance

    await performTransfer (rpcClient, inputs, vars,walletAccount)

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
