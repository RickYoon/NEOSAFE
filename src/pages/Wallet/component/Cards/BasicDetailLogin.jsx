import React, {useEffect} from 'react';
import { useDispatch , useSelector } from 'react-redux';
import Neon, { wallet,api }from "@cityofzion/neon-js";
import { walletManageModalOpen } from 'redux/reducers/WalletActions'

const BasicDetailLogin = ({ baseAddress, isBasicSelected, handleAccountSelect }) => {
  
  const dispatch = useDispatch();

  const containerClassName = isBasicSelected
  ? 'rounded-xl shadow-lg bg-white lg:border-2 border-blue-600'
  : 'rounded-xl shadow-lg bg-white lg:border border-gray-100';

  const buttonClassName = isBasicSelected
    ? 'mt-5 w-full text-white bg-gray-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-3 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'
    : 'cursor-pointer mt-5 w-full text-white bg-primary-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-3 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800';

    const walletOpen = async () => {
      dispatch(walletManageModalOpen())
    }

  return (
    <div>
      <div className={containerClassName} style={{ marginTop: '50px', width: '500px', height: '450px' }}>
        <div className="py-8 px-8">
          <div className="max-w-sm mx-auto lg:max-w-none">
          <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Base Wallet
          </h1>

            {/* Details */}
            <div className="mt-5">
              <div className="pb-3 text-xm font-bold leading-tight tracking-tight text-gray-900 md:text-1xl dark:text-white">Account Information</div>
              <ul>

                <li className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                  <div className="text-sm">Status</div>
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-100 ml-2"></div>
                </li>
                <li className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                  <div className="text-sm">Wallet Address</div>
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-100 ml-2">{baseAddress}</div>
                </li>
              </ul>
              <div className="pb-3 pt-5 text-xm font-bold leading-tight tracking-tight text-gray-900 md:text-1xl dark:text-white">Security Information</div>
              <ul>

                <li className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                  <div className="text-sm">Security level</div>
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-100 ml-2">-</div>
                </li>
                <li className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                  <div className="text-sm">Security Factor</div>
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-100 ml-2">-</div>
                </li>
              </ul>

              <div
                className={buttonClassName}
                onClick={walletOpen}
              >
                {isBasicSelected ? 'Connect' : 'Connect'}
              </div>

            </div>
            </div>
        </div>
      </div>
      
    </div>
  );
};

export default BasicDetailLogin;
