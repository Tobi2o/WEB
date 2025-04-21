import { useState } from 'react';

const useWordle = () => {
	const [turn, setTurn] = useState(0);
	const [currentGuess, setCurrentGuess] = useState('');
	const [guesses, setGuesses] = useState([...Array(6)]); // each guess is an array
	const [history, setHistory] = useState([]); // each guess is a string
	const [isCorrect, setIsCorrect] = useState(false);
	const [usedKeys, setUsedKeys] = useState({});

	const resetState = () => {
		setTurn(0);
		setCurrentGuess('');
		setGuesses([...Array(6)]);
		setHistory([]);
		setIsCorrect(false);
		setUsedKeys({});
	};

	const addNewGuess = (formattedGuess) => {
		if (formattedGuess.every(letter => letter.color === 'green')) {
			setIsCorrect(true);
		}
		setGuesses(prevGuesses => {
			let newGuesses = [...prevGuesses];
			newGuesses[turn] = formattedGuess;
			return newGuesses;
		});
		setHistory(prevHistory => {
			return [...prevHistory, formattedGuess.map(l => l.key).join('')];
		});
		setTurn(prevTurn => prevTurn + 1);
		setUsedKeys(prevUsedKeys => {
			let newUsedKeys = { ...prevUsedKeys };
			formattedGuess.forEach(l => {
				const currentColor = newUsedKeys[l.key];

				if (l.color === 'green') {
					newUsedKeys[l.key] = 'green';
					return;
				}
				if (l.color === 'yellow' && currentColor !== 'green') {
					newUsedKeys[l.key] = 'yellow';
					return;
				}
				if (l.color === 'grey' && currentColor !== ('green' || 'yellow')) {
					newUsedKeys[l.key] = 'grey';
					return;
				}
			});
			return newUsedKeys;
		});
		setCurrentGuess('');
	};

	const loadPreviousGuesses = (previousGuesses) => {
		resetState();
		previousGuesses.forEach((formattedGuess, index) => {
			if (formattedGuess.every(letter => letter.color === 'green')) {
				setIsCorrect(true);
			}
			setGuesses(prevGuesses => {
				let newGuesses = [...prevGuesses];
				newGuesses[index] = formattedGuess;
				return newGuesses;
			});
			setHistory(prevHistory => {
				return [...prevHistory, formattedGuess.map(l => l.key).join('')];
			});
			setUsedKeys(prevUsedKeys => {
				let newUsedKeys = { ...prevUsedKeys };
				formattedGuess.forEach(l => {
					const currentColor = newUsedKeys[l.key];

					if (l.color === 'green') {
						newUsedKeys[l.key] = 'green';
						return;
					}
					if (l.color === 'yellow' && currentColor !== 'green') {
						newUsedKeys[l.key] = 'yellow';
						return;
					}
					if (l.color === 'grey' && currentColor !== ('green' || 'yellow')) {
						newUsedKeys[l.key] = 'grey';
						return;
					}
				});
				return newUsedKeys;
			});
		});
		setTurn(previousGuesses.length);
	};

	const handleKeyup = ({ key }) => {
		if (key === 'Backspace') {
			setCurrentGuess(prev => prev.slice(0, -1));
			return;
		}
		if (/^[A-Za-z]$/.test(key)) {
			if (currentGuess.length < 5) {
				setCurrentGuess(prev => prev + key);
			}
		}
	};

	return { turn, currentGuess, guesses, isCorrect, usedKeys, handleKeyup, addNewGuess, loadPreviousGuesses, resetState, setCurrentGuess, setIsCorrect, setTurn, setGuesses, setHistory, setUsedKeys };
};

export default useWordle;
