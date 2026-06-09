import Borderedtitle from "./titles/BorderedTitle.jsx";
import Box from "./Boxes/Box.jsx";
import Skill from "./Boxes/Skill.jsx"
import Feature from "./Boxes/Feature.jsx";

export default function Features() {
    return (
        <section id="features" className="max-w-6xl mx-auto pt-24 px-6">
            <div className="text-center mb-16">
                <Borderedtitle text="Funcionalidades" bg="bg-primary-start/10" txtColor="text-primary-end"/>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-balance">
                    Todo lo que necesitas para dominar un nuevo idioma
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto text-pretty">
                    Una plataforma pensada para cada persona, cada ritmo y cada pasión.
                    Por ahora disponible en{' '}
                    <strong className="text-foreground">inglés</strong>,{' '}
                    con más idiomas en camino.
                </p>
                <div className="grid md:grid-cols-2 gap-5 mb-5 pt-10">

                    <Box bg="bg-emerald-600" 
                         shadow="hover:shadow-emerald-600/10"
                         border="border-emerald-600/30"
                         title="Aprende a tu ritmo y a tu manera" 
                         text="El contenido se adapta a tu velocidad y estilo de aprendizaje. Soporte para dislexia, TDAH y otras capacidades especiales: fuentes ajustables, alto contraste, narración de texto y pausas inteligentes." 
                         icon="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 6v6l4 2"/>

                    <Box bg="bg-zinc-600" 
                         shadow="hover:shadow-zinc-600/10"
                         border="border-zinc-600/30"
                         title="Aprende con lo que te apasiona" 
                         text=" Superhéroes, anime, deportes, videojuegos, música, ciencia, tecnología y cualquier otra pasión tuya. Las lecciones se construyen con el contenido que ya disfrutas para que aprender sea entretenido y relevante." 
                         icon="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                               
                </div>
                
                <div className="flex items-center gap-3 mb-6">
                        <div className="h-px flex-1 bg-zinc-600"></div>
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest whitespace-nowrap">Las 4 habilidades del idioma</span>
                        <div className="h-px flex-1 bg-zinc-600"></div>
                </div>

                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-5 text-left">
                    <Skill bg="bg-blue-500"
                           bg2="bg-blue-500/5"
                           border="border-blue-500/20"
                           title="Escucha" 
                           text="Comprensión auditiva con audios nativos, dictados interactivos y ejercicios de escucha activa."
                           icon="M3 18v-6a9 9 0 0 1 18 0v6 M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
                    
                    <Skill bg="bg-orange-400"
                           bg2="bg-orange-400/5"
                           border="border-orange-400/20"
                           title="Habla" 
                           text="Practica pronunciación con análisis de voz en tiempo real y comparación con hablantes nativos."
                           icon="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z M19 10v2a7 7 0 0 1-14 0v-2 M12 19v4 M8 23h8"/>

                    <Skill bg="bg-pink-500"
                           bg2="bg-pink-500/5"
                           border="border-pink-500/20"
                           title="Lectura" 
                           text="Lecturas graduadas con vocabulario resaltado, traducciones emergentes y comprensión lectora."
                           icon="M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>

                    <Skill bg="bg-green-500"
                           bg2="bg-green-500/5"
                           border="border-green-500/20"
                           title="Escritura" 
                           text="Ejercicios de escritura con corrección gramatical automática y retroalimentación detallada."
                           icon="M12 20h9 M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>

                </div>

                <div className="flex items-center gap-3">
                        <div className="h-px flex-1 bg-zinc-600"></div>
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest whitespace-nowrap">Otras características</span>
                        <div className="h-px flex-1 bg-zinc-600"></div>
                </div>

                <div className="grid md:grid-cols-3 gap-5 pt-5">
                    <Feature soon={true}
                             bg="bg-indigo-400/10"
                             textColor="text-indigo-400"
                             border="border-indigo-400/30"
                             title="Certificación Oficial"
                             text="Evaluaciones estructuradas para obtener un certificado de nivel que valide tu idioma ante empleadores y universidades."
                             icon="M12 2a6 6 0 1 0 0 12 6 6 0 0 0 0-12z M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>

                    <Feature soon={true}
                             bg="bg-teal-400/10"
                             textColor="text-teal-400"
                             border="border-teal-400/30"
                             title="Conversación con IA"
                             text="Practica conversaciones reales con un asistente de IA que corrige tus errores en tiempo real y se adapta a tu nivel."
                             icon="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                             
                    <Feature soon={true}
                             bg="bg-rose-400/10"
                             textColor="text-rose-400"
                             border="border-rose-400/30"
                             title="Rachas & Logros"
                             text="Mantén tu racha diaria y desbloquea insignias por cada hito. El sistema de puntos te mantiene motivado."
                             icon="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                             
                    <Feature soon={true}
                             bg="bg-lime-400/10"
                             textColor="text-lime-400"
                             border="border-lime-400/30"
                             title="Comunidad Global"
                             text="Comparte tu progreso, reta a otros estudiantes y aprende con personas de todo el mundo que comparten tu objetivo."
                             icon="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75"/>
                                                       
                    <Feature bg="bg-yellow-500/10"
                             textColor="text-yellow-500"
                             border="border-yellow-500/30"
                             title="Progreso Detallado"
                             text="Gráficas claras de tu evolución semanal. Sabe exactamente en qué habilidades debes enfocarte."
                             icon="M18 20V10 M12 20V4 M6 20v-6"/>
                             
                    <Feature bg="bg-green-500/10"
                             textColor="text-green-500"
                             border="border-green-500/30"
                             title="Vocabulario Flash"
                             text="Flashcards con repetición espaciada para memorizar palabras. El algoritmo se adapta a lo que más te cuesta."
                             icon="M12 2a6 6 0 1 0 0 12 6 6 0 0 0 0-12z M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>

                </div>
            </div>
        </section>
    );
}