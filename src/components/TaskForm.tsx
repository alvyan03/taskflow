import { useState, useEffect } from "react";
import type { Task, TaskStatus, TaskLabel, TaskPriority, ChecklistItem } from "../types/task";

interface TaskFormProps {
  isOpen: boolean;
  status: TaskStatus;
  initialTask?: Task | null;
  onClose: () => void;
  onSubmit: (task: {
    title: string;
    description: string;
    assignee: string;
    dueDate: string;
    label: TaskLabel;
    priority: TaskPriority;
    status: TaskStatus;
    coverImage?: string;
    attachments?: string[];
    checklist?: ChecklistItem[];
  }) => void;
}

function TaskForm({
  isOpen,
  status,
  initialTask,
  onClose,
  onSubmit,
}: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignee, setAssignee] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [label, setLabel] = useState<TaskLabel>("Feature");
  const [priority, setPriority] = useState<TaskPriority>("Medium");
  const [coverImage, setCoverImage] = useState("");
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [newSubtask, setNewSubtask] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setTitle(initialTask?.title ?? "");
      setDescription(initialTask?.description ?? "");
      setAssignee(initialTask?.assignee ?? "");
      setDueDate(initialTask?.dueDate ?? "");
      setLabel(initialTask?.label ?? "Feature");
      setPriority(initialTask?.priority ?? "Medium");
      setCoverImage(initialTask?.coverImage ?? "");
      setChecklist(initialTask?.checklist ?? []);
      setNewSubtask("");
      setAttachments(initialTask?.attachments ?? []);
    }
  }, [isOpen, initialTask]);

  if (!isOpen) return null;

  const handleAddSubtask = () => {
    const value = newSubtask.trim();

    if (!value) return;

    setChecklist((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: value,
        completed: false,
      },
    ]);

    setNewSubtask("");
  };

  const handleRemoveSubtask = (id: string) => {
    setChecklist((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);

    if (!files.length) return;

    setAttachments((prev) => [...prev, ...files.map((file) => file.name)]);

    e.target.value = "";
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description,
      assignee,
      dueDate,
      label,
      priority,
      status: initialTask?.status ?? status,
      coverImage,
      checklist,
      attachments,
    });

    onClose();
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setCoverImage(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="task-form" onClick={(e) => e.stopPropagation()}>
        <div className="task-form-header">
          <h2>{initialTask ? "Edit Task" : "Create New Task"}</h2>
          <button type="button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="task-form-body">
          <label>Judul task *</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
          />

          <label>Deskripsi</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
          />

          <label>Assignee</label>
          <input
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            placeholder="Enter assignee"
          />

          <label>Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <label>Label</label>
          <select
            value={label}
            onChange={(e) => setLabel(e.target.value as TaskLabel)}
          >
            <option value="Feature">Feature</option>
            <option value="Bug">Bug</option>
            <option value="Issue">Issue</option>
            <option value="Undefined">Undefined</option>
          </select>

          <label>Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <div className="form-checklist-section">
            <label>Checklist / Subtasks</label>

            <div className="form-subtask-input">
              <input
                type="text"
                placeholder="Enter subtask..."
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
              />

              <button
                type="button"
                onClick={handleAddSubtask}
                disabled={!newSubtask.trim()}
              >
                Add
              </button>
            </div>

            <div className="form-subtask-list">
              {checklist.map((item) => (
                <div className="form-subtask-item" key={item.id}>
                  <span>{item.title}</span>

                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(item.id)}
                    title="Remove subtask"
                  >
                    ×
                  </button>
                </div>
              ))}

              {checklist.length === 0 && <p>No subtasks added yet.</p>}
            </div>
          </div>

          <div className="form-attachments-section">
            <label>Attachments</label>

            <label className="form-attachment-upload">
              <span>＋ Add Attachment / Browse Files</span>

              <input
                type="file"
                multiple
                onChange={handleAttachmentChange}
                hidden
              />
            </label>

            <div className="form-attachment-list">
              {attachments.map((file, index) => (
                <div className="form-attachment-item" key={`${file}-${index}`}>
                  <span>📎 {file}</span>

                  <button
                    type="button"
                    onClick={() => handleRemoveAttachment(index)}
                    title="Remove attachment"
                  >
                    ×
                  </button>
                </div>
              ))}

            </div>
          </div>

          <label>Cover Image</label>

          {coverImage && (
            <div className="cover-image-preview">
              <img src={coverImage} alt="Task cover preview" />

              <button type="button" onClick={() => setCoverImage("")}>
                Remove Image
              </button>
            </div>
          )}

          <label className="cover-image-upload">
            <span>＋ Upload Cover Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverImageChange}
              hidden
            />
          </label>

          <div className="task-form-actions">
            <button
              type="button"
              className="cancel-task-button"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="button"
              className="create-task-button"
              onClick={handleSubmit}
              disabled={!title.trim()}
            >
              {initialTask ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskForm;
