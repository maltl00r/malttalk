import type { ReactElement } from "react";

export default function Hero(): ReactElement {
    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-white via-blue-50 to-blue-100 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 dark:bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] dark:bg-[size:4rem_4rem]">
            {/* Destello Épico Izquierdo (Sky) */}
            <div
                className="pointer-events-none absolute -top-40 left-1/4 w-[600px] h-[600px] rounded-full bg-sky-500/10 dark:bg-sky-500/10 blur-[130px] mix-blend-screen"
                aria-hidden="true"
            />
            {/* Destello Épico Derecho (Emerald) */}
            <div
                className="pointer-events-none absolute -top-40 right-1/4 w-[600px] h-[600px] rounded-full bg-emerald-500/10 dark:bg-emerald-500/10 blur-[130px] mix-blend-screen"
                aria-hidden="true"
            />

            {/* Máscara de desvanecimiento para que el grid no sea infinito */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-blue-100/50 dark:to-slate-950 pointer-events-none" />

            <div className="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-16 flex flex-col items-center text-center">
                <span className="inline-flex items-center gap-2 bg-blue-100 dark:bg-slate-900 border border-blue-200 dark:border-slate-800 text-blue-700 dark:text-slate-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-8 animate-fade-in">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    Solo inglés disponible &mdash; más idiomas próximamente
                </span>

                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-foreground tracking-tight leading-[1.08] text-balance mb-6 animate-fade-in-up">
                    Aprende nuevos idiomas{' '}
                    <span className="bg-gradient-to-r from-blue-600 via-purple-500 to-cyan-500 dark:from-primary-start dark:to-primary-end bg-clip-text text-transparent">a tu ritmo</span>,{' '}
                    con lo que te{' '}
                    <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600 dark:from-secondary-start dark:to-secondary-end bg-clip-text text-transparent">apasiona</span>
                </h1>

                <p className="text-lg text-gray-600 dark:text-slate-400 max-w-2xl mb-10 leading-relaxed text-pretty animate-fade-in-up delay-100">
                    La plataforma que adapta el aprendizaje de idiomas a tus intereses, tu estilo y tus
                    capacidades. Escucha, habla, lectura y escritura en un solo lugar.{' '}
                    <strong className="text-gray-900 dark:text-foreground font-semibold">100% gratuito.</strong>
                </p>
            </div>
        </section>
    );
}
