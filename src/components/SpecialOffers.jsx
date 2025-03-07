import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import './SpecialOffers.css';

function SpecialOffers({ specialOffers, handleBookOffer, currentPage, setCurrentPage }) {
  return (
    <div className="special-offers-container">
      <h1 className="special-offers-title">Special Offers</h1>

      {specialOffers.length === 0 ? (
        <p className="no-offers-message">No special offers available at the moment.</p>
      ) : (
        <div className="offers-grid">
          {specialOffers.map((offer) => (
            <div key={offer.id} className="offer-card">
              <img src={offer.image} alt={offer.title} className="offer-image" />
              <div className="offer-content">
                <h2 className="offer-title">{offer.title}</h2>
                <div className="offer-details">
                  <ol>
                    {(offer.details || []).map((detail, index) => (
                      <li key={index}>
                        {detail.title && <strong>{detail.title}</strong>}
                        {detail.title && <br />}
                        <p>~{detail.description}</p>
                      </li>
                    ))}
                  </ol>
                </div>
                <button 
                  className="book-offer-button"
                  onClick={() => handleBookOffer(offer)}
                >
                  BOOK THIS PACKAGE
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="page-navigation">
        <button 
          className={`page-button ${currentPage === 'home' ? 'active' : ''}`}
          onClick={() => setCurrentPage('home')}
        >
          <FaArrowLeft /> Rooms
        </button>
        <button 
          className={`page-button ${currentPage === 'offers' ? 'active' : ''}`}
          onClick={() => setCurrentPage('offers')}
        >
          Special Offers
        </button>
        <button 
          className={`page-button ${currentPage === 'about' ? 'active' : ''}`}
          onClick={() => setCurrentPage('about')}
        >
          About Us <FaArrowRight />
        </button>
      </div>
    </div>
  );
}

export default SpecialOffers;
