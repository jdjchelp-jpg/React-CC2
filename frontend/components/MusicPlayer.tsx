import { useRef, useEffect, useState } from 'react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MusicPlayerProps {
  volume: number;
  autoPlay: boolean;
  customUrl?: string;
}

export default function MusicPlayer({ volume, autoPlay, customUrl }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(customUrl || 'https://audio.jukehost.co.uk/WQF2nafozymUdCIyomH2I1R1v41NO4hk');

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    if (customUrl && customUrl !== currentUrl) {
      const wasPlaying = isPlaying;
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
      setCurrentUrl(customUrl);
      if (wasPlaying && audioRef.current) {
        setTimeout(() => {
          audioRef.current?.play().catch(() => {});
        }, 100);
      }
    }
  }, [customUrl, currentUrl, isPlaying]);

  useEffect(() => {
    if (autoPlay && audioRef.current && !isPlaying) {
      const timer = setTimeout(() => {
        if (audioRef.current && !isPlaying) {
          audioRef.current.play().catch(() => {
            console.log('Autoplay was prevented');
          });
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [autoPlay]);

  const togglePlay = async () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (err) {
          console.error('Error playing audio:', err);
        }
      }
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex gap-2">
      <Button
        onClick={togglePlay}
        size="icon"
        variant="secondary"
        className="backdrop-blur-md bg-white/20 hover:bg-white/30 border-white/20 shadow-lg"
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      </Button>
      <Button
        onClick={toggleMute}
        size="icon"
        variant="secondary"
        className="backdrop-blur-md bg-white/20 hover:bg-white/30 border-white/20 shadow-lg"
      >
        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </Button>
      <audio
        ref={audioRef}
        loop
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        src={currentUrl}
        aria-label="Background music player"
      />
    </div>
  );
}
