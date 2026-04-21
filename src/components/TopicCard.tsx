import React from 'react';
import { motion } from 'motion/react';
import { FileText, PlayCircle, BookOpen, Pencil, Trash2 } from 'lucide-react';
import { UserProgress } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TopicCardProps {
  name: string;
  progress: UserProgress;
  onUpdate: (updates: Partial<UserProgress>) => void | Promise<void>;
  onEdit?: () => void;
  onDelete?: () => void;
  color: string;
  isCustom?: boolean;
}

const TopicCard: React.FC<TopicCardProps> = ({ 
  name, 
  progress, 
  onUpdate, 
  onEdit,
  onDelete,
  color,
  isCustom 
}) => {
  const completion = (
    (progress.lectures ? 40 : 0) +
    (progress.notes ? 20 : 0) +
    (progress.pyqs ? 40 : 0)
  );

  return (
    <motion.div 
      layout
      className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 relative group"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="pr-8">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-slate-800 tracking-tight">{name}</h4>
            {isCustom && <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-500 text-[8px] font-bold rounded-md uppercase tracking-wider">Custom</span>}
          </div>
          <p className="text-[10px] font-mono text-slate-400 uppercase mt-0.5">Status: {completion}% Scored</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div 
            className="px-2 py-1 rounded-full text-[10px] font-bold"
            style={{ backgroundColor: `${color}15`, color }}
          >
            {completion}%
          </div>

          {(onEdit || onDelete) && (
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
               {onEdit && (
                <button 
                  onClick={onEdit}
                  className="p-1.5 text-slate-300 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-all"
                >
                  <Pencil size={14} />
                </button>
               )}
               {onDelete && (
                <button 
                  onClick={onDelete}
                  className="p-1.5 text-slate-300 hover:text-red-600 hover:bg-slate-50 rounded-lg transition-all"
                >
                  <Trash2 size={14} />
                </button>
               )}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => onUpdate({ lectures: !progress.lectures })}
          className={cn(
            "w-full flex items-center justify-between p-3 rounded-xl border transition-all",
            progress.lectures 
              ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
              : "bg-slate-50 border-slate-100 text-slate-600 hover:border-slate-200"
          )}
        >
          <div className="flex items-center gap-3">
            <PlayCircle size={18} className={progress.lectures ? "text-white" : "text-indigo-600"} />
            <span className="text-xs font-semibold">Video Lectures</span>
          </div>
          <span className={cn("text-[10px] font-bold", progress.lectures ? "text-indigo-100" : "text-slate-400")}>
            {progress.lectures ? '+40%' : 'WAITING'}
          </span>
        </button>

        <button
          onClick={() => onUpdate({ notes: !progress.notes })}
          className={cn(
            "w-full flex items-center justify-between p-3 rounded-xl border transition-all border-dashed",
            progress.notes
              ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
              : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
          )}
        >
          <div className="flex items-center gap-3">
            <FileText size={18} className={progress.notes ? "text-white" : "text-indigo-600"} />
            <span className="text-xs font-semibold">Revision Notes</span>
          </div>
          <span className={cn("text-[10px] font-bold", progress.notes ? "text-indigo-100" : "text-slate-400")}>
            {progress.notes ? '+20%' : 'PENDING'}
          </span>
        </button>

        <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
           <div className="flex items-center gap-3">
            <BookOpen size={18} className="text-indigo-600" />
            <span className="text-xs font-semibold">Practice PYQs</span>
          </div>
          <div className="flex items-center gap-3">
            <input 
              type="range"
              min="0"
              max="100"
              step="100" 
              value={progress.pyqs ? 100 : 0}
              onChange={() => onUpdate({ pyqs: !progress.pyqs })}
              className="w-16 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <span className="text-[10px] font-mono text-slate-500">{progress.pyqs ? '40%' : '0%'}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-50">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Manual Adjustment</span>
          <span className="text-[10px] font-mono text-indigo-600 font-bold">{progress.sliderValue}%</span>
        </div>
        <input 
          type="range"
          min="0"
          max="100"
          value={progress.sliderValue}
          onChange={(e) => onUpdate({ sliderValue: parseInt(e.target.value) })}
          className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
      </div>
    </motion.div>
  );
}

export default TopicCard;
