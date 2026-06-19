// ==========================================
// 0. EJEMPLO TEMPORAL PARA EL USUARIO LOGGED IN
// ==========================================
export interface UserPreferencesSchema {
  user_id: number;
  enrolled_courses: string[];
  chosen_tags: string[]; 
}

export const mockUserPreferences: UserPreferencesSchema = {
  user_id: 123,
  enrolled_courses: ["english"],
  chosen_tags: ["general", "tech"]
};

export type ModulosAgrupados = Record<string, LessonSchema[]>;
// ==========================================
// 1. ESTRUCTURA PREDEFINIDA PARA LLEVAR SQL
// ==========================================
export interface FlashcardContentSchema {
  id_flashcard: number;       // PRIMARY KEY
  lesson_id: number;          // Relación con LessonSchema
  front_image: string;        // Ruta o URL de la imagen
  back_title: string;         // Palabra o frase
  back_pronunciation: string; // IPA
  lang: string;               // Código de idioma para TTS (ej: "en-US", "es-ES")
}

export interface CourseSchema {
  id: number;
  slug: string;        // Ej: 'english', 'french'
  title: string;       // Ej: 'Inglés', 'Francés'
  description: string; 
}

export interface TagSchema {
  id: number;
  slug: string;        // Ej: 'tech', 'gaming'
  name: string;        // Ej: 'Tecnología e Informática'
}

export interface TopicSchema {
  id: number;
  slug: string;        // 'verbo-to-be', 'pasado-simple'
  title: string;       // 'El Verbo To Be', 'Pasado Simple'
  course_slug: string; // Relación con CourseSchema (Muchos a Uno)
}

export interface LessonSchema {
  id: number;
  uuid: string;
  topic_id: number;    // Relación con el Tema/Mosaico (Muchos a Uno)
  tag_ids: number[];   // Soporta múltiples IDs de pasiones
  tipo: 'video' | 'flashcards' | 'reading' | 'drag-drop';
  title: string;
}

export interface VideoContentSchema {
  lesson_id: number; 
  url: string;
  description: string;
}

export interface DragDropContentSchema {
  id: number;                 // ID único del ejercicio
  lesson_id: number;          // Relación con LessonSchema
  text: string;               // La frase o palabra a clasificar
  category: string;           // La categoría para las cajas
  feedback_message_wrong?: string; 
}

// ==========================================
// 2. TABLAS DE DATOS (Mock Data para MaltTalk)
// ==========================================
export const coursesTable: CourseSchema[] = [
  { 
    id: 1, 
    slug: "english", 
    title: "Inglés", 
    description: "Aprende inglés desde las bases hasta alcanzar la fluidez." 
  },
  { 
    id: 2, 
    slug: "french", 
    title: "Francés", 
    description: "Domina el idioma francés con vocabulario y gramática práctica." 
  }
];

export const tagsTable: TagSchema[] = [
  { id: 1, slug: "general", name: "General" },
  { id: 2, slug: "gaming", name: "Videojuegos" },
  { id: 3, slug: "travel", name: "Viajes y Cultura" },
  { id: 4, slug: "anime", name: "Anime" }
];

