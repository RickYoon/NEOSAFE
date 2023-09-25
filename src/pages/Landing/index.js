import React, {useEffect} from 'react';
import { useDispatch , useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { walletManageModalOpen } from 'redux/reducers/WalletActions'

import neoLogo from 'assets/logos/NEO.svg'
import socialOnboarding from "assets/Landing/SocialOnboarding.svg"
import multichainImage from 'assets/Landing/multichain.png';
import securityImage from 'assets/Landing/security.png'; 

function Landing() {

  const navigate = useNavigate();
  const userAccount = useSelector(state => state.account) // 지갑주소
  const dispatch = useDispatch();

  useEffect(() => {

    if(userAccount !== "") {
        navigate("/wallet")
    }

  }, [userAccount]);

  const walletOpen = async () => {
    dispatch(walletManageModalOpen())
  }

  return (
    <>

    <section className="pt-20 bg-gradient-to-r from-green-100 to-blue-200" 
            style={{minHeight:"calc(100vh - 350px)"}}>

        <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">

            <h1 class="mb-4 text-6xl font-extrabold tracking-tight leading-none text-gray-900 dark:text-white">
                Manage Your Assets 
                <span class="block mb-4 mt-4">
                easily and securely
                </span>
            </h1>

            <p class="mb-8 text-2xl font-normal text-gray-500 dark:text-gray-400">
                <span class="block mb-4 mt-8">
                We assist you with every aspect of your crypto investment journey.
                </span>
            </p>

            <div class="pt-3 pb-10 flex flex-col mb-0 lg:mb-0 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
                <div onClick={walletOpen} class="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900 cursor-pointer">
                    Connect
                    <svg class="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                </div>
            </div>
            <div class="px-4 pb-8 mx-auto text-center md:max-w-screen-md lg:max-w-screen-lg lg:px-36">
                <span class="font-semibold text-gray-400 uppercase">Connected </span>
                <div class="pt-5 items-center mt-8 text-gray-500 flex justify-center">
                    <img src={neoLogo} alt="Logo" class="h-10"/>
                </div>
            </div> 
        </div>
    </section>
    
    <section class="bg-white dark:bg-gray-900 pt-20">

        <div class="text-center">
            <h1 class="pt-10 pb-10 mb-4 text-4xl font-bold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-5xl dark:text-white">
                Why{" "}
                <span style={{color:"#03A688"}}>NEO</span>
                SAFE ?
            </h1>
        </div>


        <div class="gap-8 items-center py-8 px-4 mx-auto max-w-screen-xl xl:gap-16 md:grid md:grid-cols-2 sm:py-16 lg:px-6">
            <div>
                <img src={socialOnboarding} alt="Logo" class="h-30" />
            </div>
            <div class="mt-4 md:mt-0">
                <h2 class="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Start your web3 journey effortlessly</h2>
                <p class="mb-6 font-light text-gray-500 md:text-lg dark:text-gray-400">We support social Login like web2 services<br /> You don't need to create and manage a wallet from scratch.</p>
            </div>
        </div>

    </section>

    <section class="bg-white dark:bg-gray-900">
        <div class="gap-8 items-center py-8 px-4 mx-auto max-w-screen-xl xl:gap-16 md:grid md:grid-cols-2 sm:py-16 lg:px-6">
        <div class="ml-10 mt-4 md:mt-0">
                <h2 class="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">No more stress from key management</h2>
                <p class="mb-6 font-light text-gray-500 md:text-lg dark:text-gray-400">With MPC and 2FA technology <br /> you can have peace of mind even in the event of key theft or loss.</p>
            </div>
            <img src={securityImage} alt="Multichain Logo" />
        </div>
    </section>
    <section class="bg-white pt-10 pb-20" style={{paddingBottom:"100px"}}>
        <div class="gap-8 items-center py-8 px-4 mx-auto max-w-screen-xl xl:gap-16 md:grid md:grid-cols-2 sm:py-16 lg:px-6">
            <img src={multichainImage} alt="Multichain Logo" style={{width:"450px", marginLeft:"50px"}} />
            <div class="mt-4 md:mt-0">
                <h2 class="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">No more Install wallets</h2>
                <p class="mb-6 font-light text-gray-500 md:text-lg dark:text-gray-400">
                    We provide a web-based wallet,<br/>eliminating the need for users to install a wallet.
                </p>
            </div>
        </div>
    </section>

    <footer class="bg-gradient-to-r from-green-100 to-blue-200">
        <div class="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
        <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023  
            <a href="https://linkrypto.io/" class="hover:underline">{"  "}NEOSAFE</a>. All Rights Reserved.
        </span>
        <ul class="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
            <li>
                <a href="#" class="hover:underline">Contact : purevalleylabs@gmail.com</a>
            </li>
        </ul>
        </div>
    </footer>
    </>
    
  );
}

export default Landing;

