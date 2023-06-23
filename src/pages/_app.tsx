import Header from '../components/Header';
import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { MoralisProvider } from 'react-moralis';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <div>
      <Head>
        <title>Smart Contract Lottery</title>
        <meta name="description" content="Rock Paper Scissors" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MoralisProvider initializeOnMount={false}>
        <Header />
        <Component {...pageProps} />
      </MoralisProvider>
    </div>
  );
};

export default MyApp;
