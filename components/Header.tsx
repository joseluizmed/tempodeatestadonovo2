import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const Logo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-8 h-8 mr-2 text-white"
    aria-hidden="true"
  >
    <path d="M18 2H6c-1.11 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 4h2v5l-1-.75L9 9V4zm9 16H6V4h1v9l3-2.25L13 13V4h5v16z" />
  </svg>
);


const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Início', path: '/' },
    { name: 'Sobre', path: '/sobre' },
    { name: 'Calculadora de Atestado', path: '/calculadora-de-atestado' },
    { name: 'Perícia Médica [Dúvidas e Respostas]', path: '/artigos' },
    { name: 'Benefícios do INSS', path: '/beneficio-inss' },
    { name: 'Política de Privacidade', path: '/politica-de-privacidade' },
    { name: 'Contato', path: '/contato' },
  ];

  const linkClasses = "block md:inline-block px-2 py-2 rounded-md text-sm font-medium transition-colors duration-150";
  const activeLinkClasses = "bg-blue-800 text-white";
  const inactiveLinkClasses = "text-blue-100 hover:bg-blue-600 hover:text-white";

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="bg-blue-700 shadow-lg sticky top-0 z-40">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <NavLink to="/" className="text-white text-xl font-bold hover:text-blue-200 flex items-center">
              <Logo />
              Atestado e Perícia Médica
            </NavLink>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-baseline space-x-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  end={link.path === '/'}
                  className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="bg-blue-700 inline-flex items-center justify-center p-2 rounded-md text-blue-200 hover:text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-700 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Abrir menu principal</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}
                aria-current={location.pathname === link.path ? 'page' : undefined}
              >
                {link.name}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;