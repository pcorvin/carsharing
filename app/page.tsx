"use client";
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import PriceCalculator from '../utils/PriceCalculator';
import styles from '../styles/Home.module.css';

const Map = dynamic(() => import('../utils/Map'), { ssr: false });

interface Coordinates {
  longitude: number;
  latitude: number;
}

interface Route {
  distance: number;
  duration: number;
  geometry: any; // You might want to define a more specific type for geometry
}

export default function Home() {
  const [destination, setDestination] = useState<[number, number] | null>(null);
  const [route, setRoute] = useState<Route | null>(null);

  const handleDestinationChange = async (newDestination: Coordinates) => {
    console.log("New destination set:", newDestination);
    setDestination([newDestination.longitude, newDestination.latitude]);
  };

  useEffect(() => {
    if (destination) {
      console.log("Fetching route for destination:", destination);
      fetchRoute([13.408964, 52.537874], destination);
    }
  }, [destination]);

  const fetchRoute = async (start: [number, number], end: [number, number]) => {
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
        startPoint={[13.408964, 52.537874]}
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