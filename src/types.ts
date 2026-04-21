export type SubjectId = 'quant' | 'reasoning' | 'english' | 'ga';

export interface SubTopic {
  id: string;
  name: string;
  parentTopicId: string;
  subjectId?: SubjectId;
  isCustom?: boolean;
}

export interface Topic {
  id: string;
  name: string;
  subtopics: SubTopic[];
}

export interface Subject {
  id: SubjectId;
  name: string;
  topics: Topic[];
  color: string;
}

export interface UserProgress {
  topicId: string;
  subjectId: SubjectId;
  lectures: boolean;
  notes: boolean;
  pyqs: boolean;
  sliderValue: number;
}

export interface UserProfile {
  uid: string;
  displayName: string | null;
  photoURL: string | null;
  streak: number;
  lastActiveDate: string | null;
}

export interface DailyLog {
  id: string;
  date: string;
  topicsCompleted: string[];
}
