import React, { useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { 
  collection, 
  query, 
  onSnapshot, 
  setDoc, 
  doc, 
  updateDoc,
  serverTimestamp,
  getDoc
} from 'firebase/firestore';
import { auth, db, signInWithGoogle } from './lib/firebase';
import { UserProgress, SubjectId, SubTopic } from './types';
import { SYLLABUS } from './lib/syllabus';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Flame, 
  Settings, 
  ChevronRight, 
  LogOut,
  Search,
  Bell,
  Plus
} from 'lucide-react';

// Components
import ProgressDashboard from './components/ProgressDashboard';
import TopicCard from './components/TopicCard';
import TopicModal from './components/TopicModal';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'syllabus'>('dashboard');
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>('quant');
  const [progressData, setProgressData] = useState<Record<string, UserProgress>>({});
  const [customSyllabus, setCustomSyllabus] = useState<SubTopic[]>([]);
  const [userProfile, setUserProfile] = useState<{ streak: number }>({ streak: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<SubTopic | null>(null);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Sync Progress Data
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'users', user.uid, 'progress'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Record<string, UserProgress> = {};
      snapshot.forEach(doc => {
        data[doc.id] = doc.data() as UserProgress;
      });
      setProgressData(data);
    });

    const profileSub = onSnapshot(doc(db, 'users', user.uid), (docS) => {
      if (docS.exists()) {
        setUserProfile({ streak: docS.data().streak || 0 });
      }
    });

    const customSub = onSnapshot(collection(db, 'users', user.uid, 'customSyllabus'), (snapshot) => {
      const custom: SubTopic[] = [];
      snapshot.forEach(doc => custom.push({ ...doc.data(), id: doc.id } as SubTopic));
      setCustomSyllabus(custom);
    });

    return () => {
      unsubscribe();
      profileSub();
      customSub();
    };
  }, [user]);

  const saveCustomTopic = async (topic: Partial<SubTopic>) => {
    if (!user) return;
    const id = topic.id || Math.random().toString(36).substr(2, 9);
    const ref = doc(db, 'users', user.uid, 'customSyllabus', id);
    await setDoc(ref, {
      ...topic,
      id,
      isCustom: true
    }, { merge: true });
  };

  const deleteCustomTopic = async (topicId: string) => {
    if (!user) return;
    // Delete from custom syllabus
    const ref = doc(db, 'users', user.uid, 'customSyllabus', topicId);
    // Also cleanup progress if any
    const progRef = doc(db, 'users', user.uid, 'progress', topicId);
    
    // Using a simple sequence for now as we don't have batching util yet
    const { deleteDoc } = await import('firebase/firestore');
    await deleteDoc(ref);
    await deleteDoc(progRef);
  };

  const updateProgress = async (topicId: string, subjectId: SubjectId, updates: Partial<UserProgress>) => {
    if (!user) return;

    const topicRef = doc(db, 'users', user.uid, 'progress', topicId);
    const existing = progressData[topicId];

    if (!existing) {
      await setDoc(topicRef, {
        topicId,
        subjectId,
        lectures: false,
        notes: false,
        pyqs: false,
        sliderValue: 0,
        updatedAt: new Date().toISOString(),
        ...updates
      });
    } else {
      await updateDoc(topicRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    }

    // Update streak logic (simplified for demo)
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      await setDoc(userRef, { uid: user.uid, email: user.email, streak: 1, lastActiveDate: new Date().toISOString() });
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="w-8 h-8 border-4 border-zinc-900 dark:border-zinc-100 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-6 text-center">
        <div className="w-20 h-20 bg-zinc-900 rounded-2xl flex items-center justify-center mb-8 shadow-2xl rotate-3">
          <BookOpen className="text-white" size={40} />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-2 text-zinc-900 dark:text-zinc-100">SSC CGL Prep</h1>
        <p className="text-zinc-500 max-w-sm mb-12">Track your syllabus, mark progress, and crack the exam with visualized consistency.</p>
        
        <button 
          onClick={signInWithGoogle}
          className="w-full max-w-xs flex items-center justify-center gap-3 bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 text-white font-semibold py-4 rounded-2xl shadow-lg hover:opacity-90 transition-all active:scale-95"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="" />
          Join with Google
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-32 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
            <BookOpen className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">SSC Rocket</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Tier-1 SSC CGL 2024</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 border border-slate-200">
            <Bell size={18} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white"></span>
          </button>
          <button 
            onClick={() => auth.signOut()}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 border border-slate-200"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto p-6 space-y-8">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' ? (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="mb-8">
                <p className="text-slate-500 text-sm font-medium">Welcome back,</p>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">{user.displayName?.split(' ')[0]} 👋</h2>
              </div>
              <ProgressDashboard allProgress={progressData} streak={userProfile.streak} />
            </motion.div>
          ) : (
            <motion.div 
              key="syllabus"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text"
                    placeholder="Search syllabus..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all shadow-sm"
                  />
                </div>
                <button 
                  onClick={() => {
                    setEditingTopic(null);
                    setIsModalOpen(true);
                  }}
                  className="w-14 h-14 flex items-center justify-center bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100 hover:opacity-90 active:scale-95 transition-all"
                >
                  <Plus size={24} />
                </button>
              </div>

              {/* Subject Tabs */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {SYLLABUS.map((subj) => (
                  <button
                    key={subj.id}
                    onClick={() => setSelectedSubject(subj.id)}
                    className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedSubject === subj.id 
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                        : 'bg-white border border-slate-200 text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {subj.name.split(' ')[0]}
                  </button>
                ))}
              </div>

              {/* Topics List */}
              <div className="space-y-8">
                {SYLLABUS.find(s => s.id === selectedSubject)?.topics.map(topic => {
                  const preloadedOnes = topic.subtopics;
                  const customOnes = customSyllabus.filter(cs => cs.parentTopicId === topic.id);
                  const combined = [...preloadedOnes, ...customOnes].filter(st => 
                    st.name.toLowerCase().includes(searchQuery.toLowerCase())
                  );
                  
                  if (combined.length === 0) return null;

                  return (
                    <div key={topic.id} className="space-y-4">
                      <div className="flex items-center justify-between px-2">
                        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">{topic.name}</h3>
                        <span className="text-[10px] font-mono text-slate-400 uppercase">Weight: L(40%) N(20%) P(40%)</span>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        {combined.map(sub => (
                          <TopicCard
                            key={sub.id}
                            name={sub.name}
                            isCustom={sub.isCustom}
                            onEdit={sub.isCustom ? () => {
                              setEditingTopic(sub);
                              setIsModalOpen(true);
                            } : undefined}
                            onDelete={sub.isCustom ? () => deleteCustomTopic(sub.id) : undefined}
                            color={SYLLABUS.find(s => s.id === selectedSubject)?.color || '#4f46e5'}
                            progress={progressData[sub.id] || { 
                              topicId: sub.id, 
                              subjectId: selectedSubject, 
                              lectures: false, 
                              notes: false, 
                              pyqs: false, 
                              sliderValue: 0 
                            }}
                            onUpdate={(updates) => updateProgress(sub.id, selectedSubject, updates)}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-sm bg-white/90 backdrop-blur-xl rounded-2xl p-2 border border-slate-200 shadow-xl shadow-slate-200/50 flex justify-between items-center z-50">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all ${
            activeTab === 'dashboard' 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <LayoutDashboard size={20} />
          {activeTab === 'dashboard' && <span className="font-bold text-sm">Dashboard</span>}
        </button>
        
        <button 
          onClick={() => setActiveTab('syllabus')}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all ${
            activeTab === 'syllabus' 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <BookOpen size={20} />
          {activeTab === 'syllabus' && <span className="font-bold text-sm">Syllabus</span>}
        </button>

        <button className="flex items-center gap-2 px-4 py-3 rounded-xl text-slate-400 hover:text-slate-600">
          <Settings size={20} />
        </button>
      </nav>

      <TopicModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={saveCustomTopic}
        onDelete={deleteCustomTopic}
        editingTopic={editingTopic}
        defaultSubjectId={selectedSubject}
      />
    </div>
  );
}
