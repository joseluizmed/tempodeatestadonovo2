import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  if (isHomePage) {
    return (
      <header className="bg-blue-700 text-white py-10 px-4 text-center mb-10 shadow-md">
        <h1 className="text-4xl md:text-5xl font-bold">Tempo de Atestado</h1>
        <p className="text-lg mt-2 opacity-90">
          Calcule períodos efetivamente cobertos a partir de atestados concedidos, identifique sobreposições e eventuais dias não cobertos entre os afastamentos.
        </p>
      </header>
    );
  }

  return (
    <header className="bg-blue-700 text-white py-4 px-6 text-center mb-8 shadow-md">
      <Link to="/" className="text-2xl font-bold hover:text-blue-200 transition-colors duration-150" aria-label="Página Inicial">
        Tempo de Atestado
      </Link>
    </header>
  );
};

export default Header;
