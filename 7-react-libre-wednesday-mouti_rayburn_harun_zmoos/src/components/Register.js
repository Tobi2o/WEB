import React, { useState } from 'react';
import axios from 'axios';
import '../output.css';

export default function Register() {
    const [username, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior

        // Check if passwords match
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            // Send a POST request to signup endpoint
            const response = await axios.post('http://localhost:3002/signup', { username: username, password: password });

            // Handle response
            if (response.data.message) {
                // Redirect or handle successful registration
                window.location.href = '/login'; // Redirect to login page
            } else {
                setError(response.data.error || 'Registration failed');
            }
        } catch (error) {
            setError(error.response.data.error || 'An error occurred during registration');
        }
    };

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 bg-background lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-3xl font-bold leading-9 tracking-tight text-textPrimary">
                    Create a new account
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
                                id="username"
                                name="username"
                                type="username"
                                required
                                value={username}
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
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
    
                    <div>
                        <label htmlFor="confirm-password" className="block text-sm font-medium leading-6 text-textPrimary">
                            Confirm Password
                        </label>
                        <div className="mt-2">
                            <input
                                id="confirm-password"
                                name="confirm-password"
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
    
                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primaryHover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        >
                            Register
                        </button>
                    </div>
                </form>
    
                {error && (
                    <p className="mt-4 text-center text-sm text-error">
                        {error}
                    </p>
                )}
    
                <p className="mt-10 text-center text-sm text-gray-400">
                    Already have an account?{' '}
                    <a href="/login" className="font-semibold leading-6 text-primary hover:text-primaryHover">
                        Sign in
                    </a>
                </p>
            </div>
        </div>
    );
}
