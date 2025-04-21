import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import '../output.css';

export default function Login({ isAuthenticated }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    if (isAuthenticated) {
        return <Navigate to="/" />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3002/login', { email, password }, { withCredentials: true });
            if (response.status === 200) {
                window.location.href = '/';
            } else {
                setError(response.data.error || 'Login failed');
            }
        } catch (err) {
            if (err.response) {
                setError(err.response.data.error || 'An error occurred during login');
            } else if (err.request) {
                setError('No response received from the server');
            } else {
                setError('Error: ' + err.message);
            }
        }
    };

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 bg-background lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-3xl font-bold leading-9 tracking-tight text-textPrimary">
                    Sign in to your account
                </h2>
            </div>
    
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm text-left">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-textPrimary">
                            Email address
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
    
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-textPrimary">
                            Password
                        </label>
                        <div className="mt-2">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
    
                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primaryHover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        >
                            Sign in
                        </button>
                    </div>
                </form>
    
                {error && (
                    <p className="mt-4 text-center text-sm text-error">
                        {error}
                    </p>
                )}
    
                <p className="mt-10 text-center text-sm text-gray-400">
                    Not a member?{' '}
                    <a href="/register" className="font-semibold leading-6 text-primary hover:text-primaryHover">
                        Register here
                    </a>
                </p>
            </div>
        </div>
    );
}
