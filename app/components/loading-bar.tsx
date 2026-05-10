"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

/**
 * LoadingBar — Top-of-page progress bar that fires on route changes.
 * Inspired by YouTube/Linear loading indicators.
 */
export default function LoadingBar() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const startTimeout = setTimeout(() => setLoading(true), 0);
    const endTimeout = setTimeout(() => setLoading(false), 500);
    return () => {
      clearTimeout(startTimeout);
      clearTimeout(endTimeout);
    };
  }, [pathname]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ scaleX: 0, opacity: 1 }}
          animate={{ scaleX: 0.8, opacity: 1 }}
          exit={{ scaleX: 1, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed top-0 left-0 right-0 h-[2px] z-[9999] origin-left"
          style={{
            background: "linear-gradient(90deg, #a855f7, #06b6d4, #ec4899)",
          }}
        />
      )}
    </AnimatePresence>
  );
}
