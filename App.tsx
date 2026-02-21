
import React, { useState, useEffect } from 'react';
import { GameState, Player, Question, Cell, Ship } from './types';
import { GRID_SIZE, DEFAULT_SHIPS, INITIAL_QUESTIONS } from './constants';
import Grid from './components/Grid';
import Flashcard from './components/Flashcard';

const PLAYER_THEMES = [
  { 
    id: 0, 
    bg: 'bg-blue-900', 
    accent: 'text-cyan-400', 
    border: 'border-cyan-400', 
    button: 'bg-cyan-500 hover:bg-cyan-400',
    gridBg: 'bg-blue-950/60'
  },
  { 
    id: 1, 
    bg: 'bg-rose-900', 
    accent: 'text-rose-400', 
    border: 'border-rose-400', 
    button: 'bg-rose-500 hover:bg-rose-400',
    gridBg: 'bg-rose-950/60'
  },
  { 
    id: 2, 
    bg: 'bg-emerald-800', 
    accent: 'text-green-400', 
    border: 'border-green-400', 
    button: 'bg-green-500 hover:bg-green-400',
    gridBg: 'bg-emerald-950/60'
  },
];

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('LOBBY');
  const [playerCount, setPlayerCount] = useState<2 | 3>(2);
  const [players, setPlayers] = useState<Player[]>([]);
  const [activePlayerIndex, setActivePlayerIndex] = useState(0);
  const [targetPlayerIndex, setTargetPlayerIndex] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionPool, setQuestionPool] = useState<Question[]>([]);
  const [lastShotResult, setLastShotResult] = useState<{ hit: boolean, sunkenShip?: string } | null>(null);
  const [nextTask, setNextTask] = useState<string>('');
  const [hoverCell, setHoverCell] = useState<Cell | null>(null);
  const [isVertical, setIsVertical] = useState(false);
  const [playerNames, setPlayerNames] = useState<string[]>(['Player 1', 'Player 2', 'Player 3']);
  const [isFlipped, setIsFlipped] = useState(false);

  const initGame = (count: number) => {
    const newPlayers: Player[] = Array.from({ length: count }).map((_, i) => ({
      id: `p${i}`,
      name: playerNames[i],
      ships: [],
      grid: Array.from({ length: GRID_SIZE }).map(() => Array(GRID_SIZE).fill(null)),
      isEliminated: false,
    }));
    setPlayers(newPlayers);
    setGameState('SETUP');
    setActivePlayerIndex(0);
  };

  const handlePlacement = (x: number, y: number) => {
    const updatedPlayers = [...players];
    const player = updatedPlayers[activePlayerIndex];
    
    const existingShipIndex = player.ships.findIndex(s => s.coordinates.some(c => c.x === x && c.y === y));
    if (existingShipIndex !== -1) {
        player.ships.splice(existingShipIndex, 1);
        setPlayers(updatedPlayers);
        return;
    }

    const currentShipIndex = player.ships.length;
    if (currentShipIndex >= DEFAULT_SHIPS.length) return;

    const shipTemplate = DEFAULT_SHIPS[currentShipIndex];
    const coordinates: Cell[] = [];
    
    for (let i = 0; i < shipTemplate.size; i++) {
      const cx = isVertical ? x : x + i;
      const cy = isVertical ? y + i : y;
      if (cx >= GRID_SIZE || cy >= GRID_SIZE || cx < 0 || cy < 0) return;
      if (player.ships.some(s => s.coordinates.some(c => c.x === cx && c.y === cy))) return;
      coordinates.push({ x: cx, y: cy });
    }

    const newShip: Ship = { ...shipTemplate, placed: true, coordinates, isVertical, hits: 0 };
    player.ships.push(newShip);
    setPlayers(updatedPlayers);
  };

  const handleConfirmFleet = () => {
    if (activePlayerIndex < playerCount - 1) {
      setNextTask(`Pass device to ${players[activePlayerIndex + 1].name}`);
      setGameState('PASS_DEVICE');
    } else {
      setNextTask(`Battle Start! ${players[0].name}, it's your turn.`);
      setGameState('PASS_DEVICE');
      setQuestionPool([...INITIAL_QUESTIONS].sort(() => Math.random() - 0.5));
    }
  };

  const handleUndoPlacement = () => {
    const updatedPlayers = [...players];
    const player = updatedPlayers[activePlayerIndex];
    if (player.ships.length > 0) {
      player.ships.pop();
      setPlayers(updatedPlayers);
    }
  };

  const handleResetPlacement = () => {
    const updatedPlayers = [...players];
    const player = updatedPlayers[activePlayerIndex];
    player.ships = [];
    setPlayers(updatedPlayers);
  };

  const handlePassComplete = () => {
    if (gameState === 'PASS_DEVICE') {
      const nextIndex = (activePlayerIndex + 1) % playerCount;
      if (players.some(p => p.ships.length < DEFAULT_SHIPS.length)) {
        setActivePlayerIndex(nextIndex);
        setGameState('SETUP');
      } else {
        startTurn(nextIndex);
      }
    }
  };

  const startTurn = (playerIdx: number) => {
    let currentIndex = playerIdx % playerCount;
    
    const activePlayers = players.filter(p => !p.isEliminated);
    if (activePlayers.length <= 1) {
      setGameState('GAMEOVER');
      return;
    }

    while (players[currentIndex].isEliminated) {
      currentIndex = (currentIndex + 1) % playerCount;
    }

    setActivePlayerIndex(currentIndex);
    
    let pool = [...questionPool];
    if (pool.length === 0) {
      pool = [...INITIAL_QUESTIONS].sort(() => Math.random() - 0.5);
    }
    const q = pool.pop()!;
    setQuestionPool(pool);
    
    setCurrentQuestion(q);
    setIsFlipped(false);
    setGameState('QUESTION');
    setTargetPlayerIndex(null);
  };

  const handleCorrect = () => {
    let targetIdx = (activePlayerIndex + 1) % playerCount;
    while (players[targetIdx].isEliminated) {
      targetIdx = (targetIdx + 1) % playerCount;
    }
    setTargetPlayerIndex(targetIdx);
    setGameState('ACTION');
  };

  const handleShoot = (x: number, y: number) => {
    if (targetPlayerIndex === null) return;
    const target = players[targetPlayerIndex];
    if (target.grid[y][x] !== null) return;

    const hitShip = target.ships.find(s => s.coordinates.some(c => c.x === x && c.y === y));
    const updatedPlayers = [...players];
    
    if (hitShip) {
      updatedPlayers[targetPlayerIndex].grid[y][x] = 'hit';
      hitShip.hits += 1;
      const isSunk = hitShip.hits === hitShip.size;
      setLastShotResult({ hit: true, sunkenShip: isSunk ? hitShip.name : undefined });
      if (updatedPlayers[targetPlayerIndex].ships.every(s => s.hits === s.size)) {
        updatedPlayers[targetPlayerIndex].isEliminated = true;
      }
    } else {
      updatedPlayers[targetPlayerIndex].grid[y][x] = 'miss';
      setLastShotResult({ hit: false });
    }

    setPlayers(updatedPlayers);
    setGameState('RESULT');
    
    if (updatedPlayers.filter(p => !p.isEliminated).length === 1) {
      setGameState('GAMEOVER');
    }
  };

  const currentTheme = gameState === 'LOBBY' ? { bg: 'bg-slate-900', accent: 'text-blue-400', button: 'bg-blue-600 hover:bg-blue-500' } : PLAYER_THEMES[activePlayerIndex];

  return (
    <div className={`min-h-screen p-4 flex flex-col items-center justify-center transition-colors duration-700 ${currentTheme.bg}`}>
      {gameState === 'LOBBY' && (
        <div className="bg-slate-800 p-12 rounded-[4rem] border-8 border-slate-700 shadow-[0_0_100px_rgba(30,58,138,0.5)] max-w-xl w-full text-center space-y-8 animate-in zoom-in duration-500">
          <h1 className="text-7xl font-bungee text-white tracking-widest drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]">EDU-WARS</h1>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
               {[2, 3].map(n => (
                 <button key={n} onClick={() => setPlayerCount(n as 2 | 3)} className={`py-5 rounded-2xl font-bungee text-lg border-4 transition-all ${playerCount === n ? 'bg-blue-500 border-white text-white' : 'bg-slate-700 border-slate-600 text-slate-400'}`}>
                   {n} PLAYERS
                 </button>
               ))}
            </div>
            {Array.from({ length: playerCount }).map((_, i) => (
              <input key={i} type="text" value={playerNames[i]} onChange={e => {
                const names = [...playerNames];
                names[i] = e.target.value;
                setPlayerNames(names);
              }} className="w-full bg-slate-900 border-4 border-slate-700 rounded-[1.5rem] px-6 py-4 text-center font-bold text-xl focus:border-blue-500 outline-none transition-all shadow-inner" placeholder={`Admiral ${i+1}`} />
            ))}
            <button onClick={() => initGame(playerCount)} className="w-full bg-emerald-500 hover:bg-emerald-400 py-8 rounded-[2rem] font-bungee text-3xl text-white shadow-[0_15px_45_rgba(16,185,129,0.4)] transform transition hover:-translate-y-2 active:scale-95">ENGAGE</button>
          </div>
        </div>
      )}

      {gameState === 'SETUP' && (
        <div className="flex flex-col items-center gap-8 animate-in fade-in duration-500 w-full max-w-7xl">
          <div className="text-center">
            <h2 className={`text-6xl font-bungee text-white mb-2 drop-shadow-xl ${currentTheme.accent}`}>{players[activePlayerIndex].name}: FLEET SETUP</h2>
            <p className="text-white/60 uppercase tracking-[0.3em] text-sm font-bold">Secretly position your ships on the 6x6 grid.</p>
          </div>
          <div className="flex flex-col xl:flex-row items-center justify-center gap-16 w-full">
             <div className="bg-black/40 p-12 rounded-[4rem] border-8 border-white/20 shadow-2xl">
                <Grid 
                  player={players[activePlayerIndex]} 
                  onCellClick={handlePlacement}
                  hoverCell={hoverCell}
                  onCellHover={(x, y) => setHoverCell({ x, y })}
                  placementShip={players[activePlayerIndex].ships.length < DEFAULT_SHIPS.length ? DEFAULT_SHIPS[players[activePlayerIndex].ships.length] : null}
                  isVertical={isVertical}
                />
             </div>
             <div className="flex flex-col gap-8 w-full max-w-sm">
                <div className="bg-white/10 backdrop-blur-xl p-10 rounded-[3rem] border-4 border-white/20 shadow-2xl text-center">
                  <h3 className="text-[10px] font-bold text-white/40 uppercase mb-4 tracking-[0.5em]">Current Vessel</h3>
                  {players[activePlayerIndex].ships.length < DEFAULT_SHIPS.length ? (
                    <div className="space-y-4 animate-in slide-in-from-right duration-300">
                      <div className="text-4xl font-bungee text-yellow-400">{DEFAULT_SHIPS[players[activePlayerIndex].ships.length].name}</div>
                      <div className="flex justify-center gap-2">
                        {Array.from({length: DEFAULT_SHIPS[players[activePlayerIndex].ships.length].size}).map((_, i) => (
                           <div key={i} className="w-10 h-10 bg-yellow-500/40 rounded-xl border-2 border-yellow-400/50" />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6 animate-in zoom-in duration-500">
                      <div className="text-5xl font-bungee text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">READY!</div>
                      <button onClick={handleConfirmFleet} className="w-full bg-cyan-500 hover:bg-cyan-400 py-6 rounded-3xl font-bungee text-xl text-white shadow-2xl transition-all transform hover:scale-105">LOCK IN FLEET</button>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <button onClick={() => setIsVertical(!isVertical)} className="bg-indigo-500 p-6 rounded-[2rem] font-bungee text-xl shadow-xl hover:bg-indigo-400 transition-all flex items-center justify-center gap-6 group">
                    <span className={`text-3xl transition-transform duration-500 ${isVertical ? 'rotate-90' : 'rotate-0'}`}>↔</span> ROTATE
                  </button>
                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={handleUndoPlacement} disabled={players[activePlayerIndex].ships.length === 0} className="bg-slate-700 p-5 rounded-3xl font-bold text-white hover:bg-slate-600 disabled:opacity-30">UNDO</button>
                    <button onClick={handleResetPlacement} disabled={players[activePlayerIndex].ships.length === 0} className="bg-red-600/40 p-5 rounded-3xl font-bold text-white border-2 border-red-500/30 hover:bg-red-500 disabled:opacity-30">RESET</button>
                  </div>
                </div>
             </div>
          </div>
        </div>
      )}

      {(gameState === 'QUESTION' || gameState === 'ACTION' || gameState === 'RESULT') && (
        <div className="w-full h-full flex flex-col items-center justify-start pt-4 gap-4 max-w-[98vw] overflow-y-auto">
          {/* Top Info Bar */}
          <div className="text-center animate-in fade-in duration-500">
            <h3 className={`text-3xl font-bungee drop-shadow-lg mb-1 ${currentTheme.accent}`}>{players[activePlayerIndex].name.toUpperCase()}'S TURN</h3>
            <p className="text-white/40 font-bold uppercase tracking-[0.5em] text-[10px]">{currentQuestion?.category}</p>
          </div>

          {/* Action Area (Moved to Top) */}
          <div className="w-full max-w-6xl min-h-[280px] flex items-center justify-center px-4">
            {gameState === 'QUESTION' && currentQuestion && (
              <div className="flex flex-col md:flex-row items-center justify-center gap-6 animate-in slide-in-from-top-12 duration-500 w-full">
                {isFlipped && (
                  <button onClick={handleCorrect} className="order-2 md:order-1 bg-emerald-500 hover:bg-emerald-400 px-10 py-8 rounded-[2rem] font-bungee text-xl text-white shadow-[0_20px_50px_rgba(16,185,129,0.3)] transform transition hover:scale-110 active:scale-95">CORRECT</button>
                )}
                
                <div className="order-1 md:order-2 flex-1 flex justify-center w-full">
                  <Flashcard question={currentQuestion} isFlipped={isFlipped} onFlip={() => setIsFlipped(true)} accentClass={currentTheme.button} />
                </div>

                {isFlipped && (
                  <button onClick={() => { setLastShotResult(null); setGameState('RESULT'); }} className="order-3 bg-rose-600 hover:bg-rose-500 px-10 py-8 rounded-[2rem] font-bungee text-xl text-white shadow-[0_20px_50px_rgba(225,29,72,0.3)] transform transition hover:scale-110 active:scale-95">WRONG</button>
                )}
              </div>
            )}

            {gameState === 'ACTION' && (
              <div className="text-center p-10 bg-black/60 rounded-[3rem] border-8 border-emerald-500/40 animate-pulse shadow-[0_0_80px_rgba(16,185,129,0.4)] w-full max-w-2xl">
                <div className="text-6xl mb-4">🚀</div>
                <h2 className="text-4xl font-bungee text-emerald-400 drop-shadow-md">STRIKE ORDERED!</h2>
                <p className="text-lg text-white font-bold uppercase tracking-[0.3em] mt-4">
                   ATTACK {players[targetPlayerIndex ?? 0].name.toUpperCase()} NOW!
                </p>
              </div>
            )}

            {gameState === 'RESULT' && (
              <div className="text-center space-y-4 animate-in zoom-in duration-300 bg-black/50 backdrop-blur-2xl p-10 rounded-[3rem] border-8 border-white/20 shadow-2xl w-full max-w-3xl">
                 <h2 className={`text-6xl font-bungee ${lastShotResult?.hit ? 'text-orange-500' : 'text-cyan-400'} drop-shadow-2xl`}>
                    {lastShotResult ? (lastShotResult.hit ? 'BOOM!' : 'SPLASH!') : 'FAILED'}
                 </h2>
                 {lastShotResult?.sunkenShip && <p className="text-2xl font-bungee text-red-500 animate-bounce">SUNK THE {lastShotResult.sunkenShip.toUpperCase()}!</p>}
                 
                 <div className="flex justify-center">
                   {lastShotResult?.hit ? (
                     <div className="space-y-4">
                       <p className="text-lg text-emerald-400 font-bungee animate-pulse uppercase tracking-[0.2em]">Extra Turn Authorized!</p>
                       <button onClick={() => startTurn(activePlayerIndex)} className="bg-emerald-500 px-14 py-5 rounded-[1.5rem] font-bungee text-2xl text-white shadow-[0_20px_60px_rgba(16,185,129,0.5)] transform transition hover:scale-110">RELOAD & FIRE</button>
                     </div>
                   ) : (
                     <button onClick={() => {
                       const next = (activePlayerIndex + 1) % playerCount;
                       startTurn(next);
                     }} className={`${currentTheme.button} px-14 py-5 rounded-[1.5rem] font-bungee text-2xl text-white shadow-2xl transition-all transform hover:scale-110`}>NEXT ADMIRAL</button>
                   )}
                 </div>
              </div>
            )}
          </div>

          {/* Grids Area (Bottom) */}
          <div className="flex flex-col lg:flex-row items-center justify-center w-full gap-8 px-6 pb-8 flex-wrap lg:flex-nowrap mt-2">
            {players.map((p, idx) => {
              const isTargetBoard = targetPlayerIndex === idx;
              const isActiveBoard = activePlayerIndex === idx;
              const shouldVeil = gameState === 'QUESTION' ? !isActiveBoard : !isTargetBoard;

              return (
                <div key={p.id} className={`flex flex-col items-center gap-4 transition-all duration-700 ${!shouldVeil ? 'scale-110' : 'opacity-30 grayscale blur-[2px]'}`}>
                  <div className={`px-8 py-2 rounded-full border-4 ${p.isEliminated ? 'border-red-600 bg-red-900/60' : `${PLAYER_THEMES[idx].border} ${PLAYER_THEMES[idx].bg}`} font-bungee text-lg text-white shadow-xl`}>
                    {p.name}
                  </div>
                  <Grid 
                    player={p} 
                    isEnemyView={true} 
                    isVeiled={shouldVeil}
                    onCellClick={idx !== activePlayerIndex && gameState === 'ACTION' && targetPlayerIndex === idx ? handleShoot : undefined}
                    highlight={isTargetBoard && gameState === 'ACTION'}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {gameState === 'PASS_DEVICE' && (
        <div className="text-center space-y-12 animate-in zoom-in duration-500">
           <div className="text-[14rem] animate-pulse drop-shadow-[0_0_80px_rgba(255,255,255,0.3)]">⚓</div>
           <h2 className="text-9xl font-bungee text-white tracking-tighter drop-shadow-2xl">PASS DEVICE</h2>
           <p className="text-5xl text-white/80 font-bold tracking-[0.3em] uppercase">{nextTask}</p>
           <button onClick={handlePassComplete} className="px-32 py-12 bg-white text-slate-900 rounded-[4rem] font-bungee text-6xl shadow-[0_0_100px_rgba(255,255,255,0.4)] active:scale-95 transition-all transform hover:scale-105">I HAVE CONTROL</button>
        </div>
      )}

      {gameState === 'GAMEOVER' && (
        <div className="text-center space-y-16 animate-in fade-in duration-1000">
          <div className="relative inline-block">
            <div className="absolute -inset-24 bg-cyan-500/40 blur-[120px] rounded-full animate-pulse" />
            <div className="text-[15rem] relative z-10 drop-shadow-[0_0_50px_rgba(255,255,255,0.5)]">🎖️</div>
          </div>
          <div className="space-y-4">
            <h2 className="text-9xl font-bungee text-white tracking-widest drop-shadow-2xl">VICTORY</h2>
            <p className="text-7xl text-cyan-400 font-bungee animate-bounce drop-shadow-[0_0_20px_rgba(34,211,238,0.6)]">{players.find(p => !p.isEliminated)?.name.toUpperCase()}</p>
          </div>
          <button onClick={() => window.location.reload()} className="px-24 py-10 bg-white text-slate-900 rounded-[3rem] font-bungee text-5xl shadow-[0_0_100px_rgba(255,255,255,0.4)] hover:scale-110 transition-transform">RESTART CAMPAIGN</button>
        </div>
      )}
    </div>
  );
};

export default App;
