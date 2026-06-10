import type { ReactElement } from "react";
import BorderedTitle from "./titles/BorderedTitle";

export default function Start(): ReactElement {
    return (
        <section id="start" className="bg-[#5b6ef8] text-center mb-16 py-24 px-6">
            <div className="relative z-10 max-w-2xl mx-auto">
                <BorderedTitle text="Empezar" bg="bg-white/10" txtColor="text-white" />
                <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-5 text-balance">Empieza a aprender idiomas hoy mismo</h1>
                <p className="text-white/70 mb-10 text-lg leading-relaxed">Únete a estudiantes de todo el mundo que ya aprenden nuevos idiomas a su manera. Sin tarjeta. Sin anuncios. Sin letra pequeña.</p>
                <a className="inline-block bg-white text-primary font-bold px-12 py-4 rounded-xl shadow-xl hover:bg-white/95 transition-all hover:-translate-y-0.5 text-[#5b6ef8]">Crear mi cuenta gratis</a>
                <p className="text-white/40 text-xs mt-5">¿Ya tienes cuenta? <a className="underline text-white/60 hover:text-white transition-colors">Inicia sesión</a></p>
            </div>
        </section>
    );
}
