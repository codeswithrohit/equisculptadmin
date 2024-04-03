import React, { useState, useEffect } from 'react';
import { firebase } from '../Firebase/config';
import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Orders = () => {
  const db = firebase.firestore();
  const [portfoliosData, setPortfoliosData] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

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
        setLoadingData(false);
      });

    return () => unsubscribe();
  }, [db]);
  const formatDate = (timestamp) => {
    const dateObject = timestamp.toDate();
    return dateObject.toLocaleString(); // You can customize the format here
  };

  const openDocument = (url) => {
    window.open(url, '_blank');
  };
  
  const handleStatusChange = async (id, newStatus, userEmail, totalpay) => {
    try {
        // Check if the new status is "Rejected"
        if (newStatus === 'Rejected') {
            // Update order status
            await db.collection('orders').doc(id).update({ status: newStatus });

            // Update local state immediately to reflect the change
            setPortfoliosData(portfoliosData.map((portfolio) => {
                if (portfolio.id === id) {
                    return { ...portfolio, status: newStatus };
                }
                return portfolio;
            }));

            // Show toast notification for successful status update
            toast.success('Status updated successfully!', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } else {
            // Find order by ID
            const orderDoc = await db.collection('orders').doc(id).get();
            const orderData = orderDoc.data();

            // Check if the current status is "Pending"
            if (orderData.status === 'Pending') {
                // Update order status
                await db.collection('orders').doc(id).update({ status: newStatus });

                // Update local state immediately to reflect the change
                setPortfoliosData(portfoliosData.map((portfolio) => {
                    if (portfolio.id === id) {
                        return { ...portfolio, status: newStatus };
                    }
                    return portfolio;
                }));

                // Find user by email
                const userRef = db.collection('users').where('email', '==', userEmail);
                const userSnapshot = await userRef.get();

                // Update payments array in user document if status is not "Rejected"
                userSnapshot.forEach(async (doc) => {
                    const userData = doc.data();
                    const updatedPayments = Array.isArray(userData.payments) ? [...userData.payments, totalpay] : [totalpay]; // Assuming 'result' contains the payment data
                    await db.collection('users').doc(doc.id).update({ payments: updatedPayments });
                });

                // Show toast notification for successful status update
                toast.success('Status updated successfully!', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else {
                // Show toast notification if status is already "Confirm"
                toast.warning('Already verified!', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        }
    } catch (error) {
        console.error('Error updating status:', error);
        toast.error('Failed to update status!', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }
};



  
  
  return (
    <div className='bg-white min-h-screen' >
        <div className='lg:ml-64'>
            <h1 className='text-xl text-center text-black font-bold' >Our Orders</h1>
            {loadingData ? (
      // Render spinner here
      <div class='flex space-x-2 justify-center items-center bg-white h-screen dark:invert'>
      <span class='sr-only'>Loading...</span>
       <div class='h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.3s]'></div>
     <div class='h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.15s]'></div>
     <div class='h-8 w-8 bg-black rounded-full animate-bounce'></div>
   </div>
    ) : (
      <div class="  overflow-x-auto">
  <table class="min-w-full bg-white font-[sans-serif]">
    <thead class="whitespace-nowrap">
      <tr>
       
        <th class="px-6 py-4 text-left text-sm font-semibold text-black">
          Portfolio Name
        </th>
        <th class="px-6 py-4 text-left text-sm font-semibold text-black">
          Status
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 fill-gray-400 inline cursor-pointer ml-2"
            viewBox="0 0 401.998 401.998">
            <path
              d="M73.092 164.452h255.813c4.949 0 9.233-1.807 12.848-5.424 3.613-3.616 5.427-7.898 5.427-12.847s-1.813-9.229-5.427-12.85L213.846 5.424C210.232 1.812 205.951 0 200.999 0s-9.233 1.812-12.85 5.424L60.242 133.331c-3.617 3.617-5.424 7.901-5.424 12.85 0 4.948 1.807 9.231 5.424 12.847 3.621 3.617 7.902 5.424 12.85 5.424zm255.813 73.097H73.092c-4.952 0-9.233 1.808-12.85 5.421-3.617 3.617-5.424 7.898-5.424 12.847s1.807 9.233 5.424 12.848L188.149 396.57c3.621 3.617 7.902 5.428 12.85 5.428s9.233-1.811 12.847-5.428l127.907-127.906c3.613-3.614 5.427-7.898 5.427-12.848 0-4.948-1.813-9.229-5.427-12.847-3.614-3.616-7.899-5.42-12.848-5.42z"
              data-original="#000000" />
          </svg>
        </th>
        <th class="px-6 py-4 text-left text-sm font-semibold text-black">
          No.of lots
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 fill-gray-400 inline cursor-pointer ml-2"
            viewBox="0 0 401.998 401.998">
            <path
              d="M73.092 164.452h255.813c4.949 0 9.233-1.807 12.848-5.424 3.613-3.616 5.427-7.898 5.427-12.847s-1.813-9.229-5.427-12.85L213.846 5.424C210.232 1.812 205.951 0 200.999 0s-9.233 1.812-12.85 5.424L60.242 133.331c-3.617 3.617-5.424 7.901-5.424 12.85 0 4.948 1.807 9.231 5.424 12.847 3.621 3.617 7.902 5.424 12.85 5.424zm255.813 73.097H73.092c-4.952 0-9.233 1.808-12.85 5.421-3.617 3.617-5.424 7.898-5.424 12.847s1.807 9.233 5.424 12.848L188.149 396.57c3.621 3.617 7.902 5.428 12.85 5.428s9.233-1.811 12.847-5.428l127.907-127.906c3.613-3.614 5.427-7.898 5.427-12.848 0-4.948-1.813-9.229-5.427-12.847-3.614-3.616-7.899-5.42-12.848-5.42z"
              data-original="#000000" />
          </svg>
        </th>
        <th class="px-6 py-4 text-left text-sm font-semibold text-black">
          Portfolio Price
        </th>
        <th class="px-6 py-4 text-left text-sm font-semibold text-black">
          Total Price
        </th>
        <th class="px-6 py-4 text-left text-sm font-semibold text-black">
          Contact
        </th>
        <th class="px-6 py-4 text-left text-sm font-semibold text-black">
          Purchased at
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 fill-gray-400 inline cursor-pointer ml-2"
            viewBox="0 0 401.998 401.998">
            <path
              d="M73.092 164.452h255.813c4.949 0 9.233-1.807 12.848-5.424 3.613-3.616 5.427-7.898 5.427-12.847s-1.813-9.229-5.427-12.85L213.846 5.424C210.232 1.812 205.951 0 200.999 0s-9.233 1.812-12.85 5.424L60.242 133.331c-3.617 3.617-5.424 7.901-5.424 12.85 0 4.948 1.807 9.231 5.424 12.847 3.621 3.617 7.902 5.424 12.85 5.424zm255.813 73.097H73.092c-4.952 0-9.233 1.808-12.85 5.421-3.617 3.617-5.424 7.898-5.424 12.847s1.807 9.233 5.424 12.848L188.149 396.57c3.621 3.617 7.902 5.428 12.85 5.428s9.233-1.811 12.847-5.428l127.907-127.906c3.613-3.614 5.427-7.898 5.427-12.848 0-4.948-1.813-9.229-5.427-12.847-3.614-3.616-7.899-5.42-12.848-5.42z"
              data-original="#000000" />
          </svg>
        </th>
        <th class="px-6 py-4 text-left text-sm font-semibold text-black">
         View Documents
        </th>
      </tr>
    </thead>
    <tbody class="whitespace-nowrap">
    {portfoliosData.map((portfolio, index) => (
      <tr key={portfolio.id} class="odd:bg-blue-50">
      
        <td class="px-6 py-4 text-sm">
          {portfolio.portfolioname}
        </td>
        <td className="px-6 py-4 text-sm">
                                        <select
                                            className={`border border-gray-300 p-1 ${
                                                portfolio.status === 'Rejected' ? 'text-red-600' :
                                                    portfolio.status === 'Confirm' ? 'text-green-600' :
                                                        'text-yellow-600'
                                                }`}
                                            value={portfolio.status}
                                            onChange={(e) => handleStatusChange(portfolio.id, e.target.value, portfolio.useremail, portfolio.totalpay)}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Confirm">Confirm</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                    </td>
        <td class="px-6 py-4 text-sm">
        {portfolio.nooflots}
        </td>
        <td class="px-6 py-4 text-sm">
        {portfolio.portfoliovalue}
        </td>
        <td class="px-6 py-4 text-sm">
        {portfolio.totalpay}
        </td>
      
        <td class="px-6 py-4 text-sm">
          <div class="flex items-center cursor-pointer">
            <div class="ml-2">
              <p class="text-sm text-black">{portfolio.name}</p>
              <spanp class="text-sm">{portfolio.useremail}</spanp>
            </div>
          </div>
        </td>
        <td class="px-6 py-4 text-sm">
        {formatDate(portfolio.createdAt)}
        </td>
     
        <td className="px-6 py-3 text-sm">
                <button onClick={() => openDocument(portfolio.panCardUrl)} className="px-4 py-2 bg-blue-500 text-white rounded-lg">View PAN Card</button>
                <button onClick={() => openDocument(portfolio.aadharCardUrl)} className="px-4 py-2 bg-blue-500 text-white rounded-lg ml-2">View Aadhar Card</button>
                <button onClick={() => openDocument(portfolio.cmrcopyUrl)} className="px-4 py-2 bg-blue-500 text-white rounded-lg ml-2">View CMR Copy</button>
                <button onClick={() => openDocument(portfolio.cancelledcheckUrl)} className="px-4 py-2 bg-blue-500 text-white rounded-lg ml-2">View Cancelled Check</button>
              </td>
      </tr>
    ))}
    </tbody>
  </table>
</div>
    )}
    </div>
    <ToastContainer/>
    </div>
  );
};

export default Orders;
