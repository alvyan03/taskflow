import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import type { Task, TaskStatus, TaskLabel, TaskPriority } from "../types/task";

interface TaskDetailProps {
  task: Task | null;
  onClose: () => void;
  onDelete: (id: string) => void;
  onSave: (id: string, updates: Partial<Task>) => void;
}

const statuses: TaskStatus[] = ["To Do", "Doing", "Review", "Done", "Rework"];

const labels: TaskLabel[] = ["Feature", "Bug", "Issue", "Undefined"];

const priorities: TaskPriority[] = ["Low", "Medium", "High"];

function TaskDetail({ task, onClose, onDelete, onSave }: TaskDetailProps) {
  const [draft, setDraft] = useState<Task | null>(task);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  useEffect(() => {
    setDraft(task);
  }, [task]);

  if (!task || !draft) return null;

  const checklist = draft.checklist ?? [];
  const attachments = draft.attachments ?? [];

  const completedCount = checklist.filter((item) => item.completed).length;

  const progress =
    checklist.length > 0
      ? Math.round((completedCount / checklist.length) * 100)
      : 0;

  const updateDraft = (updates: Partial<Task>) => {
    setDraft((current) => (current ? { ...current, ...updates } : current));
  };

  const handleSave = () => {
    onSave(task.id, draft);
    onClose();
  };

  const handleDiscard = () => {
    setDraft(task);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm("Delete this task?")) {
      onDelete(task.id);
    }
  };

  const handleCoverChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran gambar maksimal 2 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      updateDraft({ coverImage: reader.result as string });
    };
    reader.readAsDataURL(file);

    e.target.value = "";
  };

  const handleAttachmentChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    updateDraft({
      attachments: [...attachments, ...files.map((file) => file.name)],
    });

    e.target.value = "";
  };

  const handleAddSubtask = () => {
    const title = window.prompt("Masukkan nama subtask:");
    if (!title?.trim()) return;

    updateDraft({
      checklist: [
        ...checklist,
        {
          id: crypto.randomUUID(),
          title: title.trim(),
          completed: false,
        },
      ],
    });
  };

  const handleToggleSubtask = (id: string) => {
    updateDraft({
      checklist: checklist.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item,
      ),
    });
  };

  const handleRemoveSubtask = (id: string) => {
    updateDraft({
      checklist: checklist.filter((item) => item.id !== id),
    });
  };
  

  return (
    <div className="modal-overlay" onClick={handleDiscard}>
      <div className="task-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="task-detail-layout">
          {/* LEFT COLUMN */}
          <div className="task-detail-left">
            <div className="detail-top-actions">
              <button
                type="button"
                onClick={() => updateDraft({ status: "Done" })}
              >
                ✓ Mark Complete
              </button>

              <button type="button" onClick={handleDiscard}>
                ×
              </button>
            </div>

            {/* Cover */}
            <div
              className="detail-cover clickable"
              onClick={() => coverInputRef.current?.click()}
            >
              {draft.coverImage ? (
                <img src={draft.coverImage} alt={draft.title} />
              ) : (
                <div className="detail-cover-empty">
                  <span>＋</span>
                  <small>Add Cover Image</small>
                </div>
              )}
            </div>

            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleCoverChange}
            />

            {draft.coverImage && (
              <button
                type="button"
                className="remove-cover"
                onClick={() => updateDraft({ coverImage: "" })}
              >
                Remove cover
              </button>
            )}

            {/* Title */}
            <div className="detail-title">
              <input
                className="detail-title-input"
                value={draft.title}
                onChange={(e) => updateDraft({ title: e.target.value })}
                placeholder="Task title"
              />
            </div>

            {/* Task Information */}
            <div className="detail-info-grid">
              <div>
                <label>Assignee</label>
                <input
                  value={draft.assignee}
                  onChange={(e) => updateDraft({ assignee: e.target.value })}
                  placeholder="Unassigned"
                />
              </div>

              <div>
                <label>Due Date</label>
                <input
                  type="date"
                  value={draft.dueDate}
                  onChange={(e) => updateDraft({ dueDate: e.target.value })}
                />
              </div>

              <div>
                <label>Board</label>
                <input value="" readOnly />
              </div>

              <div>
                <label>Column</label>
                <select
                  value={draft.status}
                  onChange={(e) =>
                    updateDraft({ status: e.target.value as TaskStatus })
                  }
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>Label</label>
                <select
                  value={draft.label}
                  onChange={(e) =>
                    updateDraft({ label: e.target.value as TaskLabel })
                  }
                >
                  {labels.map((label) => (
                    <option key={label} value={label}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>Priority</label>
                <select
                  value={draft.priority}
                  onChange={(e) =>
                    updateDraft({
                      priority: e.target.value as TaskPriority,
                    })
                  }
                >
                  {priorities.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="task-detail-right">
            {/* Description */}

            <section className="detail-section">
              <div className="detail-section-heading">
                <h3>Description</h3>

                <button
                  type="button"
                  className="detail-edit-icon"
                  title="Edit description"
                  onClick={() => setIsEditingDescription(true)}
                >
                  ✎
                </button>
              </div>

              <div className="detail-description-box">
                {isEditingDescription ? (
                  <textarea
                    className="detail-description-input"
                    value={draft.description}
                    onChange={(e) =>
                      updateDraft({ description: e.target.value })
                    }
                    placeholder="Write a description..."
                    autoFocus
                  />
                ) : (
                  <p className="detail-description-text">
                    {draft.description || "Add a description..."}
                  </p>
                )}
              </div>
            </section>

            {/* Attachments */}
            <section className="detail-section">
              <h3>Attachments</h3>

              <input
                ref={attachmentInputRef}
                type="file"
                multiple
                hidden
                onChange={handleAttachmentChange}
              />

              <button
                type="button"
                className="detail-upload-button"
                onClick={() => attachmentInputRef.current?.click()}
              >
                + Add attachment / Browse files
              </button>

              {attachments.map((file, index) => (
                <div className="detail-attachment" key={`${file}-${index}`}>
                  <span>📎 {file}</span>
                  <button
                    type="button"
                    onClick={() =>
                      updateDraft({
                        attachments: attachments.filter((_, i) => i !== index),
                      })
                    }
                  >
                    ×
                  </button>
                </div>
              ))}
            </section>

            {/* Checklist */}
            <section className="detail-section detail-checklist">
              <div className="checklist-heading">
                <h3>Check List</h3>
                <span>
                  {completedCount}/{checklist.length}
                </span>
              </div>

              <div className="detail-progress-track">
                <div
                  className="detail-progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Checklist List */}
              <div className="checklist-list">
                {checklist.map((item) => (
                  <div className="checklist-item" key={item.id}>
                    <label className="checklist-item-label">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => handleToggleSubtask(item.id)}
                      />

                      <span className={item.completed ? "completed" : ""}>
                        {item.title}
                      </span>
                    </label>

                    <button
                      type="button"
                      className="checklist-delete-button"
                      onClick={() => handleRemoveSubtask(item.id)}
                      title="Remove subtask"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="detail-add-subtask-button"
                onClick={handleAddSubtask}
              >
                + Add subtask
              </button>
            </section>

            {/* Activity */}
            <section className="detail-section">
              <h3>Activity</h3>
              <p className="detail-empty-activity">No activity yet.</p>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="task-detail-footer">
          {/* Delete - sebelah kiri */}
          <button
            type="button"
            className="delete-task-button"
            onClick={handleDelete}
          >
            Delete Task
          </button>

          {/* Discard & Save - sebelah kanan */}
          <div className="footer-right-actions">
            <button
              type="button"
              className="cancel-task-button"
              onClick={handleDiscard}
            >
              Discard
            </button>

            <button
              type="button"
              className="create-task-button"
              onClick={handleSave}
              disabled={!draft.title.trim()}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskDetail;
