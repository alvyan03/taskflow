import type { Task } from "../types/task";

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  onDragStart: (e: React.DragEvent<HTMLElement>) => void;
}

function TaskCard({ task, onClick, onDragStart }: TaskCardProps) {
  const checklist = task.checklist ?? [];
  const completedCount = checklist.filter((item) => item.completed).length;

  const progress =
    checklist.length > 0
      ? Math.round((completedCount / checklist.length) * 100)
      : 0;

  return (
    <article
      className="task-card"
      onClick={onClick}
      draggable
      onDragStart={onDragStart}
    >
      {/* Cover Image */}
      {task.coverImage && (
        <div className="task-card-cover">
          <img src={task.coverImage} alt={task.title} />
        </div>
      )}

      <div className="task-card-top">
        <span className={`task-label ${task.label.toLowerCase()}`}>
          {task.label}
        </span>
      </div>

      <h4>{task.title}</h4>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-footer">
        <span>{task.dueDate || "No deadline"}</span>
        <span className="task-assignee" title={task.assignee}>
          {task.assignee || "?"}
        </span>
      </div>

      {task.checklist.length > 0 && (
        <div className="task-progress">
          <div className="progress-info">
            <span>Checklist</span>
            <span>
              {completedCount}/{task.checklist.length} ({progress}%)
            </span>
          </div>

          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}
    </article>
  );
}

export default TaskCard;
