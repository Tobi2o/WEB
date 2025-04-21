import React from 'react';
import { Link } from 'react-router-dom';
import winImage from '../assets/win.webp';
import loseImage from '../assets/lose.webp';
import drawImage from '../assets/draw.webp';

const Modal = ({ isCorrect, turn, result, winner }) => {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-800 bg-opacity-50">
            <div className={`modal-content ${result === 'win' ? 'bg-green-500' : result === 'draw' ? 'bg-draw' : 'bg-red-500'} text-white p-4 rounded text-center`}>
                {result === 'win' && (
                    <div>
                        <h1>Congratulations! You won the game!</h1>
                        <img src={winImage} alt="Win" className="mt-4 mx-auto" />
                    </div>
                )}
                {result === 'draw' && (
                    <div>
                        <h1>It's a draw. You're all losers!</h1>
                        <img src={drawImage} alt="Draw" className="mt-4 mx-auto" />
                    </div>
                )}
                {result === 'lose' && (
                    <div>
                        <h1>Game Over! The winner is {winner.split('@')[0]}.</h1>
                        <img src={loseImage} alt="Lose" className="mt-4 mx-auto" />
                    </div>
                )}
            </div>
            <div className="flex justify-center mt-4 space-x-4">
                <Link to="/" className="text-lg text-white bg-primary px-4 py-2 rounded shadow hover:bg-primaryHover">
                    Home
                </Link>
                <Link to="/party" className="text-lg text-white bg-primary px-4 py-2 rounded shadow hover:bg-primaryHover">
                    New Game
                </Link>
            </div>
        </div>
    );
};

export default Modal;
