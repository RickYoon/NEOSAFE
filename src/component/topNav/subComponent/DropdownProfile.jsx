import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import {Link} from "react-router-dom"
import {CopyToClipboard} from "react-copy-to-clipboard/src";


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Example({ logout, userAccount, baseAddress }) {  

  const onClick = () => {
    logout();
  }

  const handleCopyClipBoard = async (userAccount) => {
    try {
      await navigator.clipboard.writeText(userAccount);      
      alert('address Copyed');
    } catch (error) {
      alert('copy address');
    }
  };

  function shortenEthereumAddress(address) {
    if (!address.startsWith("0x") || address.length !== 42) {
      // throw new Error("Invalid Ethereum address format");
    }
    
    const shortenedAddress = address.slice(0, 6) + "..." + address.slice(-4);
    return shortenedAddress;
  }
  

  

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button class="text-white ml-1 bg-blue-700 hover:bg-gray-100 border border-gray-200 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center">       
        {userAccount === baseAddress ? <></> : <>🔐</> }        
        {'  '}{shortenEthereumAddress(userAccount)}
        <svg
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
        </svg>
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
          <Menu.Item>
              {({ active }) => (
                <button
                onClick={() => handleCopyClipBoard(userAccount)}
                className={classNames(
                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                  'block w-full px-4 py-2 text-left text-sm'
                )}
              >
                Copy Address
              </button>
              )}
            </Menu.Item>          <hr />
            <Menu.Item>
              {({ active }) => (
                <Link 
                  to="/wallet"
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm'
                  )}
                >
                  Account Settings
                </Link>
              )}
            </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={onClick}
                    className={classNames(
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'block w-full px-4 py-2 text-left text-sm'
                    )}
                  >
                    Sign out
                  </button>
                )}
              </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

// import React, { useState, useRef, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// // import Transition from '../utils/Transition';

// // import UserAvatar from '../images/user-avatar-32.png';

// function DropdownProfile({
//   align
// }) {

//   const [dropdownOpen, setDropdownOpen] = useState(false);

//   const trigger = useRef(null);
//   const dropdown = useRef(null);

//   // close on click outside
//   useEffect(() => {
//     const clickHandler = ({ target }) => {
//       if (!dropdown.current) return;
//       if (!dropdownOpen || dropdown.current.contains(target) || trigger.current.contains(target)) return;
//       setDropdownOpen(false);
//     };
//     document.addEventListener('click', clickHandler);
//     return () => document.removeEventListener('click', clickHandler);
//   });

//   // close if the esc key is pressed
//   useEffect(() => {
//     const keyHandler = ({ keyCode }) => {
//       if (!dropdownOpen || keyCode !== 27) return;
//       setDropdownOpen(false);
//     };
//     document.addEventListener('keydown', keyHandler);
//     return () => document.removeEventListener('keydown', keyHandler);
//   });

//   return (
//     <div className="relative inline-flex">
//       <button
//         ref={trigger}
//         className="inline-flex justify-center items-center group"
//         aria-haspopup="true"
//         onClick={() => setDropdownOpen(!dropdownOpen)}
//         aria-expanded={dropdownOpen}
//       >
//         {/* <img className="w-8 h-8 rounded-full" src={UserAvatar} width="32" height="32" alt="User" /> */}
//         <div className="flex items-center truncate">
//           <span className="truncate ml-2 text-sm font-medium dark:text-slate-300 group-hover:text-slate-800 dark:group-hover:text-slate-200">Acme Inc.</span>
//           <svg className="w-3 h-3 shrink-0 ml-1 fill-current text-slate-400" viewBox="0 0 12 12">
//             <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
//           </svg>
//         </div>
//       </button>

//       {/* <Transition
//         className={`origin-top-right z-10 absolute top-full min-w-44 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-1.5 rounded shadow-lg overflow-hidden mt-1 ${align === 'right' ? 'right-0' : 'left-0'}`}
//         show={dropdownOpen}
//         enter="transition ease-out duration-200 transform"
//         enterStart="opacity-0 -translate-y-2"
//         enterEnd="opacity-100 translate-y-0"
//         leave="transition ease-out duration-200"
//         leaveStart="opacity-100"
//         leaveEnd="opacity-0"
//       > */}
//         <div
//           ref={dropdown}
//           onFocus={() => setDropdownOpen(true)}
//           onBlur={() => setDropdownOpen(false)}
//         >
//           <div className="pt-0.5 pb-2 px-3 mb-1 border-b border-slate-200 dark:border-slate-700">
//             <div className="font-medium text-slate-800 dark:text-slate-100">Acme Inc.</div>
//             <div className="text-xs text-slate-500 dark:text-slate-400 italic">Administrator</div>
//           </div>
//           <ul>
//             <li>
//               <Link
//                 className="font-medium text-sm text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center py-1 px-3"
//                 to="/settings"
//                 onClick={() => setDropdownOpen(!dropdownOpen)}
//               >
//                 Settings
//               </Link>
//             </li>
//             <li>
//               <Link
//                 className="font-medium text-sm text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center py-1 px-3"
//                 to="/signin"
//                 onClick={() => setDropdownOpen(!dropdownOpen)}
//               >
//                 Sign Out
//               </Link>
//             </li>
//           </ul>
//         </div>
//       {/* </Transition> */}
//     </div>
//   )
// }

// export default DropdownProfile;