"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useHandleStreamResponse } from '../../utilities/runtime-helpers';

function MainComponent() {
  const [prompt, setPrompt] = useState("");
  const [headcanon, setHeadcanon] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [style, setStyle] = useState("standard");
  const [length, setLength] = useState("medium");
  const [genre, setGenre] = useState("general");
  const [streamingMessage, setStreamingMessage] = useState("");

  const handleFinish = useCallback((message) => {
    setHeadcanon(message);
    setStreamingMessage("");
  }, []);

  const handleStreamResponse = useHandleStreamResponse({
    onChunk: setStreamingMessage,
    onFinish: handleFinish,
  });

  useEffect(() => {
    const isDark = localStorage.getItem("darkMode") === "true";
    setDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
  };

  const generateHeadcanon = async () => {
    if (!prompt) {
      setError("Please enter a prompt");
      return;
    }
    setLoading(true);
    setError("");
    setHeadcanon("");

    try {
      const systemPrompt = `You are a creative writing AI specialized in generating detailed headcanons. 
        Writing Style: ${style}
        Length: ${length}
        Genre: ${genre}
        
        Generate a creative and engaging headcanon based on the user's prompt. Make it detailed and imaginative.`;

      const response = await fetch("/integrations/google-gemini-1-5/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt },
          ],
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      handleStreamResponse(response);
    } catch (err) {
      setError("Failed to generate headcanon. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(headcanon || streamingMessage);
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-[#0F172A] text-white" : "bg-[#F8FAFC] text-gray-900"
      }`}
    >
      <head>
        <title>AI Headcanon Generator | Premium Fan Fiction Creation</title>
        <meta
          name="description"
          content="Create premium quality headcanons and fan stories using advanced AI. Transform your ideas into engaging narratives with our professional writing tool."
        />
        <meta
          name="keywords"
          content="headcanon generator, AI writing, fan fiction, creative writing, fandom, character stories"
        />
        <meta
          property="og:title"
          content="AI Headcanon Generator | Premium Fan Fiction Creation"
        />
        <meta
          property="og:description"
          content="Create premium quality headcanons and fan stories using advanced AI. Transform your ideas into engaging narratives with our professional writing tool."
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </head>

      <div className="relative">
        {/* Modern gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-purple-500/10 to-pink-500/10 animate-gradient-shift"></div>

        <div className="relative container mx-auto px-4 py-8">
          {/* Centered premium header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 text-transparent bg-clip-text">
              techblizr - ai headcanon generator
            </h1>
          </div>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto">
            {/* Premium Settings Card */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Writing Style
                  </label>
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full p-2 rounded-lg bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600"
                  >
                    <option value="standard">Standard</option>
                    <option value="epic">Epic</option>
                    <option value="romantic">Romantic</option>
                    <option value="humorous">Humorous</option>
                    <option value="dramatic">Dramatic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Length
                  </label>
                  <select
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    className="w-full p-2 rounded-lg bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600"
                  >
                    <option value="short">Short</option>
                    <option value="medium">Medium</option>
                    <option value="long">Long</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Genre
                  </label>
                  <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full p-2 rounded-lg bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600"
                  >
                    <option value="general">General</option>
                    <option value="fantasy">Fantasy</option>
                    <option value="scifi">Sci-Fi</option>
                    <option value="adventure">Adventure</option>
                    <option value="drama">Drama</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <textarea
                  name="prompt"
                  rows="4"
                  className="w-full p-4 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border border-gray-200 dark:border-gray-600 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 resize-none"
                  placeholder="Describe your headcanon idea... (e.g., 'What if Harry Potter was raised by the Malfoys?')"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                ></textarea>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                  <button
                    onClick={toggleDarkMode}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
                  >
                    <i
                      className={`fas ${
                        darkMode ? "fa-sun" : "fa-moon"
                      } text-xl`}
                    ></i>
                  </button>
                </div>
                <button
                  onClick={generateHeadcanon}
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-500 text-white rounded-xl font-semibold transform transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:hover:scale-100"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <i className="fas fa-spinner animate-spin"></i>
                      <span>Generating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <i className="fas fa-wand-sparkles"></i>
                      <span>Generate Headcanon</span>
                    </div>
                  )}
                </button>
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-center">
                  <i className="fas fa-exclamation-circle mr-2"></i>
                  {error}
                </div>
              )}
            </div>

            {/* Output Card */}
            {(headcanon || streamingMessage) && (
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg p-8 animate-fade-in">
                <div className="prose dark:prose-invert max-w-none mb-6">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
                    <i className="fas fa-sparkles"></i>
                    <span>Generated Headcanon</span>
                  </div>
                  <div className="whitespace-pre-wrap">
                    {streamingMessage || headcanon}
                  </div>
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
                  >
                    <i className="fas fa-copy"></i>
                    <span>Copy</span>
                  </button>
                  <button
                    onClick={generateHeadcanon}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 transition-all duration-300"
                  >
                    <i className="fas fa-redo"></i>
                    <span>Regenerate</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animate-gradient-shift {
          animation: gradient-shift 15s ease infinite;
          background-size: 400% 400%;
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default MainComponent;