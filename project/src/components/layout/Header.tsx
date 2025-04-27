import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Scale, MicIcon } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isMenuOpen 
          ? 'bg-white shadow-md py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-navy-800"
          >
            <Scale className="h-8 w-8 text-gold-600" />
            <span className="text-xl font-serif font-bold">AI Advocate</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLinks />
            <Link
              to="/chat"
              className="flex items-center space-x-2 bg-navy-800 text-black px-4 py-2 rounded-md hover:bg-navy-900 transition-colors duration-200"
            >
              <MicIcon className="h-5 w-5" />
              <span>Ask AI Advocate</span>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-navy-800"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <NavLinks mobile />
            <Link
              to="/chat"
              className="flex items-center justify-center space-x-2 bg-navy-800 text-black px-4 py-3 rounded-md hover:bg-navy-900 transition-colors duration-200"
            >
              <MicIcon className="h-5 w-5" />
              <span>Ask AI Advocate</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

const NavLinks = ({ mobile = false }: { mobile?: boolean }) => {
  const location = useLocation();
  const linkClass = mobile
    ? "block py-2 text-navy-800 hover:text-gold-600 transition-colors duration-200"
    : "text-navy-800 hover:text-gold-600 transition-colors duration-200";

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <Link
        to="/"
        className={`${linkClass} ${isActive('/') ? 'font-semibold text-navy-900' : ''}`}
      >
        Home
      </Link>
      <Link
        to="/about"
        className={`${linkClass} ${isActive('/about') ? 'font-semibold text-navy-900' : ''}`}
      >
        About
      </Link>
      <Link
        to="/resources"
        className={`${linkClass} ${isActive('/resources') ? 'font-semibold text-navy-900' : ''}`}
      >
        Resources
      </Link>
    </>
  );
};

export default Header;