import { IonContent, IonPage } from "@ionic/react";
import { useState } from "react";
import "../App.css";

import { useTaskStore } from "../stores/taskStore";
import KanbanBoard from "../components/KanbanBoard";
import AppHeader, { type TaskFilters } from "../components/AppHeader";
import TaskForm from "../components/TaskForm";
import TaskDetail from "../components/TaskDetail";
import { toast } from "sonner";

import type { Task, TaskStatus } from "../types/task";

function Dashboard() {
  const tasks = useTaskStore((state) => state.tasks);
  const addTask = useTaskStore((state) => state.addTask);
  const updateTask = useTaskStore((state) => state.updateTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus>("To Do");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<TaskFilters>({
    assignee: "",
    label: "",
    dueDate: "",
  });
  const columns = useTaskStore((state) => state.columns);
  const addColumn = useTaskStore((state) => state.addColumn);
  const renameColumn = useTaskStore((state) => state.renameColumn);
  const deleteColumn = useTaskStore((state) => state.deleteColumn);
  const assignees = Array.from(
    new Set(
      tasks.map((task) => task.assignee.trim()).filter((name) => name !== ""),
    ),
  );

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAssignee =
      !filters.assignee || task.assignee === filters.assignee;

    const matchesLabel = !filters.label || task.label === filters.label;

    const matchesDueDate = !filters.dueDate || task.dueDate === filters.dueDate;

    return matchesSearch && matchesAssignee && matchesLabel && matchesDueDate;
  });

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsDetailOpen(true);
  };

  const handleMoveTask = (taskId: string, newStatus: TaskStatus) => {
    updateTask(taskId, {
      status: newStatus,
    });
    // toast.success(`Task dipindahkan ke ${newStatus}!`);
  };

  const handleAddTask = (status: TaskStatus) => {
    setSelectedStatus(status);
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const handleSaveTask = (data: {
    title: string;
    description: string;
    assignee: string;
    dueDate: string;
    label: Task["label"];
    priority: Task["priority"];
    status: TaskStatus;
    checklist?: Task["checklist"];
    attachments?: string[];
  }) => {
    if (editingTask) {
      updateTask(editingTask.id, data);
      toast.info("Task berhasil diperbarui!");
    } else {
      addTask({
        ...data,
        checklist: data.checklist || [],
        attachments: data.attachments || [],
      });
      toast.success("Task berhasil ditambahkan!");
    }

    setEditingTask(null);
    setIsFormOpen(false);
  };

  const handleAddColumn = () => {
    const title = window.prompt("Masukkan nama kolom baru:");

    if (!title || !title.trim()) return;

    addColumn(title.trim());

    toast.success("Data berhasil ditambahkan")
  };

  const handleSaveTaskDetail = (taskId: string, updates: Partial<Task>) => {
    updateTask(taskId, updates);

    setSelectedTask((prev) =>
      prev && prev.id === taskId ? { ...prev, ...updates } : prev,
    );
    toast.info("Task berhasil diperbarui!");
  };

  const handleDeleteTask = (id: string) => {
    deleteTask(id);
    setSelectedTask(null);
    setIsDetailOpen(false);

    toast.error("Task berhasil dihapus")
  };

  const handleRenameColumn = (id: string, currentTitle: string) => {
    const newTitle = window.prompt("Masukkan nama kolom baru:", currentTitle);

    if (!newTitle || !newTitle.trim()) return;

    renameColumn(id, newTitle.trim());
  };

  const handleDeleteColumn = (id: string, title: string) => {
    const confirmed = window.confirm(
      `Hapus kolom "${title}" beserta semua task di dalamnya?`,
    );

    if (confirmed) {
      deleteColumn(id);
    }
    toast.error("Kolom berhasil dihapus");
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="dashboard">
          <AppHeader
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            assignees={assignees}
            filters={filters}
            onFiltersChange={setFilters}
          />

          <KanbanBoard
            tasks={filteredTasks}
            onTaskClick={handleTaskClick}
            onAddTask={handleAddTask}
            onMoveTask={handleMoveTask}
            onAddColumn={handleAddColumn}
            columns={columns}
            onRenameColumn={handleRenameColumn}
            onDeleteColumn={handleDeleteColumn}
          />

          <TaskForm
            isOpen={isFormOpen}
            status={selectedStatus}
            initialTask={editingTask}
            onClose={() => {
              setIsFormOpen(false);
              setEditingTask(null);
            }}
            onSubmit={handleSaveTask}
          />

          <TaskDetail
            task={isDetailOpen ? selectedTask : null}
            onClose={() => setIsDetailOpen(false)}
            onDelete={handleDeleteTask}
            onSave={handleSaveTaskDetail}
          />
        </div>
      </IonContent>
    </IonPage>
  );
}

export default Dashboard;
