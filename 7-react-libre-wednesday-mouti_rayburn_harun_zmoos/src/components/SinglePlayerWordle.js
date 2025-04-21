import React, { useState, useEffect } from 'react';
import useWordle from '../hooks/localWordle';
import Grid from './Grid';
import Keypad from './Keypad';
import keys from '../constants/keys';
import SinglePlayerModal from './SinglePlayerModal';
import useWebSocket from 'react-use-websocket';

export default function SinglePlayerWordle() {
    const [solution, setSolution] = useState(null);
    const { currentGuess, guesses, turn, isCorrect, usedKeys, handleKeyup } = useWordle(solution);
    const { sendJsonMessage, lastMessage } = useWebSocket('ws://localhost:3002', {
        onOpen: () => {
            sendJsonMessage({ type: 'single-player' });
        },
        onMessage: (message) => {
            const data = JSON.parse(message.data);
            if (data.type === 'single-player-solution') {
                setSolution(data.solution.toUpperCase());
            }
        },
    });

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        window.addEventListener('keyup', handleKeyup);

        if (isCorrect) {
            setTimeout(() => setShowModal(true), 2000);
            window.removeEventListener('keyup', handleKeyup);
        }
        if (turn > 5) {
            setTimeout(() => setShowModal(true), 2000);
            window.removeEventListener('keyup', handleKeyup);
        }

        return () => window.removeEventListener('keyup', handleKeyup);
    }, [handleKeyup, isCorrect, turn]);

    return (
        <div className="flex flex-col items-center bg-background min-h-screen text-textPrimary relative pt-12">
            <Grid guesses={guesses} currentGuess={currentGuess} turn={turn} className="layout mb-8" />
            <Keypad keys={keys} usedKeys={usedKeys} className="border border-primary p-2 rounded text-white bg-primary mb-8" />
            {showModal && <SinglePlayerModal isCorrect={isCorrect} turn={turn} solution={solution} />}
        </div>
    );
}
