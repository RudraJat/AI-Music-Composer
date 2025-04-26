import React, { useState, useRef, useEffect } from "react";
import { Music4, Wand2, Volume2, Play, Pause } from "lucide-react";
import { generateMusicPrompt } from "./lib/gemini";

// Add music samples mapping
const musicSamples = {
  Classical: {
    Happy: "/music/classical-happy.mp3",
    Melancholic: "/music/classical-melancholic.mp3",
    Energetic: "/music/classical-energetic.mp3",
    Calm: "/music/classical-calm.mp3",
    Mysterious: "/music/classical-mysterious.mp3"
  },
  Jazz: {
    Happy: "/music/jazz-happy.mp3",
    // ... other moods
  },
  // ... other genres
};

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  /* ---------------------------------- options --------------------------------- */
  const genres = ["Classical", "Jazz", "Electronic", "Ambient", "Rock"];
  const moods = ["Happy", "Melancholic", "Energetic", "Calm", "Mysterious"];
  const tempos = ["Slow", "Moderate", "Fast", "Very Fast"];

  const [selectedParams, setSelectedParams] = useState({
    genre: "",
    mood: "",
    tempo: "",
    duration: "",
  });

  /* ------------------------------ audio element ------------------------------- */
  useEffect(() => {
    // Remove the static audio initialization since we'll create it after generation
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  /* ------------------------------ generate music ----------------------------- */
  const handleGenerate = async () => {
    if (!selectedParams.genre || !selectedParams.mood || !selectedParams.tempo || !selectedParams.duration) {
      alert("Please select all fields (Genre, Mood, Tempo, and Duration) before generating music.");
      return;
    }
  
    setIsLoading(true);
    try {
      const raw = await generateMusicPrompt(selectedParams);
      setGeneratedPrompt(formatPrompt(raw));
      
      // Create new audio element with selected genre and mood's audio
      const audio = new Audio();
      // Handle special case for "Energetic" mood
      const moodFileName = selectedParams.mood === "Energetic" ? "energetic" : selectedParams.mood.toLowerCase();
      audio.src = `/audio/${moodFileName}.mp3`;
      audio.loop = true;
      
      // Add error handling for audio loading
      audio.onerror = (e) => {
        console.error("Error loading audio:", e);
        console.log("Attempted to load:", audio.src);
      };
  
      // Store audio element in ref
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = audio;
      
      // Set initial volume
      audio.volume = volume / 100;
      
      // Start playing when ready
      audio.addEventListener('canplaythrough', () => {
        if (isPlaying) {
          audio.play();
        }
      });

    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Remove the Web Audio API related code and keep only these audio controls
  useEffect(() => {
    if (audioRef.current) {
      isPlaying ? audioRef.current.play() : audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  /* ---------------------------- prompt formatting ---------------------------- */
  const formatPrompt = (prompt: string) => {
    return (
      prompt
        // remove stray * or #
        .replace(/[\*#]/g, "")
        // bold label before first colon
        .replace(/^([^:\n]+?):/gm, "<strong>$1:</strong>")
        // bold full timing lines such as 0:00-0:15 (Intro)
        .replace(/^[\t ]*(\d{1,2}:\d{2}\s*-?\s*\d{1,2}:\d{2}\s*\([^\n]+\))/gm, "<strong>$1</strong>")
    );
  };

  /* ---------------------------------- render --------------------------------- */
  return (
    <div className="min-h-screen relative bg-[#0A0A1F]">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[500px] h-[500px] bg-purple-700/30 rounded-full blur-3xl animate-float left-1/4 top-1/4" />
        <div className="absolute w-[300px] h-[300px] bg-blue-700/30 rounded-full blur-3xl animate-float delay-1000 right-1/4 bottom-1/4" />
      </div>

      <div className="relative container mx-auto px-4 py-12">
        <Header />
        <div className="max-w-4xl mx-auto space-y-8">
          <ControlCard
            selectedParams={selectedParams}
            setSelectedParams={setSelectedParams}
            genres={genres}
            moods={moods}
            tempos={tempos}
            isLoading={isLoading}
            handleGenerate={handleGenerate}
            generatedPrompt={generatedPrompt}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            volume={volume}
            setVolume={setVolume}
          />
          {generatedPrompt && (
            <div className="glass animate-glow rounded-3xl p-8">
              <h2 className="text-2xl font-semibold mb-6 text-white neon-text">Your Composition</h2>
              <div
                className="prose prose-invert max-w-none text-gray-200 whitespace-pre-line leading-relaxed"
                dangerouslySetInnerHTML={{ __html: generatedPrompt }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="text-center mb-16">
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-4 rounded-3xl animate-float animate-glow">
          <Music4 className="w-12 h-12 text-white animate-wave" />
        </div>
        <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 animate-gradient neon-text">
          AI Music Composer
        </h1>
      </div>
      <p className="text-xl text-gray-300 max-w-2xl mx-auto animate-float delay-100">
        Create unique music compositions powered by artificial intelligence
      </p>
    </header>
  );
}

// Remove this version of ControlCard
/* DELETE THIS BLOCK
function ControlCard({
  selectedParams,
  setSelectedParams,
  genres,
  moods,
  tempos,
  isLoading,
  handleGenerate,
  generatedPrompt,
  isPlaying,
  setIsPlaying,
  volume,
  setVolume,
}: any) {
  return (
    <div className="glass hover-scale animate-glow rounded-3xl p-8 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Selector 
          label="Genre" 
          value={selectedParams.genre} 
          options={genres} 
          onChange={(v) => setSelectedParams({...selectedParams, genre: v})}
        />
        <Selector 
          label="Mood" 
          value={selectedParams.mood} 
          options={moods} 
          onChange={(v) => setSelectedParams({...selectedParams, mood: v})}
        />
        <Selector 
          label="Tempo" 
          value={selectedParams.tempo} 
          options={tempos} 
          onChange={(v) => setSelectedParams({...selectedParams, tempo: v})}
        />
        <Selector 
          label="Duration" 
          value={selectedParams.duration} 
          options={["1:00", "2:00", "3:00", "5:00"]} 
          onChange={(v) => setSelectedParams({...selectedParams, duration: v})}
        />
      </div>
      <div className="flex items-center gap-6">
        <button 
          onClick={handleGenerate} 
          disabled={isLoading} 
          className="flex-1 gradient-button py-4 px-6 rounded-2xl text-white flex items-center justify-center gap-3 disabled:opacity-50"
        >
          <Wand2 className="w-6 h-6" />{isLoading ? "Composing..." : "Generate Music"}
        </button>
        {generatedPrompt && (
          <div className="flex items-center gap-4">
            <button onClick={()=>setIsPlaying(!isPlaying)} className="p-4 rounded-full glass hover-scale">
              {isPlaying ? 
                <Pause className="w-6 h-6 text-purple-400"/> : 
                <Play className="w-6 h-6 text-purple-400"/>
              }
            </button>
            <div className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-gray-400" />
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={volume} 
                onChange={(e)=>setVolume(Number(e.target.value))} 
                className="custom-input w-24 h-2 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
*/

// Keep only the properly typed version with ControlCardProps
interface ControlCardProps {
  selectedParams: {
    genre: string;
    mood: string;
    tempo: string;
    duration: string;
  };
  setSelectedParams: React.Dispatch<React.SetStateAction<{
    genre: string;
    mood: string;
    tempo: string;
    duration: string;
  }>>;
  genres: string[];
  moods: string[];
  tempos: string[];
  isLoading: boolean;
  handleGenerate: () => void;
  generatedPrompt: string;
  isPlaying: boolean;
  setIsPlaying: (value: boolean) => void;
  volume: number;
  setVolume: (value: number) => void;
}

function ControlCard({
  selectedParams,
  setSelectedParams,
  genres,
  moods,
  tempos,
  isLoading,
  handleGenerate,
  generatedPrompt,
  isPlaying,
  setIsPlaying,
  volume,
  setVolume,
}: ControlCardProps) {
  return (
    <div className="glass hover-scale animate-glow rounded-3xl p-8 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Selector 
          label="Genre" 
          value={selectedParams.genre} 
          options={genres} 
          onChange={(v) => setSelectedParams({...selectedParams, genre: v})}
        />
        <Selector 
          label="Mood" 
          value={selectedParams.mood} 
          options={moods} 
          onChange={(v) => setSelectedParams({...selectedParams, mood: v})}
        />
        <Selector 
          label="Tempo" 
          value={selectedParams.tempo} 
          options={tempos} 
          onChange={(v) => setSelectedParams({...selectedParams, tempo: v})}
        />
        <Selector 
          label="Duration" 
          value={selectedParams.duration} 
          options={["1:00", "2:00", "3:00", "5:00"]} 
          onChange={(v) => setSelectedParams({...selectedParams, duration: v})}
        />
      </div>
      <div className="flex items-center gap-6">
        <button 
          onClick={handleGenerate} 
          disabled={isLoading} 
          className="flex-1 gradient-button py-4 px-6 rounded-2xl text-white flex items-center justify-center gap-3 disabled:opacity-50"
        >
          <Wand2 className="w-6 h-6" />{isLoading ? "Composing..." : "Generate Music"}
        </button>
        {generatedPrompt && (
          <div className="flex items-center gap-4">
            <button onClick={()=>setIsPlaying(!isPlaying)} className="p-4 rounded-full glass hover-scale">
              {isPlaying ? 
                <Pause className="w-6 h-6 text-purple-400"/> : 
                <Play className="w-6 h-6 text-purple-400"/>
              }
            </button>
            <div className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-gray-400" />
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={volume} 
                onChange={(e)=>setVolume(Number(e.target.value))} 
                className="custom-input w-24 h-2 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// First, add the type interface for Selector props
interface SelectorProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

function Selector({ label, value, options, onChange }: SelectorProps) {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-300">{label}</label>
      <select 
        className="custom-input w-full p-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 smooth-transition"
        value={value} 
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="" className="bg-[#0A0A1F]">Select {label}</option>
        {options.map((o) => (
          <option key={o} value={o} className="bg-[#0A0A1F]">{o}</option>
        ))}
      </select>
    </div>
  );
}
