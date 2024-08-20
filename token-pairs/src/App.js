import React from "react";
import { ApolloProvider } from "@apollo/client";
import client from "./apolloClient";
import TokenPairs from "./components/TokenPairs";

const App = () => {
  return (
    <ApolloProvider client={client}>
      <div>
        <h1>Token Pairs Data</h1>
        <TokenPairs />
      </div>
    </ApolloProvider>
  );
};

export default App;
