import type { ReactElement } from "react";
import BorderedTitle from "./titles/BorderedTitle";

interface Nivel {
    titulo: string;
    rango: string;
    subtitulo: string;
    badgeTexto: string;
    descripcionCorta: string;
    beneficios: string[];
    colorFondoHeader: string;
    colorBorde: string;
    colorTextoIcono: string;
    colorBgBadge: string;
}

export default function Level(): ReactElement {
    const niveles: Nivel[] = [
        {
            titulo: "Principiante",
            rango: "(A1-A2)",
            subtitulo: "Primeros pasos",
            badgeTexto: "A1",
            descripcionCorta: "Conexiones iniciales",
            beneficios: [
                "Interacciones cotidianas básicas",
                "Estructuras inductivas simples",
                "Saludos, rutinas y vocabulario real"
            ],
            colorFondoHeader: "bg-green-200/45",
            colorBorde: "border-green-300",
            colorTextoIcono: "text-green-400",
            colorBgBadge: "bg-green-600"
        },
        {
            titulo: "Intermedio",
            rango: "(B1-B2)",
            subtitulo: "Independencia",
            badgeTexto: "B1",
            descripcionCorta: "Fluidez comunicativa",
            beneficios: [
                "Discusiones sobre temas familiares",
                "Estructuras gramaticales complejas",
                "Producción de textos y opiniones"
            ],
            colorFondoHeader: "bg-orange-300/40",
            colorBorde: "border-orange-400",
            colorTextoIcono: "text-orange-500",
            colorBgBadge: "bg-orange-700"
        },
        {
            titulo: "Avanzado",
            rango: "(C1-C2)",
            subtitulo: "Dominio experto",
            badgeTexto: "C1",
            descripcionCorta: "Interacciones fluidas",
            beneficios: [
                "Comprensión de textos exigentes",
                "Uso flexible del idioma en lo social",
                "Expresión espontánea y natural"
            ],
            colorFondoHeader: "bg-red-400/40",
            colorBorde: "border-red-500",
            colorTextoIcono: "text-red-800",
            colorBgBadge: "bg-red-600"
        }
    ];

    return (
        <div className="text-center mb-12 px-4">
            <BorderedTitle text="Nuestros niveles" bg="bg-violet-500/10" txtColor="text-indigo-500" />

            <div className="mx-auto max-w-6xl px-5 grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pb-20 mt-4">
                {niveles.map((nivel, index) => (
                    <div
                        key={index}
                        className={`w-full flex flex-col ${nivel.colorFondoHeader} rounded-2xl border-2 ${nivel.colorBorde} shadow-sm transition-transform duration-300 hover:scale-105 overflow-hidden`}
                    >
                        <div className={`p-6 text-center ${nivel.colorFondoHeader} border-b ${nivel.colorBorde}`}>
                            <h3 className="text-2xl font-bold text-background">{nivel.titulo}</h3>
                            <span className="text-sm font-semibold text-background block mt-1">{nivel.rango}</span>

                            <div className="flex items-center justify-center space-x-3 mt-4">
                                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${nivel.colorBgBadge}`}>
                                    {nivel.badgeTexto}
                                </span>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs ${nivel.colorBgBadge}`}>
                                    🌐
                                </div>
                                <span className="text-xs font-medium text-background truncate max-w-[120px]">
                                    {nivel.descripcionCorta}
                                </span>
                            </div>
                        </div>

                        <div className="p-6 flex-grow flex flex-col justify-between">
                            <ul className="space-y-4">
                                {nivel.beneficios.map((beneficio, bIndex) => (
                                    <li key={bIndex} className="flex items-start text-sm text-black text-left">
                                        <span className={`flex-shrink-0 mr-3 mt-0.5 ${nivel.colorTextoIcono}`}>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                            </svg>
                                        </span>
                                        <span className="text-red-50">{beneficio}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
