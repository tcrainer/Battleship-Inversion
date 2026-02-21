
import React from 'react';
import { Question } from '../types';

interface FlashcardProps {
  question: Question;
  isFlipped: boolean;
  onFlip: () => void;
  accentClass: string;
}

const Flashcard: React.FC<FlashcardProps> = ({ question, isFlipped, onFlip, accentClass }) => {
  return (
    <div className="w-full max-w-4xl h-52 perspective-1000 group">
      <div className={`relative w-full h-full text-center transition-all duration-700 preserve-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`} onClick={onFlip}>
        {/* Front (English) */}
        <div className={`absolute w-full h-full backface-hidden flex flex-col md:flex-row items-center justify-between px-12 py-6 rounded-[3rem] border-4 border-white/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-slate-800`}>
          <div className="flex-1 text-left">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40 mb-2 block">Translate to German</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight drop-shadow-sm">{question.english}</h2>
          </div>
          <div className={`mt-4 md:mt-0 md:ml-8 px-10 py-4 rounded-2xl text-xs font-bungee text-white shadow-xl animate-pulse whitespace-nowrap ${accentClass}`}>
            REVEAL GERMAN
          </div>
        </div>

        {/* Back (German) */}
        <div className={`absolute w-full h-full backface-hidden rotate-y-180 flex flex-col md:flex-row items-center justify-between px-12 py-6 rounded-[3rem] border-4 border-white/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-slate-700`}>
          <div className="flex-1 text-left">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 mb-2 block">German Translation</span>
            <h2 className="text-3xl md:text-4xl font-bold text-yellow-400 leading-tight drop-shadow-sm">{question.german}</h2>
          </div>
          <div className="hidden md:flex flex-col items-end opacity-40">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white">Was it correct?</p>
            <div className="text-3xl mt-2">🇩🇪</div>
          </div>
        </div>
      </div>

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};

export default Flashcard;
