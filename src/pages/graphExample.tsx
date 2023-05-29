import type { NextPage } from 'next';
import styles from '../styles/Home.module.scss';
import { useQuery, gql } from '@apollo/client';

const GET_ACTIVE_ITEM = gql`
  {
    activeItems(first: 5, where: { buyer: "0x00000000" }) {
      id
      seller
      nftAddress
      tokenId
      price
    }
  }
`;

const GraphExample: NextPage = () => {
  const { loading, error, data } = useQuery(GET_ACTIVE_ITEM);
  console.log('data: ', data);
  return <div className={styles.container}>Graph</div>;
};

export default GraphExample;
