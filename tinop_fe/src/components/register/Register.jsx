import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {setAuthData} from "../../utils/tokenAuth.js";

function Registration() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [generalError, setGeneralError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});
        setGeneralError('');

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

    const getInputClass = (fieldName) =>
        `text-black w-full p-3 border rounded focus:outline-none focus:ring-2 ${
            errors[fieldName]
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-600 focus:ring-blue-500'
        }`;

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white rounded-lg">
            <div className="relative hidden md:block">
                <img
                    src="../../../public/welcome.png"
                    alt="Promotional Background"
                    className="absolute inset-0 object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="relative z-10 p-8">
                    <h2 className="text-4xl font-bold text-white">Meet Ration</h2>
                    <p className="mt-2 text-xl text-white">
                        The modern task management tool
                    </p>
                    <div className="mt-4 bg-white p-4 rounded shadow text-black">
                        <p>
                            Sledujte své úkoly, organizujte své projekty a užijte si produktivitu,
                            kterou jste ještě nezažili.
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col justify-center p-8">
                <div className="max-w-md mx-auto w-full">
                    <h1 className="text-3xl font-bold mb-6 text-black">Register</h1>

                    {generalError && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                            {generalError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input
                                type="text"
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={getInputClass('name')}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>
                            )}
                        </div>

                        <div>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={getInputClass('email')}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>
                            )}
                        </div>

                        <div>
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={getInputClass('password')}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password[0]}</p>
                            )}
                        </div>

                        <div>
                            <input
                                type="password"
                                placeholder="Repeat Password"
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                className={getInputClass('password_confirmation')}
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
                </div>
            </div>
        </div>
    );
}

export default Registration;