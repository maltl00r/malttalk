"use client";

import { useState, useRef, useEffect } from "react";
import { fetchLessonWithFlashcardContent } from "@/app/actions/modules";
import type { lessons, flashcard_contents } from "@/generated/prisma/client";

interface FlashcardsDivProps {
  lessonId: number;
}

export default function FlashcardsDiv({ lessonId }: FlashcardsDivProps) {
  const [lesson, setLesson] = useState<(lessons & { flashcard_contents: flashcard_contents[] }) | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [flippedStates, setFlippedStates] = useState<boolean[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchLessonWithFlashcardContent(lessonId);
        setLesson(data);
        setFlippedStates(Array((data?.flashcard_contents?.length || 0)).fill(false));
      } catch (error) {
        console.error("Error loading flashcard content:", error);
        setLesson(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [lessonId]);

  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  useEffect(() => {
    const updateVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };

    // Initial load
    updateVoices();

    // Listener for when browser finishes loading voices
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  const playTTS = (text: string, lang: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    // 1. Cancel any previous audio
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // 2. "Smart Match" selection logic
    const langCode = lang.split('-')[0].toLowerCase();
    
    const voices = voicesRef.current;
    
    const selectedVoice = 
      voices.find(v => v.lang === lang) || // Exact match (e.g. fr-FR)
      voices.find(v => v.lang.toLowerCase().startsWith(langCode)) || // Language match (e.g. fr)
      voices.find(v => v.name.toLowerCase().includes(langCode)); // Name match (e.g. "Google Français")

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    } else {
      // Fallback: if no voice, let the browser try the lang by default
      utterance.lang = lang;
    }

    utterance.rate = 1;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  };

  const toggleFlip = (index: number) => {
    setFlippedStates((prev) =>
      prev.map((f, i) => (i === index ? !f : f))
    );
  };

  if (isLoading) {
    return (
      <div className="p-4 bg-blue-900/50 text-blue-200 border border-blue-800 rounded-md">
        Cargando flashcards...
      </div>
    );
  }

  if (!lesson || !lesson.flashcard_contents || lesson.flashcard_contents.length === 0) {
    return (
      <div className="p-4 bg-red-900/50 text-red-200 border border-red-800 rounded-md">
        No hay flashcards para esta lección.
      </div>
    );
  }

  const cards = lesson.flashcard_contents;

  return (
    <div className="flex flex-col items-center gap-6 w-full px-4">
      <h2 className="text-xl font-bold">{lesson.title}</h2>

      {/* Grid: Adjusted to use max-w-full */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full max-w-6xl">
      {cards.map((card, index) => (
        <div
          key={card.id}
          className="w-full max-w-[500px] aspect-[2/3] [perspective:500px] cursor-pointer mx-auto"
          onClick={() => toggleFlip(index)}
        >
          <div
            className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${
              flippedStates[index] ? "[transform:rotateY(180deg)]" : ""
            }`}
          >
            {/* Front card style */}
            <div className="absolute w-full h-full [backface-visibility:hidden] bg-red-400 rounded-lg shadow-md border-2 border-red-600 flex flex-col items-center justify-between p-2">
              <div className="w-full flex justify-between text-red-600 font-bold text-sm">
                <span>♥</span>
                <span>♥</span>
              </div>

              <div className="flex-grow flex items-center justify-center">
                {card.front_image && (
                  <img
                    src={card.front_image}
                    alt={card.back_title}
                    className="max-w-full max-h-16 object-contain"
                  />
                )}
              </div>

              <div className="w-full flex justify-between text-red-600 font-bold text-sm rotate-180">
                <span>♥</span>
                <span>♥</span>
              </div>
            </div>

            {/* Back */}
            <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-red-500 text-white rounded-lg shadow-md flex flex-col items-center justify-center gap-2 p-2 border-2 border-red-500">
              <h3 className="text-sm font-semibold text-center">{card.back_title}</h3>
              {card.back_pronunciation && (
                <p className="text-xs text-red-100">{card.back_pronunciation}</p>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playTTS(card.back_title, card.lang);
                }}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-red-700 hover:bg-red-100 transition-colors font-bold text-sm"
              >
                ▶
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>

    </div>
  );
}
