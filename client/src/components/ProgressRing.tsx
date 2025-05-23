interface ProgressRingProps {
  progress: number;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export default function ProgressRing({ progress, size = 'medium', className }: ProgressRingProps) {
  const sizes = {
    small: { width: 16, height: 16, radius: 6, strokeWidth: 2 },
    medium: { width: 20, height: 20, radius: 8, strokeWidth: 2 },
    large: { width: 24, height: 24, radius: 10, strokeWidth: 3 },
  };

  const { width, height, radius, strokeWidth } = sizes[size];
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={`relative ${className}`} style={{ width: width * 4, height: height * 4 }}>
      <svg 
        className="transform -rotate-90" 
        width={width * 4} 
        height={height * 4}
      >
        {/* Background circle */}
        <circle
          cx={width * 2}
          cy={height * 2}
          r={radius * 2}
          stroke="rgba(148, 163, 184, 0.3)"
          strokeWidth={strokeWidth * 2}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={width * 2}
          cy={height * 2}
          r={radius * 2}
          stroke="hsl(var(--primary))"
          strokeWidth={strokeWidth * 2}
          fill="none"
          strokeDasharray={strokeDasharray * 2}
          strokeDashoffset={strokeDashoffset * 2}
          className="transition-all duration-1000 ease-out"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-bold text-slate-900 dark:text-white">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
}
