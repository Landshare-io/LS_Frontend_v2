import React from "react";
import type { NextPage } from 'next';
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { Inter_Tight } from 'next/font/google';
import DAO from "../components/dao";

const client = new ApolloClient({
  uri: "https://hub.snapshot.org/graphql",
  cache: new InMemoryCache(),
});

const interTight = Inter_Tight({
  weight: "400",
  style: "normal",
  preload: false,
  variable: '--font-inter'
});

const DAOPage: NextPage = () => {
  return (
    <ApolloProvider client={client}>
      <div className={`${interTight.variable} font-inter`}>
        <DAO />
      </div>
    </ApolloProvider>
  );
};

export default DAOPage;
