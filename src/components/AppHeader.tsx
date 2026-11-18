import { useState } from "react";
import { IonIcon, IonAvatar } from "@ionic/react";

import {
  chevronDownOutline,
  personAddOutline,
  filterOutline,
  searchOutline,
  downloadOutline,
  lockClosedOutline,
} from "ionicons/icons";

import type { TaskLabel } from "../types/task";

export interface TaskFilters {
  assignee: string;
  label: string;
  dueDate: string;
}

interface AppHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  assignees: string[];
  filters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
}

function AppHeader({
  searchTerm,
  onSearchChange,
  assignees,
  filters,
  onFiltersChange,
}: AppHeaderProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleResetFilter = () => {
    onFiltersChange({
      assignee: "",
      label: "",
      dueDate: "",
    });
  };

  return (
    <header className="app-header">
      {/* Workspace */}
      <div className="header-left">
        <button type="button" className="workspace-button">
          <IonIcon icon={lockClosedOutline} />
          <span>Adhivasindo</span>
          <IonIcon icon={chevronDownOutline} />
        </button>
      </div>

      {/* Team Members */}
      <div className="header-center">
        <div className="header-avatars">
          <IonAvatar>
            <div>AR</div>
          </IonAvatar>
          <IonAvatar>
            <div>DK</div>
          </IonAvatar>
          <IonAvatar>
            <div>FN</div>
          </IonAvatar>
          <IonAvatar>
            <div>AM</div>
          </IonAvatar>
          <span className="more-members">+2</span>
        </div>

        <button type="button" className="invite-button">
          <IonIcon icon={personAddOutline} />
          <span>Invite</span>
        </button>
      </div>

      {/* Actions */}
      <div className="header-actions">
        <div className="filter-wrapper">
          <button
            type="button"
            className="header-action"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <IonIcon icon={filterOutline} />
            <span>Filter</span>
          </button>

          {isFilterOpen && (
            <div className="filter-dropdown">
              <div className="filter-dropdown-header">
                <strong>Filter Tasks</strong>
                <button type="button" onClick={() => setIsFilterOpen(false)}>
                  ×
                </button>
              </div>

              <div className="filter-field">
                <label>Assignee</label>
                <select
                  value={filters.assignee}
                  onChange={(e) =>
                    onFiltersChange({
                      ...filters,
                      assignee: e.target.value,
                    })
                  }
                >
                  <option value="">All Assignees</option>
                  {assignees.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-field">
                <label>Label</label>
                <select
                  value={filters.label}
                  onChange={(e) =>
                    onFiltersChange({
                      ...filters,
                      label: e.target.value,
                    })
                  }
                >
                  <option value="">All Labels</option>
                  {(
                    ["Feature", "Bug", "Issue", "Undefined"] as TaskLabel[]
                  ).map((label) => (
                    <option key={label} value={label}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-field">
                <label>Due Date</label>
                <input
                  type="date"
                  value={filters.dueDate}
                  onChange={(e) =>
                    onFiltersChange({
                      ...filters,
                      dueDate: e.target.value,
                    })
                  }
                />
              </div>

              <button
                type="button"
                className="filter-reset-button"
                onClick={handleResetFilter}
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>

        <button type="button" className="header-action">
          <IonIcon icon={downloadOutline} />
          <span>Export / Import</span>
        </button>

        {/* Search */}
        <div className="header-search">
          <IonIcon icon={searchOutline} />
          <input
            placeholder="Search Tasks"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
