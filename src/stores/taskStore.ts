import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Task, BoardColumn } from "../types/task";

type NewTask = Omit<Task, "id">;

interface TaskStore {
  tasks: Task[];
  columns: BoardColumn[];

  addTask: (task: NewTask) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addColumn: (title: string) => void;
  renameColumn: (id: string, title: string) => void;
  deleteColumn: (id: string) => void;
}

const defaultColumns: BoardColumn[] = [
  { id: "To Do", title: "To Do" },
  { id: "Doing", title: "Doing" },
  { id: "Review", title: "Review" },
  { id: "Done", title: "Done" },
  { id: "Rework", title: "Rework" },
];

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: [],
      columns: defaultColumns,

      addTask: (task) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              ...task,
              id: crypto.randomUUID(),
            },
          ],
        })),

      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task,
          ),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),

      addColumn: (title) =>
        set((state) => ({
          columns: [
            ...state.columns,
            {
              id: crypto.randomUUID(),
              title,
            },
          ],
        })),
      renameColumn: (id, title) =>
        set((state) => ({
          columns: state.columns.map((column) =>
            column.id === id ? { ...column, title } : column,
          ),
        })),

      deleteColumn: (id) =>
        set((state) => {
          const defaultColumnIds = [
            "To Do",
            "Doing",
            "Review",
            "Done",
            "Rework",
          ];

          if (defaultColumnIds.includes(id)) {
            return state;
          }

          return {
            columns: state.columns.filter((column) => column.id !== id),
            tasks: state.tasks.filter((task) => task.status !== id),
          };
        }),
    }),
    {
      name: "taskflow-storage",

      // Mempertahankan task lama saat menambahkan data columns
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<TaskStore> | undefined;

        const savedColumns = persisted?.columns;

        const columns = Array.isArray(savedColumns)
          ? savedColumns.map((column) => {
              const defaultColumn = defaultColumns.find(
                (item) => item.title === column.title,
              );

              return defaultColumn
                ? { ...column, id: defaultColumn.id }
                : column;
            })
          : defaultColumns;

        return {
          ...currentState,
          ...persisted,
          tasks: persisted?.tasks ?? currentState.tasks,
          columns,
        };
      },
    },
  ),
);
