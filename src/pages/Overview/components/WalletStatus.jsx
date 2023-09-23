import React from 'react';
import Styled, { keyframes } from 'styled-components';

function WalletStatus(props) {

  const { walletBalance, priceList, makeSendModal, isLoading } = props;

  // console.log( "walletBalance" , walletBalance.walletBalance.balance )
  console.log("priceList",priceList)
  
  function calculateTokenBalance(amount, decimal) {
    // 토큰 양을 소수 자릿수로 나누어서 계산
    const balance = amount / Math.pow(10, decimal);

    return balance;
    
  }

  // https://min-api.cryptocompare.com/data/pricemulti?fsyms=NEO,GAS&tsyms=USD
  
  return (
    // 
    <div className="border items-start p-4 rounded-xl shadow-lg bg-white transition duration-300 ease-in-out">
      <header className="px-5 py-4">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">In wallet</h2>
      </header>

      <div className="p-3">
        <div className="overflow-x-auto">
          <table className="table-auto w-full dark:text-slate-300">
            <thead className="text-xs uppercase text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-700 dark:bg-opacity-50 rounded-sm">
              <tr>
                <th className="p-3">
                  <div className="font-semibold text-left">TokenName</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">TokenPrice</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">TokenBalance</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">Value ($)</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">Action</div>
                </th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium divide-y divide-slate-100 dark:divide-slate-700">
            {isLoading ?
            <>
              <tr>
                <td className="p-3">
                  <div className="flex items-center">
                  <SmallSkeleton style={{marginLeft:"-5px"}} width="100px" height="20px" />
                  </div>
                </td>
                <td className="p-2">
                  <div className="text-center"><SmallSkeleton style={{marginLeft:"-5px"}} width="100px" height="20px" /></div>                
                </td>
                <td className="p-2">
                  <div className="text-center"><SmallSkeleton style={{marginLeft:"-5px"}} width="100px" height="20px" /></div>                
                </td>
                <td className="p-2">
                  <div className="text-center"><SmallSkeleton style={{marginLeft:"-5px"}} width="100px" height="20px" /></div>                
                </td>
                <td className="p-2">
                  <div className="text-center"><SmallSkeleton style={{marginLeft:"-5px"}} width="100px" height="20px" /></div>                
                </td>
              </tr>
              <tr>
              <td className="p-3">
                <div className="flex items-center">
                <SmallSkeleton style={{marginLeft:"-5px"}} width="100px" height="20px" />
                </div>
              </td>
              <td className="p-2">
                <div className="text-center"><SmallSkeleton style={{marginLeft:"-5px"}} width="100px" height="20px" /></div>                
              </td>
              <td className="p-2">
                <div className="text-center"><SmallSkeleton style={{marginLeft:"-5px"}} width="100px" height="20px" /></div>                
              </td>
              <td className="p-2">
                <div className="text-center"><SmallSkeleton style={{marginLeft:"-5px"}} width="100px" height="20px" /></div>                
              </td>
              <td className="p-2">
                <div className="text-center"><SmallSkeleton style={{marginLeft:"-5px"}} width="100px" height="20px" /></div>                
              </td>
            </tr>
            </>
              :
              walletBalance.balance.map((token, index) => (
              <tr>
                <td className="p-3">
                  <div className="flex items-center">
                    <img src={`https://lend-main.flamingo-n3-testnet.pages.dev/img/tokens/circle/${token.symbol}.svg`} width="36" height="36"/>
                    <div className="ml-3 text-slate-800 dark:text-slate-100">{token.symbol}</div>
                  </div>
                </td>
                <td className="p-2">
                {token.symbol === "bNEO" ?
                  <div className="text-center text-xm">{priceList["NEO"]}</div>
                  :
                  <div className="text-center text-xm">{priceList[token.symbol]}</div>
                  }
                </td>
                <td className="p-2">
                  <div className="text-center">{calculateTokenBalance(token.amount, token.decimals)}</div>
                </td>
                <td className="p-2">
                  {token.symbol === "bNEO" ?
                  <div className="text-center ">{(priceList["NEO"] * calculateTokenBalance(token.amount, token.decimals)).toFixed(2)}</div>
                  :
                  <div className="text-center">{(priceList[token.symbol] * calculateTokenBalance(token.amount, token.decimals)).toFixed(2)}</div>
                  }
                </td>
                <td className="p-2" onClick={() => makeSendModal({symbol:token.symbol, maxAmount:calculateTokenBalance(token.amount, token.decimals), token})}>
                  <div className="text-center text-sky-500 cursor-pointer">Send</div>
                </td>
              </tr>
              ))}

            </tbody>
          </table>
        </div>
      </div>
    </div>
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


export default WalletStatus;
