"use client";

import { useState, useCallback } from "react";
import { Link, Music2, ArrowRight } from "lucide-react"; import { motion } from "framer-motion";

interface UrlInputProps {
  onUrlSubmit: (url: string) => void;
  disabled?: boolean;
}

export default function UrlInput({ onUrlSubmit, disabled }: UrlInputProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!url.trim()) {
      setError("Please enter a valid URL.");
      return;
    }
    onUrlSubmit(url.trim());
  }, [url, onUrlSubmit]);

  return (
    <div className="w-full">
      <div className="flex justify-center gap-6 mb-8 text-zinc-500">
        <div className="flex flex-col items-center gap-2 group">
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
            <Music2 className="w-5 h-5 text-red-500" />
          </div>
          <span className="text-xs font-medium">YouTube</span>
        </div>
        <div className="flex flex-col items-center gap-2 group">
          <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-green-500" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.54.659.3 1.02zm1.44-3.3c-.301.42-.84.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.24 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.6.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.48-1.02.659-1.56.3z" />
            </svg>
          </div>
          <span className="text-xs font-medium">Spotify</span>
        </div>
        <div className="flex flex-col items-center gap-2 group">
          <div className="w-12 h-12 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-orange-500" fill="currentColor">
              <path d="M11.59 13.562a1.865 1.865 0 0 1 1.861-1.861c1.03 0 1.86.83 1.86 1.86 0 1.03-.83 1.86-1.86 1.861a1.864 1.864 0 0 1-1.861-1.86zM4.14 13.562c0-.501.4-.907.906-.907.502 0 .907.406.907.907 0 .502-.405.908-.907.908-.506 0-.906-.406-.906-.908zm-2.036 0c0-.281.229-.51.51-.51.282 0 .51.229.51.51 0 .282-.228.51-.51.51-.281 0-.51-.228-.51-.51zm18.334 1.096c-1.396 0-2.531-1.135-2.531-2.533 0-1.395 1.135-2.53 2.531-2.53 1.397 0 2.533 1.135 2.533 2.53 0 1.398-1.136 2.533-2.533 2.533zm-5.138.802a2.805 2.805 0 0 1 2.804-2.805c1.552 0 2.805 1.253 2.805 2.805 0 1.551-1.253 2.804-2.805 2.804-1.55 0-2.804-1.253-2.804-2.804z" />
            </svg>
          </div>
          <span className="text-xs font-medium">SoundCloud</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Link className="h-5 w-5 text-zinc-500" />
        </div>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste URL to extract & analyze..."
          disabled={disabled}
          className="w-full bg-zinc-900 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-zinc-600 focus:outline-none focus:border-purple-500 focus:bg-zinc-800 transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={disabled || !url.trim()}
          className="absolute inset-y-2 right-2 px-3 bg-purple-500 hover:bg-purple-600 disabled:bg-zinc-700 disabled:opacity-50 text-white rounded-xl flex items-center justify-center transition-colors"
        >
          <ArrowRight className="h-5 w-5" />
        </button>
      </form>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20"
        >
          <p className="text-red-400 text-sm font-bold text-center">{error}</p>
        </motion.div>
      )}
    </div>
  );
}
