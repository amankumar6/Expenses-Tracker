import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            <h1 className="text-6xl font-bold mb-4">404 - Not Found</h1>
            <p className="text-xl mb-8">
                The page you are looking for does not exist.
            </p>
            <Link
                to="/"
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
            >
                Go back to the homepage
            </Link>
        </div>
    );
};

export default NotFound;
