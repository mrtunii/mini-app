import React from 'react';
import { Task } from '../types/task';
import { CheckCircle, ChevronRight, Coins } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onTaskClick: (task: Task) => void;
  primaryColor: string;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onTaskClick, primaryColor }) => {
  return (
    <div 
      onClick={() => onTaskClick(task)}
      className={`relative flex items-center p-3 mb-2.5 rounded-lg cursor-pointer transition-all
        ${task.completed 
          ? 'bg-gray-800/50 border border-green-500/20' 
          : 'bg-gray-800/80 hover:bg-gray-800/60 border border-gray-700/50'
        }`}
    >
      {/* Task Icon/Logo */}
      <div 
        className="w-9 h-9 rounded-full flex items-center justify-center"
        style={{ backgroundColor: `${primaryColor}20` }}
      >
        <Coins className="w-4.5 h-4.5" style={{ color: primaryColor }} />
      </div>

      {/* Task Details */}
      <div className="flex-1 ml-3">
        <h3 className="text-sm font-medium text-white">{task.name}</h3>
        <div className="flex items-center mt-0.5">
          <div className="flex items-center">
            <Coins className="w-3.5 h-3.5 mr-1" style={{ color: primaryColor }} />
            <span className="text-xs" style={{ color: primaryColor }}>+{task.points}</span>
          </div>
        </div>
      </div>

      {/* Right Arrow */}
      <ChevronRight className="w-4 h-4 text-gray-400" />

      {/* Completed Badge */}
      {task.completed && (
        <div className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3">
          <CheckCircle className="w-4 h-4 text-green-500" />
        </div>
      )}
    </div>
  );
};

export default TaskCard;