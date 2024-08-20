import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const client = new ApolloClient({
  link: new HttpLink({
    uri: "/api/graphql", // Replace with the actual GraphQL server URL
  }),
  cache: new InMemoryCache(),
});

export default client;
