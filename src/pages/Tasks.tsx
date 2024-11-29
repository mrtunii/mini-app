import React, { useEffect, useState } from 'react';
import { getTasks, completeTask, getCurrentUser } from '../services/api';
import { TaskGroup as TaskGroupType } from '../types/task';
import TaskGroup from '../components/TaskGroup';
import { Coins, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';

const Tasks = () => {
  const [taskGroups, setTaskGroups] = useState<TaskGroupType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const { user, setUser } = useAuth();
  const { game } = useGame();

  const primaryColor = game?.config?.primary_color || '#FFB800';

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await getTasks();
      setTaskGroups(response.data);
      if (response.data.length > 0) {
        setActiveGroupId(response.data[0].id);
      }
    } catch (err) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const refreshUserPoints = async () => {
    try {
      const response = await getCurrentUser();
      setUser(response.data);
    } catch (err) {
      console.error('Failed to refresh user points:', err);
    }
  };

  const handleTaskClick = async (taskId: string, completionType: string, completionValue: string) => {
    if (completionType === 'visit_website') {
      try {
        await completeTask(taskId);
        window.open(completionValue, '_blank');
        await Promise.all([
          fetchTasks(),
          refreshUserPoints()
        ]);
      } catch (err) {
        console.error('Failed to complete task:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: primaryColor }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-gray-900 p-6 flex flex-col items-center justify-center">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  const activeGroup = taskGroups.find(group => group.id === activeGroupId);

  return (
    <div className="fixed inset-0 bg-gray-900 flex flex-col">
      {/* Points Header */}
      <div className="text-center p-4">
        <div className="flex items-center justify-center mb-1">
          <Coins className="w-5 h-5 mr-1" style={{ color: primaryColor }} />
          <h2 className="text-sm font-semibold text-white">Available points</h2>
        </div>
        <div className="text-3xl font-bold text-white mb-1.5">
          {user?.points?.toLocaleString() || 0}
        </div>
        <p className="text-gray-400 text-xs">
          Complete tasks to earn points towards future prize rewards!
        </p>
      </div>

      {/* Task Group Tabs */}
      <div className="px-4">
        <div className="overflow-x-auto">
          <div className="flex space-x-2 min-w-min pb-4">
            {taskGroups.map((group) => (
              <button
                key={group.id}
                onClick={() => setActiveGroupId(group.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all
                  ${activeGroupId === group.id
                    ? 'text-black'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                style={{ 
                  backgroundColor: activeGroupId === group.id ? primaryColor : undefined
                }}
              >
                {group.name} ({group.tasks_count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Task Group */}
      <div className="flex-1 overflow-y-auto px-4 pb-20">
        <div className="max-w-2xl mx-auto">
          {activeGroup && (
            <TaskGroup
              group={activeGroup}
              onTaskClick={handleTaskClick}
              primaryColor={primaryColor}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Tasks;