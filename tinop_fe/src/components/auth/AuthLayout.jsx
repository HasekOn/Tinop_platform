import React from 'react';

const AuthLayout = ({children, title, subtitle, imageSrc, type}) => {
    if (type === 'login') {
        return (
            <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white rounded-lg">
                <div className="flex flex-col justify-center p-8">
                    <div className="max-w-md mx-auto w-full">
                        <h1 className="text-3xl font-bold mb-6 text-black">{title}</h1>
                        {subtitle && <p className="text-black mb-4">{subtitle}</p>}
                        {children}
                    </div>
                </div>

                <div className="relative hidden md:block">
                    <img
                        src={imageSrc}
                        alt="Promotional"
                        className="absolute inset-0 object-cover w-full h-full"
                    />
                </div>
            </div>
        );
    } else {
        return (
            <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white rounded-lg">
                <div className="relative hidden md:block">
                    <img
                        src={imageSrc}
                        alt="Promotional"
                        className="absolute inset-0 object-cover w-full h-full"
                    />
                </div>
                <div className="flex flex-col justify-center p-8">
                    <div className="max-w-md mx-auto w-full">
                        <h1 className="text-3xl font-bold mb-6 text-black">{title}</h1>
                        {subtitle && <p className="text-black mb-4">{subtitle}</p>}
                        {children}
                    </div>
                </div>
            </div>
        );
    }
};

export default AuthLayout;
