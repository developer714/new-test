const axios = require('axios');

let watchlist = {};

const resolvers = {
  Query: {
    tokenPairs: async (_, { pairs }) => {
      const fetchTokenPairData = async (pair) => {
        try {
          const response = await axios.get('https://api.dexscreener.com/latest/dex/search', {
            params: { q: pair },
          });
          const pairData = response.data.pairs[0];

          // Add sample historical price data for demonstration purposes
          const historicalPriceData = Array.from({ length: 30 }, (_, i) => ({
            timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
            price: pairData.priceUsd * (1 + Math.random() * 0.1 - 0.05), // Random price variation
          })).reverse();

          return {
            ...pairData,
            historicalPriceData,
            isOnWatchlist: watchlist[pairData.pairAddress] || false,
          };
        } catch (error) {
          console.error(`Error fetching data for pair ${pair}:`, error);
          throw new Error(`Failed to fetch data for pair ${pair}`);
        }
      };

      const promises = pairs.map(pair => fetchTokenPairData(pair));
      return await Promise.all(promises);
    },
  },
  Mutation: {
    toggleWatchlist: (_, { pairAddress }) => {
      watchlist[pairAddress] = !watchlist[pairAddress];
      return { pairAddress, isOnWatchlist: watchlist[pairAddress] };
    },
  },
};

module.exports = resolvers;