import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { useMoralis } from 'react-moralis';
import { BigNumber, EventFilter, ethers } from 'ethers';
import { contractAddresses, contractAbi } from '../constants';
import { RockPaperScissors } from '../typechain-types';
import detectProvider from '@metamask/detect-provider';

type NetworkMapping = {
  [key: string]: string[];
};

const mapping: NetworkMapping = contractAddresses;

enum Choice {
  Rock = 'Rock',
  Paper = 'Paper',
  Scissors = 'Scissors',
}

const Home: NextPage = () => {
  const [provider, setProvider] = useState<
    ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider | null
  >(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [gameId, setGameId] = useState<number>(0);
  const [result, setResult] = useState<string>('');
  const [choice, setChoice] = useState<Choice | null>(null);
  const [salt, setSalt] = useState<string | null>(null);
  const [winner, setWinner] = useState<string | null>(null);
  const { isWeb3Enabled, chainId, Moralis } = useMoralis();
  console.log('chainId: ', chainId);
  const chainString = chainId ? parseInt(chainId).toString() : '31337';
  console.log('chainString: ', chainString);

  const contractAddress = mapping[chainString][0];

  console.log('contractAddress: ', contractAddress);

  const connectProvider = async () => {
    if (window.ethereum) {
      try {
        // await window.ethereum.enable();
        // const provider = new ethers.providers.Web3Provider(window.ethereum);
        // const provider = new ethers.providers.JsonRpcProvider(
        //   'https://rpc.gnosischain.com',
        // );
        const metamaskProvider = await detectProvider();

        console.log('metamaskProvider: ', metamaskProvider);

        const provider = new ethers.providers.Web3Provider(
          metamaskProvider as ethers.providers.ExternalProvider,
        );
        console.log('provider: ', provider);
        setProvider(provider);
        const signer = provider.getSigner();

        const contractInstance = new ethers.Contract(
          contractAddress,
          contractAbi,
          signer,
        ) as RockPaperScissors;
        setContract(contractInstance);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log('Metamask not detected');
    }
  };

  useEffect(() => {
    connectProvider();
    // const provider = new ethers.providers.JsonRpcProvider(
    //   'https://rpc.eu-central-2.gateway.fm/v1/gnosis/non-archival/mainnet',
    // );
    // const contract = new ethers.Contract(
    //   contractAddress,
    //   contractAbi,
    //   provider,
    // );

    // const gameFinishedFilter = contract?.filters.GameFinished();
    // const onGameFinished = async (
    //   gameId: string,
    //   winner: string,
    //   winningChoice: string,
    //   loser: string,
    //   losingChoice: string,
    // ) => {
    //   console.log(
    //     'GameFinished event:',
    //     gameId,
    //     winner,
    //     winningChoice,
    //     loser,
    //     losingChoice,
    //   );
    //   setWinner(winner);
    // };

    // contract?.on(gameFinishedFilter as string | EventFilter, onGameFinished);

    // return () => {
    //   contract?.off(gameFinishedFilter as string | EventFilter, onGameFinished);
    // };
  }, []);

  const generateRandomString = (length: number) => {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }

    return result;
  };

  const createGame = async () => {
    try {
      console.log('choice: ', choice);
      if (provider && contract && choice !== null) {
        const accounts = await provider.listAccounts();
        console.log('accounts: ', accounts);
        // const accounts = await provider.getSigner();
        // console.log('accounts: ', accounts);
        const player1 = accounts[0];

        // const randomSalt = generateRandomString(66);
        // const randomBytes = ethers.utils.randomBytes(32);
        // const randomSalt = ethers.utils.hexlify(randomBytes);
        // setSalt(randomSalt);
        // console.log('randomSalt: ', randomSalt);

        // const encodedSalt = ethers.utils.formatBytes32String(
        //   '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
        // );
        // console.log('encodedSalt: ', encodedSalt);

        // Hash the choice
        // const hashedChoice = hashChoice(choice, randomSalt);
        let castChoice = 0;
        if (choice === Choice.Paper) {
          castChoice = 1;
        }
        if (choice === Choice.Scissors) {
          castChoice = 2;
        }
        console.log('castChoice: ', castChoice);
        const hashedChoice = await contract.hashChoice(
          castChoice,
          '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
        );
        console.log('hashedChoice: ', hashedChoice);

        // Call the contract function to create a new game
        const tx = await contract.submitPlayer1Choice(hashedChoice);
        // , {
        //   from: player1,
        // });

        // Retrieve the gameId from the transaction receipt
        console.log('tx: ', tx);
        const gameId = tx.events.GameCreated.returnValues.gameId;
        setGameId(gameId);
        setResult(`Game created with ID: ${gameId}`);
      } else {
        alert('No data');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const joinGame = async () => {
    try {
      if (provider && contract && choice !== null) {
        // const accounts = await provider.listAccounts();
        // const player2 = accounts[0];
        // const accounts = await provider.getSigner();
        // console.log('accounts: ', accounts);
        // const player2 = accounts;
        const accounts = await provider.listAccounts();
        console.log('accounts: ', accounts);
        const player2 = accounts[0];

        let castChoice = 0;
        if (choice === Choice.Paper) {
          castChoice = 1;
        }
        if (choice === Choice.Scissors) {
          castChoice = 2;
        }
        console.log('castChoice: ', castChoice);
        // Call the contract function to join an existing game
        await contract.submitPlayer2Choice(castChoice, gameId, {
          from: player2,
        });

        setResult('Joined the game');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const revealChoice = async () => {
    try {
      // if (provider && contract && choice !== null) {
      const accounts = await provider?.listAccounts();
      // @ts-ignore
      const player1 = accounts[0];

      let castChoice = 0;
      if (choice === Choice.Paper) {
        castChoice = 1;
      }
      if (choice === Choice.Scissors) {
        castChoice = 2;
      }
      // Call the contract function to reveal the player1 choice
      await contract?.revealChoice(
        1,
        '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
        gameId,
        {
          from: player1,
        },
      );

      setResult('Choice revealed');
      // }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="py-4 px-4 font-bold text-2xl">Play a Game</h1>
      <div className="flex flex-wrap">
        {isWeb3Enabled ? (
          <div>
            <div className="choice-select">
              <label>Select your choice: </label>
              <select
                value={choice ?? ''}
                onChange={(e) => {
                  console.log('e.target.value: ', e.target.value);
                  return setChoice((e.target.value as Choice) || null);
                }}
              >
                <option value="">Select an option</option>
                <option value={Choice.Rock}>Rock</option>
                <option value={Choice.Paper}>Paper</option>
                <option value={Choice.Scissors}>Scissors</option>
              </select>
            </div>
            <div>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-5 rounded inline-block mr-2"
                onClick={createGame}
              >
                Create Game
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-5 rounded inline-block mr-2"
                onClick={joinGame}
              >
                Join Game
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-5 rounded inline-block"
                onClick={revealChoice}
              >
                Reveal Choice
              </button>
            </div>
            <p>{result}</p>
            {winner ? <h2>Winner: {winner}</h2> : <h2>No winner yet</h2>}
          </div>
        ) : (
          <div>Web3 Currently Not Enabled</div>
        )}
      </div>
    </div>
  );
};

export default Home;
