import React from 'react';
import { sendNeoToken } from '../../util/createMultiSigTransferMy';

function ReviewTransaction({ isReviewModalOpen, handleReviewModal }) {


  return (
    isReviewModalOpen ? (
      <>
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
          <div className="relative w-full max-w-md max-h-full">
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                <h3 className="text-2xl font-semibold">
                  Review and Sign Transaction
                </h3>
                <button onClick={handleReviewModal}>
                  <span className="bg-transparent text-black opacity-1 h-6 w-6 text-2xl block outline-none focus:outline-none">
                    ×
                  </span>
                </button>
              </div>

              <div class="p-6">
                <p class="text-sm font-normal text-gray-500 dark:text-gray-400">Select Token</p>
                <ul class="my-4 space-y-3">
                  {/* <li>
                    <div class="flex items-center p-3 text-base text-gray-900 rounded-lg bg-gray-50 text-left">
                      <>{sendStatus.symbol}</>
                    </div>
                  </li> */}
                </ul>
                <p class="text-sm font-normal text-gray-500 dark:text-gray-400">Insert Amount</p>                
                <ul class="my-4 space-y-3">
                  <li>
                    <div class="flex items-center p-3 text-base text-gray-900 rounded-lg bg-gray-50 text-left">
                      {/* <>{sendStatus.maxAmount}</> */}
                    </div>
                  </li>
                </ul>

                <p class="text-sm font-normal text-gray-500 dark:text-gray-400">Target Address</p>                
                <ul class="my-4 space-y-3">
                  <li>
                    <div class="flex items-center p-3 text-base text-gray-900 rounded-lg bg-gray-50 text-left">

                    </div>
                  </li>
                </ul>

                <button onClick={sendNeoToken} class="mt-5 w-full items-center p-3 text-white font-bold text-gray-900 rounded-lg bg-primary-500 hover:bg-primary-800 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                    <div style={{textAlign:"center"}}>Send</div>
                </button>

              </div>
            </div>
          </div>
        </div>
        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
      </>
    ) : null
  );
}

export default ReviewTransaction;