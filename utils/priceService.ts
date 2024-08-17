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

interface PriceStructure {
  [provider: string]: {
    [carType: string]: number;
  };
}

const providers = {
  Bolt: {
    cars: {
      Economy: { perMinute: 0.15, perKm: 0.27 },
    },
    baseFare: 0
  },
  ShareNow: {
    cars: {
      Small: { perMinute: 0.39, perKm: 0 },
      Medium: { perMinute: 0.39, perKm: 0 },
      Large: { perMinute: 0.45, perKm: 0 }
    },
    baseFare: 0.99
  },
  Sixt: {
    cars: {
      Economy: { perMinute: 0.35, perKm: 0 },
      Premium: { perMinute: 0.4, perKm: 0 }
    },
    baseFare: 1
  },
  Miles: {
    cars: {
      Small: { perMinute: 0, perKm: 0.98 },
      Van: { perMinute: 0, perKm: 1.29 }
    },
    baseFare: 1
  }
};

export const calculatePrices = (route: Route) => {
  const distanceKm = route.distance / 1000;
  const durationMinutes = route.duration / 60;

  const prices: PriceStructure = {};

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