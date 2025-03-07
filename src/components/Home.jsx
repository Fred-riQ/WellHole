import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home({ rooms, setCurrentPage, isLoggedIn, setShowLoginModal }) {
  const navigate = useNavigate();

  const handleBooking = (room) => {
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      setShowLoginModal(true);
    }
  };

  return (
    <>
      <div className="rooms-title-container">
        <h1 className="rooms-title">Rooms & Suites</h1>
      </div>

      <div className="rooms-container">
        {rooms.length > 0 ? (
          rooms.map((room, index) => (
            <div key={index} className="room-card">
              <img src={room.image} alt={room.type} className="room-image" />
              <h2 className="room-title">{room.type}</h2>
              <p className="room-description">{room.description}</p>
              <p className="price">Ksh {room.price} per night</p>
              <button 
                onClick={() => handleBooking(room)} 
                className="book-button"
                aria-label={`Book ${room.type}`}
              >
                BOOK NOW
              </button>
            </div>
          ))
        ) : (
          <p className="no-rooms-message">No rooms available at the moment.</p>
        )}
      </div>
    </>
  );
}

export default Home;
