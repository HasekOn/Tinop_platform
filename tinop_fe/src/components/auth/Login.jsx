import React, {useState} from 'react';
import {setAuthData} from '../../utils/tokenAuth.js';
import {useNavigate} from 'react-router-dom';
import AuthLayout from './AuthLayout.jsx';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [generalError, setGeneralError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});
        setGeneralError(null);

        try {
            const response = await fetch('http://127.0.0.1:8000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({email, password}),
            });

            const responseData = await response.json();

            if (!response.ok) {
                if (response.status === 422) {
                    setErrors(responseData.errors || {});
                } else {
                    setGeneralError(responseData.message || 'Login failed');
                }
                setIsLoading(false);
                return;
            }

            setAuthData(responseData.data);

            window.location.href = '/tasks';
        } catch (error) {
            setGeneralError('Network error. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout title="Tinop" subtitle="Login to Ration platform" imageSrc="../../../public/MainLogo.png" type={ "login"}>
            {generalError && (
                <div className="p-3 bg-red-100 text-red-700 rounded">{generalError}</div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border p-2 rounded"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>}
                </div>

                <div>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border p-2 rounded"
                    />
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password[0]}</p>}
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="remember"
                        className="mr-2"
                    />
                    <label htmlFor="remember" className="text-gray-600">
                        Remember me
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Processing...' : 'Login'}
                </button>
            </form>

            <p className="mt-4 text-center text-gray-600">
                Don't have an account?{' '}
                <a href="/register" className="text-blue-500 hover:underline">
                    Register
                </a>
            </p>
        </AuthLayout>
    );
};

export default Login;
