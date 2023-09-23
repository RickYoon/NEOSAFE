
import React, { useState,useEffect } from 'react';
import { initWalletConnect, signClient } from 'utils/WalletConnectUtil'


const AccountCard = ({ sessionList, idx, updateParentState, selected }) => {

    const timestamp = sessionList.expiry * 1000; // Multiply by 1000 to convert to milliseconds

    const date = new Date(timestamp);

    const options = {
    timeZone: 'Asia/Seoul', // KST time zone
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false, // Use 24-hour format
    };

    const kstFormatted = date.toLocaleString('en-US', options);

    console.log(kstFormatted);

    // const [isSelected, setIsSelected] = useState(false);

    const handleCardClick = () => {
        console.log("idx",idx)
        updateParentState(idx)
    };  

      // Handle deletion of a session
    async function onDeleteSession() {
        // console.log("sessionList",sessionList)
        await signClient.disconnect({ topic : sessionList.topic})
    }

    return (
      <div className="space-y-2 pb-5">

      <div
        className={`account-card ${selected ? 
            'border border-blue-600 cursor-pointer flex items-start p-4 rounded-xl shadow-lg bg-white hover:bg-blue-50 transition duration-300 ease-in-out' : 
            'cursor-pointer flex items-start p-4 rounded-xl shadow-lg bg-white hover:bg-blue-50 transition duration-300 ease-in-out'}`}
        onClick={handleCardClick}
        >
        {/* <div class="border border-blue-300 cursor-pointer flex items-start p-4 rounded-xl shadow-lg bg-white hover:bg-blue-50 transition duration-300 ease-in-out"> */}
            <div class="flex items-center justify-center bg-white h-12 w-12 rounded-full border border-blue-100">
                <img src={sessionList.peer.metadata.icons[0]} alt="Add Wallet" className="h-7 w-7 text-blue-800" />
            </div>

            <div class="ml-4">
                <h2 class="font-semibold">
                {sessionList.peer.metadata.name}
                </h2>
                <p class="mt-2 text-sm text-gray-500">Connection Expire : {kstFormatted}</p>
                
            </div>
        </div>

      </div>
    );
  };
  
  export default AccountCard;