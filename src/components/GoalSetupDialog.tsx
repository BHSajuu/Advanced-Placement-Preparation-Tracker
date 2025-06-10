import React, { useState } from 'react';
import { X, Target, Plus, Trash2 } from 'lucide-react';
import { UserGoals } from '../types';

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
    webDevProjects: ['E-commerce Platform', 'Task Management App'],
    systemDesignCases: [
      'Design Twitter',
      'Design URL Shortener',
      'Design Chat System',
      'Design Video Streaming',
      'Design Search Engine'
    ],
    mockInterviews: 20,
    dataScienceTutorials: 100,
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto no-scrollbar shadow-lg">
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
          {/* DSA Questions */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">DSA Foundation</h3>
            <div className="flex items-center gap-3">
              <label className="text-gray-300">Target Questions:</label>
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
          </div>

          {/* Web Development Projects */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">Web Development Projects</h3>
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
            <h3 className="text-lg font-semibold text-white">System Design Case Studies</h3>
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
            <h3 className="text-lg font-semibold text-white">Mock Interviews</h3>
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

          {/* Data Science */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">Data Science</h3>
            <div className="flex items-center gap-3">
              <label className="text-gray-300">Target Tutorials:</label>
              <input
                type="number"
                min="1"
                max="500"
                value={goals.dataScienceTutorials}
                onChange={(e) => setGoals({ ...goals, dataScienceTutorials: parseInt(e.target.value) || 0 })}
                className="px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 w-24"
              />
              <span className="text-gray-400">tutorials</span>
            </div>
          </div>

          {/* CS Fundamentals */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">CS Fundamentals Chapters</h3>
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
            <h3 className="text-lg font-semibold text-white">English Speaking Practice</h3>
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