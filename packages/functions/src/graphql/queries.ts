import { gql } from "graphql-request";

export const HELLO_QUERY = gql`
  query Hello {
    hello
  }
`;
