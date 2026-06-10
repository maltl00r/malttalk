import type { ReactElement } from "react";

export default function Card(): ReactElement {
    return (
        <div className="border-t border-b border-blue-950/50">
            <div className="max-w-5xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="flex flex-col items-center">
                    <p className="text-xl font-extrabold text-primary-start bg-gradient-to-r from-primary-start to-primary-end bg-clip-text text-transparent">4 habilidades</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Escucha · Habla · Lectura · Escritura</p>
                </div>

                <div className="flex flex-col items-center">
                    <p className="text-xl font-extrabold text-primary-start bg-gradient-to-r from-primary-start to-primary-end bg-clip-text text-transparent">100% adaptado</p>
                    <p className="text-xs text-muted-foreground mt-0.5">A tus intereses y capacidades</p>
                </div>

                <div className="flex flex-col items-center">
                    <p className="text-xl font-extrabold text-primary-start bg-gradient-to-r from-primary-start to-primary-end bg-clip-text text-transparent">Totalmente gratis</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Sin tarjeta. Sin pagos ocultos.</p>
                </div>

                <div className="flex flex-col items-center">
                    <p className="text-xl font-extrabold text-primary-start bg-gradient-to-r from-primary-start to-primary-end bg-clip-text text-transparent">Sin anuncios</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Nunca. La educación es libre.</p>
                </div>
            </div>
        </div>
    );
}
