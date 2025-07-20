import React, { useState, useEffect, useRef } from 'react';

interface Cell {
  row: number;
  col: number;
  bomb: boolean;
  revealed: boolean;
  flagged: boolean;
  adjBombs: number;
}

interface MinesweeperProps {
  onClose: () => void;
}

const colors = [
  '',
  '#0000FA',
  '#4B802D', 
  '#DB1300',
  '#202081',
  '#690400',
  '#457A7A',
  '#1B1B1B',
  '#7A7A7A',
];

const Minesweeper: React.FC<MinesweeperProps> = ({ onClose }) => {
  const [size] = useState(9); // Fixed to easy mode only
  const [board, setBoard] = useState<Cell[][]>([]);
  const [bombCount, setBombCount] = useState(10);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [hitBomb, setHitBomb] = useState(false);
  const [winner, setWinner] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const createCell = (row: number, col: number): Cell => ({
    row,
    col,
    bomb: false,
    revealed: false,
    flagged: false,
    adjBombs: 0,
  });

  const buildBoard = (boardSize: number): Cell[][] => {
    const newBoard: Cell[][] = [];
    for (let row = 0; row < boardSize; row++) {
      const rowArray: Cell[] = [];
      for (let col = 0; col < boardSize; col++) {
        rowArray.push(createCell(row, col));
      }
      newBoard.push(rowArray);
    }
    return newBoard;
  };

  const getAdjCells = (cell: Cell, gameBoard: Cell[][]): Cell[] => {
    const adj: Cell[] = [];
    const lastRow = gameBoard.length - 1;
    const lastCol = gameBoard[0].length - 1;
    
    if (cell.row > 0 && cell.col > 0) adj.push(gameBoard[cell.row - 1][cell.col - 1]);
    if (cell.row > 0) adj.push(gameBoard[cell.row - 1][cell.col]);
    if (cell.row > 0 && cell.col < lastCol) adj.push(gameBoard[cell.row - 1][cell.col + 1]);
    if (cell.col < lastCol) adj.push(gameBoard[cell.row][cell.col + 1]);
    if (cell.row < lastRow && cell.col < lastCol) adj.push(gameBoard[cell.row + 1][cell.col + 1]);
    if (cell.row < lastRow) adj.push(gameBoard[cell.row + 1][cell.col]);
    if (cell.row < lastRow && cell.col > 0) adj.push(gameBoard[cell.row + 1][cell.col - 1]);
    if (cell.col > 0) adj.push(gameBoard[cell.row][cell.col - 1]);
    
    return adj;
  };

  const calcAdjBombs = (gameBoard: Cell[][]): Cell[][] => {
    const newBoard = gameBoard.map(row => [...row]);
    
    newBoard.forEach(row => {
      row.forEach(cell => {
        const adjCells = getAdjCells(cell, newBoard);
        cell.adjBombs = adjCells.reduce((acc, adjCell) => acc + (adjCell.bomb ? 1 : 0), 0);
      });
    });
    
    return newBoard;
  };

  const addBombs = (gameBoard: Cell[][], totalBombs: number): Cell[][] => {
    const newBoard = gameBoard.map(row => [...row]);
    let currentTotalBombs = totalBombs;
    
    while (currentTotalBombs > 0) {
      const row = Math.floor(Math.random() * size);
      const col = Math.floor(Math.random() * size);
      const currentCell = newBoard[row][col];
      
      if (!currentCell.bomb) {
        currentCell.bomb = true;
        currentTotalBombs--;
      }
    }
    
    return newBoard;
  };

  const revealCell = (gameBoard: Cell[][], row: number, col: number): { newBoard: Cell[][], hitBomb: boolean } => {
    const newBoard = gameBoard.map(r => [...r]);
    const cell = newBoard[row][col];
    
    if (cell.revealed || cell.flagged) {
      return { newBoard, hitBomb: false };
    }
    
    cell.revealed = true;
    
    if (cell.bomb) {
      return { newBoard, hitBomb: true };
    }
    
    if (cell.adjBombs === 0) {
      const adjCells = getAdjCells(cell, newBoard);
      adjCells.forEach(adjCell => {
        if (!adjCell.revealed && !adjCell.flagged) {
          const result = revealCell(newBoard, adjCell.row, adjCell.col);
          result.newBoard.forEach((r, rIdx) => {
            r.forEach((c, cIdx) => {
              newBoard[rIdx][cIdx] = c;
            });
          });
        }
      });
    }
    
    return { newBoard, hitBomb: false };
  };

  const flagCell = (gameBoard: Cell[][], row: number, col: number): Cell[][] => {
    const newBoard = gameBoard.map(r => [...r]);
    const cell = newBoard[row][col];
    
    if (!cell.revealed) {
      cell.flagged = !cell.flagged;
    }
    
    return newBoard;
  };

  const checkWinner = (gameBoard: Cell[][]): boolean => {
    for (let row = 0; row < gameBoard.length; row++) {
      for (let col = 0; col < gameBoard[0].length; col++) {
        const cell = gameBoard[row][col];
        if (!cell.revealed && !cell.bomb) return false;
      }
    }
    return true;
  };

  const revealAll = (gameBoard: Cell[][]): Cell[][] => {
    return gameBoard.map(row => 
      row.map(cell => ({ ...cell, revealed: true }))
    );
  };

  const startTimer = () => {
    if (timerRef.current) return;
    
    timerRef.current = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const initGame = () => {
    let newBoard = buildBoard(size);
    newBoard = addBombs(newBoard, 10);
    newBoard = calcAdjBombs(newBoard);
    
    setBoard(newBoard);
    setBombCount(10);
    setElapsedTime(0);
    setHitBomb(false);
    setWinner(false);
    setGameStarted(false);
    stopTimer();
  };

  const handleCellClick = (row: number, col: number, isRightClick: boolean = false) => {
    if (winner || hitBomb) return;
    
    if (!gameStarted) {
      setGameStarted(true);
      startTimer();
    }
    
    const cell = board[row][col];
    
    if (isRightClick && !cell.revealed) {
      const newBoard = flagCell(board, row, col);
      setBoard(newBoard);
      setBombCount(prev => prev + (cell.flagged ? 1 : -1));
    } else if (!isRightClick && !cell.flagged) {
      const { newBoard, hitBomb: bombHit } = revealCell(board, row, col);
      setBoard(newBoard);
      
      if (bombHit) {
        setHitBomb(true);
        setBoard(revealAll(newBoard));
        stopTimer();
      } else {
        const isWinner = checkWinner(newBoard);
        if (isWinner) {
          setWinner(true);
          stopTimer();
        }
      }
    }
  };

  const handleReset = () => {
    initGame();
  };

  useEffect(() => {
    initGame();
  }, []);

  useEffect(() => {
    return () => {
      stopTimer();
    };
  }, []);

  const getFaceImage = () => {
    if (hitBomb) return '🤯';
    if (winner) return '😎';
    return '🙂';
  };

  const renderCell = (cell: Cell) => {
    const key = `${cell.row}-${cell.col}`;
    
    let content = '';
    let style: React.CSSProperties = { 
      height: '20px',
      width: '20px',
      backgroundColor: '#C0C0C0',
      textAlign: 'center',
      verticalAlign: 'middle',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    };
    
    if (cell.revealed) {
      style.border = 'none';
      style.backgroundColor = '#C0C0C0';
      style.fontFamily = '"Press Start 2P", monospace';
      style.fontSize = '10px';
      
      if (cell.bomb) {
        content = '💣';
        if (hitBomb) {
          style.backgroundColor = 'red';
        }
      } else if (cell.adjBombs > 0) {
        content = cell.adjBombs.toString();
        style.color = colors[cell.adjBombs];
      }
    } else {
      style.borderTop = '1.5px solid #ffffff';
      style.borderRight = '1.5px solid #7B7B7B';
      style.borderBottom = '1.5px solid #7B7B7B';
      style.borderLeft = '1.5px solid #ffffff';
      
      if (cell.flagged) {
        content = '🚩';
      }
    }
    
    return (
      <div
        key={key}
        style={style}
        onClick={() => handleCellClick(cell.row, cell.col)}
        onContextMenu={(e) => {
          e.preventDefault();
          handleCellClick(cell.row, cell.col, true);
        }}
      >
        {content}
      </div>
    );
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-[60]"
      style={{ backgroundColor: '#0D8584' }}
      onClick={onClose}
    >
      <div 
        className="shadow-lg"
        style={{ 
          fontFamily: 'MS Sans Serif, monospace',
          backgroundColor: '#C0C0C0',
          border: '2px outset #C0C0C0',
          width: '280px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title Bar */}
        <div 
          className="text-white px-3 py-2 flex justify-between items-center"
          style={{ 
            background: 'linear-gradient(to right, rgba(33,41,89,1) 0%, rgba(33,41,89,1) 11%, rgba(80,114,161,1) 56%, rgba(117,172,219,0.7) 92%, rgba(125,185,232,0) 100%)',
            fontFamily: 'MS Sans Serif, monospace',
            fontSize: '16px',
            letterSpacing: '0.5px'
          }}
        >
          <div className="flex items-center space-x-2" style={{ color: '#D5DEF3' }}>
            <span>💣</span>
            <span>Minesweeper</span>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center cursor-pointer"
            style={{
              width: '20px',
              height: '20px',
              backgroundColor: '#BFBFBF',
              border: '2px outset #BFBFBF',
              color: 'black',
              fontSize: '12px'
            }}
          >
            ×
          </button>
        </div>

        {/* Menu Bar */}
        <div 
          className="px-2 py-1 text-xs border-b"
          style={{ 
            backgroundColor: '#D3CEC4',
            fontFamily: 'MS Sans Serif, monospace',
            fontSize: '14px'
          }}
        >
          <span className="cursor-pointer px-2 py-1">Game</span>
          <span className="cursor-pointer px-2 py-1">Help</span>
        </div>

        {/* Game Area */}
        <div className="p-3" style={{ backgroundColor: '#C0C0C0' }}>
          {/* Status Bar */}
          <div 
            className="flex justify-between items-center p-1 mb-2"
            style={{ 
              borderTop: '2px solid #7B7B7B',
              borderRight: '2px solid #ffffff', 
              borderBottom: '2px solid #ffffff',
              borderLeft: '2px solid #7B7B7B',
              margin: '6px 2px'
            }}
          >
            <div 
              className="text-center"
              style={{ 
                fontFamily: 'monospace',
                fontSize: '20px',
                letterSpacing: '1px',
                color: 'red',
                backgroundColor: 'black',
                padding: '2px 4px',
                lineHeight: '1em',
                minWidth: '32px'
              }}
            >
              {bombCount.toString().padStart(3, '0')}
            </div>
            
            <button
              onClick={handleReset}
              className="text-center cursor-pointer"
              style={{
                width: '35px',
                height: '35px',
                borderTop: '2px solid #ffffff',
                borderRight: '2px solid #7B7B7B',
                borderBottom: '2px solid #7B7B7B', 
                borderLeft: '2px solid #ffffff',
                backgroundColor: '#C0C0C0',
                fontSize: '16px'
              }}
            >
              {getFaceImage()}
            </button>
            
            <div 
              className="text-center"
              style={{ 
                fontFamily: 'monospace',
                fontSize: '20px',
                letterSpacing: '1px',
                color: 'red',
                backgroundColor: 'black',
                padding: '2px 4px',
                lineHeight: '1em',
                minWidth: '32px'
              }}
            >
              {elapsedTime.toString().padStart(3, '0')}
            </div>
          </div>

          {/* Game Board */}
          <div 
            className="p-1"
            style={{ 
              backgroundColor: 'lightgray',
              borderTop: '2px solid #7B7B7B',
              borderRight: '2px solid #ffffff',
              borderBottom: '2px solid #ffffff', 
              borderLeft: '2px solid #7B7B7B'
            }}
          >
            <div 
              className="grid gap-0"
              style={{ 
                gridTemplateColumns: `repeat(${size}, 20px)`,
              }}
            >
              {board.flat().map(cell => renderCell(cell))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Minesweeper;