export const topicsTable: TopicSchema[] = [
  // ==========================================
  // UNIDAD I: PRIMEROS CONTACTOS Y CONEXIONES INICIALES
  // ==========================================
  { 
    id: 1, 
    slug: "greetings-and-the-basics", 
    title: "Greetings, Farewells and The Basics", 
    course_slug: "english" 
    // Cubre: be (am, are, is), have (got), articles (a, an, the)
  },
  { 
    id: 2, 
    slug: "personal-identity", 
    title: "Personal Identity and Information", 
    course_slug: "english" 
    // Cubre: this, that, these, those, question words
  },
  { 
    id: 3, 
    slug: "survival-phrases", 
    title: "Survival Phrases in the Virtual Environment", 
    course_slug: "english" 
    // Cubre: imperative forms
  },

  // ==========================================
  // UNIDAD II: INTERACCIONES COTIDIANAS Y ENTORNOS INMEDIATOS
  // ==========================================
  { 
    id: 4, 
    slug: "my-personal-space", 
    title: "My Personal Space (Home and Objects)", 
    course_slug: "english" 
    // Cubre: there is/are, some, any
  },
  { 
    id: 5, 
    slug: "around-the-town", 
    title: "Around the Town and Directions", 
    course_slug: "english" 
    // Cubre: can (ability/permission), linking words
  },
  { 
    id: 6, 
    slug: "daily-routines", 
    title: "Daily Routines and Habits", 
    course_slug: "english" 
    // Cubre: present simple, adverbs of frequency
  },

  // ==========================================
  // UNIDAD III: FUNDAMENTOS LEGALES Y REGULACIONES TECNOLÓGICAS 
  // (Transacciones Comerciales y Sociales)
  // ==========================================
  { 
    id: 7, 
    slug: "at-the-restaurant", 
    title: "At the Restaurant & Ordering", 
    course_slug: "english" 
    // Cubre: would like, much, many, a lot of, a few, a little
  },
  { 
    id: 8, 
    slug: "shopping-and-preferences", 
    title: "Shopping, Prices and Preferences", 
    course_slug: "english" 
    // Cubre: comparative and superlative adjectives
  },
  { 
    id: 9, 
    slug: "real-interaction", 
    title: "Real Interaction & Progressive Events", 
    course_slug: "english" 
    // Cubre: present continuous, present simple vs present continuous
  },

  // ==========================================
  // TEMAS ADICIONALES DEL REPERTORIO A1-A2
  // (Para futuras unidades o lecciones complementarias)
  // ==========================================
  { 
    id: 10, 
    slug: "have-to-obligations", 
    title: "Obligations (Have to)", 
    course_slug: "english" 
  },
  { 
    id: 11, 
    slug: "should-advice", 
    title: "Giving Advice (Should)", 
    course_slug: "english" 
  },
  { 
    id: 12, 
    slug: "past-simple", 
    title: "Past Events (Past Simple)", 
    course_slug: "english" 
    // Cubre: regular e irregular verbs
  },
  { 
    id: 7, 
    slug: "future-plans", 
    title: "Future Plans (Will & Going to)", 
    course_slug: "english" 
  },
  { 
    id: 14, 
    slug: "present-perfect", 
    title: "Life Experiences (Present Perfect)", 
    course_slug: "english" 
    // Cubre: just, already, yet
  }
];

export const lessonsTable: LessonSchema[] = [
  { id: 1, uuid: "xT7mP9kL2bQ1", topic_id: 1, tag_ids: [1, 2], tipo: "video", title: "El verbo To Be Fácil" },
  { id: 2, uuid: "d3V6cF9sY2wP", topic_id: 1, tag_ids: [1], tipo: "video", title: "Have to" },
  { id: 3, uuid: "k9P2mR7wX4vB", topic_id: 1, tag_ids: [1], tipo: "video", title: "Articles a-an-the" },

  { id: 4, uuid: "L5nN8jH3zQ1t", topic_id: 2, tag_ids: [1], tipo: "video", title: "This-that-these-those" },
  { id: 5, uuid: "w5J4nR8vY3xL", topic_id: 2, tag_ids: [1], tipo: "video", title: "Wh questions" },
  { id: 6, uuid: "v6R8wL3qN5jD", topic_id: 2, tag_ids: [1], tipo: "video", title: "Yes/No questions" },

  { id: 7, uuid: "b2X9pM5tJ6wD", topic_id: 3, tag_ids: [1], tipo: "video", title: "Los imperativos" },

  { id: 8, uuid: "b7K4wR1sN9xQ", topic_id: 4, tag_ids: [1], tipo: "video", title: "There is/There are" },
  { id: 9, uuid: "m2Z8pL6vF3tY", topic_id: 4, tag_ids: [1], tipo: "video", title: "Some/Any" },
  { id: 10, uuid: "mF9zW2kL8vH5", topic_id: 4, tag_ids: [1], tipo: "flashcards", title: "Home and Objects"},

  { id: 11, uuid: "g9P3mD7tL4sN", topic_id: 5, tag_ids: [1], tipo: "video", title: "Verbo can" },
  { id: 12, uuid: "W4vN8cH5zR3y", topic_id: 5, tag_ids: [1], tipo: "video", title: "Linking words" },
  { id: 13, uuid: "vH9nB2mK4sL8", topic_id: 5, tag_ids: [1], tipo: "flashcards", title: "Places in the City"},

  { id: 15, uuid: "m7H4qZ1nK8vR", topic_id: 6, tag_ids: [1], tipo: "video", title: "Present simple" },
  { id: 16, uuid: "f1Q6mP9cW2sB", topic_id: 6, tag_ids: [1], tipo: "video", title: "Adverbios de frecuencia" },
  { id: 17, uuid: "c6F2rX8wJ5vK", topic_id: 6, tag_ids: [1], tipo: "video", title: "Time expressions" },
  
  { id: 18, uuid: "t4Y9jM1sN7wP", topic_id: 7, tag_ids: [1], tipo: "video", title: "Would like"},
  { id: 19, uuid: "z3K7vL5tB9xQ", topic_id: 7, tag_ids: [1], tipo: "video", title: "Sustantivos contables"},
  { id: 20, uuid: "f8W2pD6mK3vR", topic_id: 7, tag_ids: [1], tipo: "video", title: "Expresión de cantidades (much, many, a lot of, a few, a little)"},
  { id: 21, uuid: "xR4vN8wL2qJb", topic_id: 7, tag_ids: [1], tipo: "flashcards", title: "Fruits"},
  { id: 22, uuid: "mF9zW2kL7vH5", topic_id: 7, tag_ids: [1], tipo: "flashcards", title: "Drinks"},
  { id: 23, uuid: "mf6cW2Cl5bH3", topic_id: 7, tag_ids: [1], tipo: "drag-drop", title: "Clasificación de Frutas y Bebidas" },

  { id: 24, uuid: "q2B8mF4vK6tY", topic_id: 8, tag_ids: [1], tipo: "video", title: "Adjetivos comparativos y superlativos" },
  { id: 25, uuid: "r8N3vL7kH4zQ", topic_id: 8, tag_ids: [1], tipo: "video", title: "Fórmulas para expresar preferencias" },
  { id: 26, uuid: "kL3pQ9mR4tW7", topic_id: 8, tag_ids: [1], tipo: "flashcards", title: "Clothes and Accessories"},
  
  { id: 27, uuid: "h5X1qV9jK7wB", topic_id: 9, tag_ids: [1], tipo: "video", title: "Present Continuous" },
  { id: 28, uuid: "t9K2bH7zM4pC", topic_id: 9, tag_ids: [1], tipo: "video", title: "Present Continuous vs. Present Simple" },

  { id: 30, uuid: "v3B9nL2kQ8xR", topic_id: 1, tag_ids: [1], tipo: "drag-drop", title: "Conjugación del Verbo To Be" },
  { id: 31, uuid: "q7M4sJ2vW5zT", topic_id: 1, tag_ids: [1], tipo: "drag-drop", title: "Formal vs. Informal English" },
  
  
];

