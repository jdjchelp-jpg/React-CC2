import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Gift, Sparkles, Users, Zap, Trophy } from "lucide-react";
import { useBackend } from "../../lib/backend";
import { useToast } from "@/components/ui/use-toast";

export default function ElfWorkshop() {
  const backend = useBackend();
  const { toast } = useToast();
  const [toyCount, setToyCount] = useState(0);
  const [clickPower, setClickPower] = useState(1);
  const [autoProduction, setAutoProduction] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [multiplierBoost, setMultiplierBoost] = useState(1);
  const [progress, setProgress] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [hasLoadedData, setHasLoadedData] = useState(false);

  useEffect(() => {
    if (autoProduction > 0) {
      const interval = setInterval(() => {
        setToyCount((prev) => prev + autoProduction * multiplier * multiplierBoost);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [autoProduction, multiplier, multiplierBoost]);

  useEffect(() => {
    const progressValue = ((toyCount % 1000) / 1000) * 100;
    setProgress(progressValue);
  }, [toyCount]);

  useEffect(() => {
    const saveData = () => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('elfWorkshop', JSON.stringify({
          toyCount,
          clickPower,
          autoProduction,
          multiplier,
          multiplierBoost,
        }));
      }
    };
    if (hasLoadedData) {
      saveData();
    }
  }, [toyCount, clickPower, autoProduction, multiplier, multiplierBoost, hasLoadedData]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('elfWorkshop');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          setToyCount(data.toyCount || 0);
          setClickPower(data.clickPower || 1);
          setAutoProduction(data.autoProduction || 0);
          setMultiplier(data.multiplier || 1);
          setMultiplierBoost(data.multiplierBoost || 1);
        } catch (err) {
          console.error('Failed to load saved data:', err);
        }
      }
      setHasLoadedData(true);
    }
  }, []);

  useEffect(() => {
    const saveScore = async () => {
      if (toyCount > highScore) {
        setHighScore(toyCount);
        toast({
          title: "New High Score!",
          description: `You've produced ${toyCount.toLocaleString()} toys!`,
        });
      }
    };

    if (hasLoadedData && toyCount > 0) {
      const timer = setTimeout(saveScore, 2000);
      return () => clearTimeout(timer);
    }
  }, [toyCount, highScore, hasLoadedData]);

  const handleClick = () => {
    setToyCount((prev) => prev + clickPower * multiplier * multiplierBoost);
  };

  const addToys = (amount: number) => {
    setToyCount((prev) => prev + amount);
  };

  const buyUpgrade = (cost: number, type: "power" | "auto" | "multiplier" | "megamultiplier") => {
    if (toyCount >= cost) {
      setToyCount((prev) => prev - cost);
      if (type === "power") {
        setClickPower((prev) => prev + 1);
      } else if (type === "auto") {
        setAutoProduction((prev) => prev + 1);
      } else if (type === "multiplier") {
        setMultiplier((prev) => prev + 0.5);
      } else {
        setMultiplierBoost((prev) => prev + 0.25);
      }
    }
  };

  const buyMaxUpgrade = (type: "power" | "auto" | "multiplier" | "megamultiplier") => {
    const getUpgradeName = () => {
      if (type === "power") return "Click Power";
      if (type === "auto") return "Auto Elves";
      if (type === "multiplier") return "Multiplier";
      return "Mega Boost";
    };

    const calculateMaxPurchases = () => {
      let count = 0;
      let remainingToys = toyCount;
      
      if (type === "power") {
        let currentLevel = clickPower;
        while (remainingToys >= currentLevel * 10) {
          remainingToys -= currentLevel * 10;
          currentLevel++;
          count++;
        }
      } else if (type === "auto") {
        let currentLevel = autoProduction;
        while (remainingToys >= (currentLevel + 1) * 50) {
          remainingToys -= (currentLevel + 1) * 50;
          currentLevel++;
          count++;
        }
      } else if (type === "multiplier") {
        let currentMultiplier = multiplier;
        while (remainingToys >= Math.floor(currentMultiplier * 100)) {
          remainingToys -= Math.floor(currentMultiplier * 100);
          currentMultiplier += 0.5;
          count++;
        }
      } else {
        let currentBoost = multiplierBoost;
        let currentMult = multiplier;
        while (remainingToys >= Math.floor(currentBoost * currentMult * 200)) {
          remainingToys -= Math.floor(currentBoost * currentMult * 200);
          currentBoost += 0.25;
          count++;
        }
      }
      
      return { count, toysSpent: toyCount - remainingToys };
    };

    const { count, toysSpent } = calculateMaxPurchases();
    
    if (count === 0) {
      toast({
        title: "Not enough toys!",
        description: `You don't have enough toys for any ${getUpgradeName()} upgrades.`,
        variant: "destructive",
      });
      return;
    }

    const confirmed = window.confirm(
      `Do you want to spend ${toysSpent.toLocaleString()} toys to buy ${count} ${getUpgradeName()} upgrade${count > 1 ? 's' : ''}?`
    );

    if (confirmed) {
      setToyCount((prev) => prev - toysSpent);
      if (type === "power") {
        setClickPower((prev) => prev + count);
      } else if (type === "auto") {
        setAutoProduction((prev) => prev + count);
      } else if (type === "multiplier") {
        setMultiplier((prev) => prev + (count * 0.5));
      } else {
        setMultiplierBoost((prev) => prev + (count * 0.25));
      }
      
      toast({
        title: "Upgrades purchased!",
        description: `Bought ${count} ${getUpgradeName()} upgrade${count > 1 ? 's' : ''} for ${toysSpent.toLocaleString()} toys!`,
      });
    }
  };

  const getLevel = () => Math.floor(toyCount / 1000) + 1;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
          🎄 Elf Workshop 🎄
        </h2>
        <p className="text-white/80">Click to make toys and upgrade your workshop!</p>

        <div className="bg-gradient-to-br from-red-500/20 to-green-500/20 rounded-lg p-6 backdrop-blur-sm border border-white/20">
          <div className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {toyCount.toLocaleString()}
          </div>
          <div className="text-white/80 mt-2 flex items-center justify-center gap-2">
            <Trophy className="w-4 h-4" />
            Toys Produced - Level {getLevel()}
          </div>
          <div className="mt-3">
            <Progress value={progress} className="h-3 bg-white/10" />
            <div className="text-xs text-white/60 mt-1">
              {toyCount % 1000}/1000 to next level
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-center flex-wrap">
          <Button
            onClick={handleClick}
            size="lg"
            className="bg-gradient-to-r from-red-500 to-green-500 hover:from-red-600 hover:to-green-600 text-white text-xl px-8 py-6 hover:scale-105 transition-all shadow-lg"
          >
            <Gift className="w-6 h-6 mr-2" />
            Make Toys!
          </Button>
          <Button
            onClick={() => addToys(200)}
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-xl px-8 py-6 hover:scale-105 transition-all shadow-lg"
          >
            <Sparkles className="w-6 h-6 mr-2" />
            +200 Toys!
          </Button>
          <Button
            onClick={() => addToys(10000)}
            size="lg"
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white text-xl px-8 py-6 hover:scale-105 transition-all shadow-lg"
          >
            <Zap className="w-6 h-6 mr-2" />
            +10K Toys!
          </Button>
          <Button
            onClick={() => addToys(1000000)}
            size="lg"
            className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-xl px-8 py-6 hover:scale-105 transition-all shadow-lg"
          >
            <Trophy className="w-6 h-6 mr-2" />
            +1M Toys!
          </Button>
          <Button
            onClick={() => addToys(1000000000)}
            size="lg"
            className="bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white text-xl px-8 py-6 hover:scale-105 transition-all shadow-lg"
          >
            <Sparkles className="w-6 h-6 mr-2" />
            +1B Toys!
          </Button>
        </div>
      </div>

      <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm border border-white/10">
        <h3 className="text-white font-bold mb-3 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          Production Stats
        </h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-white/10 rounded p-3">
            <div className="text-white/60">Click Power</div>
            <div className="text-white font-bold text-lg">{clickPower * multiplier * multiplierBoost}</div>
          </div>
          <div className="bg-white/10 rounded p-3">
            <div className="text-white/60">Per Second</div>
            <div className="text-white font-bold text-lg">{autoProduction * multiplier * multiplierBoost}</div>
          </div>
          <div className="bg-white/10 rounded p-3">
            <div className="text-white/60">Auto Elves</div>
            <div className="text-white font-bold text-lg">{autoProduction}</div>
          </div>
          <div className="bg-white/10 rounded p-3">
            <div className="text-white/60">Total Multiplier</div>
            <div className="text-white font-bold text-lg">{(multiplier * multiplierBoost).toFixed(2)}x</div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-700/20 rounded-lg p-4 space-y-3 border border-blue-400/20 backdrop-blur-sm">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <span className="font-semibold">Click Power</span>
            </div>
            <div className="text-right">
              <div className="text-sm text-white/60">Level {clickPower}</div>
              <div className="text-xs text-white/60">{clickPower * 10} toys</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => buyUpgrade(clickPower * 10, "power")}
              disabled={toyCount < clickPower * 10}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 transition-all hover:scale-105"
            >
              Buy 1
            </Button>
            <Button
              onClick={() => buyMaxUpgrade("power")}
              disabled={toyCount < clickPower * 10}
              className="bg-blue-700 hover:bg-blue-800 disabled:bg-gray-600 transition-all hover:scale-105"
            >
              Buy Max
            </Button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-green-700/20 rounded-lg p-4 space-y-3 border border-green-400/20 backdrop-blur-sm">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-green-400" />
              <span className="font-semibold">Auto Elves</span>
            </div>
            <div className="text-right">
              <div className="text-sm text-white/60">Level {autoProduction}</div>
              <div className="text-xs text-white/60">{(autoProduction + 1) * 50} toys</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => buyUpgrade((autoProduction + 1) * 50, "auto")}
              disabled={toyCount < (autoProduction + 1) * 50}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-600 transition-all hover:scale-105"
            >
              Buy 1
            </Button>
            <Button
              onClick={() => buyMaxUpgrade("auto")}
              disabled={toyCount < (autoProduction + 1) * 50}
              className="bg-green-700 hover:bg-green-800 disabled:bg-gray-600 transition-all hover:scale-105"
            >
              Buy Max
            </Button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-purple-700/20 rounded-lg p-4 space-y-3 border border-purple-400/20 backdrop-blur-sm">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-400" />
              <span className="font-semibold">Multiplier</span>
            </div>
            <div className="text-right">
              <div className="text-sm text-white/60">{multiplier}x</div>
              <div className="text-xs text-white/60">{Math.floor(multiplier * 100)} toys</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => buyUpgrade(Math.floor(multiplier * 100), "multiplier")}
              disabled={toyCount < Math.floor(multiplier * 100)}
              className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-600 transition-all hover:scale-105"
            >
              Buy 1
            </Button>
            <Button
              onClick={() => buyMaxUpgrade("multiplier")}
              disabled={toyCount < Math.floor(multiplier * 100)}
              className="bg-purple-700 hover:bg-purple-800 disabled:bg-gray-600 transition-all hover:scale-105"
            >
              Buy Max
            </Button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/20 to-orange-700/20 rounded-lg p-4 space-y-3 border border-yellow-400/20 backdrop-blur-sm">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span className="font-semibold">Mega Boost</span>
            </div>
            <div className="text-right">
              <div className="text-sm text-white/60">{multiplierBoost}x</div>
              <div className="text-xs text-white/60">{Math.floor(multiplierBoost * multiplier * 200)} toys</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => buyUpgrade(Math.floor(multiplierBoost * multiplier * 200), "megamultiplier")}
              disabled={toyCount < Math.floor(multiplierBoost * multiplier * 200)}
              className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-600 transition-all hover:scale-105"
            >
              Buy 1
            </Button>
            <Button
              onClick={() => buyMaxUpgrade("megamultiplier")}
              disabled={toyCount < Math.floor(multiplierBoost * multiplier * 200)}
              className="bg-yellow-700 hover:bg-yellow-800 disabled:bg-gray-600 transition-all hover:scale-105"
            >
              Buy Max
            </Button>
          </div>
        </div>
      </div>

      {autoProduction > 0 && (
        <div className="bg-white/5 rounded-lg p-4 border border-white/10 backdrop-blur-sm">
          <div className="text-white/80 text-sm mb-2 flex items-center justify-center gap-2">
            <Gift className="w-4 h-4 animate-bounce" />
            Auto-producing {(autoProduction * multiplier * multiplierBoost).toFixed(1)} toys per second
            <Gift className="w-4 h-4 animate-bounce" style={{ animationDelay: "0.5s" }} />
          </div>
          <Progress value={((Date.now() / 1000) % 1) * 100} className="h-2 bg-white/10" />
        </div>
      )}
    </div>
  );
}
