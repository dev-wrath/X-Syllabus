import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, Trash2 } from 'lucide-react';
import { SubjectId, SubTopic } from '../types';
import { SYLLABUS } from '../lib/syllabus';

interface TopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (topic: Partial<SubTopic>) => void;
  onDelete?: (id: string) => void;
  editingTopic?: SubTopic | null;
  defaultSubjectId: SubjectId;
}

export default function TopicModal({ 
  isOpen, 
  onClose, 
  onSave, 
  onDelete, 
  editingTopic,
  defaultSubjectId
}: TopicModalProps) {
  const [name, setName] = useState('');
  const [subjectId, setSubjectId] = useState<SubjectId>(defaultSubjectId);
  const [parentTopicId, setParentTopicId] = useState('');

  useEffect(() => {
    if (editingTopic) {
      setName(editingTopic.name);
      setSubjectId(defaultSubjectId); // Simplified: mostly adding/editing within current context
      setParentTopicId(editingTopic.parentTopicId || '');
    } else {
      setName('');
      setSubjectId(defaultSubjectId);
      const firstTopic = SYLLABUS.find(s => s.id === defaultSubjectId)?.topics[0];
      setParentTopicId(firstTopic?.id || '');
    }
  }, [editingTopic, isOpen, defaultSubjectId]);

  if (!isOpen) return null;

  const currentSubjectTopics = SYLLABUS.find(s => s.id === subjectId)?.topics || [];

  const handleSave = () => {
    if (!name.trim() || !parentTopicId) return;
    onSave({
      name: name.trim(),
      subjectId: subjectId,
      parentTopicId,
      id: editingTopic?.id
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 overflow-hidden"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800">
              {editingTopic ? 'Edit Topic' : 'Add New Topic'}
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                Topic Name
              </label>
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Advanced Trigonometry"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all font-medium"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                Category Group
              </label>
              <select 
                value={parentTopicId}
                onChange={(e) => setParentTopicId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all font-medium appearance-none"
              >
                {currentSubjectTopics.map(topic => (
                  <option key={topic.id} value={topic.id}>{topic.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            {editingTopic && onDelete && (
              <button 
                onClick={() => {
                  onDelete(editingTopic.id);
                  onClose();
                }}
                className="flex-shrink-0 w-14 h-14 flex items-center justify-center bg-red-50 text-red-500 rounded-2xl border border-red-100 hover:bg-red-100 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            )}
            <button 
              onClick={handleSave}
              disabled={!name.trim()}
              className="flex-1 h-14 flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 hover:opacity-90 disabled:opacity-50 transition-all active:scale-95"
            >
              <Save size={20} />
              {editingTopic ? 'Save Changes' : 'Create Topic'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