export const tablaVideosContent: VideoContentSchema[] = [
  { lesson_id: 1, url: "https://www.youtube.com/embed/nxk6IXlBqmU", description: "**🚀 ¡Aprende el Verbo TO BE desde cero! (Fácil y Rápido) 🇬🇧**\n\n¡Bienvenidos a una nueva clase de inglés! En este video vamos a dominar el pilar más importante del idioma: el **Verbo TO BE** (Ser o Estar). Olvídate de las explicaciones aburridas y confusas; hoy lo vas a entender de una vez por todas con ejemplos de la vida real.\n\n---\n\n**📌 ¿Qué vas a aprender en esta clase?**\n\n* **El Secreto del To Be:** Qué significa realmente y cuándo usarlo (*am, is, are*).\n\n* **Estructuras básicas:** Cómo hacer oraciones Afirmativas, Negativas y Preguntas.\n\n* **Contracciones:** Cómo hablar más rápido y sonar como un nativo (*I'm, She's, They're*).\n\n* **Práctica en vivo:** Ejercicios interactivos al final del video para poner a prueba lo aprendido." },
  { lesson_id: 2, url: "https://www.youtube.com/embed/2sb-z6_zCJ0", description: "**🚀 ¡Domina el HAVE TO en inglés desde cero! (Obligaciones y Reglas) 🇬🇧**\n\n¡Bienvenidos a una nueva clase de inglés! En este video vamos a dominar una estructura que usarás todos los días: el **HAVE TO** (Tener que). Olvídate de las explicaciones aburridas y confusas; hoy vas a entender de una vez por todas cómo expresar obligaciones, reglas y tareas cotidianas con ejemplos de la vida real.\n\n---\n\n**📌 ¿Qué vas a aprender en esta clase?**\n\n* **El Secreto del Have To:** Qué significa realmente, cuándo usarlo y cómo cambia para la tercera persona (*have to* vs. *has to*).\n\n* **Estructuras básicas:** Cómo hacer oraciones Afirmativas, Negativas y Preguntas usando los auxiliares correctos (*do* / *does*).\n\n* **El gran peligro del DON'T HAVE TO:** Te enseñaré por qué su significado cambia por completo en negativo y cómo evitar el error más común que cometen todos los estudiantes.\n\n* **Práctica en vivo:** Ejercicios interactivos al final del video para poner a prueba lo aprendido." },
  { lesson_id: 3, url: "https://www.youtube.com/embed/ZA8iL8H_JGk", description: "**🚀 ¡Domina los ARTÍCULOS en inglés desde cero! (A, AN, THE) 🇬🇧**\n\n¡Bienvenidos a una nueva clase de inglés! En este video vamos a dominar un tema fundamental pero que confunde a muchísimos estudiantes: los **Artículos (A, An, The)**. Olvídate de las explicaciones aburridas y confusas; hoy vas a entender de una vez por todas cuándo usarlos, cuándo dejarlos fuera y cómo sonar mucho más natural con ejemplos de la vida real.\n\n---\n\n**📌 ¿Qué vas a aprender en esta clase?**\n\n* **El Secreto de A vs. AN:** Cuándo usar cada uno basándonos en el sonido (y no solo en las letras) para que nunca te vuelvas a equivocar al decir palabras como *apple* o *university*.\n\n* **El poder de THE:** Aprenderás a identificar cuándo estás hablando de algo específico que todos conocen frente a algo general.\n\n* **El Artículo Cero (Cuándo NO usar nada):** Te enseñaré las reglas de oro para saber en qué momentos es un error grave poner un artículo en inglés.\n\n* **Práctica en vivo:** Ejercicios interactivos al final del video para poner a prueba lo aprendido." },
  { lesson_id: 4, url: "https://www.youtube.com/embed/cnNB_ThNukc", description: "Aprende la jerga, abreviaciones y expresiones más utilizadas en servidores multijugador en inglés." },
  { lesson_id: 5, url: "https://www.youtube.com/embed/nfvmNQ0cfAs", description: "Aprende la jerga, abreviaciones y expresiones más utilizadas en servidores multijugador en inglés." },
  { lesson_id: 6, url: "https://www.youtube.com/embed/gDIssulPDFY", description: "Aprende la jerga, abreviaciones y expresiones más utilizadas en servidores multijugador en inglés." },
  { lesson_id: 7, url: "https://www.youtube.com/embed/VFTd8KM2cm0", description: "Aprende la jerga, abreviaciones y expresiones más utilizadas en servidores multijugador en inglés." },
  { lesson_id: 8, url: "https://www.youtube.com/embed/j3llK722RVQ", description: "Aprende la jerga, abreviaciones y expresiones más utilizadas en servidores multijugador en inglés." },
  { lesson_id: 9, url: "https://www.youtube.com/embed/XoMdjUN_OCg", description: "Aprende la jerga, abreviaciones y expresiones más utilizadas en servidores multijugador en inglés." },
  { lesson_id: 11, url: "https://www.youtube.com/embed/EAFQ9Pj_hSM", description: "Aprende la jerga, abreviaciones y expresiones más utilizadas en servidores multijugador en inglés." },
  { lesson_id: 12, url: "https://www.youtube.com/embed/HwBrQR5ctoU", description: "Aprende la jerga, abreviaciones y expresiones más utilizadas en servidores multijugador en inglés." },
  { lesson_id: 14, url: "https://www.youtube.com/embed/wtTAdfyejH0", description: "Aprende la jerga, abreviaciones y expresiones más utilizadas en servidores multijugador en inglés." },
  { lesson_id: 15, url: "https://www.youtube.com/embed/WC2tzXPIWMs", description: "Aprende la jerga, abreviaciones y expresiones más utilizadas en servidores multijugador en inglés." },
  { lesson_id: 16, url: "https://www.youtube.com/embed/zN2ft9UDvIw", description: "Aprende la jerga, abreviaciones y expresiones más utilizadas en servidores multijugador en inglés." },
  { lesson_id: 17, url: "https://www.youtube.com/embed/u69O7uT_VRI", description: "Aprende la jerga, abreviaciones y expresiones más utilizadas en servidores multijugador en inglés." },
  { lesson_id: 18, url: "https://www.youtube.com/embed/LS9NNrxqlzQ", description: "Aprende la jerga, abreviaciones y expresiones más utilizadas en servidores multijugador en inglés." },
  { lesson_id: 19, url: "https://www.youtube.com/embed/-oll5WNHWAk", description: "Aprende la jerga, abreviaciones y expresiones más utilizadas en servidores multijugador en inglés." },
  { lesson_id: 22, url: "https://www.youtube.com/embed/3C49nBmsVbI", description: "Aprende la jerga, abreviaciones y expresiones más utilizadas en servidores multijugador en inglés." },
  { lesson_id: 23, url: "https://www.youtube.com/embed/O7AnqkMr2oI", description: "Aprende la jerga, abreviaciones y expresiones más utilizadas en servidores multijugador en inglés." },
  { lesson_id: 25, url: "https://www.youtube.com/embed/lGkxRXamy7Y", description: "Aprende la jerga, abreviaciones y expresiones más utilizadas en servidores multijugador en inglés." },
  { lesson_id: 26, url: "https://www.youtube.com/embed/jrrRYlI9XR8", description: "Aprende la jerga, abreviaciones y expresiones más utilizadas en servidores multijugador en inglés." }
];

