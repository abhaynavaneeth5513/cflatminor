"use client";

import { useEffect, useCallback, useRef } from "react";

/**
 * CursorGlow — Tracks mouse position via CSS custom properties.
 * Uses requestAnimationFrame for buttery-smooth 60fps updates.
 * Zero re-renders — purely DOM manipulation.
 */
export default function CursorGlow() {
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: -200, y: -200 });

  const updatePosition = useCallback(() => {
    document.documentElement.style.setProperty("--cursor-x", `${mouseRef.current.x}px`);
    document.documentElement.style.setProperty("--cursor-y", `${mouseRef.current.y}px`);
  }, []);

  useEffect(() => {
    // Only enable on non-touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updatePosition);
    };

    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.body.classList.add("cursor-glow");

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.body.classList.remove("cursor-glow");
      cancelAnimationFrame(rafRef.current);
    };
  }, [updatePosition]);

  return null;
}
