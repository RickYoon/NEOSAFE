import axios from 'axios';
const { wallet } = require("@cityofzion/neon-js")

export const createMultiSig = async (publickeyArray, userAccount, chainProvier) => {
  try {

    // const publicKeys = [
    //   "027515faf05d1b7475db9c8e65b027a412722da79b6c356009deeb2e8b0c7da5ec",
    //   "0234a60bb65d7fc3470752fb051892909268d2a5c8f58013a5ff377304362ad30"
    // ];

    const threshold = 2;

    const walletAccount = await wallet.Account.createMultiSig(threshold, publickeyArray)

    const dbstyleData = {
      "publicKey": userAccount,
      "chain": chainProvier,
      "smartWallets": [walletAccount]
    }

    // 저장을 할 때, 간단하게, smartaccount address / signer 1 / signer 2 가 들어가야함.

    var config = {
      method: 'post',
      url: 'https://blqkysq4r3.execute-api.ap-northeast-2.amazonaws.com/production/updatewallets',
      headers: { 
        'Content-Type': 'application/json'
      },
      data : dbstyleData
    };

    await axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });


    return walletAccount;

  } catch (e) {

    // console.log("e",e)
    alert("Failed to create multi-sig wallet : check public key")
    // throw new Error("Failed to create multi-sig wallet");

  }
};