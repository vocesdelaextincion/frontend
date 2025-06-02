"use client";

import { MoveDown } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import RecordingsTable from "@/components/recordingsTable/RecordingsTable";
import Image from "next/image";

export default function Home() {
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
