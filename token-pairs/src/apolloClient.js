import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const client = new ApolloClient({
  link: new HttpLink({
    uri: "https://new-test-token-pairs-vny8.vercel.app", // Replace with the actual GraphQL server URL
  }),
  cache: new InMemoryCache(),
});

export default client;
