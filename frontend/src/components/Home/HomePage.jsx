import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import React from "react";
import {
    FaMoneyBillWave,
    FaSignInAlt,
    FaList,
    FaChartPie,
    FaQuoteLeft,
    FaCheckCircle,
    FaUsers,
    FaLock
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
            <SocialProof />
            <HowItWorks />
            <Testimonials />
            <CallToAction />
        </>
    );
};

const Header = () => {
    return (
        <div className="bg-gradient-to-br from-[#0B1120] via-[#1E293B] to-[#0B1120] text-white py-20 px-4">
            <div className="max-w-7xl mx-auto flex flex-col items-center">
                <div className="bg-blue-600 text-white text-sm font-semibold px-6 py-2 rounded-full mb-8 animate-pulse shadow-lg">
                    🎉 Join over 50,000+ users saving money with us!
                </div>
                
                <h1 className="text-6xl font-bold text-center leading-tight mb-6">
                    Take Control of Your Money
                    <br />
                    <span className="bg-gradient-to-r from-blue-400 to-blue-300 text-transparent bg-clip-text drop-shadow-lg">
                        In Just 5 Minutes a Day
                    </span>
                </h1>

                <p className="mt-6 text-xl text-center text-white max-w-2xl leading-relaxed font-medium">
                    Stop wondering where your money goes. Start making it work for you.
                    <br />
                    <span className="text-blue-300">Join thousands who've already saved an average of $5,300 this year.</span>
                </p>

                <div className="mt-10 flex gap-4">
                    <Link
                        to="/register"
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 hover:shadow-xl shadow-md"
                    >
                        Start Saving Now - It's Free
                    </Link>
                </div>

                {/* Trust Indicators */}
                <div className="mt-16 flex items-center gap-12 text-sm text-white">
                    <div className="flex items-center gap-2">
                        <FaCheckCircle className="text-emerald-400 text-lg" />
                        <span className="font-medium">Bank-level Security</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaUsers className="text-emerald-400 text-lg" />
                        <span className="font-medium">50,000+ Active Users</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaLock className="text-emerald-400 text-lg" />
                        <span className="font-medium">256-bit Encryption</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SocialProof = () => {
    return (
        <div className="bg-white py-16 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4">
                <p className="text-center text-gray-700 mb-12 text-sm font-semibold tracking-wider">
                    TRUSTED BY INDIVIDUALS AND TEAMS FROM
                </p>
                <div className="flex justify-center items-center gap-16 opacity-90 hover:opacity-100 transition-all">
                    <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" 
                        alt="Microsoft" 
                        className="h-10 object-contain hover:scale-105 transition-transform" 
                    />
                    <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" 
                        alt="Google" 
                        className="h-8 object-contain hover:scale-105 transition-transform" 
                    />
                    <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" 
                        alt="Amazon" 
                        className="h-8 object-contain hover:scale-105 transition-transform" 
                    />
                    <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg" 
                        alt="Meta" 
                        className="h-8 object-contain hover:scale-105 transition-transform" 
                    />
                </div>
            </div>
        </div>
    );
};

const HowItWorks = () => {
    return (
        <div className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-4xl font-bold text-center mb-12">
                    Your Path to Financial Freedom
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-xl shadow-lg transform transition-all hover:scale-105">
                        <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                            <FaMoneyBillWave className="text-2xl text-white" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Track Expenses</h3>
                        <p className="text-gray-600">
                            Effortlessly log your daily expenses and income. Our smart categorization makes it simple.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-xl shadow-lg transform transition-all hover:scale-105">
                        <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                            <IoIosStats className="text-2xl text-white" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Get Insights</h3>
                        <p className="text-gray-600">
                            Visual reports and analytics help you understand your spending patterns instantly.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-xl shadow-lg transform transition-all hover:scale-105">
                        <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                            <FaChartPie className="text-2xl text-white" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Save Money</h3>
                        <p className="text-gray-600">
                            Get personalized recommendations to optimize your spending and grow your savings.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Testimonials = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    };

    return (
        <div className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-4xl font-bold text-center mb-4">
                    Loved by People Like You
                </h2>
                <p className="text-center text-gray-600 mb-12">
                    Join thousands of satisfied users who've transformed their financial lives
                </p>
                <Slider {...settings}>
                    {testimonialsData.map((testimonial, index) => (
                        <div key={index} className="px-4">
                            <div className="bg-gray-50 p-8 rounded-xl">
                                <div className="flex items-center mb-4">
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.author}
                                        className="w-12 h-12 rounded-full mr-4"
                                    />
                                    <div>
                                        <h4 className="font-semibold">{testimonial.author}</h4>
                                        <p className="text-gray-500 text-sm">{testimonial.role}</p>
                                    </div>
                                </div>
                                <FaQuoteLeft className="text-blue-500 mb-4" />
                                <p className="text-gray-600">{testimonial.quote}</p>
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
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-20">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <h2 className="text-4xl font-bold mb-6">
                    Start Your Financial Journey Today
                </h2>
                <p className="text-xl mb-8 max-w-2xl mx-auto">
                    Join over 50,000 people who've already discovered the power of smart expense tracking.
                    Don't wait - every day you delay is money left on the table.
                </p>
                <Link
                    to="/register"
                    className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg inline-block hover:bg-gray-100 transition-colors"
                >
                    Create Your Free Account
                </Link>
                <p className="mt-4 text-sm text-blue-200">
                    No credit card required • Free forever plan available
                </p>
            </div>
        </div>
    );
};

export default HomePage;
