export interface Task {
  id: string;
  name: string;
  points: number;
  start_date: string | null;
  end_date: string | null;
  completion_type: 'visit_website' | string;
  completion_value: string;
  completed?: boolean;
}

export interface TaskGroup {
  id: string;
  name: string;
  tasks: Task[];
  tasks_count: number;
}

export interface TasksResponse {
  message: null;
  data: TaskGroup[];
}