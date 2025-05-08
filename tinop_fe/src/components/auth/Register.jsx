import React, {useState} from 'react';
import {setAuthData} from '../../utils/tokenAuth.js';
import {useNavigate} from 'react-router-dom';
import AuthLayout from './AuthLayout.jsx';

const Register = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [generalError, setGeneralError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});
        setGeneralError(null);

        try {
            const response = await fetch('http://127.0.0.1:8000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    password_confirmation: passwordConfirmation
                }),
            });

            const responseData = await response.json();

            if (!response.ok) {
                if (response.status === 422) {
                    setErrors(responseData.errors || {});
                } else {
                    setGeneralError(responseData.message || 'Registration failed');
                }
                return;
            }

            setAuthData(responseData.data);

            navigate('/');
        } catch (error) {
            setGeneralError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout title="Tinop" subtitle="Register to Ration platform" imageSrc="../../../public/MainLogo.png" type={ "register"}>
            {generalError && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{generalError}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border p-2 rounded"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>}
                </div>

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

                <div>
                    <input
                        type="password"
                        placeholder="Repeat Password"
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        className="w-full border p-2 rounded"
                    />
                    {errors.password_confirmation && (
                        <p className="text-red-500 text-sm mt-1">{errors.password_confirmation[0]}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Processing...' : 'Register'}
                </button>
            </form>

            <p className="mt-4 text-center text-gray-600">
                Already have an account?{' '}
                <a href="/login" className="text-blue-500 hover:underline">
                    Login
                </a>
            </p>
        </AuthLayout>
    );
};

export default Register;
