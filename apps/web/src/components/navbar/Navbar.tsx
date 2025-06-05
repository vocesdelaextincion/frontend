"use client";

import React, { useState } from "react";
import { Menu } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-primary-500 text-white shadow-md ">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-display">Voces de la extinción</h1>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              <li>
                <Link href="/">Inicio</Link>
              </li>
              <li>
                <Link href="/recordings">Grabaciones</Link>
              </li>
              <li>
                <Link href="/about">Sobre Nosotros</Link>
              </li>
              <li>
                <Link href="/contact">Contacto</Link>
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
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                Inicio
              </Link>
            </li>
            <li>
              <Link href="/recordings" onClick={() => setMobileMenuOpen(false)}>
                Grabaciones
              </Link>
            </li>
            <li>
              <Link href="/about" onClick={() => setMobileMenuOpen(false)}>
                Sobre Nosotros
              </Link>
            </li>
            <li>
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                Contacto
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
