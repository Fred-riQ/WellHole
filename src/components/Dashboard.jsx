import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import './Dashboard.css';

function Dashboard({ rooms, searchQuery, setSearchQuery, handleBooking, setCurrentPage }) {
  const navigate = useNavigate();

  const filteredRooms = useMemo(() => {
    return searchQuery
      ? rooms.filter(room => 
          room.type.toLowerCase().includes(searchQuery.toLowerCase()) || 
          room.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : rooms;
  }, [rooms, searchQuery]);

  const handleBookNow = (room) => {
    handleBooking(room);
    navigate('/booking-form');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">PROCEED TO BOOK ROOMS</h1>
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search room type or amenities" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            aria-label="Search rooms"
          />
          <button className="search-button" aria-label="Search">
            <FaSearch /> Search
          </button>
        </div>
      </div>
      
      <div className="dashboard-rooms">
        {filteredRooms.length > 0 ? (
          filteredRooms.map((room, index) => (
            <div key={index} className="dashboard-room-card">
              <img src={room.image} alt={room.type} className="dashboard-room-image" />
              <h2 className="dashboard-room-title">{room.type}</h2>
              <p className="dashboard-room-details">MAX {room.maxGuests} GUESTS / {room.bedConfig}</p>
              <button 
                className="dashboard-book-button"
                onClick={() => handleBookNow(room)}
                aria-label={`Book ${room.type}`}
              >
                Book Now
              </button>
            </div>
          ))
        ) : (
          <p className="no-results-message">No rooms found. Try a different search.</p>
        )}
      </div>
      
      <button 
        className="back-to-home-button"
        onClick={() => setCurrentPage('home')}
        aria-label="Back to Home"
      >
        BACK TO HOME
      </button>
    </div>
  );
}

export default Dashboard;
