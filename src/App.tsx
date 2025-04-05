import React, { useState, useRef, useEffect } from 'react';
import { Music4, Wand2, Volume2, Play, Pause } from 'lucide-react';
import { generateMusicPrompt } from './lib/gemini';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const genres = ['Classical', 'Jazz', 'Electronic', 'Ambient', 'Rock'];
  const moods = ['Happy', 'Melancholic', 'Energetic', 'Calm', 'Mysterious'];
  const tempos = ['Slow', 'Moderate', 'Fast', 'Very Fast'];

  const [selectedParams, setSelectedParams] = useState({
    genre: '',
    mood: '',
    tempo: '',
    duration: '3:00',
  });

  useEffect(() => {
    audioRef.current = new Audio('https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav');
    audioRef.current.loop = true;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const prompt = await generateMusicPrompt(selectedParams);
      setGeneratedPrompt(prompt);
      setIsPlaying(true);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="bg-purple-600 p-3 rounded-2xl shadow-lg">
              <Music4 className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              AI Music Composer
            </h1>
          </div>
          <p className="text-xl text-gray-600">Create unique music compositions powered by artificial intelligence</p>
        </header>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 backdrop-blur-lg bg-opacity-90">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Genre
                </label>
                <select
                  className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  value={selectedParams.genre}
                  onChange={(e) =>
                    setSelectedParams({ ...selectedParams, genre: e.target.value })
                  }
                >
                  <option value="">Select Genre</option>
                  {genres.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Mood
                </label>
                <select
                  className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  value={selectedParams.mood}
                  onChange={(e) =>
                    setSelectedParams({ ...selectedParams, mood: e.target.value })
                  }
                >
                  <option value="">Select Mood</option>
                  {moods.map((mood) => (
                    <option key={mood} value={mood}>
                      {mood}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Tempo
                </label>
                <select
                  className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  value={selectedParams.tempo}
                  onChange={(e) =>
                    setSelectedParams({ ...selectedParams, tempo: e.target.value })
                  }
                >
                  <option value="">Select Tempo</option>
                  {tempos.map((tempo) => (
                    <option key={tempo} value={tempo}>
                      {tempo}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Duration
                </label>
                <select
                  className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  value={selectedParams.duration}
                  onChange={(e) =>
                    setSelectedParams({ ...selectedParams, duration: e.target.value })
                  }
                >
                  <option value="1:00">1 minute</option>
                  <option value="2:00">2 minutes</option>
                  <option value="3:00">3 minutes</option>
                  <option value="5:00">5 minutes</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                <Wand2 className="w-6 h-6" />
                {isLoading ? 'Composing...' : 'Generate Music'}
              </button>

              {generatedPrompt && (
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-4 rounded-full bg-purple-100 hover:bg-purple-200 transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6 text-purple-600" />
                    ) : (
                      <Play className="w-6 h-6 text-purple-600" />
                    )}
                  </button>
                  
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-gray-600" />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={(e) => setVolume(Number(e.target.value))}
                      className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {generatedPrompt && (
            <div className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-lg bg-opacity-90">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">Your Composition</h2>
              <div className="prose prose-purple max-w-none">
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">{generatedPrompt}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;