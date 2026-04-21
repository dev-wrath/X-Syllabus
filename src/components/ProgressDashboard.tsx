import React from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart, Line
} from 'recharts';
import { motion } from 'motion/react';
import { Subject, UserProgress } from '../types';
import { SYLLABUS } from '../lib/syllabus';
import { Flame, Target, TrendingUp, Calendar } from 'lucide-react';

interface ProgressDashboardProps {
  allProgress: Record<string, UserProgress>;
  streak: number;
}

export default function ProgressDashboard({ allProgress, streak }: ProgressDashboardProps) {
  // Calculate stats
  const subjectStats = SYLLABUS.map(subject => {
    let subjectTotal = 0;
    let topicsCount = 0;

    subject.topics.forEach(topic => {
      topic.subtopics.forEach(sub => {
        topicsCount++;
        const p = allProgress[sub.id] || { lectures: false, notes: false, pyqs: false, sliderValue: 0 };
        const completion = (
          (p.lectures ? 40 : 0) +
          (p.notes ? 20 : 0) +
          (p.pyqs ? 40 : 0)
        );
        subjectTotal += completion;
      });
    });

    return {
      name: subject.name,
      shortName: subject.id.toUpperCase(),
      progress: topicsCount > 0 ? Math.round(subjectTotal / topicsCount) : 0,
      color: subject.color
    };
  });

  const overallProgress = Math.round(
    subjectStats.reduce((acc, s) => acc + s.progress, 0) / subjectStats.length
  );

  const pieData = [
    { name: 'Completed', value: overallProgress },
    { name: 'Remaining', value: 100 - overallProgress }
  ];

  return (
    <div className="space-y-6">
      {/* Header Cards */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-indigo-600 rounded-2xl p-6 text-white flex flex-col justify-between shadow-xl shadow-indigo-100"
        >
          <div className="flex justify-between items-start">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Target size={20} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Progress</span>
          </div>
          <div className="mt-6">
            <div className="text-4xl font-bold tracking-tight">{overallProgress}%</div>
            <div className="text-[10px] font-medium uppercase tracking-widest opacity-70 mt-1">Syllabus Mastered</div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-orange-50 border border-orange-100 rounded-2xl p-6 text-orange-700 flex flex-col justify-between shadow-sm"
        >
          <div className="flex justify-between items-start">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Flame size={20} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-orange-600 opacity-60">Streak</span>
          </div>
          <div className="mt-6">
            <div className="text-4xl font-bold tracking-tight">{streak} Days 🔥</div>
            <div className="text-[10px] font-medium uppercase tracking-widest text-orange-600 mt-1">Study Consistency</div>
          </div>
        </motion.div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 gap-6">
        {/* Subject Progress Bar Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-bold mb-6 flex items-center justify-between uppercase tracking-wider text-slate-400">
            <span className="flex items-center gap-2 text-slate-800"><TrendingUp size={16} /> Subject Progress</span>
            <span className="text-[10px] font-mono">Weighted Avg</span>
          </h3>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectStats} layout="vertical">
                <XAxis type="number" hide domain={[0, 100]} />
                <YAxis 
                  dataKey="shortName" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  width={35}
                  tick={{ fontSize: 10, fill: '#64748b', fontWeight: 700 }}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: '1px solid #e2e8f0', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    fontSize: '12px'
                  }}
                />
                <Bar 
                  dataKey="progress" 
                  radius={[0, 6, 6, 0]} 
                  barSize={16}
                >
                  {subjectStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} opacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4 py-4 border-t border-slate-50">
            {subjectStats.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }}></div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">{s.name}</span>
                <span className="text-[10px] font-mono ml-auto">{s.progress}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Completion Ring */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col items-center">
           <h3 className="text-sm font-bold mb-6 self-start flex items-center gap-2 uppercase tracking-wider text-slate-800">
            <Calendar size={16} /> Completion State
          </h3>
          <div className="h-[200px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={8}
                  dataKey="value"
                  startAngle={90}
                  endAngle={450}
                  stroke="none"
                >
                  <Cell fill="#4f46e5" />
                  <Cell fill="#f1f5f9" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-4xl font-bold tracking-tighter text-indigo-600">{overallProgress}%</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Mastery</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
