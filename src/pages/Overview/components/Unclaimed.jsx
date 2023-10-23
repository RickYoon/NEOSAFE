import React from 'react';
// import { claimGas } from '../util/ClaimGasToken';


function Unclaimed(props) {

  const { unclaimedGas } = props;

  // // console.log( "walletBalance" , walletBalance.walletBalance.balance )
  // console.log("priceList",priceList)
  
  // function calculateTokenBalance(amount, decimal) {
  //   // 토큰 양을 소수 자릿수로 나누어서 계산
  //   const balance = amount / Math.pow(10, decimal);

  //   return balance;
    
  // }

  // https://min-api.cryptocompare.com/data/pricemulti?fsyms=NEO,GAS&tsyms=USD
  
  return (
    // 
    <div className="border items-start p-4 rounded-xl shadow-lg bg-white transition duration-300 ease-in-out">
      <header className="px-5 py-4">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">Invested</h2>
      </header>
      <div className="p-3">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full dark:text-slate-300">
            {/* Table header */}
            <thead className="text-xs uppercase text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-700 dark:bg-opacity-50 rounded-sm">
              <tr>
                <th className="p-3">
                  <div className="font-semibold text-left">Type</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">Claimable </div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">Action</div>
                </th>
              </tr>
            </thead>

            <tbody className="text-sm font-medium divide-y divide-slate-100 dark:divide-slate-700">
            
            <tr style={{height:"50px"}}>
                <td className="p-3">
                <div className="flex items-center"> Holding Neo</div>
                </td>
                <td className="p-2">
                <div className="text-center">{unclaimedGas} GAS</div>
                </td>

                <td className="p-2" style={{ textAlign: "center" }}>
                  <button class="items-center p-1 text-white font-bold text-gray-900 rounded-lg bg-primary-600 hover:bg-primary-600 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                    {/* <div onClick={claimGas} style={{textAlign:"center"}}>Claim Gas</div> */}
                  </button>
                </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Unclaimed;
