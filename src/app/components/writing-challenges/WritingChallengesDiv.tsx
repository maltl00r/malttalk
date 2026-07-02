"use client";

import { useState, useEffect } from "react";
import { fetchLessonWithWritingChallenges } from "@/app/actions/modules";
import type { lessons, writing_challenge_contents } from "@/generated/prisma/client";

/**
 * Props interface for WritingChallengesDiv component
 */
interface WritingChallengesDivProps {
  lessonId: number;
}

/**
 * State interface for lesson data
 */
interface LessonData {
  lesson: (lessons & { writing_challenge_contents: writing_challenge_contents[] }) | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * WRITING CHALLENGES COMPONENT
 * 
 * Provides an interactive text editor for students to complete writing expression tasks.
 * Students compose texts using learned vocabulary with real-time word count tracking,
 * vocabulary validation, and feedback on word count constraints.
 * 
 * Features:
 * - Guided writing prompts with difficulty levels
 * - Real-time word count tracking
 * - Required vocabulary highlighting
 * - Min/max word count validation
 * - Example answers for reference
 * - Progress indication through challenges
 * - Submission feedback
 * 
 * @component
 * @param {WritingChallengesDivProps} props - Component props
 * @returns {JSX.Element} Rendered writing challenge interface
 */
export default function WritingChallengesDiv({ lessonId }: WritingChallengesDivProps) {
  const [data, setData] = useState<LessonData>({
    lesson: null,
    isLoading: true,
    error: null,
  });

  // Track current challenge index, written text, and completion
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [writtenText, setWrittenText] = useState("");
  const [showExample, setShowExample] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [submittedChallenges, setSubmittedChallenges] = useState<number[]>([]);

  /**
   * Load lesson and writing challenges on component mount
   */
  useEffect(() => {
    const loadData = async () => {
      try {
        const lesson = await fetchLessonWithWritingChallenges(lessonId);
        setData({ lesson: lesson || null, isLoading: false, error: null });
      } catch (error) {
        setData({
          lesson: null,
          isLoading: false,
          error: "Error loading writing challenges",
        });
      }
    };

    loadData();
  }, [lessonId]);

  // Show loading state
  if (data.isLoading) {
    return (
      <div className="p-4 bg-blue-900/50 text-blue-200 border border-blue-800 rounded-md">
        Loading writing challenges...
      </div>
    );
  }

  // Show error state
  if (data.error || !data.lesson) {
    return (
      <div className="p-4 bg-red-900/50 text-red-200 border border-red-800 rounded-md">
        {data.error || "Failed to load writing challenges"}
      </div>
    );
  }

  const challenges = data.lesson.writing_challenge_contents || [];
  if (challenges.length === 0) {
    return (
      <div className="p-4 bg-yellow-900/50 text-yellow-200 border border-yellow-800 rounded-md">
        No writing challenges available for this lesson
      </div>
    );
  }

  // Completion screen
  if (completed) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-gradient-to-br from-green-900/20 to-blue-900/20 rounded-2xl border border-green-700/50">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-white">All Challenges Complete! 🎉</h2>
          <p className="text-xl text-gray-300">
            You've successfully completed <span className="font-bold text-green-400">{submittedChallenges.length}</span> writing challenges
          </p>
          <button
            onClick={() => {
              setCurrentChallengeIndex(0);
              setWrittenText("");
              setShowExample(false);
              setCompleted(false);
              setSubmittedChallenges([]);
            }}
            className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  const currentChallenge = challenges[currentChallengeIndex];
  const wordCount = writtenText.trim().split(/\s+/).filter(w => w).length;
  const isValidWordCount = wordCount >= currentChallenge.min_words && wordCount <= currentChallenge.max_words;
  const requiredVocab = currentChallenge.required_vocabulary?.split(",").map(v => v.trim()) || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      {/* Header with progress */}
      <div className="bg-gradient-to-r from-pink-600 to-rose-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">{data.lesson.title}</h1>
          <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
            Challenge {currentChallengeIndex + 1} of {challenges.length}
          </span>
        </div>
        {/* Progress bar */}
        <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-300"
            style={{
              width: `${((currentChallengeIndex + 1) / challenges.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Challenge content */}
      <div className="bg-slate-800/50 rounded-xl p-8 space-y-6 border border-slate-700">
        {/* Difficulty badge */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-400">Difficulty:</span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              currentChallenge.difficulty_level === "beginner"
                ? "bg-green-500/20 text-green-300"
                : currentChallenge.difficulty_level === "intermediate"
                  ? "bg-yellow-500/20 text-yellow-300"
                  : "bg-red-500/20 text-red-300"
            }`}
          >
            {currentChallenge.difficulty_level.charAt(0).toUpperCase() +
              currentChallenge.difficulty_level.slice(1)}
          </span>
        </div>

        {/* Challenge title and prompt */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-3">{currentChallenge.title}</h2>
          <p className="text-gray-200 text-lg leading-relaxed">{currentChallenge.prompt}</p>
        </div>

        {/* Hint section */}
        {currentChallenge.hint && (
          <div className="bg-blue-900/30 border border-blue-600/50 rounded-lg p-4">
            <p className="text-sm text-blue-200">
              <span className="font-bold">💡 Hint:</span> {currentChallenge.hint}
            </p>
          </div>
        )}

        {/* Required vocabulary */}
        {requiredVocab.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm text-gray-300 font-semibold">Required Vocabulary:</p>
            <div className="flex flex-wrap gap-2">
              {requiredVocab.map((vocab, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-pink-900/40 border border-pink-600/60 text-pink-200 rounded-full text-sm font-medium"
                >
                  {vocab}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Text editor */}
        <div className="space-y-3">
          <label className="text-sm text-gray-300 font-semibold">
            Your Response ({wordCount} words)
          </label>
          <textarea
            value={writtenText}
            onChange={(e) => setWrittenText(e.target.value)}
            placeholder="Write your response here..."
            className="w-full h-64 p-4 bg-slate-900 text-white border-2 border-slate-600 rounded-lg focus:border-pink-500 focus:outline-none resize-none"
          />
          
          {/* Word count requirements */}
          <div className="flex gap-4 text-sm">
            <div className={`flex items-center gap-2 ${wordCount < currentChallenge.min_words ? "text-red-400" : "text-green-400"}`}>
              <span>Minimum: {currentChallenge.min_words} words</span>
              {wordCount < currentChallenge.min_words && (
                <span>({currentChallenge.min_words - wordCount} more needed)</span>
              )}
            </div>
            <div className={`flex items-center gap-2 ${wordCount > currentChallenge.max_words ? "text-red-400" : "text-green-400"}`}>
              <span>Maximum: {currentChallenge.max_words} words</span>
              {wordCount > currentChallenge.max_words && (
                <span>({wordCount - currentChallenge.max_words} too many)</span>
              )}
            </div>
          </div>
        </div>

        {/* Example answer toggle */}
        {currentChallenge.example_answer && (
          <div className="space-y-3">
            <button
              onClick={() => setShowExample(!showExample)}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition"
            >
              {showExample ? "Hide" : "Show"} Example Answer
            </button>
            {showExample && (
              <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-4">
                <p className="text-sm text-gray-300 font-semibold mb-2">Example Answer:</p>
                <p className="text-gray-200 leading-relaxed">{currentChallenge.example_answer}</p>
              </div>
            )}
          </div>
        )}

        {/* Status message */}
        <div className={`p-4 rounded-lg ${isValidWordCount ? "bg-green-900/40 border border-green-600 text-green-100" : "bg-orange-900/40 border border-orange-600 text-orange-100"}`}>
          <p className="font-semibold">
            {isValidWordCount ? "✓ Ready to submit" : "⚠ Word count requirements not met"}
          </p>
          <p className="text-sm mt-1">
            {isValidWordCount
              ? "Your response meets the word count requirements."
              : `Your response needs ${
                  wordCount < currentChallenge.min_words
                    ? `at least ${currentChallenge.min_words - wordCount} more word(s)`
                    : `${wordCount - currentChallenge.max_words} fewer word(s)`
                }`}
          </p>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex gap-3 justify-between">
        <button
          disabled={currentChallengeIndex === 0}
          onClick={() => {
            setCurrentChallengeIndex((prev) => Math.max(0, prev - 1));
            setWrittenText("");
            setShowExample(false);
          }}
          className="px-6 py-3 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:opacity-50 text-white font-semibold rounded-lg transition"
        >
          ← Previous
        </button>

        {currentChallengeIndex === challenges.length - 1 ? (
          <button
            disabled={!isValidWordCount}
            onClick={() => {
              setSubmittedChallenges([...submittedChallenges, currentChallengeIndex]);
              setCompleted(true);
            }}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:opacity-50 text-white font-semibold rounded-lg transition"
          >
            Finish Challenges
          </button>
        ) : (
          <button
            disabled={!isValidWordCount}
            onClick={() => {
              setSubmittedChallenges([...submittedChallenges, currentChallengeIndex]);
              setCurrentChallengeIndex((prev) => prev + 1);
              setWrittenText("");
              setShowExample(false);
            }}
            className="px-6 py-3 bg-pink-600 hover:bg-pink-700 disabled:bg-pink-800 disabled:opacity-50 text-white font-semibold rounded-lg transition"
          >
            Next Challenge →
          </button>
        )}
      </div>

      {/* Submitted count */}
      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
        <p className="text-sm text-gray-400">
          Completed: <span className="font-bold text-cyan-400">{submittedChallenges.length}/{challenges.length}</span>
        </p>
      </div>
    </div>
  );
}
