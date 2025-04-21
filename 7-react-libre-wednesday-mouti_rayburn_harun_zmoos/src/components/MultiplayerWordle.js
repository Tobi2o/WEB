import React, { useState, useEffect } from 'react';
import useWordle from '../hooks/useWordle';
import Grid from './Grid';
import Keypad from './Keypad';
import keys from '../constants/keys';
import Modal from './Modal';
import useWebSocket from 'react-use-websocket';
import { useParams } from 'react-router-dom';
import loadingImage from '../assets/loading.webp';

export default function MultiplayerWordle() {
    const { partyCode } = useParams();
    const { currentGuess, guesses, turn, isCorrect, usedKeys, handleKeyup, addNewGuess, loadPreviousGuesses, resetState } = useWordle();
    const [showModal, setShowModal] = useState(false);
    const [waitingForServer, setWaitingForServer] = useState(false);
    const [waitingForOpponentToFinish, setWaitingForOpponentToFinish] = useState(false);
    const [waitingForOpponentToJoin, setWaitingForOpponentToJoin] = useState(true);
    const [result, setResult] = useState(null);
    const [winner, setWinner] = useState(null);
    const { sendJsonMessage } = useWebSocket('ws://localhost:3002', {

        onOpen: () => {
            sendJsonMessage({ type: 'join-party', partyCode });
        },
        onMessage: (message) => {
            const data = JSON.parse(message.data);
            console.log('Received message:', data);
            if (data.type === 'start-game') {
                resetState();
                setWaitingForOpponentToJoin(false);
            } else if (data.type === 'next-turn') {
                addNewGuess(data.guesses);
                setWaitingForServer(false);
            } else if (data.type === 'ack') {
                addNewGuess(data.guess);
                setWaitingForServer(false);
            } else if (data.type === 'game-over') {
                switch (data.result) {
                    case 'win':
                        setResult('win');
                        break;
                    case 'lose':
                        setResult('lose');
                        setWinner(data.winner);
                        break;
                    case 'draw':
                        setResult('draw');
                        break;
                }
                setWaitingForOpponentToFinish(false);
                setShowModal(true);
            } else if (data.type === 'waiting-for-opponent-to-finish') {
                setWaitingForOpponentToFinish(true);
                setWaitingForServer(false);
            } else if (data.type === 'opponent-finished') {
                setWaitingForOpponentToFinish(false);
            } else if (data.type === 'waiting-for-opponent') {
                setWaitingForOpponentToJoin(true);
            } else if (data.type === 'ack-guesses') {
                loadPreviousGuesses(data.guesses); // Use the new function for loading previous guesses
                setWaitingForOpponentToJoin(false);
            }
        },
    });

    const handleSubmitGuess = () => {
        if (currentGuess.length !== 5 || waitingForServer || waitingForOpponentToFinish) return;
        setWaitingForServer(true);
        sendJsonMessage({ type: 'guess', guess: currentGuess });
    };

    const handleEnterKey = (event) => {
        if (event.key === 'Enter') {
            handleSubmitGuess();
        }
    };

    useEffect(() => {
        window.addEventListener('keyup', handleKeyup);
        window.addEventListener('keyup', handleEnterKey);

        return () => {
            window.removeEventListener('keyup', handleKeyup);
            window.removeEventListener('keyup', handleEnterKey);
        };
    }, [handleKeyup]);

    useEffect(() => {
        if (isCorrect || turn > 5) {
            setTimeout(() => setShowModal(true), 2000);
            window.removeEventListener('keyup', handleKeyup);
            window.removeEventListener('keyup', handleEnterKey);
            sendJsonMessage({ type: 'guess', guess: currentGuess });
        }
    }, [isCorrect, turn]);

    if (waitingForOpponentToJoin) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background text-textPrimary">
                <div className="text-4xl mb-4">Waiting for opponent to join...</div>
                <div className="loading-container">
                    <div className="loading">
                        <img src={loadingImage} alt="Loading" />
                    </div>
                </div>
            </div>
        );
    }

    if (waitingForOpponentToFinish) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background text-textPrimary">
                <div className="text-4xl mb-4">Waiting for opponent to finish...</div>
                <div className="loading-container">
                    <div className="loading">
                        <img src={loadingImage} alt="Loading" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center bg-background min-h-screen text-textPrimary relative pt-12">
            <Grid guesses={guesses} currentGuess={currentGuess} turn={turn} className="layout mb-8" />
            <Keypad keys={keys} usedKeys={usedKeys} className="border border-primary p-2 rounded text-white bg-primary mb-8" />
            <button onClick={handleSubmitGuess} disabled={waitingForServer} className="mt-4 px-4 py-2 bg-primary text-white rounded">
                Submit Guess
            </button>
            {showModal && <Modal isCorrect={isCorrect} turn={turn} result={result} winner={winner} />}
        </div>
    );
}
