import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import Party from './components/Party';
import MultiplayerWordle from './components/MultiplayerWordle';
import SinglePlayerWordle from './components/SinglePlayerWordle';
import './App.css';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get('http://localhost:3002/auth-check', { withCredentials: true });
                if (response.status === 200) {
                    setIsAuthenticated(true);
                }
            } catch (error) {
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();

        const getUsername = async () => {
            try {
                const response = await axios.get('http://localhost:3002/user', { withCredentials: true });
                console.log(response)

                if (response.status === 200) {
                    setUsername(response.data.user.username);
                }
            } catch (error) {
                setUsername('');
            }
        };

        getUsername();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen w-screen">
                <div className="loading"></div>
            </div>
        );
    }

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home isAuthenticated={isAuthenticated} username={username} />} />
                <Route path="/login" element={<Login isAuthenticated={isAuthenticated} />} />
                <Route path="/register" element={<Register isAuthenticated={isAuthenticated} />} />
                <Route path="/party" element={isAuthenticated ? <Party isAuthenticated={isAuthenticated} /> : <Navigate to="/login" />} />
                <Route path="/multiplayer/:partyCode" element={isAuthenticated ? <MultiplayerWordle /> : <Navigate to="/login" />} />
                <Route path="/single-player" element={isAuthenticated ? <SinglePlayerWordle /> : <Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;
