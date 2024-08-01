const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiY29ydmluZW56aSIsImEiOiJjbHphMWpldzkwZTB6MnFzYWZxbHRyMzl1In0.4HKIQNTWjqSZ9E1FUER4SQ';

interface Coordinates {
  longitude: number;
  latitude: number;
}

export const geocodeAddress = async (address: string): Promise<Coordinates> => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${MAPBOX_ACCESS_TOKEN}&limit=1`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const [longitude, latitude] = data.features[0].center;
      return { longitude, latitude };
    } else {
      throw new Error('No results found');
    }
  } catch (error) {
    console.error('Geocoding error:', error);
    throw error;
  }
};