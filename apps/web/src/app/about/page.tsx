import Image from "next/image";
import React from "react";

const About = () => {
  return (
    <main className="min-h-screen bg-black text-white space-y-1">
      <section className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
        <div className="md:col-span-4">
          <Image
            src="/voces_1.jpg"
            alt="Imagen moderna"
            width={800}
            height={800}
            className="w-full h-auto object-cover"
          />
        </div>
        <div className="md:col-span-2 flex items-center p-2">
          <p className="text-md md:text-base leading-relaxed">
            «Voces de la Extinción» es un proyecto que propone la grabación del
            paisaje sonoro del bosque nativo de la Provincia de Córdoba. Busca
            reconectar, a través de la valoración y recuperación de la trama de
            prácticas del territorio, un sentido que no necesariamente tiene una
            utilidad, un resultado material, económico, o científico. Recuperar
            el abordaje afectivo, la trama cultural propia del territorio,
            profundamente anclada en lo natural. Apelar a lenguajes diferentes
            de los científicos y técnicos, especialmente basados en experiencias
            sensibles, puede llevar a la construcción de una relación más
            afectiva y, por lo tanto, una reapropiación social de estos espacios
            y sus procesos de conservación.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
        <div className="md:col-span-2 flex items-center order-2 md:order-1 p-2">
          <p className="text-md md:text-base leading-relaxed">
            Teniendo en cuenta la realidad de nuestra provincia, a la que solo
            le queda el 3% de bosque nativo, y el “campo ambiental” creemos que
            incorporar dispositivos que interpelen lo sensible y lo estético
            abren este campo, lo transgreden y lo amplían, convocando a más
            personas y actores sociales, una consecuencia muy necesaria para la
            defensa y la conservación de estos espacios.{" "}
          </p>
        </div>
        <div className="md:col-span-4 order-1 md:order-2">
          <Image
            src="/voces_2.webp"
            alt="Imagen moderna 2"
            width={800}
            height={800}
            className="w-full h-auto object-cover"
          />
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
        <div className="md:col-span-4">
          <Image
            src="/voces_3.webp"
            alt="Imagen moderna"
            width={800}
            height={800}
            className="w-full h-auto object-cover"
          />
        </div>
        <div className="md:col-span-2 flex flex-col items-center p-2 gap-2">
          <p className="text-md md:text-base leading-relaxed">
            “Voces de la Extinción” plantea la escucha y la grabación del
            paisaje sonoro del Bosque Chaqueño Serrano como una práctica de
            intervención social con el fin de poder incidir en la comunidad a
            través de estos procesos que implican la emergencia de sentidos que,
            tal vez, se habían perdido o permanecen ocluidos; se presenta como
            disparador del fortalecimiento de la trama de sentidos y valores,
            volver a recomponer la trama que se ha fragmentado como resultado de
            la especialización de cómo abordar el territorio.
          </p>
          <button className="bg-primary-800 text-white p-4 rounded-md self-start">
            Leer texto completo
          </button>
        </div>
      </section>
    </main>
  );
};

export default About;
