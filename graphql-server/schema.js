const { gql } = require('apollo-server');

const typeDefs = gql`
  type TokenPair {
    pairAddress: String
    baseToken: Token
    quoteToken: Token
    priceUsd: Float
    dexId: String
    volume: Volume
    priceChange: PriceChange
    historicalPriceData: [HistoricalPrice]
    liquidity: Liquidity
    isOnWatchlist: Boolean
  }

  type Token {
    symbol: String
  }

  type Volume {
    h24: Float
  }

  type PriceChange {
    m5: Float
  }

  type HistoricalPrice {
    timestamp: String
    price: Float
  }

  type Liquidity {
    usd: Float
  }

  type Query {
    tokenPairs(pairs: [String!]!): [TokenPair]
  }

  type Mutation {
    toggleWatchlist(pairAddress: String!): TokenPair
  }
`;

module.exports = typeDefs;