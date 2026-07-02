import type { ReactElement } from "react";
import BorderedTitle from "./titles/BorderedTitle";

export default function Start(): ReactElement {
    return (
        <section id="start" className="bg-gradient-to-r from-white via-blue-50 to-blue-100 dark:from-[#5b6ef8] dark:via-blue-600 dark:to-purple-600 text-center mb-16 py-24 px-6">
            <div className="relative z-10 max-w-2xl mx-auto">
                <BorderedTitle text="Empezar" bg="dark:bg-white/10 bg-blue-200" txtColor="dark:text-white text-blue-700" />
                <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-5 text-balance">Empieza a aprender idiomas hoy mismo</h1>
                <p className="text-gray-700 dark:text-white/70 mb-10 text-lg leading-relaxed">Únete a estudiantes de todo el mundo que ya aprenden nuevos idiomas a su manera. Sin tarjeta. Sin anuncios. Sin letra pequeña.</p>
                <a className="inline-block bg-blue-600 dark:bg-white text-white dark:text-blue-600 font-bold px-12 py-4 rounded-xl shadow-xl hover:bg-blue-700 dark:hover:bg-white/95 transition-all hover:-translate-y-0.5">Crear mi cuenta gratis</a>
                <p className="text-gray-600 dark:text-white/40 text-xs mt-5">¿Ya tienes cuenta? <a className="underline text-gray-700 dark:text-white/60 hover:text-gray-900 dark:hover:text-white transition-colors">Inicia sesión</a></p>
            </div>
        </section>
    );
}
