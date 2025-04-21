import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Wordle from './Wordle';
import '../App.css';
import logo from '../assets/logo.png';

const Home = ({ isAuthenticated, username }) => {
    const [solution, setSolution] = useState(null);

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:3002/logout', {}, { withCredentials: true });
            window.location.href = '/';
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    useEffect(() => {
        // Fetch the random solution word
        fetch('http://localhost:3002/random-solution')
            .then(res => res.json())
            .then(json => {
                setSolution(json.word);
            })
            .catch(err => console.error('Error fetching solution:', err));
    }, []);

    return (
        <div className="min-h-screen bg-background text-textPrimary flex flex-col">
            <header className="w-full py-4 bg-primary text-center text-2xl font-bold">
                Home Page
            </header>
            <main className="flex flex-col items-center mt-4 px-4 w-full">
                <h1 className="text-4xl font-bold mb-2">Wordle ++</h1>
                <p className="mb-4">Première version de Wordle multijoueur développée par <br /> Amir Mouti, Nathan Rayburn, Léo Zmoos et Ouweis Harun</p>
                {!isAuthenticated && (
                    <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/register"
                                className="text-lg text-white bg-primary px-4 py-2 rounded shadow hover:bg-primaryHover"
                            >
                                Register
                            </Link>
                            <Link
                                to="/login"
                                className="text-lg text-white bg-primary px-4 py-2 rounded shadow hover:bg-primaryHover"
                            >
                                Login
                            </Link>
                            <div className="ml-2">
                                <div className={`status-indicator ${isAuthenticated ? 'bg-green-500' : 'bg-red-500'} text-white px-2 py-1 rounded-full shadow`}>
                                    {isAuthenticated ? 'Connected' : 'Disconnected'}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {isAuthenticated && (
                    <div className="space-y-4 text-center">
                        <p className="text-xl">Welcome {username.split('@')[0]} !</p>
                        <div className="flex items-center space-x-4 justify-center">
                            <Link
                                to="/party"
                                className="text-lg text-white bg-primary px-4 py-2 rounded shadow hover:bg-primaryHover"
                            >
                                Multiplayer
                            </Link>
                            <Link
                                to="/single-player"
                                className="text-lg text-white bg-primary px-4 py-2 rounded shadow hover:bg-primaryHover"
                            >
                                Single Player
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="text-lg text-white bg-primary px-4 py-2 rounded shadow hover:bg-primaryHover"
                            >
                                Logout
                            </button>
                            <div className="ml-2">
                                <div className={`status-indicator ${isAuthenticated ? 'bg-green-500' : 'bg-red-500'} text-white px-2 py-1 rounded-full shadow`}>
                                    {isAuthenticated ? 'Connected' : 'Disconnected'}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {solution && <Wordle solution={solution} />}
            </main>
            <footer className="mt-8 w-full flex-grow">
                <img src={logo} alt="Wordle ++ Logo" className="w-full h-full object-cover" />
            </footer>
        </div>
    );
};

export default Home;
