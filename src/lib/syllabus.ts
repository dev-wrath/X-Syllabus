import { Subject } from '../types';

const SYLLABUS_RAW: Subject[] = [
  {
    id: 'quant',
    name: 'Quantitative Aptitude',
    color: '#3b82f6', // blue
    topics: [
      {
        id: 'arithmetic',
        name: 'Arithmetic',
        subtopics: [
          { id: 'percentage', name: 'Percentage', parentTopicId: 'arithmetic' },
          { id: 'profit-loss', name: 'Profit & Loss', parentTopicId: 'arithmetic' },
          { id: 'si-ci', name: 'SI & CI', parentTopicId: 'arithmetic' },
          { id: 'ratio-proportion', name: 'Ratio & Proportion', parentTopicId: 'arithmetic' },
          { id: 'time-work', name: 'Time & Work', parentTopicId: 'arithmetic' },
          { id: 'time-speed-distance', name: 'Time, Speed & Distance', parentTopicId: 'arithmetic' },
          { id: 'average', name: 'Average', parentTopicId: 'arithmetic' },
          { id: 'mixture-alligation', name: 'Mixture & Alligation', parentTopicId: 'arithmetic' },
        ],
      },
      {
        id: 'advance-math',
        name: 'Advance Mathematics',
        subtopics: [
          { id: 'number-system', name: 'Number System', parentTopicId: 'advance-math' },
          { id: 'algebra', name: 'Algebra', parentTopicId: 'advance-math' },
          { id: 'geometry', name: 'Geometry', parentTopicId: 'advance-math' },
          { id: 'mensuration', name: 'Mensuration', parentTopicId: 'advance-math' },
          { id: 'trigonometry', name: 'Trigonometry', parentTopicId: 'advance-math' },
        ],
      },
      {
        id: 'data-interpretation',
        name: 'Data Interpretation',
        subtopics: [
          { id: 'tables-graphs', name: 'Tables & Graphs', parentTopicId: 'data-interpretation' },
        ],
      },
    ],
  },
  {
    id: 'reasoning',
    name: 'General Intelligence & Reasoning',
    color: '#8b5cf6', // violet
    topics: [
      {
        id: 'verbal-reasoning',
        name: 'Verbal Reasoning',
        subtopics: [
          { id: 'analogy', name: 'Analogy', parentTopicId: 'verbal-reasoning' },
          { id: 'classification', name: 'Classification', parentTopicId: 'verbal-reasoning' },
          { id: 'coding-decoding', name: 'Coding-Decoding', parentTopicId: 'verbal-reasoning' },
          { id: 'series', name: 'Series', parentTopicId: 'verbal-reasoning' },
          { id: 'blood-relation', name: 'Blood Relation', parentTopicId: 'verbal-reasoning' },
          { id: 'direction-sense', name: 'Direction Sense', parentTopicId: 'verbal-reasoning' },
          { id: 'ranking-order', name: 'Ranking & Order', parentTopicId: 'verbal-reasoning' },
          { id: 'missing-number', name: 'Missing Number', parentTopicId: 'verbal-reasoning' },
          { id: 'syllogism', name: 'Syllogism', parentTopicId: 'verbal-reasoning' },
          { id: 'venn-diagram', name: 'Venn Diagram', parentTopicId: 'verbal-reasoning' },
        ],
      },
      {
        id: 'non-verbal-reasoning',
        name: 'Non-Verbal Reasoning',
        subtopics: [
          { id: 'mirror-water-images', name: 'Mirror & Water Images', parentTopicId: 'non-verbal-reasoning' },
          { id: 'paper-folding', name: 'Paper Folding', parentTopicId: 'non-verbal-reasoning' },
          { id: 'embedded-figures', name: 'Embedded Figures', parentTopicId: 'non-verbal-reasoning' },
          { id: 'figure-completion', name: 'Figure Completion', parentTopicId: 'non-verbal-reasoning' },
        ],
      },
    ],
  },
  {
    id: 'english',
    name: 'English Language',
    color: '#ec4899', // pink
    topics: [
      {
        id: 'grammar',
        name: 'Grammar',
        subtopics: [
          { id: 'parts-of-speech', name: 'Parts of Speech', parentTopicId: 'grammar' },
          { id: 'subject-verb-agreement', name: 'Subject-Verb Agreement', parentTopicId: 'grammar' },
          { id: 'tenses', name: 'Tenses', parentTopicId: 'grammar' },
          { id: 'voice-narration', name: 'Active/Passive & Direct/Indirect', parentTopicId: 'grammar' },
          { id: 'error-spotting', name: 'Error Spotting', parentTopicId: 'grammar' },
        ],
      },
      {
        id: 'vocabulary',
        name: 'Vocabulary',
        subtopics: [
          { id: 'synonyms-antonyms', name: 'Synonyms & Antonyms', parentTopicId: 'vocabulary' },
          { id: 'one-word-substitution', name: 'One Word Substitution', parentTopicId: 'vocabulary' },
          { id: 'idioms-phrases', name: 'Idioms & Phrases', parentTopicId: 'vocabulary' },
          { id: 'spelling-check', name: 'Spelling Check', parentTopicId: 'vocabulary' },
        ],
      },
      {
        id: 'reading-comprehension',
        name: 'Reading & Comprehension',
        subtopics: [
          { id: 'cloze-test', name: 'Cloze Test', parentTopicId: 'reading-comprehension' },
          { id: 'reading-passages', name: 'Reading Passages', parentTopicId: 'reading-comprehension' },
          { id: 'para-jumbles', name: 'Para Jumbles', parentTopicId: 'reading-comprehension' },
        ],
      },
    ],
  },
  {
    id: 'ga',
    name: 'General Awareness',
    color: '#10b981', // emerald
    topics: [
      {
        id: 'history',
        name: 'History',
        subtopics: [
          { id: 'ancient-history', name: 'Ancient History', parentTopicId: 'history' },
          { id: 'medieval-history', name: 'Medieval History', parentTopicId: 'history' },
          { id: 'modern-history', name: 'Modern History', parentTopicId: 'history' },
        ],
      },
      {
        id: 'polity-geography',
        name: 'Polity & Geography',
        subtopics: [
          { id: 'indian-polity', name: 'Indian Polity', parentTopicId: 'polity-geography' },
          { id: 'indian-geography', name: 'Indian Geography', parentTopicId: 'polity-geography' },
          { id: 'world-geography', name: 'World Geography', parentTopicId: 'polity-geography' },
        ],
      },
      {
        id: 'science',
        name: 'Science',
        subtopics: [
          { id: 'physics', name: 'Physics', parentTopicId: 'science' },
          { id: 'chemistry', name: 'Chemistry', parentTopicId: 'science' },
          { id: 'biology', name: 'Biology', parentTopicId: 'science' },
        ],
      },
      {
        id: 'static-gk-current',
        name: 'Static GK & Current Affairs',
        subtopics: [
          { id: 'static-gk', name: 'Static GK', parentTopicId: 'static-gk-current' },
          { id: 'current-affairs', name: 'Current Affairs', parentTopicId: 'static-gk-current' },
          { id: 'economics', name: 'Economics', parentTopicId: 'static-gk-current' },
        ],
      },
    ],
  },
];

export const SYLLABUS = SYLLABUS_RAW;
