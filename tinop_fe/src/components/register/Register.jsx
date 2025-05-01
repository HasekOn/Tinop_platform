function Registration() {
    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white rounded-lg">
            {/* Levá strana – Propagační sekce */}
            <div className="relative hidden md:block">
                {/* Pozadí – nahraďte cestu k vašemu obrázku dle potřeby */}
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

            {/* Pravá strana – Registrační formulář */}
            <div className="flex flex-col justify-center p-8">
                <div className="max-w-md mx-auto w-full">
                    <h1 className="text-3xl font-bold mb-6 text-black">Register</h1>
                    <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Name"
                            className="text-black w-full p-3 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            className="text-black w-full p-3 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="text-black w-full p-3 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="password"
                            placeholder="Repeat Password"
                            className="text-black w-full p-3 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                        >
                            Register
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
