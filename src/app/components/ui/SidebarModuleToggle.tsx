"use client";

interface SidebarModuleToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function SidebarModuleToggle({ isOpen, onToggle }: SidebarModuleToggleProps) {
  return (
    <button 
      onClick={onToggle}
      className="fixed bottom-2 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-full bg-gray-900 text-white text-sm font-medium shadow-lg shadow-black/20 border border-gray-700/50 hover:bg-gray-800 hover:scale-105 hover:shadow-xl active:scale-95 transition-all duration-300 backdrop-blur-sm"
    >
      {isOpen ? (
        <>
          {/* Ícono de "Contraer" (Flecha a la derecha o panel ocultándose) */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <path d="M15 3v18" />
            <path d="m10 15 3-3-3-3" />
          </svg>
        </>
      ) : (
        <>
          {/* Ícono de "Expandir" (Panel mostrándose) */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <path d="M9 3v18" />
            <path d="m14 9-3 3 3 3" />
          </svg>
        </>
      )}
    </button>
  );
}