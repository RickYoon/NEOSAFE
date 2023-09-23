import React from 'react';

function SelectSignerModal({ handleCredential, isModalOpen, handleModal, secondAddress, handleLoadingModal, isNeolineSelected, publicKey, isSecondAddressLoading}) {


  console.log("secondAddress",secondAddress)
  return (
    isModalOpen ? (
      <>
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
          <div className="relative w-full max-w-md max-h-full">
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                <h3 className="text-2xl font-semibold">
                  Create Secure Account
                </h3>
                <button onClick={handleModal}>
                  <span className="bg-transparent text-black opacity-1 h-6 w-6 text-2xl block outline-none focus:outline-none">
                    ×
                  </span>
                </button>
              </div>

              <div class="p-6">
                <p class="text-sm font-normal text-gray-500 dark:text-gray-400">First Signer publickey</p>
                <ul class="my-4 space-y-3">
                  <li>
                    <div class="flex items-center p-3 text-base text-gray-900 rounded-lg bg-gray-50 text-left">
                      <img src="https://static-00.iconduck.com/assets.00/google-icon-2048x2048-czn3g8x8.png" alt="Google Auth Icon" class="ml-3 h-5" />
                      <div class="ml-5">{publicKey.slice(0,30)}...</div>
                    </div>
                  </li>
                </ul>
                <p class="text-sm font-normal text-gray-500 dark:text-gray-400">Insert Second Signer publickey</p>
                <ul class="my-4 space-y-3">
                    
                  <li>

                    {isNeolineSelected ?
                      <div class="flex items-center justify-between p-3 text-base text-gray-900 rounded-lg bg-blue-100">
                        <div class="flex flex-row">
                          <img src="https://play-lh.googleusercontent.com/TObkXJ6AbaWuE-oEYnfxH4fT6wsZvZTxa2O0hD4AHt2AQnAz6U9qFQ6CHqtijA7aaA" alt="Google Auth Icon" class="ml-3 h-5" />
                          <span class="ml-5">{secondAddress.slice(0,30)}...</span>
                        </div>                        
                      </div>
                      :
                      <div class="flex items-center justify-between p-3 hover:font-bold text-base text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                        <div class="flex flex-row">
                          <img src="https://play-lh.googleusercontent.com/TObkXJ6AbaWuE-oEYnfxH4fT6wsZvZTxa2O0hD4AHt2AQnAz6U9qFQ6CHqtijA7aaA" alt="Google Auth Icon" class="ml-3 h-5" />
                          <span class="ml-5">{isSecondAddressLoading ? <>Loading...</>: <></>}</span>
                        </div>
                        <div class="ml-3 pr-3">
                          <button class="bg-blue" onClick={handleCredential}>
                            <span class="opacity-0 group-hover:opacity-100 transition-opacity">Select</span>
                          </button>
                        </div>
                      </div>
                    }
                  </li>
                </ul>
                <div class="mt-10"></div>
                {secondAddress.length === 0 ?
                  <div class="w-full items-center p-3 text-white font-bold text-gray-900 rounded-lg bg-primary-100 hover:bg-primary-200 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                    <div style={{textAlign:"center"}}>Create Wallet</div>
                  </div>
                  :isSecondAddressLoading ?
                  <button class="w-full items-center p-3 text-white font-bold text-gray-900 rounded-lg bg-primary-300 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                    <div onClick={handleLoadingModal} class="flex flex-row justify-center">
                    <svg aria-hidden="true" class="w-6 h-6 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                    Waiting for Multi-sig Wallet Creation</div>
                  </button>                         
                  :
                  <button class="w-full items-center p-3 text-white font-bold text-gray-900 rounded-lg bg-primary-500 hover:bg-primary-800 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                    <div onClick={handleLoadingModal} style={{textAlign:"center"}}>Create Wallet</div>
                  </button>                         
                }
              </div>
            </div>
          </div>
        </div>
        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
      </>
    ) : null
  );
}

export default SelectSignerModal;