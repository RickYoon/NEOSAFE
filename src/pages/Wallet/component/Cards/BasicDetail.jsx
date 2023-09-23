import Neon, { wallet,api }from "@cityofzion/neon-js";

const BasicDetail = ({ baseAddress, isBasicSelected, handleAccountSelect }) => {
  
  const containerClassName = isBasicSelected
  ? 'rounded-xl shadow-lg bg-white lg:border-2 border-blue-600'
  : 'rounded-xl shadow-lg bg-white lg:border border-gray-100';

  const buttonClassName = isBasicSelected
    ? 'mt-5 w-full text-white bg-gray-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-3 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'
    : 'cursor-pointer mt-5 w-full text-white bg-primary-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-3 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800';

  const {email, typeOfLogin} = JSON.parse(localStorage.getItem("LoginInfo"))
  // console.log(localStorage.getItem("LoginInfo"))

  return (
    <div>
              <div className={containerClassName} style={{ marginTop: '50px', width: '500px' }}>
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
                          <div className="text-sm">Social</div>
                          <div className="text-sm font-medium text-slate-800 dark:text-slate-100 ml-2">{typeOfLogin} : {email}</div>
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
                          <div className="text-sm font-medium text-slate-800 dark:text-slate-100 ml-2">1 </div>
                        </li>
                        <li className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                          <div className="text-sm">Security Tech</div>
                          <div className="text-sm font-medium text-slate-800 dark:text-slate-100 ml-2">Key Sharing (MPC)</div>
                        </li>
                        <li className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                          <div className="text-sm">Key Sharing 1 / 2</div>
                          <div className="text-sm font-medium text-slate-800 dark:text-slate-100 ml-2">Google Auth</div>
                        </li>
                        <li className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                          <div className="text-sm">Key Sharing 1 / 2</div>
                          <div className="text-sm font-medium text-slate-800 dark:text-slate-100 ml-2">Device</div>
                        </li>
                      </ul>

                      <div
                        className={buttonClassName}
                        onClick={handleAccountSelect}
                      >
                        {isBasicSelected ? 'Selected' : 'Select'}
                      </div>
                      {/* <div class="mt-5 w-full text-white bg-gray-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-3 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                        Selected
                      </div> */}
                    </div>
                    </div>
                </div>
              </div>
              
            </div>
  );
};

export default BasicDetail;
