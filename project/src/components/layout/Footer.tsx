import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, Mail, Phone, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-navy-900 text-black py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Scale className="h-6 w-6 text-gold-400" />
              <span className="text-xl font-serif font-bold">AI Advocate</span>
            </div>
            <p className="text-gray-600 text-sm max-w-xs">
              Your personal legal assistant, providing guidance and information about laws and regulations when you need it most.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-black transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-black transition-colors duration-200">
                  About
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-gray-600 hover:text-black transition-colors duration-200">
                  Resources
                </Link>
              </li>
              <li>
                <Link to="/chat" className="text-gray-600 hover:text-black transition-colors duration-200">
                  Ask AI Advocate
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Legal Areas</h3>
            <ul className="space-y-2">
              <li className="text-gray-600 hover:text-black transition-colors duration-200">
                Criminal Defense
              </li>
              <li className="text-gray-600 hover:text-black transition-colors duration-200">
                Traffic Law
              </li>
              <li className="text-gray-600 hover:text-black transition-colors duration-200">
                Civil Rights
              </li>
              <li className="text-gray-600 hover:text-black transition-colors duration-200">
                Know Your Rights
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-gold-400 mt-0.5" />
                <span className="text-gray-600">support@aiAdvocate.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-gold-400 mt-0.5" />
                <span className="text-gray-600">(555) 123-4567</span>
              </li>
              <li className="flex items-start space-x-3">
                <Globe className="h-5 w-5 text-gold-400 mt-0.5" />
                <span className="text-gray-600">www.aiAdvocate.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-navy-700 text-center text-gray-600 text-sm">
          <p>&copy; {new Date().getFullYear()} AI Advocate. All rights reserved.</p>
          <p className="mt-2">
            Disclaimer: AI Advocate provides legal information, not legal advice.
            Always consult with a qualified attorney for legal advice.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;