export const tablaFlashcardsContent: FlashcardContentSchema[] = [
  { id_flashcard: 1, lesson_id: 20, front_image: "/flashcards/apple.png", back_title: "Apple", back_pronunciation: "/ˈæp.əl/", lang: "en-US" },
  { id_flashcard: 2, lesson_id: 20, front_image: "/flashcards/orange.png", back_title: "Orange", back_pronunciation: "/ˈɔːr.ɪndʒ/", lang: "en-US" },
  { id_flashcard: 3, lesson_id: 20, front_image: "/flashcards/lemon.png", back_title: "Lemon", back_pronunciation: "/ˈlem.ən/", lang: "en-US" },
  { id_flashcard: 4, lesson_id: 20, front_image: "/flashcards/strawberry.png", back_title: "Strawberry", back_pronunciation: "/ˈstrɔːˌber.i/", lang: "en-US" },
  { id_flashcard: 5, lesson_id: 20, front_image: "/flashcards/cherry.png", back_title: "Cherry", back_pronunciation: "/ˈtʃer.i/", lang: "en-US" },
  { id_flashcard: 6, lesson_id: 20, front_image: "/flashcards/blueberry.png", back_title: "Blueberry", back_pronunciation: "/ˈbluːˌber.i/", lang: "en-US" },
  { id_flashcard: 7, lesson_id: 20, front_image: "/flashcards/banana.png", back_title: "Banana", back_pronunciation: "/bəˈnæn.ə/", lang: "en-US" },
  { id_flashcard: 8, lesson_id: 20, front_image: "/flashcards/mango.png", back_title: "Mango", back_pronunciation: "/ˈmæŋ.ɡoʊ/", lang: "en-US" },
  { id_flashcard: 9, lesson_id: 20, front_image: "/flashcards/pineapple.png", back_title: "Pineapple", back_pronunciation: "/ˈpaɪnˌæp.əl/", lang: "en-US" },
  { id_flashcard: 10, lesson_id: 20, front_image: "/flashcards/watermelon.png", back_title: "Watermelon", back_pronunciation: "/ˈwɔː.tərˌmel.ən/", lang: "en-US" },
  { id_flashcard: 11, lesson_id: 20, front_image: "/flashcards/pear.png", back_title: "Pear", back_pronunciation: "/peər/", lang: "en-US" },
  { id_flashcard: 12, lesson_id: 20, front_image: "/flashcards/grape.png", back_title: "Grape", back_pronunciation: "/ɡreɪp/", lang: "en-US" },
  { id_flashcard: 13, lesson_id: 20, front_image: "/flashcards/kiwi.png", back_title: "Kiwi", back_pronunciation: "/ˈkiː.wiː/", lang: "en-US" },
  { id_flashcard: 14, lesson_id: 20, front_image: "/flashcards/peach.png", back_title: "Peach", back_pronunciation: "/piːtʃ/", lang: "en-US" },
  { id_flashcard: 15, lesson_id: 20, front_image: "/flashcards/melon.png", back_title: "Melon", back_pronunciation: "/ˈmel.ən/", lang: "en-US" },
  { id_flashcard: 16, lesson_id: 21, front_image: "/flashcards/water.png", back_title: "Water", back_pronunciation: "/ˈwɔː.tər/", lang: "en-US" },
  { id_flashcard: 17, lesson_id: 21, front_image: "/flashcards/coffee.png", back_title: "Coffee", back_pronunciation: "/ˈkɒf.i/", lang: "en-US" },
  { id_flashcard: 18, lesson_id: 21, front_image: "/flashcards/tea.png", back_title: "Tea", back_pronunciation: "/tiː/", lang: "en-US" },
  { id_flashcard: 19, lesson_id: 21, front_image: "/flashcards/juice.png", back_title: "Juice", back_pronunciation: "/dʒuːs/", lang: "en-US" },
  { id_flashcard: 20, lesson_id: 21, front_image: "/flashcards/milk.png", back_title: "Milk", back_pronunciation: "/mɪlk/", lang: "en-US" },
  { id_flashcard: 21, lesson_id: 21, front_image: "/flashcards/soda.png", back_title: "Soda", back_pronunciation: "/ˈsoʊ.də/", lang: "en-US" },
  { id_flashcard: 22, lesson_id: 21, front_image: "/flashcards/lemonade.png", back_title: "Lemonade", back_pronunciation: "/ˌlem.əˈneɪd/", lang: "en-US" },
  { id_flashcard: 23, lesson_id: 21, front_image: "/flashcards/beer.png", back_title: "Beer", back_pronunciation: "/bɪər/", lang: "en-US" },
  { id_flashcard: 24, lesson_id: 21, front_image: "/flashcards/wine.png", back_title: "Wine", back_pronunciation: "/waɪn/", lang: "en-US" },
  { id_flashcard: 25, lesson_id: 21, front_image: "/flashcards/smoothie.png", back_title: "Smoothie", back_pronunciation: "/ˈsmuː.ði/", lang: "en-US" },
  { id_flashcard: 26, lesson_id: 10, front_image: "/flashcards/table.png", back_title: "Table", back_pronunciation: "/ˈteɪ.bəl/", lang: "en-US" },
  { id_flashcard: 27, lesson_id: 10, front_image: "/flashcards/chair.png", back_title: "Chair", back_pronunciation: "/tʃeər/", lang: "en-US" },
  { id_flashcard: 28, lesson_id: 10, front_image: "/flashcards/bed.png", back_title: "Bed", back_pronunciation: "/bed/", lang: "en-US" },
  { id_flashcard: 29, lesson_id: 10, front_image: "/flashcards/lamp.png", back_title: "Lamp", back_pronunciation: "/læmp/", lang: "en-US" },
  { id_flashcard: 30, lesson_id: 10, front_image: "/flashcards/mirror.png", back_title: "Mirror", back_pronunciation: "/ˈmɪr.ər/", lang: "en-US" },
  { id_flashcard: 31, lesson_id: 10, front_image: "/flashcards/sofa.png", back_title: "Sofa", back_pronunciation: "/ˈsoʊ.fə/", lang: "en-US" },
  { id_flashcard: 32, lesson_id: 10, front_image: "/flashcards/desk.png", back_title: "Desk", back_pronunciation: "/desk/", lang: "en-US" },
  { id_flashcard: 33, lesson_id: 10, front_image: "/flashcards/fridge.png", back_title: "Fridge", back_pronunciation: "/frɪdʒ/", lang: "en-US" },
  { id_flashcard: 34, lesson_id: 10, front_image: "/flashcards/closet.png", back_title: "Closet", back_pronunciation: "/ˈklɒz.ɪt/", lang: "en-US" },
  { id_flashcard: 35, lesson_id: 10, front_image: "/flashcards/window.png", back_title: "Window", back_pronunciation: "/ˈwɪn.doʊ/", lang: "en-US" },
  { id_flashcard: 36, lesson_id: 24, front_image: "/flashcards/shirt.png", back_title: "Shirt", back_pronunciation: "/ʃɜːrt/", lang: "en-US" },
  { id_flashcard: 37, lesson_id: 24, front_image: "/flashcards/pants.png", back_title: "Pants", back_pronunciation: "/pænts/", lang: "en-US" },
  { id_flashcard: 38, lesson_id: 24, front_image: "/flashcards/dress.png", back_title: "Dress", back_pronunciation: "/dres/", lang: "en-US" },
  { id_flashcard: 39, lesson_id: 24, front_image: "/flashcards/jacket.png", back_title: "Jacket", back_pronunciation: "/ˈdʒæk.ɪt/", lang: "en-US" },
  { id_flashcard: 40, lesson_id: 24, front_image: "/flashcards/shoes.png", back_title: "Shoes", back_pronunciation: "/ʃuːz/", lang: "en-US" },
  { id_flashcard: 41, lesson_id: 24, front_image: "/flashcards/hat.png", back_title: "Hat", back_pronunciation: "/hæt/", lang: "en-US" },
  { id_flashcard: 42, lesson_id: 24, front_image: "/flashcards/socks.png", back_title: "Socks", back_pronunciation: "/sɒks/", lang: "en-US" },
  { id_flashcard: 43, lesson_id: 24, front_image: "/flashcards/coat.png", back_title: "Coat", back_pronunciation: "/koʊt/", lang: "en-US" },
  { id_flashcard: 44, lesson_id: 24, front_image: "/flashcards/skirt.png", back_title: "Skirt", back_pronunciation: "/skɜːrt/", lang: "en-US" },
  { id_flashcard: 45, lesson_id: 24, front_image: "/flashcards/glasses.png", back_title: "Glasses", back_pronunciation: "/ˈɡlæs.ɪz/", lang: "en-US" },
  { id_flashcard: 51, lesson_id: 13, front_image: "/flashcards/bank.png", back_title: "Bank", back_pronunciation: "/bæŋk/", lang: "en-US" },
  { id_flashcard: 52, lesson_id: 13, front_image: "/flashcards/hospital.png", back_title: "Hospital", back_pronunciation: "/ˈhɒs.pɪ.təl/", lang: "en-US" },
  { id_flashcard: 53, lesson_id: 13, front_image: "/flashcards/library.png", back_title: "Library", back_pronunciation: "/ˈlaɪ.brər.i/", lang: "en-US" },
  { id_flashcard: 54, lesson_id: 13, front_image: "/flashcards/supermarket.png", back_title: "Supermarket", back_pronunciation: "/ˈsuː.pəˌmɑː.kɪt/", lang: "en-US" },
  { id_flashcard: 55, lesson_id: 13, front_image: "/flashcards/school.png", back_title: "School", back_pronunciation: "/skuːl/", lang: "en-US" },
  { id_flashcard: 56, lesson_id: 13, front_image: "/flashcards/park.png", back_title: "Park", back_pronunciation: "/pɑːrk/", lang: "en-US" },
  { id_flashcard: 57, lesson_id: 13, front_image: "/flashcards/pharmacy.png", back_title: "Pharmacy", back_pronunciation: "/ˈfɑːr.mə.si/", lang: "en-US" },
  { id_flashcard: 58, lesson_id: 13, front_image: "/flashcards/cinema.png", back_title: "Cinema", back_pronunciation: "/ˈsɪn.ə.mə/", lang: "en-US" },
  { id_flashcard: 59, lesson_id: 13, front_image: "/flashcards/airport.png", back_title: "Airport", back_pronunciation: "/ˈeə.pɔːt/", lang: "en-US" },
  { id_flashcard: 60, lesson_id: 13, front_image: "/flashcards/restaurant.png", back_title: "Restaurant", back_pronunciation: "/ˈres.tər.ɒnt/", lang: "en-US" }
];

