import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiY29ydmluZW56aSIsImEiOiJjbHphMWpldzkwZTB6MnFzYWZxbHRyMzl1In0.4HKIQNTWjqSZ9E1FUER4SQ';

function Map({ startPoint, destination, route }) {
    const mapContainer = useRef(null);
    const map = useRef(null);
  
    useEffect(() => {
      if (map.current) return; // Initialize map only once
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: startPoint,
        zoom: 12
      });
  
      // Add start point marker
      new mapboxgl.Marker({ color: '#FF0000' })
        .setLngLat(startPoint)
        .addTo(map.current);
    }, [startPoint]);
  
    useEffect(() => {
      if (!map.current || !destination) return;
      // Add destination marker
      new mapboxgl.Marker({ color: '#00FF00' })
        .setLngLat(destination)
        .addTo(map.current);
  
      // Fit map to show both start and destination
      const bounds = new mapboxgl.LngLatBounds();
      bounds.extend(startPoint);
      bounds.extend(destination);
      map.current.fitBounds(bounds, { padding: 50 });
    }, [destination, startPoint]);
  
    useEffect(() => {
      if (!map.current || !route) return;
      // Add route to the map
      if (map.current.getSource('route')) {
        map.current.removeLayer('route');
        map.current.removeSource('route');
      }
      map.current.addLayer({
        id: 'route',
        type: 'line',
        source: {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: route.geometry
          }
        },
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#3887be',
          'line-width': 5,
          'line-opacity': 0.75
        }
      });
    }, [route]);
  
    return <div ref={mapContainer} style={{ width: '100%', height: '100vh' }} />;
  }
  
  export default Map;