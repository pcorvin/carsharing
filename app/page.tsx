"use client";
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import PriceCalculator from '../utils/PriceCalculator';
import styles from '../styles/Home.module.css';

const Map = dynamic(() => import('../utils/Map'), { ssr: false });

// Fixed starting point (example: Berlin Hauptbahnhof)
const FIXED_START_POINT = [13.408955, 52.537865];

export default function Home() {
  const [destination, setDestination] = useState(null);
  const [route, setRoute] = useState(null);

  const handleDestinationChange = async (newDestination) => {
    console.log("New destination set:", newDestination);
    setDestination([newDestination.longitude, newDestination.latitude]);
  };

  useEffect(() => {
    if (destination) {
      console.log("Fetching route for destination:", destination);
      fetchRoute(FIXED_START_POINT, destination);
    }
  }, [destination]);

  const fetchRoute = async (start, end) => {
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&steps=true&access_token=pk.eyJ1IjoiY29ydmluZW56aSIsImEiOiJjbHphMWpldzkwZTB6MnFzYWZxbHRyMzl1In0.4HKIQNTWjqSZ9E1FUER4SQ`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log("Route data received:", data);
      setRoute(data.routes[0]);  // Set the first (best) route
    } catch (error) {
      console.error('Error fetching route:', error);
    }
  };

  return (
    <div className={styles.container}>
      <Map 
        startPoint={FIXED_START_POINT}
        destination={destination}
        route={route}
      />
      <div className={styles.overlay}>
        <PriceCalculator 
          onDestinationChange={handleDestinationChange}
          route={route}
        />
      </div>
    </div>
  );
}