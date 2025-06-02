"use client";

import React, { useState } from "react";
import { Menu } from "lucide-react";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-primary-500 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-display">Voces de la extinción</h1>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              <li>
                <a
                  href="#"
                  className="hover:text-primary-200 transition-colors"
                >
                  Inicio
                </a>
              </li>
              <li>
                <a
                  href="#recordings"
                  className="hover:text-primary-200 transition-colors"
                >
                  Grabaciones
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="hover:text-primary-200 transition-colors"
                >
                  Sobre Nosotros
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="hover:text-primary-200 transition-colors"
                >
                  Contacto
                </a>
              </li>
            </ul>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden rounded-lg focus:outline-none focus:shadow-outline p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu />
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          id="mobile-menu"
          className={`${mobileMenuOpen ? "block" : "hidden"} md:hidden mt-2 pb-2`}
        >
          <ul className="flex flex-col space-y-2">
            <li>
              <a
                href="#"
                className="block px-4 py-2 hover:bg-primary-600 rounded transition-colors"
              >
                Inicio
              </a>
            </li>
            <li>
              <a
                href="#recordings"
                className="block px-4 py-2 hover:bg-primary-600 rounded transition-colors"
              >
                Grabaciones
              </a>
            </li>
            <li>
              <a
                href="#about"
                className="block px-4 py-2 hover:bg-primary-600 rounded transition-colors"
              >
                Sobre Nosotros
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className="block px-4 py-2 hover:bg-primary-600 rounded transition-colors"
              >
                Contacto
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
