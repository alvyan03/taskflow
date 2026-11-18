import type { Task, TaskStatus, BoardColumn } from "../types/task";
import TaskCard from "./TaskCard";
import { IonIcon } from "@ionic/react";
import { addOutline } from "ionicons/icons";
import { useState } from "react";

interface KanbanBoardProps {
  tasks: Task[];
  columns: BoardColumn[];
  onTaskClick: (task: Task) => void;
  onAddTask: (status: TaskStatus) => void;
  onMoveTask: (taskId: string, newStatus: TaskStatus) => void;
  onAddColumn: () => void;
  onRenameColumn: (id: string, title: string) => void;
  onDeleteColumn: (id: string, title: string) => void;
}

function KanbanBoard({
  tasks,
  columns,
  onTaskClick,
  onAddTask,
  onMoveTask,
  onAddColumn,
  onRenameColumn,
  onDeleteColumn,
}: KanbanBoardProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    status: TaskStatus,
  ) => {
    e.preventDefault();

    const taskId = e.dataTransfer.getData("taskId");

    if (taskId) {
      onMoveTask(taskId, status);
    }
  };

  return (
    <section className="kanban-board">
      {columns.map((column) => {
        const columnTasks = tasks.filter((task) => task.status === column.id);

        return (
          <div
            className="kanban-column"
            key={column.id}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className="column-header">
              <div className="column-title">
                <h3>{column.title}</h3>
                {/* <span className="task-count">
                  {columnTasks.length}
                </span> */}
              </div>

              <div className="column-actions">
                <button
                  className="column-add"
                  onClick={() => onAddTask(column.id)}
                  title="Add Task"
                >
                  <IonIcon icon={addOutline} />
                </button>

                <div className="column-menu-wrapper">
                  <button
                    className="column-menu"
                    title="Column options"
                    onClick={() =>
                      setActiveMenu(activeMenu === column.id ? null : column.id)
                    }
                  >
                    ⋮
                  </button>

                  {activeMenu === column.id && (
                    <div className="column-dropdown">
                      <button
                        onClick={() => {
                          onRenameColumn(column.id, column.title);
                          setActiveMenu(null);
                        }}
                      >
                        ✏️ Rename Column
                      </button>

                      <button
                        className="delete-option"
                        onClick={() => {
                          onDeleteColumn(column.id, column.title);
                          setActiveMenu(null);
                        }}
                      >
                        🗑️ Delete Column
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="task-list">
              {columnTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onClick={() => onTaskClick(task)}
                  onDragStart={(e) => {
                    e.dataTransfer.setData("taskId", task.id);
                  }}
                />
              ))}
            </div>
          </div>
        );
      })}

      <button className="add-column-button" onClick={onAddColumn}>
        <IonIcon icon={addOutline} />
        Add New List
      </button>
    </section>
  );
}

export default KanbanBoard;
