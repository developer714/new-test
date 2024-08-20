import React, { useEffect, useState, useRef } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import Chart from "chart.js/auto";
import "chartjs-adapter-moment";

const GET_TOKEN_PAIRS_DATA = gql`
  query GetTokenPairsData($pairs: [String!]!) {
    tokenPairs(pairs: $pairs) {
      pairAddress
      baseToken {
        symbol
      }
      quoteToken {
        symbol
      }
      priceUsd
      dexId
      volume {
        h24
      }
      priceChange {
        m5
      }
      historicalPriceData {
        timestamp
        price
      }
      liquidity {
        usd
      }
      isOnWatchlist
    }
  }
`;

const TOGGLE_WATCHLIST = gql`
  mutation ToggleWatchlist($pairAddress: String!) {
    toggleWatchlist(pairAddress: $pairAddress) {
      pairAddress
      isOnWatchlist
    }
  }
`;

const TokenPairs = () => {
  const [search, setSearch] = useState("");
  const [pairs, setPairs] = useState(["SOL/USDC", "WIF/SOL", "AURA/SOL"]);
  const chartRefs = useRef({});
  const chartInstances = useRef({});
  const { loading, error, data, refetch } = useQuery(GET_TOKEN_PAIRS_DATA, {
    variables: { pairs },
  });
  const [toggleWatchlist] = useMutation(TOGGLE_WATCHLIST);

  useEffect(() => {
    if (data) {
      data.tokenPairs.forEach((pair) => {
        const ctx = document.getElementById(`chart-${pair.pairAddress}`);
        if (pair.historicalPriceData && ctx) {
          if (chartInstances.current[pair.pairAddress]) {
            chartInstances.current[pair.pairAddress].destroy();
          }
          chartInstances.current[pair.pairAddress] = new Chart(ctx, {
            type: "line",
            data: {
              labels: pair.historicalPriceData.map((data) =>
                new Date(data.timestamp).toLocaleDateString()
              ),
              datasets: [
                {
                  label: "Price",
                  data: pair.historicalPriceData.map((data) => data.price),
                  borderColor: "rgba(75, 192, 192, 1)",
                  borderWidth: 1,
                },
              ],
            },
            options: {
              scales: {
                x: {
                  type: "time",
                  time: {
                    unit: "day",
                  },
                },
              },
            },
          });
        }
      });
    }
  }, [data]);

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 60000); // Fetch updated data every 60 seconds

    return () => clearInterval(interval);
  }, [refetch]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (search) {
      setPairs([search]);
    } else {
      setPairs(["SOL/USDC", "WIF/SOL", "AURA/SOL"]);
    }
  };

  const handleWatchlistToggle = async (pairAddress) => {
    try {
      await toggleWatchlist({ variables: { pairAddress } });
      refetch();
    } catch (error) {
      console.error("Error toggling watchlist:", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search token pairs"
      />
      <button onClick={handleSearch}>Search</button>
      {data.tokenPairs.map((pair) => (
        <div key={pair.pairAddress}>
          <h2>
            {pair.baseToken.symbol}/{pair.quoteToken.symbol}
          </h2>
          <p>Price (USD): {pair.priceUsd}</p>
          <p>DEX: {pair.dexId}</p>
          <p>24-Hour Volume: {pair.volume.h24}</p>
          <p>5-Minute Price Update: {pair.priceChange.m5}</p>
          <p>Liquidity (USD): {pair.liquidity.usd}</p>
          <p>Is On Watchlist: {pair.isOnWatchlist ? "Yes" : "No"}</p>
          <button onClick={() => handleWatchlistToggle(pair.pairAddress)}>
            {pair.isOnWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
          </button>
          <canvas
            id={`chart-${pair.pairAddress}`}
            width="400"
            height="200"
          ></canvas>
        </div>
      ))}
    </div>
  );
};

export default TokenPairs;
