"use client";

import { memo } from "react";
import Header from "@/app/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Download, Trash2, Music, Activity } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const MOCK_DATA = [
  { id: "1", title: "Cyberpunk City Theme.wav", duration: "3:45", date: "2026-05-08", status: "Completed", bpm: 120, key: "Am" },
  { id: "2", title: "Acoustic_Guitar_Take4.mp3", duration: "1:20", date: "2026-05-07", status: "Completed", bpm: 85, key: "G" },
  { id: "3", title: "Vocal_Isolate_Stem.flac", duration: "4:02", date: "2026-05-06", status: "Processing", bpm: "--", key: "--" },
  { id: "4", title: "Lofi_Beat_Idea.wav", duration: "2:30", date: "2026-05-05", status: "Completed", bpm: 75, key: "Fm" },
  { id: "5", title: "Orchestral_Draft_v2.mp3", duration: "5:12", date: "2026-05-04", status: "Failed", bpm: "--", key: "--" },
] as const;

const STATUS_STYLES = {
  Completed: "border-green-500/30 text-green-400 bg-green-500/10",
  Processing: "border-blue-500/30 text-blue-400 bg-blue-500/10",
  Failed: "border-red-500/30 text-red-400 bg-red-500/10",
} as const;

function Dashboard() {
  return (
    <div className="min-h-screen bg-black text-foreground selection:bg-purple-500/30">
      <Header />
      
      <main className="pt-24 px-4 pb-20 container max-w-7xl mx-auto">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">My Studio Dashboard</h1>
            <p className="text-zinc-400">View and manage your analyzed tracks and generated stems.</p>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" className="border-zinc-700 text-white bg-zinc-900 hover:bg-zinc-800 hover:text-white">
              Export All Data
            </Button>
            <Link href="/" className="inline-flex items-center bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-600/20 px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200">
              <Music className="w-4 h-4 mr-2" />
              New Analysis
            </Link>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <Card className="bg-zinc-950 border-zinc-800 shadow-xl hover:border-zinc-700 transition-colors duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-zinc-400">Total Tracks</CardTitle>
              <Music className="w-4 h-4 text-zinc-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">128</div>
              <p className="text-xs text-zinc-500 mt-1">+14% from last month</p>
            </CardContent>
          </Card>
          <Card className="bg-zinc-950 border-zinc-800 shadow-xl hover:border-zinc-700 transition-colors duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-zinc-400">Processing Hours</CardTitle>
              <Activity className="w-4 h-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">42.5h</div>
              <p className="text-xs text-zinc-500 mt-1">Total server time used</p>
            </CardContent>
          </Card>
          <Card className="bg-zinc-950 border-zinc-800 shadow-xl md:col-span-2 bg-gradient-to-br from-purple-900/20 to-blue-900/20 relative overflow-hidden hover:border-zinc-700 transition-colors duration-200">
             <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-[40px] -mr-10 -mt-10" />
            <CardHeader>
              <CardTitle className="text-sm font-medium text-zinc-300">Pro Subscription</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between items-end">
              <div>
                <div className="text-2xl font-bold text-white">Active</div>
                <p className="text-xs text-zinc-400 mt-1">Renews on June 15, 2026</p>
              </div>
              <Button variant="secondary" size="sm" className="bg-white/10 text-white hover:bg-white/20 border-white/5">
                Manage Plan
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Card className="bg-zinc-950 border-zinc-800 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-xl">Recent Analyses</CardTitle>
              <CardDescription>A list of your recent tracks and their status.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader className="bg-zinc-900/50 hover:bg-zinc-900/50">
                  <TableRow className="border-zinc-800">
                    <TableHead className="w-[300px] text-zinc-400">Track Name</TableHead>
                    <TableHead className="text-zinc-400">Status</TableHead>
                    <TableHead className="text-zinc-400">Duration</TableHead>
                    <TableHead className="text-zinc-400">BPM</TableHead>
                    <TableHead className="text-zinc-400">Key</TableHead>
                    <TableHead className="text-zinc-400">Date</TableHead>
                    <TableHead className="text-right text-zinc-400">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_DATA.map((track) => (
                    <TableRow key={track.id} className="border-zinc-800/50 hover:bg-zinc-900/50 transition-colors duration-150 group">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-zinc-700 transition-colors duration-150">
                            <Music className="w-4 h-4 text-zinc-500" />
                          </div>
                          <span className="text-zinc-200">{track.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={STATUS_STYLES[track.status as keyof typeof STATUS_STYLES]}
                        >
                          {track.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-zinc-400">{track.duration}</TableCell>
                      <TableCell className="text-zinc-300 font-mono">{track.bpm}</TableCell>
                      <TableCell className="text-zinc-300 font-mono">{track.key}</TableCell>
                      <TableCell className="text-zinc-400">{track.date}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800">
                            <Play className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-red-400 hover:bg-zinc-800">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}

export default memo(Dashboard);
