"use client";

import { useCallback, useState, useRef } from "react";
import { formatFileSize, isAllowedAudioFile } from "@/app/lib/api";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  disabled?: boolean;
}

/**
 * FileUpload — Drag & drop audio file upload component
 *
 * Features:
 * - Drag & drop zone with visual feedback
 * - Click to browse files
 * - Client-side file type validation
 * - File info display (name, size, type)
 */
export default function FileUpload({
  onFileSelect,
  selectedFile,
  disabled = false,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      setError(null);

      if (!isAllowedAudioFile(file)) {
        setError(
          "Unsupported file type. Please upload MP3, WAV, FLAC, OGG, or M4A."
        );
        return;
      }

      if (file.size > 50 * 1024 * 1024) {
        setError("File too large. Maximum size is 50 MB.");
        return;
      }

      onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;

      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile, disabled]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) setIsDragging(true);
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleClick = useCallback(() => {
    if (!disabled) inputRef.current?.click();
  }, [disabled]);

  return (
    <div className="w-full">
      {/* Drop Zone */}
      <div
        id="upload-drop-zone"
        className={`drop-zone ${isDragging ? "dragging" : ""} ${
          selectedFile ? "active" : ""
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label="Upload audio file"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") handleClick();
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="audio/*,.mp3,.wav,.flac,.ogg,.m4a"
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
          id="file-input"
        />

        {selectedFile ? (
          <div className="flex flex-col items-center gap-3 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center">
              <svg
                className="w-7 h-7 text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-white font-medium text-sm truncate max-w-[280px]">
                {selectedFile.name}
              </p>
              <p className="text-zinc-500 text-xs mt-1">
                {formatFileSize(selectedFile.size)} •{" "}
                {selectedFile.type || "audio"}
              </p>
            </div>
            <p className="text-zinc-600 text-xs">Click or drop to replace</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center">
              <svg
                className="w-7 h-7 text-zinc-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-zinc-300 text-sm font-medium">
                Drop your audio file here
              </p>
              <p className="text-zinc-600 text-xs mt-1">
                or click to browse • MP3, WAV, FLAC, OGG, M4A • Max 50MB
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
          <p className="text-red-400 text-sm text-center">{error}</p>
        </div>
      )}
    </div>
  );
}
