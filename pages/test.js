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
const Dashboard = () => {
    const router = useRouter();
  const [userData, setUserData] = useState([]);
  const [userId, setUserId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // State variable to check if the user is an admin
  const [adminData, setAdminData] = useState([]);
  const openBankModal = (id) => {
    setUserId(id); // Set the userId when opening the modal
    setShowModal(true);
  };

  const closeBankModal = () => {
    setShowModal(false);
  };
  // Check if the user is an admin when the component mounts
 


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
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, []);

console.log(userData)
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
      const userRef = firebase.firestore().collection('users').doc(userId);
      await userRef.update({ status }); // Update the status in Firestore

      // Send message on WhatsApp
      const body = `Hi ${name}, your status has been changed to ${status}.`;
      const res = await sendMessage(phoneNumber, body);
      await sendVerificationEmail(email)
      toast.success('Status updated successfully');
      
      // Refresh the data after updating
      const updatedUserData = [...userData];
      const updatedIndex = updatedUserData.findIndex(user => user.userId === userId);
      if (updatedIndex !== -1) {
        updatedUserData[updatedIndex].status = status;
        setUserData(updatedUserData);
      }
    } catch (error) {
      console.error('Error updating status:', error);
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
    const sendVerificationEmail = async (email) => {
      try {
        const response = await axios.post('/api/sendEmail', {
          email,
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
 
  const handleSubmit = async () => {
    setLoading(true);
    console.log(userId)
    try {
      const db = firebase.firestore();
      // Get a reference to the subcollection
      const userRef = db.collection('users').doc(userId).collection('Assign_Bank_Details');
      // Add a new document to the subcollection with the bank details
      await userRef.add({
        BankName: BankName,
        AccountNo: AccountNo,
        AccountHolderName: AccountHolderName,
        IFSCCode: IFSCCode,
      });
      
      toast.success('Bank Details added successfully!');
      setShowModal(false);
    } catch (error) {
      console.error('Error adding bankdetails: ', error);
      toast.error('Failed to add bank details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <div className=''>
    <div className='lg:ml-64 bg-white dark:bg-white min-h-screen'>
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
      {/* Background overlay */}
      <div className="fixed inset-0 transition-opacity" aria-hidden="true">
        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>

      {/* Modal content */}
      <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        {/* Modal content goes here */}
        <div className="max-w-full overflow-x-auto">
          <table className="w-full bg-white font-[sans-serif]">
            <thead className="whitespace-nowrap">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-black">
                  Bank Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-black">
                  Account Number
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-black">
                  Account Holder Name
                </th>
               
                <th className="px-6 py-3 text-left text-sm font-semibold text-black">
                 IFSC Code
                </th>
            
                
               
              </tr>
            </thead>
            <tbody className="whitespace-nowrap">
              <tr className="odd:bg-blue-50">
                <td className="px-6 py-3 text-sm">
                  <div className="flex items-center cursor-pointer">
                    <div className="ml-4">
                    <input type="text" placeholder='Enter Bank Name'   value={BankName}
                                onChange={(e) => setBankName(e.target.value)} className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring focus:border-blue-500" />
                    </div>
                  </div>
                </td>
               
                <td className="px-6 py-3 text-sm">
                <input placeholder='Enter Account Number' type="text" value={AccountNo}
                            onChange={(e) => setAccountNo(e.target.value)} className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring focus:border-blue-500" />
                </td>
                <td className="px-6 py-3 text-sm">
                <input placeholder='Enter Account Holder Name' type="text" value={AccountHolderName}
                            onChange={(e) => setAccountHolderName(e.target.value)} className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring focus:border-blue-500" />
                </td>
              
                <td className="px-6 py-3 text-sm">
                <input placeholder='Enter IFSC CODE' type="text" value={IFSCCode}
                            onChange={(e) => setIFSCCode(e.target.value)} className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring focus:border-blue-500" />
                </td>
                
               
                
               
                <td className="px-6 py-3 text-sm">
                <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className={`px-4 py-2 bg-blue-500 text-white rounded-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {loading ? 'Loading...' : 'Submit'}
                          </button>
                </td>
               
              </tr>
              {/* Additional table rows go here */}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button type="button" onClick={closeBankModal} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}
        <section class="px-6 py-6">
                    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                        <div
                            class="flex items-center justify-between p-4 border-l-2 border-yellow-500 rounded-md shadow dark:border-blue-400 dark:bg-gray-900 bg-gray-50">
                            <div>
                                <p class="mb-2 text-gray-700 dark:text-gray-400">Total Users</p>
                                <h2 class="text-2xl font-bold text-gray-700 dark:text-gray-400">
                                {totalUsers}</h2>
                            </div>
                            <div>
                                <span
                                    class="inline-block p-4 mr-2 text-white bg-yellow-500 rounded-full dark:text-gray-400 dark:bg-gray-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                        class="w-6 h-6 bi bi-bag-check" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd"
                                            d="M10.854 8.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0z">
                                        </path>
                                        <path
                                            d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z">
                                        </path>
                                    </svg>
                                </span>
                            </div>
                        </div>
                        <div
                            class="flex items-center justify-between p-4 border-l-2 border-green-500 rounded-md shadow dark:border-blue-400 dark:bg-gray-900 bg-gray-50">
                            <div>
                                <p class="mb-2 text-gray-700 dark:text-gray-400">Approved Users</p>
                                <h2 class="text-2xl font-bold text-gray-700 dark:text-gray-400">
                                {approvedUsers}</h2>
                            </div>
                            <div>
                                <span
                                    class="inline-block p-4 mr-2 text-white bg-green-500 rounded-full dark:text-gray-400 dark:bg-gray-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                        class="w-6 h-6 bi bi-bag-check" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd"
                                            d="M10.854 8.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0z">
                                        </path>
                                        <path
                                            d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z">
                                        </path>
                                    </svg>
                                </span>
                            </div>
                        </div>
                        <div
                            class="flex items-center justify-between p-4 border-l-2 border-red-500 rounded-md shadow dark:border-blue-400 dark:bg-gray-900 bg-gray-50">
                            <div>
                                <p class="mb-2 text-gray-700 dark:text-gray-400">Pending Users</p>
                                <h2 class="text-2xl font-bold text-gray-700 dark:text-gray-400">
                                {pendingUsers}</h2>
                            </div>
                            <div>
                                <span
                                    class="inline-block p-4 mr-2 text-white bg-red-500 rounded-full dark:text-gray-400 dark:bg-gray-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                        class="w-6 h-6 bi bi-bag-check" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd"
                                            d="M10.854 8.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0z">
                                        </path>
                                        <path
                                            d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z">
                                        </path>
                                    </svg>
                                </span>
                            </div>
                        </div>


                       
                    </div>
                </section>
               
<body class="antialiased font-sans ">
    <div class=" px-4 sm:px-8">
        <div class="py-8">
            <div>
                <h2 class="text-2xl font-semibold leading-tight">Users</h2>
            </div>
            <div class="my-2 ml-8 flex sm:flex-row flex-col">
                <div class="flex flex-row mb-1 sm:mb-0">
                  
                    <div class="relative">
                    <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              class="appearance-none h-full rounded-r border-t sm:rounded-r-none sm:border-r-0 border-r border-b block appearance-none w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:border-l focus:border-r focus:bg-white focus:border-gray-500"
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
                        <div
                            class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
            <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                <div class="inline-block min-w-full shadow rounded-lg overflow-hidden">
                    <table class="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th
                                    class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    User Name
                                </th>
                                <th
                                    class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Email
                                </th>
                                <th
                                    class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Mobile Number
                                </th>
                                <th
                                    class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Aadhar Detail
                                </th>
                                <th
                                    class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                   Pan Detail
                                </th>
                                <th
                                    class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                   AssignBank Details
                                </th>
                                <th
                                    class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                   Address
                                </th>
                                <th
                                    class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                  Delete User
                                </th>
                                
                                <th
                                    class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody>

                        {currentUsers.map((user, index) => (
                            <tr key={user.id} >
                                <td  class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <div class="flex items-center">
                                        <div class="flex-shrink-0 w-10 h-10">
                                            <img className="w-full h-full rounded-full"
                    src={user.photo || 'default_avatar_url'}
                    alt="" />
                                        </div>
                                        <div class="ml-3">
                                            <p class="text-gray-900 whitespace-no-wrap">
                                            {user.name}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p class="text-gray-900 whitespace-no-wrap">{user.email}</p>
                                </td>
                                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p class="text-gray-900 whitespace-no-wrap">{user.phoneNumber}</p>
                                </td>
                                <td class="px-5 py-5 border-b border-gray-200 cursor-pointer bg-white text-sm">
                                <p
    className="text-white bg-green-500 rounded-lg text-center font-bold whitespace-no-wrap"
    onClick={() => handleViewAadhar(user.aadharCardUrl)}
  >
    View Aadhar
  </p>
                                </td>
                                <td class="px-5 py-5 border-b border-gray-200 cursor-pointer bg-white text-sm">
                                <p
    className="text-white bg-green-500 rounded-lg text-center font-bold whitespace-no-wrap"
    onClick={() => handleViewPAN(user.panCardUrl)}
  >
    View PAN
  </p>
                                </td>
                                <td class="px-8 py-8 border-b border-gray-200 cursor-pointer bg-white text-sm">
                                <p  onClick={() => openBankModal(user.userId)}
    className="text-white bg-green-500 rounded-lg text-center font-bold whitespace-no-wrap"
   
  >
   Assign Bank Account
  </p>
                                </td>
                                <td class="px-5 py-5 border-b border-gray-200  bg-white text-sm">
                                    <p class="text-gray-900 whitespace-no-wrap">
                                    {user.address}
                                    </p>
                                </td>
                                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              {/* Delete button */}
              <button
                onClick={() => handleDeleteUser(user.userId)}
                className="text-white bg-red-500 rounded-lg text-center font-bold whitespace-no-wrap"
              >
                Delete
              </button>
            </td>
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
  <select
    value={user.status}
    onChange={(e) => {
      let newStatus;
      if (e.target.value === 'Active') {
        newStatus = 'Pending';
      } else if (e.target.value === 'Pending') {
        newStatus = 'Active';
      } else if (e.target.value === 'Rejected') {
        newStatus = 'Pending';
      }
      handleStatusChange(user.userId, newStatus, user.email,user.phoneNumber,user.name);
    }}
    className={`appearance-none rounded-lg text-center font-bold whitespace-no-wrap ${
      user.status === 'Active' ? 'bg-green-500 text-white' : user.status === 'Pending' ? 'bg-yellow-500 text-black' : user.status === 'Rejected' ? 'bg-red-500 text-white' : ''
    }`}
  >
    <option value="Active" className="bg-green-500 text-white">Active</option>
    <option value="Pending" className="bg-yellow-500 text-black">Pending</option>
    <option value="Rejected" className="bg-red-500 text-white">Rejected</option>
  </select>
</td>

                            </tr>
                        ))}


                                               </tbody>
                    </table>
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
            </div>
        </div>
    </div>
</body>

    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
        </div>
        <ToastContainer/>
        </div>
  )
}

export default Dashboard