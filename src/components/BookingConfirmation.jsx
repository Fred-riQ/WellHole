import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaCalendarAlt, FaUser, FaCreditCard, FaHome } from 'react-icons/fa';
import './BookingConfirmation.css';

function BookingConfirmation({ booking, setCurrentPage }) {
  const navigate = useNavigate();

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateNights = () => {
    if (!booking.checkIn || !booking.checkOut) return 0;
    const checkInDate = new Date(booking.checkIn);
    const checkOutDate = new Date(booking.checkOut);
    const diffTime = Math.abs(checkOutDate - checkInDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleViewBookings = () => {
    setCurrentPage('my-bookings');
    navigate('/my-bookings');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    navigate('/rooms');
  };

  return (
    <div className="confirmation-container">
      <div className="confirmation-header">
        <FaCheckCircle className="confirmation-icon" />
        <h1>Booking Confirmed!</h1>
        <p>Thank you for choosing The Wellhall Hotel. Your booking has been confirmed.</p>
      </div>

      <div className="confirmation-content">
        <div className="confirmation-card">
          <h2>Booking Details</h2>

          <div className="confirmation-info">
            <div className="info-item">
              <FaCalendarAlt className="info-icon" />
              <div>
                <h3>Stay Dates</h3>
                <p>Check-in: {formatDate(booking.checkIn)}</p>
                <p>Check-out: {formatDate(booking.checkOut)}</p>
                <p>Duration: {calculateNights()} night(s)</p>
              </div>
            </div>

            <div className="info-item">
              <FaUser className="info-icon" />
              <div>
                <h3>Guest Information</h3>
                <p>Name: {booking.user.name}</p>
                <p>Email: {booking.user.email}</p>
              </div>
            </div>

            <div className="info-item">
              <FaCreditCard className="info-icon" />
              <div>
                <h3>Payment Information</h3>
                <p>Method: {booking.paymentDetails.method === 'mpesa' ? 'M-Pesa' : booking.paymentDetails.method}</p>
                <p>Transaction ID: {booking.paymentDetails.transactionId}</p>
                <p>Amount: ${parseFloat(booking.paymentDetails.amount).toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="room-confirmation">
          <img src={booking.room.image} alt={booking.room.type} className="confirmation-room-image" />
          <div className="room-confirmation-details">
            <h3>{booking.room.type}</h3>
            <p>{booking.room.description}</p>
            <p className="room-price">${parseFloat(booking.room.price).toFixed(2)} per night</p>
          </div>
        </div>

        <div className="confirmation-message">
          <p>A confirmation email has been sent to <strong>{booking.user.email}</strong> with all the details of your booking.</p>
          <p>If you have any questions or need to make changes to your reservation, please contact our customer service.</p>
        </div>

        <div className="confirmation-actions">
          <button className="view-bookings-button" onClick={handleViewBookings} aria-label="View My Bookings">
            View My Bookings
          </button>
          <button className="back-to-home-button" onClick={handleBackToHome} aria-label="Back to Home">
            <FaHome /> Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookingConfirmation;
