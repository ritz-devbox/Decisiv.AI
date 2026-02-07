
import React from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer 
} from 'recharts';
import { InfluenceVector } from '../types';

interface InfluenceRadarProps {
  vectors: InfluenceVector[];
}

const InfluenceRadar: React.FC<InfluenceRadarProps> = ({ vectors }) => {
  // Ensure we have at least 3 points for a radar chart
  const data = vectors.length >= 3 ? vectors : [
    ...vectors,
    { category: 'Neutral A', weight: 50, description: '' },
    { category: 'Neutral B', weight: 50, description: '' }
  ].slice(0, 5);

  return (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center relative group">
      <div className="absolute inset-0 bg-blue-500/5 blur-[120px] rounded-full opacity-50" />
      
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#1e293b" strokeDasharray="5 5" />
          <PolarAngleAxis 
            dataKey="category" 
            tick={{ fill: '#64748b', fontSize: 10, fontWeight: 800, letterSpacing: '0.1em' }}
          />
          <Radar
            name="Weight"
            dataKey="weight"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.2}
            strokeWidth={3}
          />
        </RadarChart>
      </ResponsiveContainer>
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="w-32 h-32 border border-blue-500/10 rounded-full animate-ping opacity-20" />
      </div>
    </div>
  );
};

export default InfluenceRadar;
