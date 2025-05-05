import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {setAuthData} from "../../utils/tokenAuth.js";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [generalError, setGeneralError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});
        setGeneralError('');

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

    const getInputClass = (fieldName) =>
        `w-full p-3 border text-gray-600 rounded focus:outline-none focus:ring-2 ${
            errors[fieldName]
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-500 focus:ring-blue-500'
        }`;

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white rounded-lg">
            <div className="relative flex flex-col justify-between p-8">
                <div className="space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold text-black">Tinop</h1>
                        <p className="mt-1 text-black">Login to Ration platform</p>
                    </div>
                    <div className="space-y-4">
                        <p className="text-lg font-semibold text-black">
                            Say goodbye to complexity. Say welcome to Tinop
                        </p>

                        {generalError && (
                            <div className="p-3 bg-red-100 text-red-700 rounded">
                                {generalError}
                            </div>
                        )}

                        <form className="space-y-4" onSubmit={handleSubmit}>
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

                        <div className="text-center text-gray-500">or</div>

                        <button
                            className="w-full py-3 border border-gray-300 rounded flex items-center justify-center space-x-2 hover:bg-gray-100 transition"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 48 48">
                                <path fill="#fbc02d"
                                      d="M43.611 20.083H42V20H24v8h11.303C34.732 32.488 30.49 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.148 0 6.088 1.193 8.354 3.146l5.657-5.657C34.353 7.85 29.45 6 24 6 12.954 6 4 14.954 4 26s8.954 20 20 20 20-8.954 20-20c0-1.341-.138-2.646-.389-3.917z"/>
                                <path fill="#e53935"
                                      d="M6.306 14.691l6.571 4.82C14.242 15.354 18.73 12 24 12c3.148 0 6.088 1.193 8.354 3.146l5.657-5.657C34.353 7.85 29.45 6 24 6 16.645 6 10 10.345 6.306 14.691z"/>
                                <path fill="#4caf50"
                                      d="M24 44c6.49 0 12.231-2.688 16.353-7.167l-7.448-6.171C29.872 34.84 27.084 36 24 36c-6.49 0-10.732-3.512-12.303-8.334l-7.448 6.171C10.005 41.312 15.746 44 24 44z"/>
                                <path fill="#1565c0"
                                      d="M43.611 20.083H42V20H24v8h11.303c-1.197 3.217-3.664 5.828-6.303 7.034V38h10.005C39.291 34.691 42 29.788 42 24c0-.7-.063-1.35-.389-3.917z"/>
                            </svg>
                            <span>Sign in with Google</span>
                        </button>
                    </div>
                </div>
                <div className="mt-4 text-center">
                    <p className="text-gray-600">
                        Don't have an account? <a href="/register"
                                                  className="text-blue-500 hover:underline">Register</a>
                    </p>
                </div>
            </div>

            <div className="relative hidden md:block">
                <img
                    src="../../../public/welcome.png"
                    alt="Promotional"
                    className="absolute inset-0 object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="relative z-10 p-8">
                    <h2 className="text-4xl font-bold text-white">Meet Tinop</h2>
                    <p className="mt-2 text-xl text-white">The modern task management tool</p>
                    <div className="mt-4 bg-white p-4 rounded shadow">
                        <p>Placeholder pro recenze</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;