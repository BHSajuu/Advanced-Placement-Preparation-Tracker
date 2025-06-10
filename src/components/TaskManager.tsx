import React, { useState } from 'react';
import { Plus, Clock, CheckCircle2, Circle, Trash2, Star, Hash } from 'lucide-react';
import { Task, TaskCategory, TimeSlot } from '../types';

interface TaskManagerProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TaskManager: React.FC<TaskManagerProps> = ({ 
  tasks, 
  onAddTask, 
  onToggleTask, 
  onDeleteTask 
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    category: 'DSA' as TaskCategory,
    timeSlot: 'Morning' as TimeSlot,
    xp: 50,
    questionsCount: 1
  });

  const timeSlots: TimeSlot[] = ['Morning', 'Afternoon', 'Evening'];
  const categories: TaskCategory[] = ['DSA', 'Web Dev', 'Data Science', 'CS Fundamentals', 'System Design', 'Mock Interview', 'English Speaking Practice'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    const taskToAdd: Omit<Task, 'id' | 'createdAt'> = {
      title: newTask.title,
      category: newTask.category,
      timeSlot: newTask.timeSlot,
      xp: newTask.xp,
      completed: false
    };

    // Add questionsCount only for DSA tasks
    if (newTask.category === 'DSA') {
      taskToAdd.questionsCount = newTask.questionsCount;
    }

    onAddTask(taskToAdd);

    setNewTask({
      title: '',
      category: 'DSA',
      timeSlot: 'Morning',
      xp: 50,
      questionsCount: 1
    });
    setShowAddForm(false);
  };

  const tasksByTimeSlot = timeSlots.reduce((acc, slot) => {
    acc[slot] = tasks.filter(task => task.timeSlot === slot);
    return acc;
  }, {} as Record<TimeSlot, Task[]>);

  const getCategoryColor = (category: TaskCategory) => {
    const colors = {
      'DSA': 'bg-blue-900 text-blue-200 border border-blue-700',
      'Web Dev': 'bg-green-900 text-green-200 border border-green-700',
      'Data Science': 'bg-purple-900 text-purple-200 border border-purple-700',
      'CS Fundamentals': 'bg-red-900 text-red-200 border border-red-700',
      'System Design': 'bg-yellow-900 text-yellow-200 border border-yellow-700',
      'Mock Interview': 'bg-pink-900 text-pink-200 border border-pink-700',
      'English Speaking Practice': 'bg-indigo-900 text-indigo-200 border border-indigo-700'
    };
    return colors[category];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Daily Planner</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>

      {/* Add Task Form */}
      {showAddForm && (
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Task Title
              </label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white"
                placeholder="Enter your task..."
                autoFocus
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={newTask.category}
                  onChange={(e) => setNewTask({ ...newTask, category: e.target.value as TaskCategory })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Time Slot
                </label>
                <select
                  value={newTask.timeSlot}
                  onChange={(e) => setNewTask({ ...newTask, timeSlot: e.target.value as TimeSlot })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white"
                >
                  {timeSlots.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>

              {/* DSA Questions Count - Only show for DSA category */}
              {newTask.category === 'DSA' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Questions Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={newTask.questionsCount}
                    onChange={(e) => setNewTask({ ...newTask, questionsCount: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white"
                    placeholder="Number of questions"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  XP Value
                </label>
                <select
                  value={newTask.xp}
                  onChange={(e) => setNewTask({ ...newTask, xp: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white"
                >
                  <option value={25}>Easy (25 XP)</option>
                  <option value={50}>Medium (50 XP)</option>
                  <option value={100}>Hard (100 XP)</option>
                  <option value={200}>Epic (200 XP)</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Add Task
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Time Slot Sections */}
      <div className="grid gap-6">
        {timeSlots.map(slot => (
          <div key={slot} className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-white">{slot}</h3>
              <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-sm">
                {tasksByTimeSlot[slot].length} tasks
              </span>
            </div>

            <div className="space-y-3">
              {tasksByTimeSlot[slot].length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No tasks planned for {slot.toLowerCase()}</p>
                </div>
              ) : (
                tasksByTimeSlot[slot].map(task => (
                  <div
                    key={task.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 ${
                      task.completed
                        ? 'bg-green-900/20 border-green-800'
                        : 'bg-gray-700 border-gray-600 hover:shadow-md hover:border-gray-500'
                    }`}
                  >
                    <button
                      onClick={() => onToggleTask(task.id)}
                      className={`transition-colors ${
                        task.completed
                          ? 'text-green-500 hover:text-green-600'
                          : 'text-gray-400 hover:text-blue-500'
                      }`}
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-sm font-medium ${task.completed ? 'line-through text-gray-500' : 'text-white'}`}>
                          {task.title}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(task.category)}`}>
                          {task.category}
                        </span>
                        {task.category === 'DSA' && task.questionsCount && (
                          <span className="bg-blue-800 text-blue-200 px-2 py-1 rounded-full text-xs font-medium border border-blue-600 flex items-center gap-1">
                            <Hash className="w-3 h-3" />
                            {task.questionsCount} Q
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Star className="w-3 h-3" />
                        <span>{task.xp} XP</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};