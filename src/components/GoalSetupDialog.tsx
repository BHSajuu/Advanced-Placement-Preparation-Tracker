import React, { useState } from 'react';
import { X, Target, Plus, Trash2, Database, Code, Globe, Network, MessageSquare, Cpu, Mic } from 'lucide-react';
import { UserGoals, DSATopic } from '../types';

interface GoalSetupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goals: UserGoals) => void;
  existingGoals?: UserGoals;
}

export const GoalSetupDialog: React.FC<GoalSetupDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  existingGoals
}) => {
  const [goals, setGoals] = useState<UserGoals>(existingGoals || {
    dsaQuestions: 400,
    dsaTopics: [
      { name: 'Arrays & Strings', targetQuestions: 50 },
      { name: 'Linked Lists', targetQuestions: 30 },
      { name: 'Stacks & Queues', targetQuestions: 25 },
      { name: 'Trees & Binary Search Trees', targetQuestions: 40 },
      { name: 'Graphs', targetQuestions: 35 },
      { name: 'Dynamic Programming', targetQuestions: 45 },
      { name: 'Sorting & Searching', targetQuestions: 30 },
      { name: 'Hash Tables', targetQuestions: 25 },
      { name: 'Heaps & Priority Queues', targetQuestions: 20 },
      { name: 'Backtracking', targetQuestions: 25 },
      { name: 'Greedy Algorithms', targetQuestions: 20 },
      { name: 'Two Pointers & Sliding Window', targetQuestions: 30 },
      { name: 'Bit Manipulation', targetQuestions: 15 },
      { name: 'Math & Number Theory', targetQuestions: 20 },
      { name: 'System Design Coding', targetQuestions: 10 }
    ],
    webDevProjects: ['E-commerce Platform', 'Task Management App'],
    systemDesignCases: [
      'Design Twitter',
      'Design URL Shortener',
      'Design Chat System',
      'Design Video Streaming',
      'Design Search Engine'
    ],
    mockInterviews: 20,
    dataScienceTutorials: 50,
    dataScienceTopics: [
      { name: 'Python for Data Science', targetTutorials: 10 },
      { name: 'Data Visualization with Matplotlib', targetTutorials: 5 },
      { name: 'Pandas for Data Analysis', targetTutorials: 8 },
      { name: 'Machine Learning Basics', targetTutorials: 12 },
      { name: 'Deep Learning Fundamentals', targetTutorials: 10 }
    ],
    csFundamentalsChapters: [
      'Operating Systems: Process Management',
      'Database Systems: SQL Fundamentals',
      'Computer Networks: TCP/IP',
      'Data Structures: Trees and Graphs'
    ],
    englishSpeakingSessions: 30
  });

  const [newProject, setNewProject] = useState('');
  const [newCase, setNewCase] = useState('');
  const [newChapter, setNewChapter] = useState('');
  const [newDSATopic, setNewDSATopic] = useState({ name: '', targetQuestions: 20, description: '' });
  const [newDSTopic, setNewDSTopic] = useState({ name: '', targetTutorials: 20 });

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(goals);
    onClose();
  };

  const addProject = () => {
    if (newProject.trim()) {
      setGoals({
        ...goals,
        webDevProjects: [...goals.webDevProjects, newProject.trim()]
      });
      setNewProject('');
    }
  };

  const removeProject = (index: number) => {
    setGoals({
      ...goals,
      webDevProjects: goals.webDevProjects.filter((_, i) => i !== index)
    });
  };

  const addCase = () => {
    if (newCase.trim()) {
      setGoals({
        ...goals,
        systemDesignCases: [...goals.systemDesignCases, newCase.trim()]
      });
      setNewCase('');
    }
  };

  const removeCase = (index: number) => {
    setGoals({
      ...goals,
      systemDesignCases: goals.systemDesignCases.filter((_, i) => i !== index)
    });
  };

  const addChapter = () => {
    if (newChapter.trim()) {
      setGoals({
        ...goals,
        csFundamentalsChapters: [...goals.csFundamentalsChapters, newChapter.trim()]
      });
      setNewChapter('');
    }
  };

  const removeChapter = (index: number) => {
    setGoals({
      ...goals,
      csFundamentalsChapters: goals.csFundamentalsChapters.filter((_, i) => i !== index)
    });
  };

  const addDSATopic = () => {
    if (newDSATopic.name.trim() && newDSATopic.targetQuestions > 0) {
      setGoals({
        ...goals,
        dsaTopics: [...goals.dsaTopics, { ...newDSATopic, name: newDSATopic.name.trim() }]
      });
      setNewDSATopic({ name: '', targetQuestions: 20, description: '' });
    }
  };

  const removeDSATopic = (index: number) => {
    setGoals({
      ...goals,
      dsaTopics: goals.dsaTopics.filter((_, i) => i !== index)
    });
  };

  const updateDSATopic = (index: number, field: keyof DSATopic, value: string | number) => {
    const updatedTopics = [...goals.dsaTopics];
    updatedTopics[index] = { ...updatedTopics[index], [field]: value };
    setGoals({ ...goals, dsaTopics: updatedTopics });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto no-scrollbar shadow-lg">
        <div className="sticky top-0 bg-gray-800 p-6 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Target className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-bold text-white">
              {existingGoals ? 'Update Your Goals' : 'Set Your 60-Day Goals'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* DSA Foundation with Topics */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Code className="w-5 h-5 text-blue-500" />
              DSA Foundation (Topic-Based Tracking)
            </h3>

            <div className="flex items-center gap-3 mb-4">
              <label className="text-gray-300">Overall Target Questions:</label>
              <input
                type="number"
                min="1"
                max="1000"
                value={goals.dsaQuestions}
                onChange={(e) => setGoals({ ...goals, dsaQuestions: parseInt(e.target.value) || 0 })}
                className="px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 w-24"
              />
              <span className="text-gray-400">questions</span>
            </div>

            <div className="space-y-3">
              <h4 className="text-md font-medium text-gray-300">DSA Topics & Targets</h4>
              <div className="grid gap-3 max-h-60 overflow-y-auto achievement-scrollbar">
                {goals.dsaTopics.map((topic, index) => (
                  <div key={index} className="bg-gray-700 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={topic.name}
                        onChange={(e) => updateDSATopic(index, 'name', e.target.value)}
                        className="flex-1 px-2 py-1 bg-gray-600 text-white rounded border border-gray-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="Topic name"
                      />
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={topic.targetQuestions}
                        onChange={(e) => updateDSATopic(index, 'targetQuestions', parseInt(e.target.value) || 1)}
                        className="w-16 px-2 py-1 bg-gray-600 text-white rounded border border-gray-500 focus:ring-1 focus:ring-blue-500"
                      />
                      <span className="text-xs text-gray-400">Q</span>
                      <button
                        onClick={() => removeDSATopic(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-700 p-3 rounded-lg border-2 border-dashed border-gray-600">
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newDSATopic.name}
                    onChange={(e) => setNewDSATopic({ ...newDSATopic, name: e.target.value })}
                    placeholder="New topic name..."
                    className="flex-1 px-2 py-1 bg-gray-600 text-white rounded border border-gray-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newDSATopic.targetQuestions}
                    onChange={(e) => setNewDSATopic({ ...newDSATopic, targetQuestions: parseInt(e.target.value) || 1 })}
                    className="w-16 px-2 py-1 bg-gray-600 text-white rounded border border-gray-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    onClick={addDSATopic}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <input
                  type="text"
                  value={newDSATopic.description}
                  onChange={(e) => setNewDSATopic({ ...newDSATopic, description: e.target.value })}
                  placeholder="Topic description (optional)..."
                  className="w-full px-2 py-1 bg-gray-600 text-white rounded border border-gray-500 focus:ring-1 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Web Development Projects */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-green-500" />
              Web Development Projects
            </h3>
            <div className="space-y-2">
              {goals.webDevProjects.map((project, index) => (
                <div key={index} className="flex items-center gap-2 bg-gray-700 p-2 rounded-lg">
                  <span className="text-white flex-1">{project}</span>
                  <button
                    onClick={() => removeProject(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newProject}
                  onChange={(e) => setNewProject(e.target.value)}
                  placeholder="Add new project..."
                  className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && addProject()}
                />
                <button
                  onClick={addProject}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* System Design Cases */}
          <div className="space-y-3">

            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Network className="w-5 h-5 text-yellow-500" />
              System Design Case Studies
            </h3>
            <div className="space-y-2">
              {goals.systemDesignCases.map((caseStudy, index) => (
                <div key={index} className="flex items-center gap-2 bg-gray-700 p-2 rounded-lg">
                  <span className="text-white flex-1">{caseStudy}</span>
                  <button
                    onClick={() => removeCase(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCase}
                  onChange={(e) => setNewCase(e.target.value)}
                  placeholder="Add new case study..."
                  className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && addCase()}
                />
                <button
                  onClick={addCase}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Mock Interviews */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-pink-500" />
              Mock Interviews
            </h3>
            <div className="flex items-center gap-3">
              <label className="text-gray-300">Target Sessions:</label>
              <input
                type="number"
                min="1"
                max="100"
                value={goals.mockInterviews}
                onChange={(e) => setGoals({ ...goals, mockInterviews: parseInt(e.target.value) || 0 })}
                className="px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 w-24"
              />
              <span className="text-gray-400">sessions</span>
            </div>
          </div>

          {/* Data Science (Topic‑Based Tracking) */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-purple-500" />
              Data Science (Topic‑Based)
            </h3>
            <div className="flex items-center gap-3 mb-4">
              <label className="text-gray-300">Overall Target Tutorials:</label>
              <input
                type="number"
                min="1"
                max="1000"
                value={goals.dataScienceTutorials}
                onChange={(e) => setGoals({ ...goals, dataScienceTutorials: parseInt(e.target.value) || 0 })}
                className="px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 w-24"
              />
              <span className="text-gray-400">tutorials</span>
            </div>
            <div className="space-y-3">
              <h4 className="text-md font-medium text-gray-300">DS Topics & Targets</h4>
              <div className="grid gap-3 max-h-60 overflow-y-auto achievement-scrollbar">
                {goals.dataScienceTopics?.map((topic, idx) => (
                  <div key={idx} className="bg-gray-700 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={topic.name}
                        onChange={(e) => {
                          const t = [...goals.dataScienceTopics];
                          t[idx].name = e.target.value;
                          setGoals({ ...goals, dataScienceTopics: t });
                        }}
                        className="flex-1 px-2 py-1 bg-gray-600 text-white rounded border border-gray-500 focus:ring-1 focus:ring-purple-500"
                        placeholder="Topic name"
                      />
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={topic.targetTutorials}
                        onChange={(e) => {
                          const t = [...goals.dataScienceTopics];
                          t[idx].targetTutorials = parseInt(e.target.value) || 1;
                          setGoals({ ...goals, dataScienceTopics: t });
                        }}
                        className="w-16 px-2 py-1 bg-gray-600 text-white rounded border border-gray-500 focus:ring-1 focus:ring-purple-500"
                      />
                      <span className="text-xs text-gray-400">Tuts</span>
                      <button
                        onClick={() => {
                          const t = goals.dataScienceTopics.filter((_, i) => i !== idx);
                          setGoals({ ...goals, dataScienceTopics: t });
                        }}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>


              {/* Add new DS topic */}
              <div className="bg-gray-700 p-3 rounded-lg border-2 border-dashed border-gray-600">
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newDSTopic.name}
                    onChange={(e) => setNewDSTopic({ ...newDSTopic, name: e.target.value })}
                    placeholder="New topic name..."
                    className="flex-1 px-2 py-1 bg-gray-600 text-white rounded border border-gray-500 focus:ring-1 focus:ring-purple-500"
                  />
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newDSTopic.targetTutorials}
                    onChange={(e) => setNewDSTopic({ ...newDSTopic, targetTutorials: parseInt(e.target.value) || 1 })}
                    className="w-16 px-2 py-1 bg-gray-600 text-white rounded border border-gray-500 focus:ring-1 focus:ring-purple-500"
                  />
                  <button
                    onClick={() => {
                      if (newDSTopic.name.trim()) {
                        setGoals({
                          ...goals,
                          dataScienceTopics: [
                            ...goals.dataScienceTopics,
                            { ...newDSTopic, name: newDSTopic.name.trim() }
                          ]
                        });
                        setNewDSTopic({ name: '', targetTutorials: 5 });
                      }
                    }}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </div>
          </div>


          {/* CS Fundamentals */}
          <div className="space-y-3">

            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-red-500" />
              CS Fundamentals Chapters</h3>
            <div className="space-y-2">
              {goals.csFundamentalsChapters.map((chapter, index) => (
                <div key={index} className="flex items-center gap-2 bg-gray-700 p-2 rounded-lg">
                  <span className="text-white flex-1">{chapter}</span>
                  <button
                    onClick={() => removeChapter(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newChapter}
                  onChange={(e) => setNewChapter(e.target.value)}
                  placeholder="Add new chapter..."
                  className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && addChapter()}
                />
                <button
                  onClick={addChapter}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* English Speaking */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Mic className="w-5 h-5 text-indigo-500" />
              English Speaking Practice
            </h3>
            <div className="flex items-center gap-3">
              <label className="text-gray-300">Target Sessions:</label>
              <input
                type="number"
                min="1"
                max="100"
                value={goals.englishSpeakingSessions}
                onChange={(e) => setGoals({ ...goals, englishSpeakingSessions: parseInt(e.target.value) || 0 })}
                className="px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 w-24"
              />
              <span className="text-gray-400">sessions</span>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-800 p-6 border-t border-gray-700 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Save Goals
          </button>
        </div>
      </div>
    </div>
  );
};