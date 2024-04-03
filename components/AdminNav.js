import React, { useState } from "react";

export default function Index() {
    const [showMenu, setShowMenu] = useState(false);
    const [showMenuSm, setShowMenuSm] = useState(false);
    const [search, setSearch] = useState(false);

    return (
        <div className="dark:white bg-white ">
            <div className="2xl:container 2xl:mx-auto md:py-5 lg:px-20 md:px-6 p-4">
                <div className="flex items-center justify-between">
                    <div className="lg:w-3/12">
                     
                        <button onClick={() => setShowMenu(true)} aria-label="Open Menu" className="text-gray-800 dark:text-white hidden md:block lg:hidden focus:outline-none focus:ring-2 focus:ring-gray-800 rounded">
                            <svg className="fill-stroke" width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 18L4 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M14 12L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M18 6L4 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                      
                    </div>
                    <div className="lg:w-6/12 flex flex-col justify-center items-center space-y-3.5">
                        <div aria-label="Luxiwood. Logo" role="img" className="cursor-pointer">
                           <h1 className="text-xl font-bold">Admin Arene</h1>
                        </div>
                        <div className="hidden lg:block">
                            <ul className="flex items-center space-x-10">
                                <li>
                                    <a href="/Admin/dashboard" className="dark:text-white dark:hover:text-gray-300 text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 hover:underline">
                                        Home
                                    </a>
                                </li>
                                <li>
                                    <a href="/Admin/addpg" className="dark:text-white dark:hover:text-gray-300 text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 hover:underline">
                                        Add PG
                                    </a>
                                </li>
                                <li>
                                    <a href="/Admin/addbuydata" className="dark:text-white dark:hover:text-gray-300 text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 hover:underline">
                                        Add Buy
                                    </a>
                                </li>
                                <li>
                                    <a href="javascript:void(0)" className="dark:text-white dark:hover:text-gray-300 text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 hover:underline">
                                        Orders
                                    </a>
                                </li>
                              
                            </ul>
                        </div>
                    </div>
                    <div className="lg:w-3/12 flex justify-end items-center space-x-4">
                        
                      
                        <button onClick={() => setShowMenuSm(true)} aria-label="open menu" className="text-gray-800 dark:text-white md:hidden focus:outline-none focus:ring-2 focus:ring-gray-800 rounded hover:bg-gray-100 p-0.5">
                            <svg className="fill-stroke" width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 6H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M10 12H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M6 18H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div id="md-menu" className={`${showMenu ? "md:block" : ""} hidden lg:hidden absolute z-10 inset-0 h-screen w-full dark:bg-gray-800 bg-gray-800 bg-opacity-70 dark:bg-opacity-70`}>
                    <div className="relative w-full h-screen">
                        <div className="absolute inset-0 w-1/2 bg-white dark:bg-gray-900 p-6 justify-center">
                            <div className="flex items-center justify-between border-b pb-4 border-gray-200 dark:border-gray-700">
                                <div className="flex items-center space-x-3 mx-2">
                                    <div>
                                        <svg className="fill-stroke text-gray-800 dark:text-white" width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M18.9984 19.0004L14.6484 14.6504" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <input type="text" placeholder="Search for Addpg" className="text-sm text-gray-600 dark:text-gray-300 focus:outline-none bg-transparent" />
                                </div>
                                <button onClick={() => setShowMenu(false)} aria-label="close menu" className="focus:outline-none focus:ring-2 focus:ring-gray-800">
                                    <svg className="fill-stroke text-gray-800 dark:text-white" width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 4L4 12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M4 4L12 12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>
                            <div className="mt-8">
                                <ul className="flex flex-col space-y-8">
                                    <li className="flex items-center justify-between">
                                        <a href="/Admin/dashboard" className="dark:text-white text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 hover:underline">
                                            Home
                                        </a>
                                        <button className="fill-stroke text-black dark:text-white" aria-label="show options">
                                            <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 6L8 10L4 6" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    </li>
                                    <li className="flex items-center justify-between">
                                        <a href="/Admin/addpg" className="dark:text-white text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 hover:underline">
                                            Addpg
                                        </a>
                                        <button className="fill-stroke text-black dark:text-white" aria-label="show options">
                                            <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 6L8 10L4 6" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    </li>
                                    <li className="flex items-center justify-between">
                                        <a href="/Admin/addbuydata" className="dark:text-white text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 hover:underline">
                                            Add Buy
                                        </a>
                                        <button className="fill-stroke text-black dark:text-white" aria-label="show options">
                                            <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 6L8 10L4 6" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    </li>
                                    <li className="flex items-center justify-between">
                                        <a href="javascript:void(0)" className="dark:text-white text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 hover:underline">
                                            Orders
                                        </a>
                                        <button className="fill-stroke text-black dark:text-white" aria-label="show options">
                                            <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 6L8 10L4 6" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    </li>
                                   
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Search menu */}
                <div id="mobile-search-menu" className={`${search ? "flex" : "hidden"} md:hidden absolute inset-0 z-10 flex-col w-full h-screen bg-white dark:bg-gray-900 pt-4`}>
                    <div className="w-full">
                        <div className="flex items-center justify-between border-b border-gray-200 pb-3 mx-4">
                            <div className="flex items-center space-x-3 mx-2">
                                <div>
                                    <svg className="fill-stroke text-gray-800 dark:text-white" width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M18.9984 19.0004L14.6484 14.6504" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <input type="text" placeholder="Search for Addpg" className="text-sm text-gray-600 focus:outline-none bg-transparent" />
                            </div>
                            <button aria-label="close menu" onClick={() => setSearch(false)} className="text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-800">
                                <svg className="fill-stroke" width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15 5L5 15" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M5 5L15 15" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div className="mt-8 mx-4">
                        <h2 className="text-sm text-gray-600 dark:text-gray-300 uppercase">Suggestions</h2>
                        <ul className="mt-6 flex flex-col space-y-6">
                            <li className="flex items-center justify-between">
                                <a href="javascript:void(0)" className="text-sm text-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-800 hover:underline">
                                    Bags
                                </a>
                            </li>
                            <li className="flex items-center justify-between">
                                <a href="javascript:void(0)" className="text-sm text-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-800 hover:underline">
                                    Shoes
                                </a>
                            </li>
                            <li className="flex items-center justify-between">
                                <a href="javascript:void(0)" className="text-sm text-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-800 hover:underline">
                                    Capes
                                </a>
                            </li>
                            <li className="flex items-center justify-between">
                                <a href="javascript:void(0)" className="text-sm text-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-800 hover:underline">
                                    Coats
                                </a>
                            </li>
                            <li className="flex items-center justify-between">
                                <a href="javascript:void(0)" className="text-sm text-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-800 hover:underline">
                                    Denim 2021
                                </a>
                            </li>
                            <li className="flex items-center justify-between">
                                <a href="javascript:void(0)" className="text-sm text-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-800 hover:underline">
                                    Leather shoe collection 2021
                                </a>
                            </li>
                            <li className="flex items-center justify-between">
                                <a href="javascript:void(0)" className="text-sm text-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-800 hover:underline">
                                    Active wear
                                </a>
                            </li>
                            <li className="flex items-center justify-between">
                                <a href="javascript:void(0)" className="text-sm text-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-800 hover:underline">
                                    Sweat suits
                                </a>
                            </li>
                        </ul>
                    </div>
                   
                </div>
                {/* Main Menu */}
                <div id="mobile-menu" className={`${showMenuSm ? "flex" : "hidden"} md:hidden absolute inset-0 z-10 flex-col w-full h-screen bg-white pt-4`}>
                    <div className="w-full">
                        <div className="flex items-center justify-between border-b border-gray-200 pb-4 mx-4">
                            <div />
                            <div>
                                <p className="text-base font-semibold text-gray-800">Menu</p>
                            </div>
                            <button aria-label="close menu" onClick={() => setShowMenuSm(false)} className="text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-800">
                                <svg className="fill-stroke" width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15 5L5 15" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M5 5L15 15" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div className="mt-6 mx-4">
                        <ul className="flex flex-col space-y-8">
                            <li className="flex items-center justify-between">
                                <a href="/Admin/dashboard" className="text-base text-gray-800 focus:outline-none dark:text-white focus:ring-2 focus:ring-gray-800 hover:underline">
                                    Home
                                </a>
                                <button className="focus:outline-none focus:ring-2 text-black dark:text-white focus:ring-gray-800 rounded hover:bg-gray-100 p-0.5">
                                    <svg className="fill-stroke" width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 6L8 10L4 6" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </li>
                            <li className="flex items-center justify-between">
                                <a href="/Admin/addpg" className="text-base text-gray-800 focus:outline-none dark:text-white focus:ring-2 focus:ring-gray-800 hover:underline">
                                    Add PG
                                </a>
                                <button className="focus:outline-none focus:ring-2 text-black dark:text-white focus:ring-gray-800 rounded hover:bg-gray-100 p-0.5">
                                    <svg className="fill-stroke" width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 6L8 10L4 6" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </li>
                            <li className="flex items-center justify-between">
                                <a href="/Admin/addbuydata" className="text-base text-gray-800 focus:outline-none dark:text-white focus:ring-2 focus:ring-gray-800 hover:underline">
                                    Add Buy
                                </a>
                                <button className="focus:outline-none focus:ring-2 text-black dark:text-white focus:ring-gray-800 rounded hover:bg-gray-100 p-0.5">
                                    <svg className="fill-stroke" width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 6L8 10L4 6" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </li>
                            <li className="flex items-center justify-between">
                                <a href="javascript:void(0)" className="text-base text-gray-800 focus:outline-none dark:text-white focus:ring-2 focus:ring-gray-800 hover:underline">
                                    Orders
                                </a>
                                <button className="focus:outline-none focus:ring-2 text-black dark:text-white focus:ring-gray-800 rounded hover:bg-gray-100 p-0.5">
                                    <svg className="fill-stroke" width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 6L8 10L4 6" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </li>
                          
                           
                        </ul>
                    </div>
                  
                </div>
            </div>
        </div>
    );
}
