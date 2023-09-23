import { initWalletConnect, signClient } from 'utils/WalletConnectUtil'
import { getSdkError } from '@walletconnect/utils'


const BasicDetail = ({ sessionlist, selectedNum, onClick }) => {

  async function onDeleteSession() {
    try {
      await signClient.disconnect({ topic : sessionlist[selectedNum].topic, reason: getSdkError('USER_DISCONNECTED') })      
      await onClick()
    } catch (error) {
      console.log("error",error)
    }
  }

  return (
    <div>
              <div className="rounded-xl shadow-lg bg-white lg:border-t-10 lg:w-[450px]" style={{marginTop:"25px"}}>
                <div className="py-8 px-8">
                  <div className="max-w-sm mx-auto lg:max-w-none">
                  <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                    Session Detail
                  </h1>

                    {/* Details */}
                    <div className="mt-10">
                      <div className="pb-3 text-xm font-bold leading-tight tracking-tight text-gray-900 md:text-1xl dark:text-white">project</div>
                      <ul>
                        <li className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                          <div className="text-sm">Name</div>
                          <div className="text-sm font-medium text-slate-800 dark:text-slate-100 ml-2">{sessionlist[selectedNum].peer.metadata.name}</div>
                        </li>
                        <li className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                          <div className="text-sm">description</div>
                          <div className="text-sm font-medium text-slate-800 dark:text-slate-100 ml-2">{sessionlist[selectedNum].peer.metadata.description}</div>
                        </li>
                        <li className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                          <div className="text-sm">URL</div>
                          <div className="text-sm font-medium text-slate-800 dark:text-slate-100 ml-2">{sessionlist[selectedNum].peer.metadata.url}</div>
                        </li>
                        <li className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                          <div className="text-sm">Phishing</div>
                          <div className="text-sm font-medium text-slate-800 dark:text-slate-100 ml-2">No</div>
                        </li>
                      </ul>
                    </div>

                    <button onClick={onDeleteSession} class="mt-5 w-full text-white bg-red-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Delete</button>
                    </div>
                </div>
              </div>
            </div>
  );
};

export default BasicDetail;