export const tablaDragDropContent: DragDropContentSchema[] = [
  // Frutas (Categoría: fruits)
  { id: 1, lesson_id: 23, text: "Apple", category: "fruits", feedback_message_wrong: "Analiza el ciclo biológico: ¿es un producto de una infusión o el contenedor de semillas de una planta?" },
  { id: 2, lesson_id: 23, text: "Orange", category: "fruits", feedback_message_wrong: "Considera su rol botánico: su función principal es proteger el germen de la especie, no saciar la sed directamente." },
  { id: 3, lesson_id: 23, text: "Lemon", category: "fruits", feedback_message_wrong: "Su acidez es un mecanismo de defensa natural, no una propiedad del procesamiento de un líquido industrial." },
  { id: 4, lesson_id: 23, text: "Strawberry", category: "fruits", feedback_message_wrong: "Distingue entre el recipiente (fruta) y el contenido extraído (bebida). ¿Qué estás manipulando realmente?" },
  { id: 5, lesson_id: 23, text: "Cherry", category: "fruits", feedback_message_wrong: "Observa su estructura: contiene un endocarpio leñoso. ¿Es coherente con la naturaleza de una bebida?" },
  { id: 6, lesson_id: 23, text: "Blueberry", category: "fruits", feedback_message_wrong: "Es un fruto pequeño y denso. Su propósito evolutivo es la dispersión, no la hidratación fluida." },
  { id: 7, lesson_id: 23, text: "Banana", category: "fruits", feedback_message_wrong: "Es una baya botánica (aunque no lo parezca). ¿Requiere un recipiente para ser consumida?" },
  { id: 8, lesson_id: 23, text: "Mango", category: "fruits", feedback_message_wrong: "Requiere un proceso mecánico de masticación para su digestión. ¿Eso encaja en tu lógica de líquidos?" },
  { id: 9, lesson_id: 23, text: "Pineapple", category: "fruits", feedback_message_wrong: "Su arquitectura es compleja y fibrosa. ¿Cómo se transforma en el estado líquido que buscas?" },
  { id: 10, lesson_id: 23, text: "Watermelon", category: "fruits", feedback_message_wrong: "Su alto contenido hídrico no altera su estado físico fundamental. Es materia sólida." },

  // Bebidas (Categoría: drinks)
  { id: 11, lesson_id: 23, text: "Water", category: "drinks", feedback_message_wrong: "Es la forma más simple de materia líquida. ¿Dónde ubicarías un fluido esencial?" },
  { id: 12, lesson_id: 23, text: "Coffee", category: "drinks", feedback_message_wrong: "Es el resultado de una extracción en caliente. Su estado físico es post-sólido." },
  { id: 13, lesson_id: 23, text: "Tea", category: "drinks", feedback_message_wrong: "Es una solución acuosa. ¿Es su naturaleza la de un cuerpo sólido?" },
  { id: 14, lesson_id: 23, text: "Juice", category: "drinks", feedback_message_wrong: "El estado original cambió. ¿Es esto el fruto o la esencia líquida extraída?" },
  { id: 15, lesson_id: 23, text: "Milk", category: "drinks", feedback_message_wrong: "Es una secreción biológica líquida. ¿Cumple con la definición de fruto?" },
  { id: 16, lesson_id: 23, text: "Soda", category: "drinks", feedback_message_wrong: "Es una mezcla gaseosa y líquida. ¿Existe algún sólido que masticar aquí?" },
  { id: 17, lesson_id: 23, text: "Lemonade", category: "drinks", feedback_message_wrong: "Es una disolución. ¿Es esta mezcla el fruto original o una preparación posterior?" },
  { id: 18, lesson_id: 23, text: "Beer", category: "drinks", feedback_message_wrong: "Es un producto fermentado. ¿Es una entidad vegetal que crece en un tallo?" },
  { id: 19, lesson_id: 23, text: "Wine", category: "drinks", feedback_message_wrong: "Es un destilado o fermentado. Analiza su estado de agregación molecular." },
  { id: 20, lesson_id: 23, text: "Smoothie", category: "drinks", feedback_message_wrong: "Aunque contiene fragmentos, su estado funcional es un fluido viscoso. ¿Qué define a una bebida?" },

  // Lección ID: 30 (Nueva) - Título: "Conjugación del Verbo To Be"
  { id: 21, lesson_id: 30, text: "I", category: "am", feedback_message_wrong: "Recuerda que 'I' es la primera persona del singular y tiene su forma exclusiva." },
  { id: 22, lesson_id: 30, text: "You", category: "are", feedback_message_wrong: "El pronombre 'you' siempre utiliza la forma 'are', tanto en singular como en plural." },
  { id: 23, lesson_id: 30, text: "He", category: "is", feedback_message_wrong: "Para las terceras personas del singular (he, she, it) usamos 'is'." },
  { id: 24, lesson_id: 30, text: "She", category: "is", feedback_message_wrong: "Recuerda: 'she' requiere el auxiliar 'is'." },
  { id: 25, lesson_id: 30, text: "We", category: "are", feedback_message_wrong: "Al ser un pronombre plural, le corresponde la forma 'are'." },
  { id: 26, lesson_id: 30, text: "They", category: "are", feedback_message_wrong: "El plural de la tercera persona utiliza 'are'." },

  { id: 27, lesson_id: 31, text: "How are you?", category: "formal", feedback_message_wrong: "Esta es una forma estándar y educada de saludar en entornos profesionales." },
  { id: 28, lesson_id: 31, text: "What's up?", category: "informal", feedback_message_wrong: "Esta es una expresión coloquial usada solo con amigos o gente de confianza." },
  { id: 29, lesson_id: 31, text: "Could you please help me?", category: "formal", feedback_message_wrong: "El uso de 'could' y 'please' denota un nivel de cortesía elevado." },
  { id: 30, lesson_id: 31, text: "Can you help?", category: "informal", feedback_message_wrong: "Aunque es correcto, suena directo y casual." },
  { id: 31, lesson_id: 31, text: "I would like to...", category: "formal", feedback_message_wrong: "Esta estructura es la preferida para hacer peticiones educadas." },
  { id: 32, lesson_id: 31, text: "I wanna...", category: "informal", feedback_message_wrong: "Esta es una contracción de 'want to' utilizada en el lenguaje hablado casual." },
];  