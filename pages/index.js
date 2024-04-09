import React from 'react'
import AdminNav from '../components/AdminNav'
import { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/router';
import { firebase } from '../Firebase/config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
const Index = () => {
  const db = firebase.firestore();
  const router = useRouter();
  const [userData, setUserData] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loadingUserData, setLoadingUserData] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // State variable to check if the user is an admin
  const [adminData, setAdminData] = useState([]);
  const [bankDetails, setBankDetails] = useState({
    BankName: '',
    AccountNo: '',
    AccountHolderName: '',
    IFSCCode: '',
  });

  const openBankModal = (id) => {
    setUserId(id);
    fetchBankDetails(id);
    setShowModal(true);
  };

  const closeBankModal = () => {
    setShowModal(false);
  };
  // Check if the user is an admin when the component mounts
  const [portfolios, setPortfolios] = useState([]);
  useEffect(() => {
    const unsubscribe = db.collection('portfolios').onSnapshot((snapshot) => {
      const fetchedPortfolios = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPortfolios(fetchedPortfolios);
    });

    return () => unsubscribe();
  }, [db]);

   const totalportfolio=portfolios.length

   const [portfoliosData, setPortfoliosData] = useState([]);
 
 
   useEffect(() => {
     const currentUser = firebase.auth().currentUser;
     const unsubscribe = db.collection('orders')
       .onSnapshot((snapshot) => {
         const fetchedPortfoliosData = snapshot.docs.map((doc) => {
           const data = doc.data();
           return {
             id: doc.id,
             ...data,
           };
         });
         setPortfoliosData(fetchedPortfoliosData);
       });
 
     return () => unsubscribe();
   }, [db]);
   const totalorder=portfoliosData.length

   useEffect(() => {
    const fetchData = async () => {
      try {
        const userRef = firebase.firestore().collection('users');
        const querySnapshot = await userRef.get();
  
        const fetchedUserData = [];
        querySnapshot.forEach((doc) => {
          // Extract data for each document
          const data = doc.data();
          fetchedUserData.push(data);
        });
  
        setUserData(fetchedUserData);
        setLoadingUserData(false); // Set loading state to false after data is fetched
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoadingUserData(false); // Also set loading state to false in case of error
      }
    };
  
    fetchData();
  }, []);
  


  const countUsersByStatus = (status) => {
    return userData.filter((user) => user.status === status).length;
  };

  // Calculate counts for Active and Pending users
  const totalUsers = userData.length;
  const approvedUsers = countUsersByStatus('Active');
  const pendingUsers = countUsersByStatus('Pending');
  const [imageUrl, setImageUrl] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const handleViewAadhar = (aadharImageUrl) => {
    setImageUrl(aadharImageUrl);
    setModalOpen(true);
  };

  const handleViewPAN = (panImageUrl) => {
    setImageUrl(panImageUrl);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setImageUrl('');
  };

 
  const handleStatusChange = async (userId, status, email, phoneNumber, name) => {
    try {
      // Show updating message
      toast.info('Updating status...');
      // Update the status in Firestore
      await firebase.firestore().collection('users').doc(userId).update({ status: status });
      // Show success message
      console.log(email)
      const body = `Hi ${name}, your status has been changed to ${status}.`;
      const res = await sendMessage(phoneNumber, body);
      await sendVerificationEmail(email,name,status)
      toast.success('Status updated successfully');
      // Reload the page
      window.location.reload();
    } catch (error) {
      console.error('Error updating status:', error);
      // Show error message
      toast.error('Failed to update status');
    }
  };

  const sendMessage = async (phoneNumber, body) => {
    try {
      const res = await fetch('/api/sendMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phoneNumber, body })
      });

      const data = await res.json();
      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error('Failed to send message');
    }
  };

  const [emailSent, setEmailSent] = useState(false);
  console.log(emailSent)
    const sendVerificationEmail = async (email,name,status) => {
      try {
        const response = await axios.post('/api/sendEmail', {
          email,name,status
        });
  
        if (response.ok) {
          setEmailSent(true);
          console.log(email)
        } else {
          console.error('Failed to send verification email');
        }
      } catch (error) {
        console.error('Error sending verification email:', error);
      }
    };
  
  
  
  



  const [statusFilter, setStatusFilter] = useState('All'); // State to manage selected status filter

  // ... (other code)

  const filteredUsers = userData.filter((user) => {
    if (statusFilter === 'All') {
      return true; // Show all users when 'All' is selected
    }
    return user.status === statusFilter; // Filter users based on the selected status
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5); // Define the number of users per page
  const handleStatusFilter = (status) => {
    setStatusFilter(status); // Set the status filter state
  };
  // ... Existing code ...

  // Pagination Logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);


  const handleDeleteUser = async (userId) => {
    try {
      await firebase.firestore().collection('users').doc(userId).delete();
      // Remove the user from the userData state
      const updatedUserData = userData.filter((user) => user.userId !== userId);
      setUserData(updatedUserData);

      // Show success notification
      toast.success('User deleted successfully');
      
      // Refresh the page after deletion
      window.location.reload();
    } catch (error) {
      console.error('Error deleting user:', error);
      // Show error notification
      toast.error('Failed to delete user');
    }
  };
  const [BankName, setBankName] = useState('');
  const [AccountNo, setAccountNo] = useState('');
  const [AccountHolderName, setAccountHolderName] = useState('');
  const [IFSCCode, setIFSCCode] = useState('');
  const [loading, setLoading] = useState(false);
  const fetchBankDetails = async (userId) => {
    try {
      const userRef = db.collection('users').doc(userId).collection('Assign_Bank_Details');
      const snapshot = await userRef.get();
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        setBankDetails(data);
      }
    } catch (error) {
      console.error('Error fetching bank details:', error);
      toast.error('Failed to fetch bank details. Please try again.');
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const userRef = db.collection('users').doc(userId).collection('Assign_Bank_Details').doc(userId);
      await userRef.set(bankDetails, { merge: true });
      toast.success('Bank details updated successfully!');
      setShowModal(false);
    } catch (error) {
      console.error('Error updating bank details:', error);
      toast.error('Failed to update bank details. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  


  return (
    <div className='bg-white min-h-screen' >
       {modalOpen && (
        <div className="modal fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 z-30 bg-opacity-100">
          <div className="modal-content bg-white p-4 rounded-lg">
            <span className="close text-4xl cursor-pointer absolute top-2 right-4 text-red-600 " onClick={closeModal}>&times;</span>
            <img className='h-64 w-64 mx-auto' src={imageUrl} alt="Card" />
          </div>
        </div>
      )}


{showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="max-w-full overflow-x-auto">
                <table className="w-full bg-white font-[sans-serif]">
                  <thead className="whitespace-nowrap">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-black">Bank Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-black">Account Number</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-black">Account Holder Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-black">IFSC Code</th>
                    </tr>
                  </thead>
                  <tbody className="whitespace-nowrap">
                    <tr className="odd:bg-blue-50">
                      <td className="px-6 py-3 text-sm">
                      <input
                type="text"
                placeholder='Enter Bank Name'
                value={bankDetails.BankName}
                onChange={(e) => setBankDetails({ ...bankDetails, BankName: e.target.value })}
                className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring focus:border-blue-500"
              />
                      </td>
                      <td className="px-6 py-3 text-sm">
                        <input
                          placeholder='Enter Account Number'
                          type="text"
                          value={bankDetails.AccountNo}
                          onChange={(e) => setBankDetails({ ...bankDetails, AccountNo: e.target.value })}
                          className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring focus:border-blue-500"
                        />
                      </td>
                      <td className="px-6 py-3 text-sm">
                        <input
                          placeholder='Enter Account Holder Name'
                          type="text"
                          value={bankDetails.AccountHolderName}
                          onChange={(e) => setBankDetails({ ...bankDetails, AccountHolderName: e.target.value })}
                          className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring focus:border-blue-500"
                        />
                      </td>
                      <td className="px-6 py-3 text-sm">
                        <input
                          placeholder='Enter IFSC CODE'
                          type="text"
                          value={bankDetails.IFSCCode}
                          onChange={(e) => setBankDetails({ ...bankDetails, IFSCCode: e.target.value })}
                          className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring focus:border-blue-500"
                        />
                      </td>
                      <td className="px-6 py-3 text-sm">
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                disabled={loading} // Disable the button when loading
              >
                {loading ? 'Loading...' : 'Submit'} {/* Show loading text when loading */}
              </button>
            </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={closeBankModal}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div class="h-full  mb-10 md:ml-64">
    
      {loadingUserData ? (
      // Render spinner here
      <div class='flex space-x-2 justify-center items-center bg-white h-screen dark:invert'>
      <span class='sr-only'>Loadin...</span>
       <div class='h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.3s]'></div>
     <div class='h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.15s]'></div>
     <div class='h-8 w-8 bg-black rounded-full animate-bounce'></div>
   </div>
    ) : (
    <><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 p-4 gap-4">
              <div class="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
                <div class="flex justify-center items-center w-14 h-14 bg-white rounded-full transition-all duration-300 transform group-hover:rotate-12">
                  <svg width="30" height="30" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="stroke-current text-blue-800 dark:text-gray-800 transform transition-transform duration-500 ease-in-out"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                </div>
                <div class="text-right">
                  <p class="text-2xl">{totalUsers}</p>
                  <p>Users</p>
                </div>
              </div>
              <div class="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
                <div class="flex justify-center items-center w-14 h-14 bg-white rounded-full transition-all duration-300 transform group-hover:rotate-12">
                  <svg width="30" height="30" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="stroke-current text-blue-800 dark:text-gray-800 transform transition-transform duration-500 ease-in-out"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                </div>
                <div class="text-right">
                  <p class="text-2xl">{totalportfolio}</p>
                  <p>Total Portfolio</p>
                </div>
              </div>
              <div class="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
                <div class="flex justify-center items-center w-14 h-14 bg-white rounded-full transition-all duration-300 transform group-hover:rotate-12">
                  <svg width="30" height="30" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="stroke-current text-blue-800 dark:text-gray-800 transform transition-transform duration-500 ease-in-out"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                </div>
                <div class="text-right">
                  <p class="text-2xl">{totalorder}</p>
                  <p>Portfolio Order</p>
                </div>
              </div>
              {/* <div class="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
      <div class="flex justify-center items-center w-14 h-14 bg-white rounded-full transition-all duration-300 transform group-hover:rotate-12">
        <svg width="30" height="30" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="stroke-current text-blue-800 dark:text-gray-800 transform transition-transform duration-500 ease-in-out"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      </div>
      <div class="text-right">
        <p class="text-2xl">$75,257</p>
        <p>Balances</p>
      </div>
    </div> */}
            </div><div class="mt-4 mx-4">
                <div class="w-full overflow-hidden rounded-lg shadow-xs">
                  <div class="w-full overflow-x-auto">
                    <div class="border-b border-gray-200 dark:border-gray-700 mb-4">
                      <ul class="flex flex-wrap -mb-px" id="myTab" data-tabs-toggle="#myTabContent" role="tablist">
                        <li class="mr-2" role="presentation">
                          <button
                            onClick={() => handleStatusFilter('All')}
                            className={`inline-block text-gray-500 hover:text-gray-600 hover:border-gray-300 rounded-t-lg py-4 px-4 text-sm font-medium text-center border-transparent border-b-2 ${statusFilter === 'All' ? 'dark:text-gray-300 border-blue-600' : 'dark:text-gray-400'}`}
                            aria-selected={statusFilter === 'All'}
                            role="tab"
                          >
                            All ({userData.length})
                          </button>
                        </li>
                        <li class="mr-2" role="presentation">
                          <button
                            onClick={() => handleStatusFilter('Active')}
                            className={`inline-block text-gray-500 hover:text-gray-600 hover:border-gray-300 rounded-t-lg py-4 px-4 text-sm font-medium text-center border-transparent border-b-2 ${statusFilter === 'Active' ? 'dark:text-green-500 border-green-500' : 'dark:text-gray-400'}`}
                            aria-selected={statusFilter === 'Active'}
                            role="tab"
                          >
                            Active ({approvedUsers})
                          </button>
                        </li>
                        <li class="mr-2" role="presentation">
                          <button
                            onClick={() => handleStatusFilter('Pending')}
                            className={`inline-block text-gray-500 hover:text-gray-600 hover:border-gray-300 rounded-t-lg py-4 px-4 text-sm font-medium text-center border-transparent border-b-2 ${statusFilter === 'Pending' ? 'dark:text-yellow-500 border-yellow-500' : 'dark:text-gray-400'}`}
                            aria-selected={statusFilter === 'Pending'}
                            role="tab"
                          >
                            Pending ({pendingUsers})
                          </button>
                        </li>
                        <li role="presentation">
                          <button
                            onClick={() => handleStatusFilter('Rejected')}
                            className={`inline-block text-gray-500 hover:text-gray-600 hover:border-gray-300 rounded-t-lg py-4 px-4 text-sm font-medium text-center border-transparent border-b-2 ${statusFilter === 'Rejected' ? 'dark:text-red-500 border-red-500' : 'dark:text-gray-400'}`}
                            aria-selected={statusFilter === 'Rejected'}
                            role="tab"
                          >
                            Rejected ({countUsersByStatus('Rejected')})
                          </button>
                        </li>
                      </ul>

                    </div>
                    <table class="w-full">
                      <thead>
                        <tr class="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                          <th class="px-4 py-3">Client</th>
                          <th class="px-4 py-3">Aadhar Detail</th>
                          <th class="px-4 py-3">Pan Details</th>
                          <th class="px-4 py-3">Assign Bank Details</th>
                          <th class="px-4 py-3">Address</th>
                          <th class="px-4 py-3">Delete</th>
                          <th class="px-4 py-3">Status</th>
                          {/* <th class="px-4 py-3">Date</th> */}
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                        {currentUsers.map((user, index) => (
                          <tr key={user.id} class="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400">
                            <td class="px-4 py-3">
                              <div class="flex items-center text-sm">
                                <div class="relative hidden w-8 h-8 mr-3 rounded-full md:block">
                                  <img class="object-cover w-full h-full rounded-full" src={user.photo || 'default_avatar_url'} alt="" loading="lazy" />
                                  <div class="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></div>
                                </div>
                                <div>
                                  <p class="font-semibold">   {user.name}</p>
                                  <p class="text-xs text-gray-600 dark:text-gray-400">{user.email}</p>
                                  <p class="text-xs text-gray-600 dark:text-gray-400">{user.phoneNumber}</p>
                                  <p class="text-xs text-gray-600 dark:text-gray-400">Earn Reward: { user.earnPrice || '0' }</p>

                                </div>
                              </div>
                            </td>
                            <td class="px-4 py-3 text-sm cursor-pointer">  <p
                              className="text-white bg-green-500 rounded-sm text-xs p-1 text-center font-bold whitespace-no-wrap"
                              onClick={() => handleViewAadhar(user.aadharCardUrl)}
                            >
                              View Aadhar
                            </p></td>
                            <td class="px-4 py-3 text-sm cursor-pointer">    <p
                              className="text-white bg-green-500 rounded-sm text-xs p-1 text-center font-bold whitespace-no-wrap"
                              onClick={() => handleViewPAN(user.panCardUrl)}
                            >
                              View PAN
                            </p></td>
                            <td class="px-4 py-3 text-sm cursor-pointer">   <p onClick={() => openBankModal(user.userId)}
                              className="text-white bg-green-500 rounded-sm p-1 text-center text-xs font-bold whitespace-no-wrap"

                            >
                              Assign Bank Account
                            </p>
                            </td>
                            <td class="px-4 py-3 text-sm">{user.address}</td>
                            <td class="px-4 py-3 text-sm">
                              <button onClick={() => handleDeleteUser(user.userId)} class="mr-4" title="Delete">
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 fill-red-500 hover:fill-red-700" viewBox="0 0 24 24">
                                  <path
                                    d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
                                    data-original="#000000" />
                                  <path d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
                                    data-original="#000000" />
                                </svg>
                              </button>

                            </td>
                            <td class="px-4 py-3 text-xs">
                              <div className="relative w-36 max-w-full mx-auto">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="absolute top-0 bottom-0 w-5 h-5 my-auto text-gray-400 right-3"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                    clipRule="evenodd" />
                                </svg>
                                <select
                                  className={`w-full px-3 py-2 text-sm text-gray-600 bg-white border rounded-lg shadow-sm outline-none appearance-none focus:ring-offset-2 focus:ring-indigo-600 focus:ring-2 
                  ${user.status === 'Active' ? 'border-green-500 text-green-500' :
                                      user.status === 'Pending' ? 'border-yellow-500 text-yellow-500' : 'border-red-500 text-red-500'}`}
                                  onChange={(e) => handleStatusChange(user.userId, e.target.value, user.email,user.phoneNumber,user.name)}
                                >
                                  <option value="Active" selected={user.status === 'Active'}>Active</option>
                                  <option value="Pending" selected={user.status === 'Pending'}>Pending</option>
                                  <option value="Rejected" selected={user.status === 'Rejected'}>Rejected</option>
                                </select>
                              </div>
                            </td>


                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between">
                    <span className="text-xs xs:text-sm text-gray-900">
                      Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} Entries
                    </span>
                    <div className="inline-flex mt-2 xs:mt-0">
                      <button
                        className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-l"
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Prev
                      </button>
                      <button
                        className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-r"
                        onClick={() => paginate(currentPage + 1)}
                        disabled={indexOfLastUser >= filteredUsers.length}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </div></>
    )}
  </div>
  <ToastContainer/>
    </div>
  )
}

export default Index