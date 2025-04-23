import React, { useState, useRef, useEffect } from "react";
import { Music4, Wand2, Volume2, Play, Pause } from "lucide-react";
import { generateMusicPrompt } from "./lib/gemini";

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
    audioRef.current = new Audio(
      "https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav"
    );
    audioRef.current.loop = true;
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      isPlaying ? audioRef.current.play() : audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100;
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

  /* ------------------------------ generate music ----------------------------- */
  const handleGenerate = async () => {
    // Check if all fields are selected
    if (!selectedParams.genre || !selectedParams.mood || !selectedParams.tempo || !selectedParams.duration) {
      alert("Please select all fields (Genre, Mood, Tempo, and Duration) before generating music.");
      return;
    }
  
    setIsLoading(true);
    try {
      const raw = await generateMusicPrompt(selectedParams);
      setGeneratedPrompt(formatPrompt(raw));
      setIsPlaying(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------------------------- render --------------------------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-12">
        <Header />
        <div className="max-w-4xl mx-auto">
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
            <div className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-lg bg-opacity-90">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">Your Composition</h2>
              <div
                className="prose prose-purple max-w-none text-gray-700 whitespace-pre-line leading-relaxed"
                dangerouslySetInnerHTML={{ __html: generatedPrompt }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ header comp ------------------------------ */
function Header() {
  return (
    <header className="text-center mb-16">
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="bg-purple-600 p-3 rounded-2xl shadow-lg">
          <Music4 className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
          AI Music Composer
        </h1>
      </div>
      <p className="text-xl text-gray-600">
        Create unique music compositions powered by artificial intelligence
      </p>
    </header>
  );
}

/* ---------------------------- control card comp --------------------------- */
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
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 backdrop-blur-lg bg-opacity-90">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Selector label="Genre" value={selectedParams.genre} options={genres} onChange={(v:any)=>setSelectedParams({...selectedParams,genre:v})}/>
        <Selector label="Mood" value={selectedParams.mood} options={moods} onChange={(v:any)=>setSelectedParams({...selectedParams,mood:v})}/>
        <Selector label="Tempo" value={selectedParams.tempo} options={tempos} onChange={(v:any)=>setSelectedParams({...selectedParams,tempo:v})}/>
        <Selector label="Duration" value={selectedParams.duration} options={["1:00","2:00","3:00","5:00"]} onChange={(v:any)=>setSelectedParams({...selectedParams,duration:v})}/>
      </div>
      <div className="flex items-center gap-6">
        <button onClick={handleGenerate} disabled={isLoading} className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-3 disabled:opacity-50">
          <Wand2 className="w-6 h-6" />{isLoading?"Composing...":"Generate Music"}
        </button>
        {generatedPrompt && (
          <div className="flex items-center gap-4">
            <button onClick={()=>setIsPlaying(!isPlaying)} className="p-4 rounded-full bg-purple-100 hover:bg-purple-200 transition-colors">
              {isPlaying? <Pause className="w-6 h-6 text-purple-600"/> : <Play className="w-6 h-6 text-purple-600"/>}
            </button>
            <div className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-gray-600" />
              <input type="range" min="0" max="100" value={volume} onChange={(e)=>setVolume(Number(e.target.value))} className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"/>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------ selector comp ------------------------------ */
function Selector({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void; }) {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <select className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" value={value} onChange={(e)=>onChange(e.target.value)}>
        <option value="">Select {label}</option>
        {options.map((o)=>(<option key={o} value={o}>{o}</option>))}
      </select>
    </div>
  );
}
