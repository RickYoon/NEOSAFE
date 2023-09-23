const { CONST, tx, rpc, sc, u } = require("@cityofzion/neon-js")

const rpcAddress = "https://testnet2.neo.coz.io/";

async function sendCustomToken (scriptHash, operation, sender, receiver, amount ) {

    try {

      // console.log("clicked ! ")

      // token scriptHash,
      // 

        const vars = {}
        let trx = {}

        const _scriptHash = scriptHash
        const _operation = operation
        const _senderAddress = sender
        const _receiverAddress = receiver
        const _sendAmount = amount

        console.log("scriptHash",_scriptHash)
        console.log("operation",_operation)
        console.log("senderAddress",_senderAddress)
        console.log("receiverAddress",_receiverAddress)
        console.log("sendAmount",_sendAmount)
        

        // // create Transaction 
        // const aa = await createTransaction (scriptHash, operation, args, vars, signers)

        // trx.nonce = aa.nonce;
        // trx.script = aa.script;
        // trx.signers = aa.signers;
        // trx.validUntilBlock = aa.validUntilBlock;
      
        // // const networkFee = await checkNetworkFee (rpcClient, inputs, vars)
        // // const decimalValue =  Number(networkFee);
        // // const integerRepresentation = Math.round(decimalValue * 1e8); // Convert to 8 decimal places
        // // const bigInteger = new u.BigInteger(integerRepresentation.toString());
        // // console.log("bigInteger",bigInteger)
      
        // trx.networkFee = 1024890;
      
        // // const systemFee = await checkSystemFee (rpcClient, inputs, vars)
        // trx.systemFee = 8097775
        // trx.attributes = []
        // trx.witnesses = []
        // trx.version = 0
      
        // // await performTransfer (rpcClient, inputs, trx, walletAccount)
      
        // console.log("vars.tx",vars.tx)

        //   // eslint-disable-next-line no-undef
        // const instance = new NEOLineN3.Init();
        // // eslint-disable-next-line no-undef
        // const instance2 = new NEOLine.Init();
        // const network = await instance2.getNetworks();
        // const account = await instance.getAccount();

        // console.log("vars.tx",vars.tx)

        // // console.log("dd", {
        // //   transaction: trx,
        // //   magicNumber: CONST.MAGIC_NUMBER.TestNet
        // // })

        // console.log("trx",trx)

        // const signedReturn = (await instance.signTransaction({
        //     transaction: trx,
        //     magicNumber: CONST.MAGIC_NUMBER.TestNet
        // }))
        

        // console.log("signedReturn",signedReturn)

        // vars.tx = new tx.Transaction(signedReturn);

        // // console.log("signedReturn",signedReturn)

        // // vars.tx.witnesses.push(signedReturn.witnesses[0])

        // const signedTransaction = vars.tx.sign({
        //     "addressVersion": 53,
        //     "label": "NWGMZv3gA4prdZcGUt8xomzj643AKMuobx",
        //     "isDefault": false,
        //     "lock": false,
        //     "contract": {
        //         "script": "DCECdRX68F0bdHXbnI5lsCekEnItp5tsNWAJ3usuiwx9pexBVuezJw==",
        //         "parameters": [
        //             {
        //                 "name": "signature",
        //                 "type": "Signature"
        //             }
        //         ],
        //         "deployed": false
        //     },
        //     "privateKey": "2f154a95e815a759f0215e8c119042fd0e6f74f6104de416d9571ce8bea04256",
        //     "publicKey": "027515faf05d1b7475db9c8e65b027a412722da79b6c356009deeb2e8b0c7da5ec",
        //     "scriptHash": "55750689a835aae41f0020c6721452a9bb428c71",
        //     "address": "NWGMZv3gA4prdZcGUt8xomzj643AKMuobx"
        // }, CONST.MAGIC_NUMBER.TestNet)

        // const walletAccount = {
        //     "addressVersion": 53,
        //     "contract": {
        //     "deployed": false,
        //     "parameters": [
        //       null,
        //       null
        //     ],
        //     "script": "EgwhAnUV+vBdG3R125yOZbAnpBJyLaebbDVgCd7rLosMfaXsDCECNKYLtl1/w0cHUvsFGJKQkmjSpcj1gBOl/zdzBDYq0wQSQZ7Q3Do="
        //     },
        //     "isDefault": false,
        //     "label": "NPtG3HrNV6Wj2CpuZ4MmnU5H3KSAEtxD79",
        //     "lock": false,
        //     "address": "NPtG3HrNV6Wj2CpuZ4MmnU5H3KSAEtxD79",
        //     "scriptHash": "b02f1d8c7da61afadca643a8d2442d6a82bd8d2b"
        //  }

        //  console.log("signedTransaction bf",signedTransaction)


        // const multisigWitness = tx.Witness.buildMultiSig(
        // vars.tx.serialize(false),
        // vars.tx.witnesses,
        // walletAccount
        // );

        // //   // // Replace the single witnesses with the combined witness.
        // vars.tx.witnesses = [multisigWitness];

        // const rpcClient = new rpc.RPCClient(rpcAddress)

        // const result = await rpcClient.sendRawTransaction(
        // u.HexString.fromHex(signedTransaction.serialize(true))
        // );

        // console.log("signedTransaction at",signedTransaction)

        // console.log("\n\n--- Transaction hash ---");
        // console.log(result);
  
  
        // return {
        //     id : id,
        //     topic : topic,
        //     sign : result
        // }

    } catch (error) {
        console.log(error)
    }

}

async function createTransaction(scriptHash, operation, args, vars, signers) {

    const rpcClient = new rpc.RPCClient(rpcAddress)
    const currentHeight = await rpcClient.getBlockCount();
  
    // Since the token is now an NEP-17 token, we transfer using a VM script.
    const script = sc.createScript({
                        scriptHash: scriptHash,
                        operation: operation,
                        args: [
                            sc.ContractParam.hash160("0xb02f1d8c7da61afadca643a8d2442d6a82bd8d2b"),
                            sc.ContractParam.hash160("0x85deac50febfd93988d3f391dea54e8289e43e9e"),
                            1,
                            sc.ContractParam.any(),
                    ]
                    });

    vars.tx = new tx.Transaction({
        signers: [
            {
                "account": "b02f1d8c7da61afadca643a8d2442d6a82bd8d2b",
                "scopes": 16,
                "allowedContracts": ["0x6f0910fa26290f4a423930c8f833395790c71705","0xf9c55e595b39ded1e866efcc163445a168d378d5","0x52bf47559436d3572a9b1cb83c056dc39cb42d0d","0xd2a4cff31913016155e38e474a2c06d08be276cf","0x7deb6406aeef3414ae47ae34fd986d0ca2c92859","0x5b53998b399d10cd25727269e865acc785ef5c1a"]
            }
            ],
        validUntilBlock: currentHeight + 1000,
        script: script,
    });
    console.log("vars.tx",vars.tx)        
    console.log("\u001b[32m  ✓ Transaction created \u001b[0m");

    return {
      signers: [
        {
          account: "b02f1d8c7da61afadca643a8d2442d6a82bd8d2b",
          scopes: tx.WitnessScope.CalledByEntry,
        },
      ],
      validUntilBlock: currentHeight + 1000,
      script: script,
      nonce: vars.tx.nonce
    }

}


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

  }

module.exports = {
  sendCustomToken
};
