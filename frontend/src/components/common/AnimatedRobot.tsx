import React from 'react';

interface AnimatedRobotProps {
  delay?: number;
  variant?: 'demonstrator' | 'coder' | 'analyzer' | 'assistant';
}

const AnimatedRobot: React.FC<AnimatedRobotProps> = ({ 
  delay = 0, 
  variant = 'demonstrator' 
}) => {
  const config = {
    demonstrator: {
      color: 'var(--primary)',
      secondaryColor: 'var(--primary-light)',
      action: 'Demonstrating',
      codes: ['AI.process()', 'neural.train()']
    },
    coder: {
      color: 'var(--primary)',
      secondaryColor: 'var(--primary-light)',
      action: 'Coding',
      codes: ['code.analyze()', 'ml.predict()']
    },
    analyzer: {
      color: 'var(--primary)',
      secondaryColor: 'var(--primary-light)',
      action: 'Analyzing',
      codes: ['data.process()', 'ai.learn()']
    },
    assistant: {
      color: 'var(--primary)',
      secondaryColor: 'var(--primary-light)',
      action: 'Assisting',
      codes: ['help.user()', 'bot.respond()']
    }
  };

  const getVariantConfig = () => {
    switch (variant) {
      case 'demonstrator':
        return config.demonstrator;
      case 'coder':
        return config.coder;
      case 'analyzer':
        return config.analyzer;
      case 'assistant':
        return config.assistant;
      default:
        return {
          action: 'Processing',
          color: '#3b82f6',
          secondaryColor: '#f48048',
          animation: 'default',
          codes: ['ai.process()', 'task.execute()', 'result.deliver()']
        };
    }
  };

  const variantConfig = getVariantConfig();

  return (
    <div 
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Simplified Background AI Grid */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="border border-accent-500"
            />
          ))}
        </div>
      </div>

      {/* Main Robot */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <svg
          width="180"
          height="180"
          viewBox="0 0 180 180"
          className="opacity-80"
        >
          {/* Robot Body */}
          <g>
            {/* Main Body */}
            <rect
              x="60"
              y="80"
              width="60"
              height="70"
              rx="15"
              fill={variantConfig.color}
              className="opacity-90"
            />
            
            {/* Head */}
            <rect
              x="65"
              y="40"
              width="50"
              height="45"
              rx="20"
              fill={variantConfig.color}
              className="opacity-95"
            />
            
            {/* Eyes */}
            <circle cx="75" cy="55" r="6" fill="#ffffff" />
            <circle cx="105" cy="55" r="6" fill="#ffffff" />
            <circle 
              cx="75" 
              cy="55" 
              r="3" 
              fill={variantConfig.secondaryColor}
            />
            <circle 
              cx="105" 
              cy="55" 
              r="3" 
              fill={variantConfig.secondaryColor}
            />
            
            {/* Arms */}
            <rect x="35" y="85" width="25" height="12" rx="6" fill={variantConfig.color} />
            <rect x="120" y="85" width="25" height="12" rx="6" fill={variantConfig.color} />
            
            {/* Legs */}
            <rect x="70" y="150" width="12" height="20" rx="6" fill={variantConfig.color} />
            <rect x="98" y="150" width="12" height="20" rx="6" fill={variantConfig.color} />
            
            {/* Chest Panel */}
            <rect x="75" y="95" width="30" height="25" rx="5" fill="rgba(0,0,0,0.2)" />
            <circle cx="80" cy="102" r="2" fill="#10b981" />
            <circle cx="90" cy="102" r="2" fill={variantConfig.secondaryColor} />
            <circle cx="100" cy="102" r="2" fill="#3b82f6" />
            
            {/* Activity Text */}
            <text
              x="90"
              y="115"
              textAnchor="middle"
              fontSize="6"
              fill="white"
              className="font-mono"
            >
              {variant.toUpperCase()}
            </text>
          </g>
        </svg>

        {/* Simplified Status Indicator */}
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
          <div className="bg-black/60 rounded-full px-3 py-1 border border-accent-400/30">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-accent-400 rounded-full"></div>
              <span className="text-xs font-mono text-accent-300">
                {variantConfig.action}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedRobot; 