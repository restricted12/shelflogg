import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white text-center py-5 mt-5">
      <p className="mb-0">&copy; {new Date().getFullYear()} ShelfLog. Built by Dev. Ezedin.</p>
    </footer>
  );
};

export default Footer;
