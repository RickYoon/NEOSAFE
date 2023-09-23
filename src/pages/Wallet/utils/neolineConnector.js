export const initNeoLine = async () => {
    try {
      // eslint-disable-next-line no-undef
      const instance = new NEOLineN3.Init();
      const account = await instance.getAccount();

      // eslint-disable-next-line no-undef
      const instance2 = new NEOLine.Init();
      const network = await instance2.getNetworks();

      console.log('account', account)

      const publicKey = await instance.getPublicKey();
      console.log('getPublicKey', publicKey)
  
      return {
        instance,
        account,
        network,
        publicKey
      };
    } catch (e) {
      throw new Error("Failed to connect NeoLine.");
    }
  };

