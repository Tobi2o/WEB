import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useWebSocket from 'react-use-websocket';
import "../App.css";

const Party = ({ isAuthenticated }) => {
    const [partyCode, setPartyCode] = useState('');
    const [gameState, setGameState] = useState(null);
    const [waitingForOpponent, setWaitingForOpponent] = useState(false);
    const navigate = useNavigate();
    const { sendJsonMessage, lastMessage } = useWebSocket('ws://localhost:3002', {
        onOpen: () => {
            // Do nothing initially
        },
        onMessage: (message) => {
            const data = JSON.parse(message.data);
            if (data.type === 'party-created') {
                setPartyCode(data.partyCode);
            } else if (data.type === 'joined-party') {
                setGameState({ ...gameState, joined: true });
                setWaitingForOpponent(true);
                navigate(`/multiplayer/${partyCode}`);
            } else if (data.type === 'start-game') {
                setGameState({ ...gameState, solution: data.solution });
                setWaitingForOpponent(false);
                navigate(`/multiplayer/${partyCode}`);
            } else if (data.type === 'game-over') {
                setGameState({ ...gameState, winner: data.winner });
            } else if (data.type === 'error') {
                alert(data.message);
            } else if (data.type === 'waiting-for-opponent') {
                setWaitingForOpponent(true);
            }
        },
    });

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    const createParty = () => {
        sendJsonMessage({ type: 'create-party' });
    };

    const joinParty = () => {
        sendJsonMessage({ type: 'join-party', partyCode });
        navigate(`/multiplayer/${partyCode}`);
    };

    if (gameState?.winner) {
        return <div>Game over! Winner: {gameState.winner}</div>;
    }

    return (
        <div className="min-h-screen bg-background text-textPrimary flex flex-col items-center">
            <header className="w-full py-4 bg-primary text-center text-2xl font-bold">
                Multiplayer Mode
            </header>
            <main className="flex flex-col items-center mt-4 px-4 w-full">
                <Link to="/" className="text-lg text-white bg-primary px-4 py-2 rounded shadow hover:bg-primaryHover mb-4">
                    Home
                </Link>
                <div className="flex flex-col items-center justify-center mt-8">
                    <div className="flex space-x-4 items-center justify-center">
                        <button
                            className="text-2xl text-white bg-primary px-6 py-3 rounded shadow hover:bg-primaryHover"
                            onClick={createParty}
                        >
                            Create Party
                        </button>
                        <input
                            type="text"
                            value={partyCode}
                            onChange={(e) => setPartyCode(e.target.value)}
                            placeholder="Enter Party Code"
                            className="w-96 p-3 text-2xl rounded border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <button
                            className="text-2xl text-white bg-primary px-6 py-3 rounded shadow hover:bg-primaryHover"
                            onClick={joinParty}
                        >
                            Join Party
                        </button>
                    </div>
                    {waitingForOpponent && (
                        <div className="flex flex-col items-center justify-center mt-8">
                            <div className="text-2xl text-center mb-4">Waiting for opponent...</div>
                            <div className="loading"></div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Party;
