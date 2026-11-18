export type TaskStatus = string;

export type TaskLabel = "Feature" | "Bug" | "Issue" | "Undefined";

export type TaskPriority = "Low" | "Medium" | "High";

export interface BoardColumn {
  id: string;
  title: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  label: TaskLabel;
  priority: TaskPriority;
  status: TaskStatus;
  checklist: ChecklistItem[];
  attachments: string[];
  coverImage?: string;
}
