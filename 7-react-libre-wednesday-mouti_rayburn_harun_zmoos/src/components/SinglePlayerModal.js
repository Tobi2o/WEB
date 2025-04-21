import React from 'react';
import { Link } from 'react-router-dom';

const SinglePlayerModal = ({ isCorrect, turn, solution }) => {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-800 bg-opacity-50">
            <div className={`modal-content ${isCorrect ? 'bg-green-500' : 'bg-red-500'} text-white p-4 rounded`}>
                {isCorrect && (
                    <div>
                        <h1>Congratulations! You found the word in {turn} guesses!</h1>
                    </div>
                )}
                {!isCorrect && (
                    <div>
                        <h1>Game Over! The correct word was {solution}.</h1>
                    </div>
                )}
            </div>
            <div className="flex justify-center mt-4 space-x-4">
                <Link to="/" className="text-lg text-white bg-primary px-4 py-2 rounded shadow hover:bg-primaryHover">
                    Home
                </Link>
                <button
                    onClick={() => window.location.reload()}
                    className="text-lg text-white bg-primary px-4 py-2 rounded shadow hover:bg-primaryHover"
                >
                    Play Again
                </button>
            </div>
        </div>
    );
};

export default SinglePlayerModal;
