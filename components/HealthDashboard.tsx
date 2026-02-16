
import React, { useState, useEffect } from 'react';
import { getHealthRecommendations } from '../services/geminiService';
import { Pet, HealthRecommendation } from '../types';
import { Activity, ShieldAlert, Sparkles, ChevronRight } from 'lucide-react';

interface HealthDashboardProps {
  pet: Pet;
  limit?: number;
}

export const HealthDashboard: React.FC<HealthDashboardProps> = ({ pet, limit }) => {
  const [recommendations, setRecommendations] = useState<HealthRecommendation[]>([]);
  const [disclaimer, setDisclaimer] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInsights() {
      setLoading(true);
      const data = await getHealthRecommendations({
        breed: pet.breed,
        age: pet.age,
        conditions: pet.chronicConditions
      });
      if (data) {
        setRecommendations(data.recommendations);
        setDisclaimer(data.disclaimer);
      }
      setLoading(false);
    }
    fetchInsights();
  }, [pet]);

  const displayList = limit ? recommendations.slice(0, limit) : recommendations;

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="h-28 bg-white rounded-5xl shadow-sm animate-pulse" />
          ))}
        </div>
      ) : (
        displayList.map((rec, i) => (
          <div key={i} className="bg-white p-6 rounded-5xl border border-white shadow-sm hover:shadow-md transition-all flex gap-5 items-start group cursor-pointer">
            <div className={`p-4 rounded-3xl shrink-0 transition-transform group-hover:scale-110 ${
              rec.type === 'urgent' ? 'bg-rose-50 text-rose-500' : 
              rec.type === 'preventive' ? 'bg-primary/10 text-primary' : 
              'bg-blue-50 text-blue-500'
            }`}>
              {rec.type === 'urgent' ? <ShieldAlert className="w-6 h-6" /> : 
               rec.type === 'preventive' ? <Sparkles className="w-6 h-6" /> : 
               <Activity className="w-6 h-6" />}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-black text-secondary text-base leading-tight">{rec.title}</h4>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">{rec.message}</p>
            </div>
          </div>
        ))
      )}
      
      {!loading && !limit && disclaimer && (
        <div className="bg-secondary/5 p-5 rounded-4xl border border-secondary/10">
          <p className="text-[10px] text-slate-400 italic font-medium leading-relaxed">
            {disclaimer}
          </p>
        </div>
      )}
    </div>
  );
};
