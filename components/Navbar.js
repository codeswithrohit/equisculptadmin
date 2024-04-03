import React, { useState } from "react";
import { useRouter } from 'next/router';
import { firebase } from '../Firebase/config'; // Import Firebase auth instance

export default function Index() {
  const [show, setShow] = useState(true);
  const router = useRouter();

    const handleLogout = async () => {
      try {
        await firebase.auth().signOut(); // Logout user from Firebase
        router.push('/login'); // Redirect to login page
      } catch (error) {
        console.error('Error logging out:', error);
        // Handle error during logout if needed
      }
    };
    return (
        <div>
            <div className=" bg-indigo-700 rounded-r shadow xl:hidden flex justify-between w-full p-6 items-center border-b border-transparent sm:border-gray-200 ">
                <button className="flex text-white hover:text-indigo-200 focus:outline-none focus:text-indigo-200 justify-between  items-center space-x-3">
                   
                    <p className="text-2xl leading-6 ">Equisculpt Admin</p>
                </button>
                <div aria-label="toggler" className="flex justify-center items-center">
                    <button id="open" aria-label="open" onClick={() => setShow(!show)} className={`${show ? "" : "hidden"} focus:outline-none focus:ring-2 `}>
                        <svg className="text-indigo-200" width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 6H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M4 12H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M4 18H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <button id="close" aria-label="close" onClick={() => setShow(!show)} className={`${show ? "hidden" : ""} focus:outline-none focus:ring-2  `}>
                        <svg className="text-indigo-200" width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M6 6L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>

            <div id="Main" className={`${show ? "-translate-x-full" : "translate-x-0"} bg-indigo-700 transform  xl:translate-x-0 shadow xl:rounded-r fixed h-full top-22 sm:z-20 bg-white  ease-in-out transition duration-500 flex justify-start items-start w-full sm:w-64 flex-col `}>
                <button className="hidden focus:outline-none hover:text-indigo-200 focus:text-indigo-200 text-white sm:flex justify-start p-6 items-center space-x-3  w-full">
                  
                    <p className="text-2xl leading-6 ">Equisculpt Admin</p>
                </button>
                <button className="focus:outline-none focus:text-white  focus:bg-indigo-900 flex justify-between  sm:w-auto items-center space-x-10 text-white mx-6  p-3 rounded hover:bg-indigo-900 bg-indigo-800 ">
                    <div className="flex justify-start  sm:w-auto items-center space-x-2">
                        <div>
                            <img src="https://i.ibb.co/G2sDV5X/Ellipse-2-4.png" alt="avatar" />
                        </div>
                        <div className="flex  flex-col justify-start space-y-1 items-center ">
                            <p className="text-base leading-4 text-white">Admin</p>
                        </div>
                    </div>
                    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M13 18L19 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M13 6L19 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <div class="fixed flex flex-col top-0 left-0 w-64 bg-white h-full border-r">
            <div class="flex items-center justify-center h-14 border-b">
            <a href="/" className="flex-shrink-0 w-36 ml-2 h-12 inline-flex items-center justify-center">
            <p className="text-md font-bold leading-6 ">Equisculpt Admin</p>
    </a>
            </div>
            <div class="overflow-y-auto overflow-x-hidden flex-grow">
              <ul class="flex flex-col py-4 space-y-1">
              
                <li>
                  <a href="/" class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate">Dashboard</span>
                  </a>
                </li>
                <li>
                  <a href="/AddPortfolio" class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate">Add Portfolio</span>
                  </a>
                </li>
                <li>
                  <a href="/orders" class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate">Orders</span>
                  </a>
                </li>
                
            
                
                
                <li>
                  <button onClick={handleLogout}   class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    </span>
                    <span class="ml-2 text-sm tracking-wide truncate">Logout</span>
                  </button >
                </li>
              </ul>
            </div>
          </div>
            </div>
        </div>
    );
}

