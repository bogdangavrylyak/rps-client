import type { NextPage } from 'next';
import networkMapping from '../constants/networkMapping.json';
import { useMoralis } from 'react-moralis';
import { GET_ACTIVE_ITEMS } from '../constants/subgraphQueries';
import { useQuery } from '@apollo/client';
import NFTBox from '../components/NFTBox';

type NetworkMapping = {
  [key: string]: {
    NftMarketplace: string[];
  };
};

const mapping: NetworkMapping = networkMapping;

interface nftInterface {
  price: number;
  nftAddress: string;
  tokenId: string;
  address: string;
  seller: string;
}

interface contractAddressesInterface {
  [key: string]: contractAddressesItemInterface;
}

interface contractAddressesItemInterface {
  [key: string]: string[];
}

const Home: NextPage = () => {
  const { isWeb3Enabled, chainId } = useMoralis();
  const chainString = chainId ? parseInt(chainId).toString() : '31337';
  const marketplaceAddress = mapping[chainString].NftMarketplace[0];

  const { loading, error, data: listedNfts } = useQuery(GET_ACTIVE_ITEMS);

  console.log('listedNfts: ', listedNfts);
  console.log('loading: ', loading);

  return (
    <div className="container mx-auto">
      <h1 className="py-4 px-4 font-bold text-2xl">Recently Listed</h1>
      <div className="flex flex-wrap">
        {isWeb3Enabled ? (
          loading || !listedNfts ? (
            <div>Loading...</div>
          ) : (
            listedNfts.activeItems.map((nft: nftInterface /*, index*/) => {
              const { price, nftAddress, tokenId, seller } = nft;

              return (
                <NFTBox
                  price={price}
                  nftAddress={nftAddress}
                  tokenId={tokenId}
                  nftMarketplaceAddress={marketplaceAddress!}
                  seller={seller}
                  key={`${nftAddress}${tokenId}`}
                />
              );
            })
          )
        ) : (
          <div>Web3 Currently Not Enabled</div>
        )}
      </div>
    </div>
  );
};

export default Home;
