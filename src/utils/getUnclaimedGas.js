import { rpc, u } from '@cityofzion/neon-js'

async function UnClaimedGas (address,rpcURL) {

    const rpcClient = new rpc.RPCClient(rpcURL)

    try {
      const query = {
        method: 'getunclaimedgas',
        params: [address],
      }

      const response = await rpcClient.execute(new rpc.Query(query))

      const { unclaimed } = response

      // console.log("address",u.BigInteger.fromNumber(unclaimed).toDecimal(8),)

      return {
        total: u.BigInteger.fromNumber(unclaimed).toDecimal(8),
      }
    } catch (err){
        // console.log("err", err)
    }
}
export default UnClaimedGas;
// module.exports = {
//     UnClaimedGas, // 필요한 다른 함수도 필요에 따라 내보낼 수 있습니다.
// };
  