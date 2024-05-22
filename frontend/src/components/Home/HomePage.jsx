import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import React from "react";
import {
    FaMoneyBillWave,
    FaSignInAlt,
    FaList,
    FaChartPie,
    FaQuoteLeft,
} from "react-icons/fa";
import { IoIosStats } from "react-icons/io";
import { FaFilter } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Slider from "react-slick";

import testimonialsData from "../../utils/testimonialsData";

const HomePage = () => {
    return (
        <>
            <Header />
            <HowItWorks />
            <Testimonials />
            <CallToAction />
        </>
    );
};

const Header = () => {
    return (
        <div className="bg-gray-800 text-white py-20 px-4" >
            <div className="max-w-7xl mx-auto flex flex-col items-center">
                <h1 className="text-5xl font-bold text-center">
                    Track Your Money with Ease
                </h1>

                <p className="mt-4 text-xl text-center">
                    Empower your financial journey with our intuitive money
                    tracking platform.
                </p>

                {/* Feature Icons */}
                <div className="flex space-x-8 mt-10">
                    <div className="flex flex-col items-center">
                        <FaMoneyBillWave className="text-3xl" />
                        <p className="mt-2">Efficient Tracking</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <FaFilter className="text-3xl" />
                        <p className="mt-2">Transactions Filtering</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <IoIosStats className="text-3xl" />
                        <p className="mt-2">Insightful Reports</p>
                    </div>
                </div>

                {/* Call to Action Button */}
                <Link to="/register">
                    <button className="mt-8 px-6 py-3 bg-white text-green-500 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition duration-300">
                        Get Started
                    </button>
                </Link>
            </div>
        </div>
    );
};

const HowItWorks = () => {
    return (
        <div className="py-20 px-4 bg-gray-100">
            <h2 className="text-3xl font-bold text-center text-gray-800">
                How It Works
            </h2>
            <div className="mt-10 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center text-center">
                    <div className="p-4 rounded-full bg-blue-500 text-white mb-4">
                        <FaSignInAlt className="text-xl" />
                    </div>
                    <h3 className="mb-2 font-semibold">Sign Up</h3>
                    <p>
                        Register and start managing your expenses in a minute.
                    </p>
                </div>
                <div className="flex flex-col items-center text-center">
                    <div className="p-4 rounded-full bg-green-500 text-white mb-4">
                        <FaList className="text-xl" />
                    </div>
                    <h3 className="mb-2 font-semibold">Add Transactions</h3>
                    <p>Quickly add income and expenses to your account.</p>
                </div>
                <div className="flex flex-col items-center text-center">
                    <div className="p-4 rounded-full bg-yellow-500 text-white mb-4">
                        <FaChartPie className="text-xl" />
                    </div>
                    <h3 className="mb-2 font-semibold">View Reports</h3>
                    <p>See insightful reports & graphs of your finances.</p>
                </div>
            </div>
        </div>
    );
};

const Testimonials = () => {
    const settings = {
        className: "center",
        centerMode: true,
        centerPadding: "0px",
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        speed: 2000,
        autoplaySpeed: 5000,
        cssEase: "linear",
        pauseOnHover: true,
    };

    return (
        <div className="bg-gray-200 py-20 px-4">
            <h2 className="text-3xl font-bold text-center text-gray-800">
                What Our Users Say
            </h2>

            <div className="mt-10 max-w-4xl mx-auto">
                <Slider {...settings}>
                    {testimonialsData.map((testimonial, index) => (
                        <div key={index} className="px-4">
                            <div
                                className="bg-white p-6 rounded-lg shadow-lg"
                                style={{ minHeight: "250px" }}
                            >
                                <FaQuoteLeft className="text-xl text-gray-400" />
                                <p
                                    className="mt-4"
                                    style={{
                                        height: "100px",
                                        overflow: "hidden",
                                    }}
                                >
                                    {testimonial.quote}
                                </p>
                                <p className="mt-4 font-bold">
                                    {testimonial.author}
                                </p>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
};

const CallToAction = () => {
    return (
        <div className="bg-gray-800 text-white py-20 px-4">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-bold">
                    Ready to Take Control of Your Finances?
                </h2>
                <p className="mt-4">
                    Join us now and start managing your expenses like a pro!
                </p>
                <Link to="/register">
                    <button className="mt-8 px-6 py-3 bg-white text-blue-500 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition duration-300">
                        Sign Up For Free
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default HomePage;
