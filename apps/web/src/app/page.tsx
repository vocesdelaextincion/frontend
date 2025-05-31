"use client";

import { useState } from "react";
import { Menu, MoveDown } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import RecordingsTable from "@/components/recordingsTable/RecordingsTable";
import Image from "next/image";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const tableData = [
    {
      id: 1,
      name: "Crespín",
      date: "2025-05-31",
      audioPath: "/crespin-clasico-diciembre-19hs.mp3",
    },
    {
      id: 2,
      name: "Rana y agua",
      date: "2025-05-31",
      audioPath: "/ranacampanitayaguadiciembre21hs.mp3",
    },
    {
      id: 3,
      name: "Rana sola",
      date: "2025-05-31",
      audioPath: "/rana-sola-2019-01-13.mp3",
    },
  ];

  return (
    <main className="flex flex-col items-stretch">
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
      <section className="flex flex-col items-center justify-center h-screen gap-4  p-10">
        <div className="flex flex-4 flex-col items-center justify-center gap-2">
          <Image
            src="/placeholder2.png"
            alt="Imagen"
            width={200}
            height={200}
            priority
          />
          <h1>Voces de la extincion</h1>
        </div>
        <div className="mt-8 animate-pulse flex-1">
          <MoveDown className="w-8 h-8 text-primary-500" />
        </div>
      </section>
      <section className="flex flex-col items-center justify-start h-screen bg-primary-900 p-5 gap-10">
        <h2>Escucha nuestras grabaciones</h2>
        <div>
          <div className="w-full max-w-7xl mx-auto">
            <RecordingsTable data={tableData} />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <p className="text-center">
            Éstas grabaciones representan una muestra del proyecto Voces de la
            Extinción.
          </p>
          <p className="text-center">Accedé a más grabaciones</p>
        </div>
        <button className="bg-primary-500 text-white p-4 rounded-md">
          Escuchar más{" "}
        </button>
      </section>
      <section className="flex flex-col items-center justify-start h-screen p10">
        <motion.img
          ref={ref}
          src="/placeholder2.png"
          alt="Imagen"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-100 h-100"
        />
        section 3
      </section>
      <section className="flex flex-col items-center justify-center h-screen bg-primary-300 p-10">
        section 4
      </section>
      <section className="flex flex-col items-center justify-center h-screen p-10">
        section 5
      </section>
    </main>
  );
}
