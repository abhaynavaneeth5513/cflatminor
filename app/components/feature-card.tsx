"use client";

interface FeatureCardProps {
  emoji: string;
  title: string;
  description: string;
}

/**
 * FeatureCard — Showcases upcoming/current platform features
 */
export default function FeatureCard({
  emoji,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="feature-card">
      <div className="flex items-start gap-3">
        <span className="text-xl flex-shrink-0 mt-0.5">{emoji}</span>
        <div>
          <h3 className="text-sm font-semibold text-zinc-200">{title}</h3>
          <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
