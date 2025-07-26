import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { exerciseService } from "@/services/api/exerciseService";
import { workoutService } from "@/services/api/workoutService";

const ExerciseGame = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exercise, setExercise] = useState(null);
  const [gameState, setGameState] = useState("ready"); // ready, playing, completed
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Memory Game State
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  
  const loadExercise = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await exerciseService.getById(parseInt(id));
      setExercise(data);
      initializeGame(data);
    } catch (err) {
      setError("Failed to load exercise");
    } finally {
      setLoading(false);
    }
  };
  
  const initializeGame = (exerciseData) => {
    if (exerciseData.category === "Memory") {
      // Initialize memory matching game
      const symbols = ["🧠", "🎯", "⚡", "🔥", "💎", "🌟", "🎨", "🚀"];
      const gameCards = [...symbols.slice(0, 8), ...symbols.slice(0, 8)]
        .sort(() => Math.random() - 0.5)
        .map((symbol, index) => ({
          id: index,
          symbol,
          isFlipped: false,
          isMatched: false
        }));
      setCards(gameCards);
    }
  };
  
  useEffect(() => {
    loadExercise();
  }, [id]);
  
  useEffect(() => {
    let timer;
    if (gameState === "playing" && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && gameState === "playing") {
      completeExercise();
    }
    return () => clearTimeout(timer);
  }, [gameState, timeLeft]);
  
  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setTimeLeft(exercise?.averageTime * 60 || 60);
    toast.success("Game started! Good luck!");
  };
  
  const completeExercise = async () => {
    setGameState("completed");
    
    // Calculate final score based on performance
    const finalScore = Math.max(0, score + (timeLeft * 10));
    setScore(finalScore);
    
    try {
      await workoutService.recordExerciseCompletion(parseInt(id), finalScore);
      toast.success(`Exercise completed! Score: ${finalScore}`);
    } catch (err) {
      toast.error("Failed to save progress");
    }
  };
  
  const handleCardClick = (cardId) => {
    if (gameState !== "playing" || flippedCards.length >= 2) return;
    
    const card = cards.find(c => c.id === cardId);
    if (card.isFlipped || card.isMatched) return;
    
    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);
    
    setCards(cards.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));
    
    if (newFlippedCards.length === 2) {
      const [first, second] = newFlippedCards;
      const firstCard = cards.find(c => c.id === first);
      const secondCard = cards.find(c => c.id === second);
      
      setTimeout(() => {
        if (firstCard.symbol === secondCard.symbol) {
          // Match found
          setMatchedCards([...matchedCards, first, second]);
          setCards(cards.map(c => 
            (c.id === first || c.id === second) ? { ...c, isMatched: true } : c
          ));
          setScore(score + 100);
          
          // Check if game is complete
          if (matchedCards.length + 2 === cards.length) {
            setTimeout(completeExercise, 500);
          }
        } else {
          // No match - flip back
          setCards(cards.map(c => 
            (c.id === first || c.id === second) ? { ...c, isFlipped: false } : c
          ));
        }
        setFlippedCards([]);
      }, 1000);
    }
  };
  
  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadExercise} />;
  if (!exercise) return <Error message="Exercise not found" />;
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
        >
          <ApperIcon name="ArrowLeft" size={20} className="mr-2" />
          Back
        </Button>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 font-display">
            {exercise.name}
          </h1>
          <p className="text-gray-600 font-body">{exercise.category} Training</p>
        </div>
        <div />
      </div>
      
      {/* Game Stats */}
      {gameState !== "ready" && (
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 text-center">
            <p className="text-sm text-gray-600 font-body">Score</p>
            <p className="text-2xl font-bold text-primary font-display">{score}</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-sm text-gray-600 font-body">Time Left</p>
            <p className="text-2xl font-bold text-accent font-display">
              {formatTime(timeLeft)}
            </p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-sm text-gray-600 font-body">Matches</p>
            <p className="text-2xl font-bold text-success font-display">
              {matchedCards.length / 2}
            </p>
          </Card>
        </div>
      )}
      
      {/* Game Area */}
      <Card className="p-8">
        <AnimatePresence mode="wait">
          {gameState === "ready" && (
            <motion.div
              key="ready"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <ApperIcon name="Brain" size={48} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 font-display mb-4">
                Ready to Train?
              </h2>
              <p className="text-gray-600 font-body mb-8 max-w-md mx-auto">
                {exercise.description}
              </p>
              <Button variant="primary" size="lg" onClick={startGame}>
                <ApperIcon name="Play" size={24} className="mr-2" />
                Start Exercise
              </Button>
            </motion.div>
          )}
          
          {gameState === "playing" && exercise.category === "Memory" && (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 font-display mb-2">
                  Memory Match
                </h2>
                <p className="text-gray-600 font-body">
                  Find all matching pairs to complete the exercise
                </p>
              </div>
              
              <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
                {cards.map((card) => (
                  <motion.div
                    key={card.id}
                    className={`aspect-square bg-gradient-to-br ${
                      card.isFlipped || card.isMatched
                        ? "from-primary to-secondary"
                        : "from-gray-200 to-gray-300"
                    } rounded-xl flex items-center justify-center cursor-pointer shadow-lg`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCardClick(card.id)}
                  >
                    <span className="text-2xl">
                      {card.isFlipped || card.isMatched ? card.symbol : "?"}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
          
          {gameState === "completed" && (
            <motion.div
              key="completed"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-success to-success/80 rounded-full flex items-center justify-center mx-auto mb-6">
                <ApperIcon name="Trophy" size={48} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 font-display mb-4">
                Exercise Complete!
              </h2>
              <p className="text-xl text-gray-600 font-body mb-2">
                Final Score: <span className="font-bold text-primary">{score}</span>
              </p>
              <p className="text-gray-500 font-body mb-8">
                Great job! Your cognitive skills are improving.
              </p>
              <div className="flex items-center justify-center space-x-4">
                <Button
                  variant="primary"
                  onClick={() => navigate("/dashboard")}
                >
                  <ApperIcon name="Home" size={20} className="mr-2" />
                  Back to Dashboard
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/exercises")}
                >
                  <ApperIcon name="Grid3x3" size={20} className="mr-2" />
                  More Exercises
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
};

export default ExerciseGame;