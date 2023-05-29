import Header from '../components/Header';
import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { MoralisProvider } from 'react-moralis';
import { NotificationProvider } from 'web3uikit';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: 'https://api.studio.thegraph.com/query/47569/gnosis-nft-marketplace/version/latest',
});

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <div>
      <Head>
        <title>Smart Contract Lottery</title>
        <meta name="description" content="Smart Contract Lottery" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MoralisProvider initializeOnMount={false}>
        <ApolloProvider client={client}>
          <NotificationProvider>
            <Header />
            <Component {...pageProps} />
          </NotificationProvider>
        </ApolloProvider>
      </MoralisProvider>
    </div>
  );
};

export default MyApp;
