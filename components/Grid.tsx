
import React from 'react';
import { GRID_SIZE } from '../constants';
import { Player, Ship } from '../types';

interface GridProps {
  player: Player;
  isEnemyView?: boolean;
  onCellClick?: (x: number, y: number) => void;
  hoverCell?: { x: number; y: number } | null;
  onCellHover?: (x: number, y: number) => void;
  placementShip?: Omit<Ship, 'coordinates' | 'placed' | 'isVertical' | 'hits'> | null;
  isVertical?: boolean;
  isVeiled?: boolean;
  highlight?: boolean;
}

const Grid: React.FC<GridProps> = ({ 
  player, 
  isEnemyView = false, 
  onCellClick, 
  hoverCell, 
  onCellHover,
  placementShip,
  isVertical,
  isVeiled = false,
  highlight = false
}) => {
  const checkCanPlace = (startX: number, startY: number, size: number, vertical: boolean) => {
    for (let i = 0; i < size; i++) {
      const cx = vertical ? startX : startX + i;
      const cy = vertical ? startY + i : startY;
      if (cx >= GRID_SIZE || cy >= GRID_SIZE || cx < 0 || cy < 0) return false;
      if (player.ships.some(s => s.coordinates.some(c => c.x === cx && c.y === cy))) return false;
    }
    return true;
  };

  const renderCell = (x: number, y: number) => {
    const cellValue = player.grid[y][x];
    const shipAt = player.ships.find(s => s.coordinates.some(c => c.x === x && c.y === y));
    
    let bgColor = 'bg-black/10';
    let content = null;

    if (isEnemyView) {
      // BATTLE MODE: Hide ships, only show results
      if (cellValue === 'hit') {
        bgColor = 'bg-red-500 shadow-[inset_0_0_20px_rgba(0,0,0,0.3)]';
        content = <div className="text-2xl animate-pulse">💥</div>;
      } else if (cellValue === 'miss') {
        bgColor = 'bg-blue-400/20';
        content = <div className="text-xl opacity-60">💧</div>;
      }
    } else {
      // SETUP MODE: Show ships for placement
      if (shipAt) {
        bgColor = 'bg-slate-500 border-slate-400';
        content = <div className="text-2xl opacity-50">🚢</div>;
        if (cellValue === 'hit') {
            bgColor = 'bg-red-600 border-red-400';
            content = <div className="text-2xl">💥</div>;
        }
      } else if (cellValue === 'miss') {
        bgColor = 'bg-blue-300/30';
      }
    }

    // Hover effect for placement (only in setup)
    const isHovering = hoverCell && placementShip && !isEnemyView;
    let hoverStyle = '';
    if (isHovering) {
      const canPlaceHere = checkCanPlace(hoverCell.x, hoverCell.y, placementShip.size, !!isVertical);
      const isInShipRange = isVertical 
        ? (x === hoverCell.x && y >= hoverCell.y && y < hoverCell.y + placementShip.size)
        : (y === hoverCell.y && x >= hoverCell.x && x < hoverCell.x + placementShip.size);
      
      if (isInShipRange) {
        hoverStyle = canPlaceHere 
          ? 'ring-4 ring-emerald-400 ring-inset bg-emerald-500/80 z-20 animate-pulse' 
          : 'ring-4 ring-red-500 ring-inset bg-red-600/80 z-20';
        content = canPlaceHere ? <div className="text-3xl drop-shadow-md">🚢</div> : <div className="text-3xl">🚫</div>;
      }
    }

    return (
      <div
        key={`${x}-${y}`}
        className={`relative w-full aspect-square border border-white/20 flex items-center justify-center cursor-pointer transition-all duration-200 ${bgColor} ${hoverStyle} ${!isVeiled ? 'hover:brightness-125' : ''} min-w-[55px] sm:min-w-[70px] group`}
        onClick={() => !isVeiled && onCellClick?.(x, y)}
        onMouseEnter={() => !isVeiled && onCellHover?.(x, y)}
      >
        {content}
        {!isEnemyView && shipAt && !isVeiled && !isHovering && (
          <div className="absolute inset-0 bg-red-500/0 hover:bg-red-500/40 transition-colors flex items-center justify-center text-white opacity-0 hover:opacity-100 font-bold text-[10px] uppercase text-center p-1 leading-none z-30">
            Remove
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`relative transition-all duration-500 rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-8 ${highlight ? 'border-yellow-400 scale-105 ring-8 ring-yellow-400/20' : 'border-white/10'}`}>
      <div 
        className="grid gap-0 bg-black/40"
        style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: GRID_SIZE }).map((_, y) => 
          Array.from({ length: GRID_SIZE }).map((_, x) => renderCell(x, y))
        )}
      </div>

      {isVeiled && (
        <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-2xl flex flex-col items-center justify-center text-center p-4 z-10 transition-opacity duration-500">
           <div className="text-6xl mb-4 grayscale opacity-40">⚓</div>
           <p className="text-sm font-bungee text-white/50 tracking-[0.3em] uppercase">Sector Hidden</p>
           <p className="text-[10px] text-white/30 px-6 mt-2 font-bold uppercase">Locked by Fog of War</p>
        </div>
      )}
    </div>
  );
};

export default Grid;
