import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Gift, RotateCw, Sparkles } from "lucide-react";

type WrapperColor = "red" | "green" | "blue" | "gold" | "silver" | "purple";
type RibbonColor = "red" | "green" | "gold" | "silver" | "pink" | "blue";
type BowStyle = "classic" | "fancy" | "sparkle";

export default function GiftWrapper() {
  const [wrapperColor, setWrapperColor] = useState<WrapperColor>("red");
  const [ribbonColor, setRibbonColor] = useState<RibbonColor>("gold");
  const [bowStyle, setBowStyle] = useState<BowStyle>("classic");
  const [wrappedGifts, setWrappedGifts] = useState(0);
  const [isWrapping, setIsWrapping] = useState(false);

  const wrapperColors: { color: WrapperColor; class: string; label: string }[] = [
    { color: "red", class: "bg-red-500", label: "Red" },
    { color: "green", class: "bg-green-500", label: "Green" },
    { color: "blue", class: "bg-blue-500", label: "Blue" },
    { color: "gold", class: "bg-yellow-500", label: "Gold" },
    { color: "silver", class: "bg-gray-300", label: "Silver" },
    { color: "purple", class: "bg-purple-500", label: "Purple" },
  ];

  const ribbonColors: { color: RibbonColor; class: string; label: string }[] = [
    { color: "red", class: "bg-red-600", label: "Red" },
    { color: "green", class: "bg-green-600", label: "Green" },
    { color: "gold", class: "bg-yellow-400", label: "Gold" },
    { color: "silver", class: "bg-gray-400", label: "Silver" },
    { color: "pink", class: "bg-pink-500", label: "Pink" },
    { color: "blue", class: "bg-blue-600", label: "Blue" },
  ];

  const bowStyles: { style: BowStyle; emoji: string; label: string }[] = [
    { style: "classic", emoji: "🎀", label: "Classic" },
    { style: "fancy", emoji: "🌟", label: "Fancy" },
    { style: "sparkle", emoji: "✨", label: "Sparkle" },
  ];

  const wrapGift = () => {
    setIsWrapping(true);
    setTimeout(() => {
      setWrappedGifts((prev) => prev + 1);
      setIsWrapping(false);
    }, 600);
  };

  const getWrapperClass = () => {
    const wrapper = wrapperColors.find((w) => w.color === wrapperColor);
    return wrapper?.class || "bg-red-500";
  };

  const getRibbonClass = () => {
    const ribbon = ribbonColors.find((r) => r.color === ribbonColor);
    return ribbon?.class || "bg-yellow-400";
  };

  const getBowEmoji = () => {
    const bow = bowStyles.find((b) => b.style === bowStyle);
    return bow?.emoji || "🎀";
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-white">🎁 Gift Wrapper 🎁</h2>
        <p className="text-white/80">Design and wrap beautiful presents!</p>
        <div className="text-white text-lg">
          Gifts Wrapped: <span className="font-bold text-blue-400">{wrappedGifts}</span>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative w-56 h-56 flex items-center justify-center">
          <div
            className={`w-44 h-44 ${getWrapperClass()} rounded-lg relative shadow-2xl transition-all duration-300 ${
              isWrapping ? "scale-110 rotate-12" : "scale-100 rotate-0"
            }`}
            style={{
              boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
            }}
          >
            <div
              className={`absolute top-1/2 left-0 right-0 h-7 ${getRibbonClass()} -translate-y-1/2 shadow-lg transition-all duration-300`}
            />
            <div
              className={`absolute top-0 bottom-0 left-1/2 w-7 ${getRibbonClass()} -translate-x-1/2 shadow-lg transition-all duration-300`}
            />
            <div
              className={`absolute -top-5 left-1/2 -translate-x-1/2 text-5xl transition-all duration-300 ${
                isWrapping ? "animate-bounce" : ""
              }`}
            >
              {getBowEmoji()}
            </div>
            
            {isWrapping && (
              <>
                <div className="absolute -top-8 -left-8 text-3xl animate-ping">✨</div>
                <div className="absolute -top-8 -right-8 text-3xl animate-ping" style={{ animationDelay: "0.1s" }}>✨</div>
                <div className="absolute -bottom-8 -left-8 text-3xl animate-ping" style={{ animationDelay: "0.2s" }}>✨</div>
                <div className="absolute -bottom-8 -right-8 text-3xl animate-ping" style={{ animationDelay: "0.3s" }}>✨</div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="space-y-3">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <Gift className="w-4 h-4" />
            Wrapper Color:
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {wrapperColors.map((w) => (
              <Button
                key={w.color}
                onClick={() => setWrapperColor(w.color)}
                className={`${w.class} hover:opacity-90 transition-all ${
                  wrapperColor === w.color ? "ring-4 ring-white scale-105" : "ring-2 ring-white/20"
                }`}
              >
                {w.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Ribbon Color:
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {ribbonColors.map((r) => (
              <Button
                key={r.color}
                onClick={() => setRibbonColor(r.color)}
                className={`${r.class} hover:opacity-90 transition-all ${
                  ribbonColor === r.color ? "ring-4 ring-white scale-105" : "ring-2 ring-white/20"
                }`}
              >
                {r.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-white font-semibold">Bow Style:</h3>
          <div className="grid grid-cols-3 gap-2">
            {bowStyles.map((b) => (
              <Button
                key={b.style}
                onClick={() => setBowStyle(b.style)}
                className={`bg-white/20 hover:bg-white/30 text-white transition-all ${
                  bowStyle === b.style ? "ring-4 ring-white scale-105" : "ring-2 ring-white/20"
                }`}
              >
                <span className="text-2xl mr-2">{b.emoji}</span>
                {b.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <Button
          onClick={wrapGift}
          disabled={isWrapping}
          size="lg"
          className="bg-gradient-to-r from-red-500 to-green-500 hover:from-red-600 hover:to-green-600 text-white font-bold transition-all hover:scale-105"
        >
          <Gift className="w-5 h-5 mr-2" />
          {isWrapping ? "Wrapping..." : "Wrap Gift"}
        </Button>
        <Button
          onClick={() => {
            setWrapperColor("red");
            setRibbonColor("gold");
            setBowStyle("classic");
          }}
          variant="outline"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all hover:scale-105"
        >
          <RotateCw className="w-5 h-5 mr-2" />
          Reset Design
        </Button>
      </div>
    </div>
  );
}
