import React from 'react';
import Styled, { keyframes } from 'styled-components';

function WalletInout(props) {

  const { walletBalance, priceList, makeSendModal, isLoading, history } = props;

  // console.log( "walletBalance" , walletBalance.walletBalance.balance )
  console.log("priceList",priceList)
  
  function calculateTokenBalance(amount, decimal) {
    // 토큰 양을 소수 자릿수로 나누어서 계산
    const balance = amount / Math.pow(10, decimal);

    return balance;
    
  }
  function formatISO8601ToCustomFormatWithoutGMT(isoDateString) {
    const date = new Date(isoDateString);
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    };
    const customFormatDate = date.toLocaleDateString('en-US', options);
    return customFormatDate;
  }
  

  // https://min-api.cryptocompare.com/data/pricemulti?fsyms=NEO,GAS&tsyms=USD
  
  return (
    // 
    <div className="border items-start p-4 rounded-xl shadow-lg bg-white transition duration-300 ease-in-out">
      <header className="px-5 py-4">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">History</h2>
      </header>


      <div className="p-3">
        <div className="overflow-x-auto">
          {/* <DashboardCard11 /> */}
          <div>
          {/* <header className="text-xs uppercase text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-700 dark:bg-opacity-50 rounded-sm font-semibold p-2">Today</header> */}
          <ul>


          
                    
                    {/* <div id="downshift-36-menu" role="listbox" aria-labelledby="downshift-36-label" class="nz4fo00" style="visibility: hidden; display: flex; flex-direction: column; position: absolute; width: 480px; z-index: var(--dropdown-menu-index); padding-top: 0px; padding-bottom: 8px; top: calc(100% + 4px); left: -12px; background-color: var(--z-index-1); box-shadow: var(--elevation-200); max-height: 50vh; overflow: hidden;"><div style="padding: 12px 20px 20px; position: sticky; width: 100%; top: 0px; background-color: var(--z-index-1); z-index: 1;"><div class="SearchInput__Wr-sc-15wgvpl-3 hZdLLk"><span class="SearchInput__LeadingIcon-sc-15wgvpl-1 ihUaxk"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 24px; height: 24px; color: var(--neutral-700);"><circle cx="10" cy="10" r="6" stroke="currentColor" stroke-width="2"></circle><path d="M14.5 14.5l5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></span><input id="downshift-36-input" aria-autocomplete="list" aria-controls="downshift-36-menu" aria-labelledby="downshift-36-label" autocomplete="off" placeholder="Search..." class="SearchInput__Input-sc-15wgvpl-0 jKfYAl" value=""><button type="button" class="SearchInput__ClearButton-sc-15wgvpl-2 RePrD" style="display: none;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 18c3.282 0 6-2.718 6-6 0-3.276-2.723-6-6.006-6C8.718 6 6 8.724 6 12c0 3.282 2.724 6 6 6zm-2.112-3.388a.498.498 0 01-.494-.5c0-.136.053-.253.147-.341l1.759-1.765-1.759-1.765a.448.448 0 01-.147-.341c0-.27.224-.488.494-.488.141 0 .253.053.341.147l1.765 1.759 1.777-1.765a.449.449 0 01.34-.153c.277 0 .495.224.495.494a.426.426 0 01-.147.341l-1.765 1.77 1.759 1.754a.484.484 0 01.147.353.495.495 0 01-.847.353L11.994 12.7l-1.753 1.765a.475.475 0 01-.353.147z" fill="var(--primary)"></path></svg></button></div></div></div></div></div><div kind="h/5_med" color="currentColor" class="UIText-sc-96tl0y-0 hrMWtP"><input id="buy" type="number" class="UnstyledInput-sc-1k7ufoi-0 ikGXXm e7qsc50 _1YYmc" placeholder="0" title="" autocomplete="off" value=""></div></div><div class="shared__HStack-sc-1qg837v-1 cCMTXM"><div kind="body/s_reg" color="ver(--neutral-600)" class="UIText-sc-96tl0y-0 JfCcn"><div class="shared__HStack-sc-1qg837v-1 kQUltc"><div kind="body/s_reg" color="var(--neutral-600)" class="UIText-sc-96tl0y-0 JfCeH">Balance:</div><button type="button" class="UnstyledButton__UnstyledButtonElement-sc-1d365uh-0 jGTdft"><div kind="body/s_reg" color="var(--primary)" class="UIText-sc-96tl0y-0 jmuVlh">1.999&nbsp;</div></button></div></div><div kind="body/s_reg" color="ver(--neutral-600)" class="UIText-sc-96tl0y-0 JfCcn"></div></div></div></fieldset> */}
            

          {history.map((token, index) => (          
            <li className="flex px-2">
                {token.type === "send" ?
                <div className="w-9 h-9 rounded-full shrink-0 bg-emerald-500 my-2 mr-3">
                <svg className="w-9 h-9 fill-current text-emerald-50" viewBox="0 0 36 36">
                  <path d="M18.3 11.3l-1.4 1.4 4.3 4.3H11v2h10.2l-4.3 4.3 1.4 1.4L25 18z" />
                </svg>  
                </div>  
                :                
                <div className="w-9 h-9 rounded-full shrink-0 bg-blue-500 my-2 mr-3">
                <svg className="w-9 h-9 fill-current text-rose-50" viewBox="0 0 36 36">
                  <path d="M17.7 24.7l1.4-1.4-4.3-4.3H25v-2H14.8l4.3-4.3-1.4-1.4L11 18z" />
                </svg>
              </div>      
                }

              <div className="grow flex items-center border-b border-slate-100 dark:border-slate-700 text-sm py-2">
                <div className="grow flex justify-between">
                  <div className="self-center">
                    <div className="font-medium text-slate-400 hover:text-slate-900 dark:text-slate-100 dark:hover:text-white" href="#0">
                      {token.type === "send" ? <>{token.to}</> : <>{token.from === "" ? "minting" : token.from}</> }
                      <div className="text-gray-400">{formatISO8601ToCustomFormatWithoutGMT(token.block_time_kst)}</div>
                    </div> 
                  </div>
                  <div className="flex flex-row alignitem-center self-center shrink-0 self-start ml-2" style={{height:"50px"}}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                      <img src={`https://lend-main.flamingo-n3-testnet.pages.dev/img/tokens/circle/${token.symbol}.svg`} width="36" height="36"/>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                      {token.type === "send" ? "-" : "+"
                      }
                        {token.amount} {token.symbol}
                      </div>
                  </div>
                </div>
              </div>
            </li>
            ))}

          </ul>
        </div>


        </div>
      </div>
    </div>
  );
}

{/* <li className="flex px-2">
<div className="w-9 h-9 rounded-full shrink-0 bg-emerald-500 my-2 mr-3">
  <svg className="w-9 h-9 fill-current text-emerald-50" viewBox="0 0 36 36">
    <path d="M18.3 11.3l-1.4 1.4 4.3 4.3H11v2h10.2l-4.3 4.3 1.4 1.4L25 18z" />
  </svg>
</div>
<div className="grow flex items-center border-b border-slate-100 dark:border-slate-700 text-sm py-2">
  <div className="grow flex justify-between">
    <div className="self-center"><a className="font-medium text-slate-800 hover:text-slate-900 dark:text-slate-100 dark:hover:text-white" href="#0">Cruip.com</a> Market Ltd 70 Wilson St London</div>
    <div className="shrink-0 self-start ml-2">
      <span className="font-medium text-emerald-500">+249.88</span>
    </div>
  </div>
</div>
</li> */}

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


export default WalletInout;
