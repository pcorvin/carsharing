interface Route {
  distance: number;
  duration: number;
}

interface CarRates {
  perMinute: number;
  perKm: number;
}

interface ProviderData {
  cars: {
    [key: string]: CarRates;
  };
  baseFare: number;
}

const providers: { [key: string]: ProviderData } = {
  // ... (keep your existing providers data here)
};

export const calculatePrices = (route: Route) => {
  const distanceKm = route.distance / 1000;
  const durationMinutes = route.duration / 60;

  const prices: { [key: string]: { [key: string]: number } } = {};

  for (const [providerName, providerData] of Object.entries(providers)) {
    prices[providerName] = {};
    for (const [carType, rates] of Object.entries(providerData.cars)) {
      const price = providerData.baseFare + 
                    (distanceKm * rates.perKm) + 
                    (durationMinutes * rates.perMinute);
      prices[providerName][carType] = Math.round(price * 100) / 100; // Round to 2 decimal places
    }
  }

  return prices;
};