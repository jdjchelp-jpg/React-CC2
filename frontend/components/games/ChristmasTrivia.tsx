import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, CheckCircle, XCircle, Trophy, RotateCcw } from 'lucide-react';

interface Question {
  question: string;
  options: string[];
  correct: number;
}

const questions: Question[] = [
  {
    question: "What color is Santa's suit?",
    options: ["Green", "Red", "Blue", "Purple"],
    correct: 1
  },
  {
    question: "How many reindeer pull Santa's sleigh (including Rudolph)?",
    options: ["6", "8", "9", "12"],
    correct: 2
  },
  {
    question: "What do people traditionally put on top of a Christmas tree?",
    options: ["A candy cane", "A star or angel", "A bell", "A snowflake"],
    correct: 1
  },
  {
    question: "In which country did the tradition of the Christmas tree originate?",
    options: ["England", "France", "Germany", "Italy"],
    correct: 2
  },
  {
    question: "What is Frosty the Snowman's nose made of?",
    options: ["A carrot", "A button", "A coal", "A stick"],
    correct: 1
  },
  {
    question: "Which reindeer has a red nose?",
    options: ["Dasher", "Dancer", "Rudolph", "Blitzen"],
    correct: 2
  },
  {
    question: "What do children leave out for Santa on Christmas Eve?",
    options: ["Pizza and soda", "Cookies and milk", "Cake and tea", "Fruit and water"],
    correct: 1
  },
  {
    question: "How does Santa enter houses?",
    options: ["Through the door", "Through the window", "Through the chimney", "Magic portal"],
    correct: 2
  },
  {
    question: "What color are candy canes traditionally?",
    options: ["Blue and white", "Green and white", "Red and white", "Yellow and white"],
    correct: 2
  },
  {
    question: "Where does Santa Claus live?",
    options: ["South Pole", "North Pole", "Antarctica", "Iceland"],
    correct: 1
  }
];

export default function ChristmasTrivia() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setAnswered(false);
    setGameOver(false);
  };

  const handleAnswer = (index: number) => {
    if (answered) return;

    setSelectedAnswer(index);
    setAnswered(true);

    if (index === shuffledQuestions[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion + 1 < shuffledQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    } else {
      setGameOver(true);
    }
  };

  if (shuffledQuestions.length === 0) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <Card className="p-6 bg-white/10 backdrop-blur-md border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Brain className="w-6 h-6" />
          Christmas Trivia
        </h2>
        <div className="text-white font-bold">
          Score: {score}/{shuffledQuestions.length}
        </div>
      </div>

      {!gameOver ? (
        <div className="space-y-4">
          <div className="text-white/80 text-sm">
            Question {currentQuestion + 1} of {shuffledQuestions.length}
          </div>

          <div className="bg-white/10 rounded-lg p-4 mb-6">
            <p className="text-lg text-white font-semibold">
              {shuffledQuestions[currentQuestion].question}
            </p>
          </div>

          <div className="grid gap-3">
            {shuffledQuestions[currentQuestion].options.map((option, index) => {
              const isCorrect = index === shuffledQuestions[currentQuestion].correct;
              const isSelected = index === selectedAnswer;
              
              let buttonClass = "w-full p-4 text-left rounded-lg transition-all ";
              
              if (!answered) {
                buttonClass += "bg-white/20 hover:bg-white/30 text-white";
              } else if (isCorrect) {
                buttonClass += "bg-green-500/40 border-2 border-green-400 text-white";
              } else if (isSelected && !isCorrect) {
                buttonClass += "bg-red-500/40 border-2 border-red-400 text-white";
              } else {
                buttonClass += "bg-white/10 text-white/60";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={answered}
                  className={buttonClass}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {answered && isCorrect && (
                      <CheckCircle className="w-5 h-5 text-green-300" />
                    )}
                    {answered && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-red-300" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {answered && (
            <Button
              onClick={handleNext}
              className="w-full bg-green-600 hover:bg-green-700 text-white mt-4"
            >
              {currentQuestion + 1 < shuffledQuestions.length ? 'Next Question' : 'Finish'}
            </Button>
          )}
        </div>
      ) : (
        <div className="text-center space-y-6">
          <Trophy className="w-16 h-16 mx-auto text-yellow-400" />
          <div className="text-3xl font-bold text-white">
            Quiz Complete!
          </div>
          <div className="text-xl text-white">
            You scored {score} out of {shuffledQuestions.length}
          </div>
          <div className="text-lg text-white/80">
            {score === shuffledQuestions.length && "Perfect score! You're a Christmas expert! 🎄"}
            {score >= shuffledQuestions.length * 0.7 && score < shuffledQuestions.length && "Great job! You know your Christmas trivia! 🎅"}
            {score >= shuffledQuestions.length * 0.5 && score < shuffledQuestions.length * 0.7 && "Good effort! Keep learning! ☃️"}
            {score < shuffledQuestions.length * 0.5 && "Nice try! Study up for next time! 🎁"}
          </div>
          <Button
            onClick={startNewGame}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Play Again
          </Button>
        </div>
      )}
    </Card>
  );
}
