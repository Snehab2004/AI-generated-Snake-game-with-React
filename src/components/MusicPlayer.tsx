import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from 'lucide-react';

const TRACKS = [
  { id: 1, title: "Neon Drive (AI Gen)", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: 2, title: "Cybernetic Pulse (AI Gen)", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: 3, title: "Synthwave Dreams (AI Gen)", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(err => {
        console.error("Audio playback failed:", err);
        setIsPlaying(false);
      });
    } else if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnded = () => {
    handleNext();
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const percentage = x / bounds.width;
      audioRef.current.currentTime = percentage * audioRef.current.duration;
      setProgress(percentage * 100);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-black border-2 border-fuchsia-500 p-4 shadow-[0_0_20px_rgba(255,0,255,0.3)] rgb-split-border">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnded}
      />
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className={`p-2 border-2 border-cyan-400 text-cyan-400 ${isPlaying ? 'animate-pulse shadow-[0_0_10px_rgba(0,255,255,0.5)]' : ''}`}>
            <Music size={20} />
          </div>
          <div className="truncate">
            <h3 className="text-cyan-400 font-bold truncate text-lg tracking-wider uppercase">{currentTrack.title}</h3>
            <p className="text-fuchsia-500 text-sm">AUDIO_STREAM_ACTIVE</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button onClick={() => setIsMuted(!isMuted)} className="text-fuchsia-500 hover:text-cyan-400 transition-colors">
            {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              setIsMuted(false);
            }}
            className="w-20 h-2 bg-black border border-cyan-400 appearance-none cursor-pointer accent-fuchsia-500"
          />
        </div>
      </div>

      {/* Progress Bar */}
      <div 
        className="w-full h-2 bg-black border border-fuchsia-500 mb-4 cursor-pointer overflow-hidden relative"
        onClick={handleProgressClick}
      >
        <div 
          className="absolute top-0 left-0 h-full bg-cyan-400 shadow-[0_0_10px_rgba(0,255,255,0.8)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6">
        <button 
          onClick={handlePrev}
          className="text-fuchsia-500 hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.8)] transition-all"
        >
          <SkipBack size={24} />
        </button>
        
        <button 
          onClick={togglePlay}
          className="w-12 h-12 flex items-center justify-center bg-black border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black hover:shadow-[0_0_15px_rgba(0,255,255,0.8)] transition-all transform hover:scale-105 rgb-split"
        >
          {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
        </button>
        
        <button 
          onClick={handleNext}
          className="text-fuchsia-500 hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.8)] transition-all"
        >
          <SkipForward size={24} />
        </button>
      </div>
    </div>
  );
}
