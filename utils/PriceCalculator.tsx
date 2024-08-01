import { useState, useEffect } from 'react';
import { calculatePrices } from './priceService';
import { geocodeAddress } from './geocodingService';
import styles from '../styles/PriceCalculator.module.css';

interface Coordinates {
  longitude: number;
  latitude: number;
}

interface Route {
  distance: number;
  duration: number;
  geometry: any; // You might want to define a more specific type for geometry
}

interface PriceCalculatorProps {
  onDestinationChange: (coordinates: Coordinates) => void;
  route: Route | null;
}

function PriceCalculator({ onDestinationChange, route }: PriceCalculatorProps) {
  const [destinationInput, setDestinationInput] = useState('');
  const [prices, setPrices] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
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