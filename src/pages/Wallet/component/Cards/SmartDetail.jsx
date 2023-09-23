import {useState} from "react";
import Neon, { wallet,api } from "@cityofzion/neon-js";

const SmartDetail = ({ smartWallet, isSmartSelected, handleSmartSelect }) => {

  const containerClassName = isSmartSelected
  ? 'rounded-xl shadow-lg bg-white lg:border-2 border-blue-600'
  : 'rounded-xl shadow-lg bg-white lg:border border-gray-100';

  const buttonClassName = isSmartSelected
    ? 'mt-5 w-full text-white bg-gray-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-3 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'
    : 'cursor-pointer mt-5 w-full text-white bg-primary-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-3 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800';


  return (
    <div>
      <div className={containerClassName} style={{ marginTop: '50px', width: '500px'}}>
        <div className="py-8 px-8">
          <div className="max-w-sm mx-auto lg:max-w-none">

            <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            🔐 2-FA Secure Wallet
            </h1>

            <div className="mt-5">
              <div className="pb-3 text-xm font-bold leading-tight tracking-tight text-gray-900 md:text-1xl dark:text-white">Account Information</div>

              <ul>
              <li className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                  <div className="text-sm">Auth</div>
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-100 ml-2">Google Auth + Device + Neoline</div>
                </li>
                <li className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                  <div className="text-sm">Wallet Address</div>
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-100 ml-2">{smartWallet.address}</div>
                </li>
              </ul>

              <div className="pb-3 pt-5 text-xm font-bold leading-tight tracking-tight text-gray-900 md:text-1xl dark:text-white">Security Information</div>

              <ul>
                <li className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                  <div className="text-sm">Security level</div>
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-100 ml-2">2</div>
                </li>
                <li className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                  <div className="text-sm">Security Tech</div>
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-100 ml-2">Multi-sig</div>
                </li>
                <li className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                  <div className="text-sm">Signer 1</div>
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-100 ml-2">{smartWallet.firstSigner}</div>
                </li>
                <li className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                  <div className="text-sm">Signer 2</div>
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-100 ml-2">NV6b5AbWRDzbg4esbAdigWnG73ytcUJapm</div>
                </li>
              </ul>

              <div
                className={buttonClassName}
                onClick={handleSmartSelect}
                >
                {isSmartSelected ? 'Selected' : 'Select'}
              </div>
              
            </div>
          </div>
        </div>
      </div>              
    </div>
  );
};

export default SmartDetail;
