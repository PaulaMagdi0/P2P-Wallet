import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'

// The backend GraphQL endpoint
const backendAPI = 'http://localhost:8000/graphql'

const client = new ApolloClient({
  link: new HttpLink({
    uri: backendAPI,
  }),
  cache: new InMemoryCache(),
})

console.log('ApolloClient instance created in apollo-client.ts:', client)

export default client
