import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy } from "lucide-react";

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const INITIAL_SPEED = 150;

// Trigger sequence: type "snake" anywhere
const TRIGGER = ["s", "n", "a", "k", "e"];

type Point = { x: number; y: number };

const SnakeEasterEgg = () => {
  const [open, setOpen] = useState(false);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try {
      return Number(localStorage.getItem("snake-highscore")) || 0;
    } catch {
      return 0;
    }
  });
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);
  const sequenceRef = useRef<string[]>([]);
  const directionRef = useRef(direction);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  // Detect trigger sequence
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (open) return;
      // Ignore typing inside form fields
      const target = e.target as HTMLElement;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable) return;
      const key = e.key.toLowerCase();
      sequenceRef.current = [...sequenceRef.current, key].slice(-TRIGGER.length);
      if (sequenceRef.current.join("") === TRIGGER.join("")) {
        setOpen(true);
        sequenceRef.current = [];
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  const placeFood = useCallback((avoidSnake: Point[]) => {
    let next: Point;
    do {
      next = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (avoidSnake.some((s) => s.x === next.x && s.y === next.y));
    setFood(next);
  }, []);

  const reset = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setPaused(false);
    placeFood(INITIAL_SNAKE);
  }, [placeFood]);

  // Game loop
  useEffect(() => {
    if (!open || gameOver || paused) return;
    const interval = setInterval(() => {
      setSnake((prev) => {
        const head = prev[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        // Wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prev;
        }
        // Self collision
        if (prev.some((s) => s.x === newHead.x && s.y === newHead.y)) {
          setGameOver(true);
          return prev;
        }

        const newSnake = [newHead, ...prev];
        // Eat food?
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 10);
          placeFood(newSnake);
          return newSnake;
        }
        newSnake.pop();
        return newSnake;
      });
    }, INITIAL_SPEED);
    return () => clearInterval(interval);
  }, [open, gameOver, paused, food, placeFood]);

  // Save high score
  useEffect(() => {
    if (gameOver && score > highScore) {
      setHighScore(score);
      try {
        localStorage.setItem("snake-highscore", String(score));
      } catch {}
    }
  }, [gameOver, score, highScore]);

  // Direction control
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      const cur = directionRef.current;
      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          if (cur.y === 0) setDirection({ x: 0, y: -1 });
          e.preventDefault();
          break;
        case "ArrowDown":
        case "s":
        case "S":
          if (cur.y === 0) setDirection({ x: 0, y: 1 });
          e.preventDefault();
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          if (cur.x === 0) setDirection({ x: -1, y: 0 });
          e.preventDefault();
          break;
        case "ArrowRight":
        case "d":
        case "D":
          if (cur.x === 0) setDirection({ x: 1, y: 0 });
          e.preventDefault();
          break;
        case " ":
          setPaused((p) => !p);
          e.preventDefault();
          break;
        case "Escape":
          setOpen(false);
          break;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  const close = () => {
    setOpen(false);
    setTimeout(reset, 300);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9998] flex items-center justify-center bg-background/80 backdrop-blur-md p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
        >
          <motion.div
            className="relative card-premium p-6 max-w-md w-full"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={close}
              className="absolute top-3 end-3 w-8 h-8 rounded-lg bg-secondary/50 hover:bg-secondary flex items-center justify-center transition-colors z-10"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center mb-4">
              <h2 className="font-display text-2xl font-bold text-gradient-warm mb-1">
                🐍 Snake
              </h2>
              <div className="flex items-center justify-center gap-4 text-sm">
                <span className="text-muted-foreground">
                  Score: <span className="text-primary font-bold">{score}</span>
                </span>
                <span className="text-muted-foreground flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5 text-primary" />
                  <span className="text-primary font-bold">{highScore}</span>
                </span>
              </div>
            </div>

            <div
              className="relative mx-auto rounded-lg overflow-hidden border border-primary/30"
              style={{
                width: GRID_SIZE * CELL_SIZE,
                height: GRID_SIZE * CELL_SIZE,
                background: "hsl(var(--background))",
                boxShadow: "0 0 40px hsl(var(--primary) / 0.2)",
              }}
            >
              {/* Grid pattern */}
              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage:
                    "linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)",
                  backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`,
                }}
              />
              {/* Snake */}
              {snake.map((seg, i) => (
                <div
                  key={i}
                  className="absolute rounded-sm"
                  style={{
                    left: seg.x * CELL_SIZE,
                    top: seg.y * CELL_SIZE,
                    width: CELL_SIZE - 2,
                    height: CELL_SIZE - 2,
                    background: i === 0 ? "hsl(var(--primary))" : `hsl(var(--primary) / ${1 - i * 0.04})`,
                    boxShadow: i === 0 ? "0 0 10px hsl(var(--primary) / 0.6)" : "none",
                  }}
                />
              ))}
              {/* Food */}
              <motion.div
                className="absolute rounded-full"
                style={{
                  left: food.x * CELL_SIZE,
                  top: food.y * CELL_SIZE,
                  width: CELL_SIZE - 2,
                  height: CELL_SIZE - 2,
                  background: "hsl(var(--destructive))",
                  boxShadow: "0 0 12px hsl(var(--destructive) / 0.8)",
                }}
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />

              {/* Game Over overlay */}
              {gameOver && (
                <motion.div
                  className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <p className="font-display text-2xl font-bold text-gradient-warm mb-2">Game Over</p>
                  <p className="text-sm text-muted-foreground mb-4">Score: {score}</p>
                  <button
                    onClick={reset}
                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity"
                  >
                    Play Again
                  </button>
                </motion.div>
              )}

              {paused && !gameOver && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm">
                  <p className="font-display text-xl font-bold">Paused</p>
                </div>
              )}
            </div>

            <p className="text-xs text-muted-foreground text-center mt-4 font-mono">
              Arrow keys / WASD · Space to pause · Esc to close
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SnakeEasterEgg;
