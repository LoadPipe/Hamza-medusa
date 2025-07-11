'use client';
import Link from 'next/link';
import { Facebook, Twitter, Github, Youtube } from 'lucide-react';

interface FooterProps {
    selectedLanguage: string;
}

export default function Footer({ selectedLanguage }: FooterProps) {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#0a0a0a] text-gray-400 py-12 sm:py-16 lg:py-20 mt-20 sm:mt-24 lg:mt-40 border-t border-gray-800/50">
            <div className="max-w-[1200px] mx-auto px-4">
                {/* Main Footer Content with Enhanced Typography */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 lg:gap-16 mb-12 sm:mb-16">
                    {/* About Section */}
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <h3 className="text-xl sm:text-2xl font-light text-white tracking-wide">
                                About Hamza
                            </h3>
                            <div className="w-12 h-px bg-green-400"></div>
                        </div>
                        <p className="text-sm sm:text-base lg:text-lg leading-relaxed font-light tracking-wide max-w-sm">
                            The ultimate platform for secure and efficient
                            crypto transactions in the decentralized economy.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <h3 className="text-xl sm:text-2xl font-light text-white tracking-wide">
                                Quick Links
                            </h3>
                            <div className="w-12 h-px bg-green-400"></div>
                        </div>
                        <ul className="space-y-4 text-sm sm:text-base lg:text-lg font-light">
                            <li>
                                <Link
                                    href="#how-it-works"
                                    className="hover:text-green-400 transition-colors duration-300 tracking-wide"
                                >
                                    How It Works
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#escrow"
                                    className="hover:text-green-400 transition-colors duration-300 tracking-wide"
                                >
                                    Escrow
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#crypto"
                                    className="hover:text-green-400 transition-colors duration-300 tracking-wide"
                                >
                                    Accepted Crypto
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/"
                                    className="hover:text-green-400 transition-colors duration-300 tracking-wide"
                                >
                                    Launch Marketplace
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Connect Section */}
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <h3 className="text-xl sm:text-2xl font-light text-white tracking-wide">
                                Connect With Us
                            </h3>
                            <div className="w-12 h-px bg-green-400"></div>
                        </div>
                        <div className="flex space-x-6">
                            <a
                                href="#"
                                aria-label="Facebook"
                                className="hover:text-green-400 transition-colors duration-300 p-2 hover:bg-green-400/10 rounded-lg"
                            ></a>
                            <a
                                href="#"
                                aria-label="Twitter"
                                className="hover:text-green-400 transition-colors duration-300 p-2 hover:bg-green-400/10 rounded-lg"
                            ></a>
                            <a
                                href="#"
                                aria-label="GitHub"
                                className="hover:text-green-400 transition-colors duration-300 p-2 hover:bg-green-400/10 rounded-lg"
                            ></a>
                            <a
                                href="#"
                                aria-label="YouTube"
                                className="hover:text-green-400 transition-colors duration-300 p-2 hover:bg-green-400/10 rounded-lg"
                            ></a>
                        </div>
                    </div>
                </div>

                {/* Footer Bottom with Enhanced Typography */}
                <div className="border-t border-gray-800/50 pt-8 sm:pt-10 space-y-6">
                    <div className="text-center">
                        <p className="text-sm sm:text-base lg:text-lg font-light tracking-wide">
                            &copy; {currentYear} Hamza. All rights reserved.
                        </p>
                    </div>

                    <div className="flex items-center justify-center space-x-4 sm:space-x-6 lg:space-x-8 text-sm font-light">
                        <Link
                            href="/privacy-policy"
                            className="hover:text-green-400 transition-colors duration-300 tracking-wide"
                        >
                            Privacy Policy
                        </Link>
                        <span className="text-gray-600">•</span>
                        <Link
                            href="/terms-of-service"
                            className="hover:text-green-400 transition-colors duration-300 tracking-wide"
                        >
                            Terms of Service
                        </Link>
                    </div>

                    {/* Decorative element */}
                    <div className="flex items-center justify-center">
                        <div className="w-32 h-px bg-gradient-to-r from-transparent via-green-400/50 to-transparent"></div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
