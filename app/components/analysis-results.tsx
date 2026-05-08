"use client";

import React, { useState } from "react";
import type { AnalysisResult } from "@/app/lib/api";
import { 
  Music, Guitar, Drum, Mic, Piano, Wind, Activity, Clock, 
  BarChart2, Waves, ListMusic, AudioWaveform, Disc3
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface AnalysisResultsProps {
  result: AnalysisResult;
}

const INSTRUMENT_COLORS: Record<string, string> = {
  Piano: "bg-purple-500",
  Guitar: "bg-blue-500",
  Drums: "bg-orange-500",
  Bass: "bg-green-500",
  Vocals: "bg-pink-500",
  Strings: "bg-cyan-500",
  Synth: "bg-indigo-500",
  "Brass/Winds": "bg-yellow-500",
};

const INSTRUMENT_ICONS: Record<string, React.ReactNode> = {
  Piano: <Piano className="w-4 h-4" />,
  Guitar: <Guitar className="w-4 h-4" />,
  Drums: <Drum className="w-4 h-4" />,
  Vocals: <Mic className="w-4 h-4" />,
  "Brass/Winds": <Wind className="w-4 h-4" />,
  Bass: <Guitar className="w-4 h-4" />,
};

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function MetricCard({ title, value, unit, icon }: { title: string, value: string | number, unit?: string, icon: React.ReactNode }) {
  return (
    <div className="flex flex-col bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 backdrop-blur-sm shadow-sm transition-all hover:bg-zinc-800/50 hover:border-zinc-700">
      <div className="flex items-center gap-2 text-zinc-400 mb-2">
        {icon}
        <span className="text-xs font-medium uppercase tracking-wider">{title}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-white tracking-tight">{value}</span>
        {unit && <span className="text-sm text-zinc-500 font-medium">{unit}</span>}
      </div>
    </div>
  );
}

export default function AnalysisResults({ result }: AnalysisResultsProps) {
  const instruments = Object.entries(result.instruments);
  const metadata = result.metadata;

  if (!metadata) return null;

  return (
    <div className="fade-in space-y-6 w-full max-w-4xl mx-auto">
      
      {/* File Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-zinc-900 to-zinc-950 border border-zinc-800 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
            <Music className="w-6 h-6 text-zinc-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white max-w-[200px] md:max-w-xs truncate" title={result.filename}>
              {result.filename}
            </h2>
            <div className="flex gap-2 mt-1">
              <Badge variant="secondary" className="text-xs bg-zinc-800 text-zinc-300">
                {formatDuration(result.duration_seconds)}
              </Badge>
              <Badge variant="outline" className="text-xs border-zinc-700 text-zinc-400">
                Processed
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 shrink-0">
          <div className="flex flex-col items-end mr-4">
            <span className="text-xs text-zinc-500 uppercase font-semibold">BPM</span>
            <span className="text-xl font-black text-purple-400">{metadata.tempo_bpm}</span>
          </div>
          <div className="flex flex-col items-end mr-4">
            <span className="text-xs text-zinc-500 uppercase font-semibold">Key</span>
            <span className="text-xl font-black text-blue-400">{metadata.key} {metadata.scale}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-zinc-500 uppercase font-semibold">Signature</span>
            <span className="text-xl font-black text-pink-400">{metadata.time_signature}</span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="instruments" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-zinc-900 border border-zinc-800">
          <TabsTrigger value="instruments">Instruments</TabsTrigger>
          <TabsTrigger value="audio">Audio Features</TabsTrigger>
          <TabsTrigger value="structure">Structure</TabsTrigger>
        </TabsList>
        
        <TabsContent value="instruments" className="mt-4 space-y-4">
          <Card className="bg-zinc-950 border-zinc-800 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AudioWaveform className="w-5 h-5 text-purple-400" />
                Detected Instruments
              </CardTitle>
              <CardDescription>
                AI confidence scores for individual instruments present in the mix.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {instruments.map(([name, percentage]) => (
                  <div key={name} className="group">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        {INSTRUMENT_ICONS[name] || <Disc3 className="w-4 h-4" />}
                        <span className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors">
                          {name}
                        </span>
                      </div>
                      <span className="text-sm font-bold tracking-tight text-zinc-400 group-hover:text-white">
                        {percentage}%
                      </span>
                    </div>
                    <div className="h-3 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800 relative">
                      <div 
                        className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out ${INSTRUMENT_COLORS[name] || "bg-zinc-500"}`}
                        style={{ width: `${percentage}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audio" className="mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard title="Energy" value={Math.round(metadata.energy * 100)} unit="%" icon={<Activity className="w-4 h-4 text-orange-400" />} />
            <MetricCard title="Danceability" value={Math.round(metadata.danceability * 100)} unit="%" icon={<Music className="w-4 h-4 text-pink-400" />} />
            <MetricCard title="Acousticness" value={Math.round(metadata.acousticness * 100)} unit="%" icon={<Guitar className="w-4 h-4 text-green-400" />} />
            <MetricCard title="Loudness" value={metadata.loudness_db} unit="dB" icon={<Waves className="w-4 h-4 text-blue-400" />} />
            
            <MetricCard title="Brightness" value={Math.round(metadata.brightness * 100)} unit="%" icon={<Activity className="w-4 h-4 text-yellow-400" />} />
            <MetricCard title="Instrumental" value={Math.round(metadata.instrumentalness * 100)} unit="%" icon={<Piano className="w-4 h-4 text-purple-400" />} />
            <MetricCard title="Spectral Centroid" value={Math.round(metadata.spectral_centroid)} unit="Hz" icon={<BarChart2 className="w-4 h-4 text-cyan-400" />} />
            <MetricCard title="RMS Energy" value={metadata.rms_energy.toFixed(3)} icon={<Activity className="w-4 h-4 text-red-400" />} />
          </div>
        </TabsContent>

        <TabsContent value="structure" className="mt-4">
           <Card className="bg-zinc-950 border-zinc-800 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ListMusic className="w-5 h-5 text-indigo-400" />
                Song Structure
              </CardTitle>
              <CardDescription>
                AI-detected sections of the track.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result.sections ? (
                <div className="relative h-24 w-full bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden mt-4">
                  {result.sections.map((section, idx) => {
                    const width = ((section.end - section.start) / result.duration_seconds) * 100;
                    const left = (section.start / result.duration_seconds) * 100;
                    const colors = ["bg-indigo-500/20", "bg-purple-500/20", "bg-pink-500/20", "bg-orange-500/20", "bg-blue-500/20"];
                    const color = colors[idx % colors.length];
                    const borderColors = ["border-indigo-500/50", "border-purple-500/50", "border-pink-500/50", "border-orange-500/50", "border-blue-500/50"];
                    const borderColor = borderColors[idx % borderColors.length];

                    return (
                      <div 
                        key={idx}
                        className={`absolute top-0 bottom-0 ${color} border-l border-r ${borderColor} flex flex-col items-center justify-center transition-all hover:brightness-125 cursor-default`}
                        style={{ width: `${width}%`, left: `${left}%` }}
                        title={`${section.label} (${formatDuration(section.start)} - ${formatDuration(section.end)})`}
                      >
                        <span className="text-[10px] uppercase font-bold text-white/70 tracking-widest truncate px-1 max-w-full">
                          {section.label}
                        </span>
                        <span className="text-[9px] text-white/40 mt-1 hidden md:block">
                          {formatDuration(section.start)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-zinc-500 text-sm">No structural sections detected.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
