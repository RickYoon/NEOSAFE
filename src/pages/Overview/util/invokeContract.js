const { default: Neon, tx, wallet, rpc, u } = require("@cityofzion/neon-js");

const props = {
  scriptHash: "80de34fbe3e6488ce316b722c5455387b001df31",
  operation: "symbol",
  args: []
};
const script = Neon.create.script(props);

const myAccount = {
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
  }

// create raw invocation transaction
let rawTransaction = new tx.InvocationTransaction({
  script: script,
  gas: 0
});

// Build input objects and output objects.
rawTransaction.addAttribute(
  tx.TxAttrUsage.Script,
  u.reverseHex(wallet.getScriptHashFromAddress(myAccount.address))
);

// Sign transaction with sender's private key
const signature = wallet.sign(
  rawTransaction.serialize(false),
  myAccount.privateKey
);

// Add witness
rawTransaction.addWitness(
  tx.Witness.fromSignature(signature, myAccount.publicKey)
);

// Send raw transaction
const client = new rpc.RPCClient("https://testnet2.neo.coz.io/");
client
  .sendRawTransaction(rawTransaction)
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.log(err);
  });