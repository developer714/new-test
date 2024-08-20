import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const client = new ApolloClient({
  link: new HttpLink({
    uri: "http://localhost:4000", // Replace with the actual GraphQL server URL
  }),
  cache: new InMemoryCache(),
});

export default client;
