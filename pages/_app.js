import { useRouter } from 'next/router';
import '@/styles/globals.css';
import Navbar from '../components/Navbar';

export default function App({ Component, pageProps }) {
  const router = useRouter();

  // Conditionally render Navbar based on the route
  const showNavbar = router.pathname !== '/adminlogin'; // Adjust the route as per your login route

  return (
    <div>
      {showNavbar && <Navbar />}
      <Component {...pageProps} />
    </div>
  );
}
