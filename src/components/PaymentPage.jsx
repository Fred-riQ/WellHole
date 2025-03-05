import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaMoneyBillWave, FaCreditCard, FaMobile } from 'react-icons/fa';
import './PaymentPage.css';

function PaymentPage({ room, bookingDates, onConfirmPayment, setCurrentPage }) {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  const calculateNights = () => {
    if (!bookingDates.checkIn || !bookingDates.checkOut) return 0;
    const diffTime = Math.abs(bookingDates.checkOut - bookingDates.checkIn);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    return nights * room.price;
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (paymentMethod === 'mpesa') {
      if (!phoneNumber) {
        newErrors.phoneNumber = 'Phone number is required';
      } else if (!/^(?:\+254|0)[17]\d{8}$/.test(phoneNumber)) {
        newErrors.phoneNumber = 'Please enter a valid Kenyan phone number';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsProcessing(true);
      
      // Simulate payment processing
      setTimeout(() => {
        const paymentDetails = {
          method: paymentMethod,
          amount: calculateTotal(),
          transactionId: 'MPESA' + Math.floor(Math.random() * 1000000),
          phoneNumber: phoneNumber,
          timestamp: new Date()
        };
        
        onConfirmPayment(paymentDetails);
        setIsProcessing(false);
      }, 2000);
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="payment-container">
      <div className="payment-header">
        <h1>Payment</h1>
        <p>Complete your booking by making a payment</p>
      </div>
      
      <div className="payment-content">
        <div className="booking-details">
          <h2>Booking Details</h2>
          
          <div className="booking-summary-card">
            <img src={room.image} alt={room.type} className="summary-room-image" />
            
            <div className="summary-details">
              <h3>{room.type}</h3>
              
              <div className="summary-item">
                <span>Check-in:</span>
                <span>{formatDate(bookingDates.checkIn)}</span>
              </div>
              
              <div className="summary-item">
                <span>Check-out:</span>
                <span>{formatDate(bookingDates.checkOut)}</span>
              </div>
              
              <div className="summary-item">
                <span>Number of Nights:</span>
                <span>{calculateNights()}</span>
              </div>
              
              <div className="summary-item">
                <span>Price per Night:</span>
                <span>${room.price}</span>
              </div>
              
              <div className="summary-item total">
                <span>Total Amount:</span>
                <span>${calculateTotal()}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="payment-methods">
          <h2>Payment Method</h2>
          
          <div className="payment-options">
            <div 
              className={`payment-option ${paymentMethod === 'mpesa' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('mpesa')}
            >
              <FaMobile className="payment-icon" />
              <span>M-Pesa</span>
            </div>
            
            <div 
              className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('card')}
            >
              <FaCreditCard className="payment-icon" />
              <span>Credit Card</span>
              <span className="coming-soon">Coming Soon</span>
            </div>
            
            <div 
              className={`payment-option ${paymentMethod === 'bank' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('bank')}
            >
              <FaMoneyBillWave className="payment-icon" />
              <span>Bank Transfer</span>
              <span className="coming-soon">Coming Soon</span>
            </div>
          </div>
          
          {paymentMethod === 'mpesa' && (
            <form className="mpesa-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="phone-number">M-Pesa Phone Number</label>
                <input 
                  type="text" 
                  id="phone-number" 
                  placeholder="e.g., 254712345678" 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={isProcessing}
                />
                {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
              </div>
              
              <div className="payment-instructions">
                <h3>How to Pay with M-Pesa</h3>
                <ol>
                  <li>Enter your M-Pesa registered phone number above</li>
                  <li>Click on "Pay Now" button</li>
                  <li>You will receive a prompt on your phone</li>
                  <li>Enter your M-Pesa PIN to complete the payment</li>
                 <li>Once payment is confirmed, you'll receive a confirmation message</li>
                </ol>
              </div>
              
              <button 
                type="submit" 
                className="pay-button"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Pay Now'} <FaLock />
              </button>
              
              <p className="secure-payment-note">
                <FaLock /> All payments are secure and encrypted
              </p>
            </form>
          )}
          
          {(paymentMethod === 'card' || paymentMethod === 'bank') && (
            <div className="coming-soon-message">
              <p>This payment method will be available soon. Please use M-Pesa for now.</p>
              <button 
                className="switch-to-mpesa"
                onClick={() => setPaymentMethod('mpesa')}
              >
                Switch to M-Pesa
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;