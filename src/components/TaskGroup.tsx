import React from 'react';
import { TaskGroup as TaskGroupType } from '../types/task';
import TaskCard from './TaskCard';

interface TaskGroupProps {
  group: TaskGroupType;
  onTaskClick: (taskId: string, completionType: string, completionValue: string) => void;
  primaryColor: string;
}

const TaskGroup: React.FC<TaskGroupProps> = ({ group, onTaskClick, primaryColor }) => {
  return (
    <div>
      {group.tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onTaskClick={() => onTaskClick(task.id, task.completion_type, task.completion_value)}
          primaryColor={primaryColor}
        />
      ))}
    </div>
  );
};

export default TaskGroup;