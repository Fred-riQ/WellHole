import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

// Import components
import Navbar from './components/Navbar';
import Welcome from './components/Welcome';
import Home from './components/Home';
import SpecialOffers from './components/SpecialOffers';
import AboutUs from './components/AboutUs';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import BookingForm from './components/BookingForm';
import BookingConfirmation from './components/BookingConfirmation';
import MyBookings from './components/MyBookings';
import PaymentPage from './components/PaymentPage';

// API URL
const API_URL = 'https://backend-1-xjqw.onrender.com/api';

function App() {
  const [rooms, setRooms] = useState([]);
  const [specialOffers, setSpecialOffers] = useState([]);
  const [aboutUsContent, setAboutUsContent] = useState({});
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [currentPage, setCurrentPage] = useState('welcome');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookingDates, setBookingDates] = useState({ checkIn: null, checkOut: null });
  const [bookings, setBookings] = useState([]);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
      
      // Set authorization header for all future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    
    // Fetch initial data
    fetchRooms();
    fetchSpecialOffers();
    fetchAboutUsContent();
  }, []);

  // Fetch user's bookings when logged in
  useEffect(() => {
    if (isLoggedIn && user) {
      fetchUserBookings();
    }
  }, [isLoggedIn, user]);

  const fetchRooms = async () => {
    try {
      const response = await axios.get(`${API_URL}/rooms`);
      setRooms(response.data);
    } catch (err) {
      console.error('Error fetching rooms:', err);
      setError('Failed to load rooms. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSpecialOffers = async () => {
    try {
      const response = await axios.get(`${API_URL}/special-offers`);
      setSpecialOffers(response.data);
    } catch (err) {
      console.error('Error fetching special offers:', err);
    }
  };

  const fetchAboutUsContent = async () => {
    try {
      const response = await axios.get(`${API_URL}/about`);
      setAboutUsContent(response.data);
    } catch (err) {
      console.error('Error fetching about us content:', err);
    }
  };

  const fetchUserBookings = async () => {
    if (!user || !user.id) {
      console.error('User object is null or undefined');
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/bookings/user/${user.id}`);
      setBookings(response.data);
    } catch (err) {
      console.error('Error fetching user bookings:', err);
    }
  };

  const handleBooking = (room) => {
    setSelectedRoom(room);
    if (isLoggedIn) {
      setCurrentPage('booking-form');
    } else {
      setShowLoginModal(true);
    }
  };

  const handleBookOffer = (offer) => {
    if (isLoggedIn) {
      alert(`Booking ${offer.title} package. Our team will contact you shortly with details.`);
    } else {
      setShowLoginModal(true);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: loginEmail,
        password: loginPassword
      });
      
      const { user, token } = response.data;
      
      // Save user and token to localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      
      // Set authorization header for all future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      setIsLoggedIn(true);
      setShowLoginModal(false);
      setCurrentPage('dashboard');
      
      // Fetch user's bookings
      fetchUserBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!registerEmail || !registerPassword || !registerName) {
      alert('Please fill in all fields');
      return;
    }
    
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        name: registerName,
        email: registerEmail,
        password: registerPassword
      });
      
      const { user, token } = response.data;
      
      // Save user and token to localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      
      // Set authorization header for all future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      setIsLoggedIn(true);
      setShowRegisterModal(false);
      setCurrentPage('dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  const handleLogout = () => {
    // Remove user and token from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Remove authorization header
    delete axios.defaults.headers.common['Authorization'];
    
    setIsLoggedIn(false);
    setUser(null);
    setCurrentPage('welcome');
  };

  const handleDateSelection = (dates) => {
    setBookingDates(dates);
  };

  const confirmBooking = async (paymentDetails) => {
    try {
      const response = await axios.post(`${API_URL}/bookings`, {
        roomId: selectedRoom.id,
        checkIn: bookingDates.checkIn,
        checkOut: bookingDates.checkOut,
        guests: paymentDetails.guests || 1,
        paymentDetails: paymentDetails
      });
      
      const newBooking = response.data.booking;
      setBookings([...bookings, newBooking]);
      setCurrentBooking(newBooking);
      setCurrentPage('booking-confirmation');
    } catch (err) {
      alert(err.response?.data?.message || 'Booking failed. Please try again.');
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      await axios.patch(`${API_URL}/bookings/${bookingId}/cancel`);
      
      // Update bookings state
      const updatedBookings = bookings.map(booking => 
        booking.id === bookingId ? {...booking, status: 'cancelled'} : booking
      );
      setBookings(updatedBookings);
    } catch (err) {
      alert(err.response?.data?.message || 'Cancellation failed. Please try again.');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <Router>
      <div className="app-container">
        <Navbar 
          isLoggedIn={isLoggedIn} 
          setCurrentPage={setCurrentPage} 
          setShowLoginModal={setShowLoginModal} 
          handleLogout={handleLogout} 
          user={user}
        />

        <Routes>
          <Route path="/" element={<Welcome setCurrentPage={setCurrentPage} />} />
          <Route path="/rooms" element={
            <Home 
              rooms={rooms} 
              currentPage="home" 
              setCurrentPage={setCurrentPage} 
              isLoggedIn={isLoggedIn}
              setShowLoginModal={setShowLoginModal}
            />
          } />
          <Route path="/offers" element={
            <SpecialOffers 
              specialOffers={specialOffers} 
              handleBookOffer={handleBookOffer} 
              currentPage="offers" 
              setCurrentPage={setCurrentPage} 
            />
          } />
          <Route path="/about" element={
            <AboutUs 
              aboutUsContent={aboutUsContent} 
              currentPage="about" 
              setCurrentPage={setCurrentPage} 
            />
          } />
          <Route path="/dashboard" element={
            isLoggedIn ? (
              <Dashboard 
                rooms={rooms} 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery} 
                handleBooking={handleBooking} 
                setCurrentPage={setCurrentPage} 
              />
            ) : (
              <Navigate to="/" replace />
            )
          } />
          <Route path="/booking-form" element={
            isLoggedIn && selectedRoom ? (
              <BookingForm 
                room={selectedRoom}
                onDateSelection={handleDateSelection}
                bookingDates={bookingDates}
                setCurrentPage={setCurrentPage}
              />
            ) : (
              <Navigate to="/" replace />
            )
          } />
          <Route path="/payment" element={
            isLoggedIn && selectedRoom && bookingDates.checkIn && bookingDates.checkOut ? (
              <PaymentPage 
                room={selectedRoom}
                bookingDates={bookingDates}
                onConfirmPayment={confirmBooking}
                setCurrentPage={setCurrentPage}
              />
            ) : (
              <Navigate to="/" replace />
            )
          } />
          <Route path="/booking-confirmation" element={
            isLoggedIn && currentBooking ? (
              <BookingConfirmation 
                booking={currentBooking}
                setCurrentPage={setCurrentPage}
              />
            ) : (
              <Navigate to="/" replace />
            )
          } />
          <Route path="/my-bookings" element={
            isLoggedIn ? (
              <MyBookings 
                bookings={bookings}
                onCancelBooking={cancelBooking}
                setCurrentPage={setCurrentPage}
              />
            ) : (
              <Navigate to="/" replace />
            )
          } />
        </Routes>
        
        {showLoginModal && (
          <Login 
            setShowLoginModal={setShowLoginModal}
            setShowRegisterModal={setShowRegisterModal}
            handleLogin={handleLogin}
            loginEmail={loginEmail}
            setLoginEmail={setLoginEmail}
            loginPassword={loginPassword}
            setLoginPassword={setLoginPassword}
          />
        )}
        
        {showRegisterModal && (
          <Register 
            setShowRegisterModal={setShowRegisterModal}
            setShowLoginModal={setShowLoginModal}
            handleRegister={handleRegister}
            registerName={registerName}
            setRegisterName={setRegisterName}
            registerEmail={registerEmail}
            setRegisterEmail={setRegisterEmail}
            registerPassword={registerPassword}
            setRegisterPassword={setRegisterPassword}
          />
        )}
      </div>
    </Router>
  );
}

export default App;