import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Snowflake, Plus, Check, Award } from "lucide-react";

type SnowmanPart = "base" | "middle" | "head" | "hat" | "scarf" | "buttons" | "arms" | "nose" | "eyes";

interface Snowman {
  base: boolean;
  middle: boolean;
  head: boolean;
  hat: boolean;
  scarf: boolean;
  buttons: boolean;
  arms: boolean;
  nose: boolean;
  eyes: boolean;
}

export default function SnowmanBuilder() {
  const [snowman, setSnowman] = useState<Snowman>({
    base: false,
    middle: false,
    head: false,
    hat: false,
    scarf: false,
    buttons: false,
    arms: false,
    nose: false,
    eyes: false,
  });

  const [completedCount, setCompletedCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const addPart = (part: SnowmanPart) => {
    setIsAnimating(true);
    setTimeout(() => {
      setSnowman((prev) => ({ ...prev, [part]: true }));
      setIsAnimating(false);
      
      const newSnowman = { ...snowman, [part]: true };
      if (Object.values(newSnowman).every((v) => v)) {
        setCompletedCount((prev) => prev + 1);
      }
    }, 200);
  };

  const reset = () => {
    setSnowman({
      base: false,
      middle: false,
      head: false,
      hat: false,
      scarf: false,
      buttons: false,
      arms: false,
      nose: false,
      eyes: false,
    });
  };

  const isComplete = Object.values(snowman).every((v) => v);
  const completionPercentage = Math.round(
    (Object.values(snowman).filter((v) => v).length / Object.keys(snowman).length) * 100
  );

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
          ⛄ Snowman Builder ⛄
        </h2>
        <p className="text-white/80">Build your perfect snowman step by step!</p>
        <div className="flex items-center justify-center gap-4 text-white">
          <div className="bg-white/10 rounded-lg px-4 py-2 backdrop-blur-sm">
            <div className="text-sm text-white/60">Completed</div>
            <div className="text-2xl font-bold flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" />
              {completedCount}
            </div>
          </div>
          <div className="bg-white/10 rounded-lg px-4 py-2 backdrop-blur-sm">
            <div className="text-sm text-white/60">Progress</div>
            <div className="text-2xl font-bold">{completionPercentage}%</div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative w-72 h-[500px] bg-gradient-to-b from-blue-400/10 to-white/5 rounded-lg flex items-end justify-center p-8 border border-white/20 backdrop-blur-sm overflow-hidden">
          <div className="absolute inset-0 bg-white/5 rounded-lg" />
          
          <div className="relative flex flex-col items-center gap-0">
            {snowman.hat && (
              <div 
                className="text-5xl mb-1 animate-in slide-in-from-top-4 fade-in duration-500"
                style={{ animationDelay: "0.1s" }}
              >
                🎩
              </div>
            )}

            {snowman.head && (
              <div className="relative animate-in zoom-in fade-in duration-500">
                <div className="text-7xl relative">
                  ⚪
                  {snowman.eyes && (
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-3 text-2xl animate-in fade-in duration-300">
                      <div>👁️</div>
                      <div>👁️</div>
                    </div>
                  )}
                  {snowman.nose && (
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 text-3xl animate-in zoom-in duration-300">
                      🥕
                    </div>
                  )}
                </div>
                {snowman.scarf && (
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-4xl animate-in slide-in-from-right-4 fade-in duration-500">
                    🧣
                  </div>
                )}
              </div>
            )}

            {snowman.middle && (
              <div className="relative animate-in zoom-in fade-in duration-500" style={{ animationDelay: "0.2s" }}>
                <div className="text-8xl relative">
                  ⚪
                  {snowman.buttons && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-2 animate-in fade-in zoom-in duration-300">
                      <div className="w-4 h-4 rounded-full bg-black shadow-lg"></div>
                      <div className="w-4 h-4 rounded-full bg-black shadow-lg"></div>
                      <div className="w-4 h-4 rounded-full bg-black shadow-lg"></div>
                    </div>
                  )}
                </div>
                {snowman.arms && (
                  <>
                    <div className="absolute top-1/2 -left-12 -translate-y-1/2 text-4xl rotate-45 animate-in slide-in-from-left-4 fade-in duration-500">
                      🌿
                    </div>
                    <div className="absolute top-1/2 -right-12 -translate-y-1/2 text-4xl -rotate-45 animate-in slide-in-from-right-4 fade-in duration-500">
                      🌿
                    </div>
                  </>
                )}
              </div>
            )}

            {snowman.base && (
              <div className="text-9xl animate-in zoom-in fade-in duration-500" style={{ animationDelay: "0.3s" }}>
                ⚪
              </div>
            )}
          </div>

          {isComplete && (
            <>
              <div className="absolute top-4 left-1/2 -translate-x-1/2 text-5xl animate-bounce">
                🎉
              </div>
              <div className="absolute top-8 left-8 text-3xl animate-ping">✨</div>
              <div className="absolute top-8 right-8 text-3xl animate-ping" style={{ animationDelay: "0.2s" }}>✨</div>
              <div className="absolute bottom-8 left-8 text-3xl animate-ping" style={{ animationDelay: "0.4s" }}>⭐</div>
              <div className="absolute bottom-8 right-8 text-3xl animate-ping" style={{ animationDelay: "0.6s" }}>⭐</div>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Button
          onClick={() => addPart("base")}
          disabled={snowman.base || isAnimating}
          className={`${
            snowman.base
              ? "bg-green-600 hover:bg-green-600"
              : "bg-blue-500 hover:bg-blue-600"
          } disabled:bg-gray-600 transition-all hover:scale-105 relative`}
        >
          {snowman.base ? <Check className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
          Base
        </Button>
        <Button
          onClick={() => addPart("middle")}
          disabled={snowman.middle || !snowman.base || isAnimating}
          className={`${
            snowman.middle
              ? "bg-green-600 hover:bg-green-600"
              : "bg-blue-500 hover:bg-blue-600"
          } disabled:bg-gray-600 transition-all hover:scale-105`}
        >
          {snowman.middle ? <Check className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
          Middle
        </Button>
        <Button
          onClick={() => addPart("head")}
          disabled={snowman.head || !snowman.middle || isAnimating}
          className={`${
            snowman.head
              ? "bg-green-600 hover:bg-green-600"
              : "bg-blue-500 hover:bg-blue-600"
          } disabled:bg-gray-600 transition-all hover:scale-105`}
        >
          {snowman.head ? <Check className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
          Head
        </Button>
        <Button
          onClick={() => addPart("eyes")}
          disabled={snowman.eyes || !snowman.head || isAnimating}
          className={`${
            snowman.eyes
              ? "bg-green-600 hover:bg-green-600"
              : "bg-purple-500 hover:bg-purple-600"
          } disabled:bg-gray-600 transition-all hover:scale-105`}
        >
          {snowman.eyes ? <Check className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
          Eyes
        </Button>
        <Button
          onClick={() => addPart("nose")}
          disabled={snowman.nose || !snowman.head || isAnimating}
          className={`${
            snowman.nose
              ? "bg-green-600 hover:bg-green-600"
              : "bg-orange-500 hover:bg-orange-600"
          } disabled:bg-gray-600 transition-all hover:scale-105`}
        >
          {snowman.nose ? <Check className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
          Nose
        </Button>
        <Button
          onClick={() => addPart("hat")}
          disabled={snowman.hat || !snowman.head || isAnimating}
          className={`${
            snowman.hat
              ? "bg-green-600 hover:bg-green-600"
              : "bg-gray-700 hover:bg-gray-800"
          } disabled:bg-gray-600 transition-all hover:scale-105`}
        >
          {snowman.hat ? <Check className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
          Hat
        </Button>
        <Button
          onClick={() => addPart("scarf")}
          disabled={snowman.scarf || !snowman.head || isAnimating}
          className={`${
            snowman.scarf
              ? "bg-green-600 hover:bg-green-600"
              : "bg-red-500 hover:bg-red-600"
          } disabled:bg-gray-600 transition-all hover:scale-105`}
        >
          {snowman.scarf ? <Check className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
          Scarf
        </Button>
        <Button
          onClick={() => addPart("buttons")}
          disabled={snowman.buttons || !snowman.middle || isAnimating}
          className={`${
            snowman.buttons
              ? "bg-green-600 hover:bg-green-600"
              : "bg-yellow-500 hover:bg-yellow-600"
          } disabled:bg-gray-600 transition-all hover:scale-105`}
        >
          {snowman.buttons ? <Check className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
          Buttons
        </Button>
        <Button
          onClick={() => addPart("arms")}
          disabled={snowman.arms || !snowman.middle || isAnimating}
          className={`${
            snowman.arms
              ? "bg-green-600 hover:bg-green-600"
              : "bg-green-700 hover:bg-green-800"
          } disabled:bg-gray-600 transition-all hover:scale-105`}
        >
          {snowman.arms ? <Check className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
          Arms
        </Button>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={reset}
          variant="outline"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all hover:scale-105"
        >
          <Snowflake className="w-4 h-4 mr-2" />
          Start Over
        </Button>
      </div>

      {isComplete && (
        <div className="text-center space-y-2 animate-in fade-in zoom-in duration-500">
          <div className="text-white text-2xl font-bold animate-pulse">
            🎉 Perfect Snowman! 🎉
          </div>
          <div className="text-white/80">
            You've completed {completedCount} snowman{completedCount !== 1 ? "s" : ""}!
          </div>
        </div>
      )}
    </div>
  );
}
