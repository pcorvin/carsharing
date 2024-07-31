import { useState, useEffect } from 'react';
import { calculatePrices } from '../utils/priceService';
import { geocodeAddress } from '../utils/geocodingService';
import styles from '../styles/PriceCalculator.module.css';

function PriceCalculator({ onDestinationChange, route }) {
  const [destinationInput, setDestinationInput] = useState('');
  const [prices, setPrices] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    console.log("Geocoding address:", destinationInput);
    try {
      const coordinates = await geocodeAddress(destinationInput);
      console.log("Geocoded coordinates:", coordinates);
      onDestinationChange(coordinates);
    } catch (error) {
      console.error("Geocoding error:", error);
      setError('Failed to geocode address. Please try again.');
    }
  };

  useEffect(() => {
    if (route) {
      console.log("Calculating prices for route:", route);
      const allPrices = calculatePrices(route);
      console.log("Calculated prices:", allPrices);
      setPrices(allPrices);
    }
  }, [route]);

  return (
    <div className={styles.calculator}>
      <h2>Ride Calculator</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          value={destinationInput} 
          onChange={(e) => setDestinationInput(e.target.value)} 
          placeholder="Enter destination address"
          className={styles.input}
        />
        <button type="submit" className={styles.button}>Set Destination</button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
      
      {route && (
        <div className={styles.routeInfo}>
          <h3>Route Information:</h3>
          <p>Distance: {(route.distance / 1000).toFixed(2)} km</p>
          <p>Duration: {Math.round(route.duration / 60)} min</p>
        </div>
      )}

      {prices && (
        <div className={styles.prices}>
          <h3>Estimated Prices:</h3>
          {Object.entries(prices).map(([provider, providerPrices]) => (
            <div key={provider} className={styles.providerPrices}>
              <h4>{provider}</h4>
              {Object.entries(providerPrices).map(([carType, price]) => (
                <p key={carType}>{carType}: €{price.toFixed(2)}</p>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PriceCalculator;