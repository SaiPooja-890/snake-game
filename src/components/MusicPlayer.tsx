import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Terminal } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: "ERR_0x001",
    artist: "SYS.AUDIO_NODE",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: 2,
    title: "MEM_LEAK",
    artist: "SYS.AUDIO_NODE",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: 3,
    title: "NULL_POINTER",
    artist: "SYS.AUDIO_NODE",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    } else if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const playNext = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  }, []);

  const playPrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
    if (isMuted) setIsMuted(false);
  };

  const toggleMute = () => setIsMuted(!isMuted);

  return (
    <div className="bg-dark-surface border-2 border-magenta p-6 w-full max-w-md mx-auto flex flex-col items-center gap-4 relative">
      {/* Glitchy decorative corners */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-cyan -translate-x-1 -translate-y-1"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-cyan translate-x-1 translate-y-1"></div>

      <div className="flex items-center gap-3 w-full border-b border-magenta pb-4">
        <div className="w-12 h-12 bg-magenta text-dark-bg flex items-center justify-center">
          <Terminal size={24} />
        </div>
        <div className="flex-1 overflow-hidden">
          <h3 className="text-cyan font-pixel text-xs truncate uppercase mb-2">
            <span className="glitch" data-text={currentTrack.title}>{currentTrack.title}</span>
          </h3>
          <p className="text-magenta text-xl truncate">[{currentTrack.artist}]</p>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onEnded={playNext}
      />

      <div className="flex items-center justify-between w-full mt-2 px-4">
        <button 
          onClick={playPrev}
          className="text-cyan hover:text-magenta hover:scale-110 transition-all"
        >
          <SkipBack size={28} />
        </button>
        
        <button 
          onClick={togglePlay}
          className="w-14 h-14 bg-cyan text-dark-bg flex items-center justify-center hover:bg-magenta transition-colors"
        >
          {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
        </button>
        
        <button 
          onClick={playNext}
          className="text-cyan hover:text-magenta hover:scale-110 transition-all"
        >
          <SkipForward size={28} />
        </button>
      </div>

      <div className="flex items-center gap-3 w-full mt-4 bg-dark-bg p-2 border border-cyan">
        <button onClick={toggleMute} className="text-magenta hover:text-cyan">
          {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="flex-1 h-2 bg-magenta appearance-none cursor-pointer accent-cyan"
        />
      </div>
    </div>
  );
}
