import React, { useState } from 'react';
import { useDispatch , useSelector } from 'react-redux';
import {changeChainProvider} from 'redux/reducers/WalletActions'

function ChainSelector({chainProvider, handleChangeChainProvider}) {
    
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const dispatch = useDispatch();

  return (
    <div>
     <button
        id="dropdownUsersButton"
        // onClick={toggleDropdown}
        className="mr-5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
      >
        {chainProvider}{' '}
        {/* <svg
          className="w-2.5 h-2.5 ml-2.5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg> */}
      </button>

      {isDropdownOpen?
          <div
        id="dropdownUsers"
        className="absolute mr-3 right-0 mt-2 w-60 bg-white border border-gray-300 rounded-md shadow-lg origin-top-right transform scale-100 transition duration-300" style={{ zIndex: 9999 }}>
       <ul>
       <li>
                <div onClick={() => dispatch(changeChainProvider("NEO-N3-MAIN"))} class="flex items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer">
                    <img class="w-6 h-6 mr-5 rounded-full" src="https://iconape.com/wp-content/png_logo_vector/neo-symbol.png" alt="Jese image" />
                    NEO-N3 (MAIN) {' '}
                    {chainProvider === "NEO-N3-MAIN" ?
                        <div style={{marginLeft:"10px"}}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                            >
                            <circle cx="8" cy="8" r="6" fill="#37FD12" />
                            </svg>
                        </div> 
                      :
                        <></>
                    }
                </div>
                </li>
            <li>
                <div onClick={() => dispatch(changeChainProvider("NEO-N3-TEST"))} class="flex items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer">
                    <img class="w-6 h-6 mr-5 rounded-full" src="https://iconape.com/wp-content/png_logo_vector/neo-symbol.png" alt="Jese image" />
                    NEO-N3 (TEST) {' '}
                    {chainProvider === "NEO-N3-TEST" ?
                        <div style={{marginLeft:"10px"}}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                            >
                            <circle cx="8" cy="8" r="6" fill="#37FD12" />
                            </svg>
                        </div> 
                      :
                        <></>
                    }
                </div>
                </li>

                <li>
                <div onClick={() => dispatch(changeChainProvider("NEO-EVM-TEST"))} class="flex items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer">
                    <img class="w-6 h-6 mr-5 rounded-full" src="https://iconape.com/wp-content/png_logo_vector/neo-symbol.png" alt="Jese image" />
                    NEO-EVM (TEST) {' '}
                    {chainProvider === "NEO-EVM-TEST" ?
                        <div style={{marginLeft:"10px"}}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                            >
                            <circle cx="8" cy="8" r="6" fill="#37FD12" />
                            </svg>
                        </div> 
                      :
                        <></>
                    }
                </div>
            </li>
            <hr />
            <li>
                <div class="ml-2 flex p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600 mt-1">
                <label class="relative inline-flex items-center w-full cursor-pointer">
                    <input type="checkbox" value="" class="sr-only peer" />
                    <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-500 peer-checked:bg-blue-600"></div>
                    <span class="ml-5 text-sm font-medium text-gray-900 dark:text-gray-300">Show Test Network</span>
                </label>
                </div>
            </li>
            
        </ul>
      </div>
        :
        <></>
    }
    </div>
  );
}

export default ChainSelector;
