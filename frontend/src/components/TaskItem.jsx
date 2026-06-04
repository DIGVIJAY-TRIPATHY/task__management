import React from 'react';
import { formatDate, getDaysUntilDue, isOverdue, isDueSoon } from '../utils/helpers';
import Button from './Button';

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const daysUntilDue = getDaysUntilDue(task.dueDate);
  const overdue = isOverdue(task.dueDate, task.status);
  const dueSoon = isDueSoon(task.dueDate, task.status);

  return (
    <div className={`card p-5 animate-fadeIn ${task.status === 'completed' ? 'opacity-75' : ''}`}>
      <div className="flex gap-4">
        {/* Checkbox */}
        <div className="flex-shrink-0 pt-1">
          <input
            type="checkbox"
            checked={task.status === 'completed'}
            onChange={() => onToggle(task._id)}
            className="w-5 h-5 rounded accent-purple-600 cursor-pointer"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-2">
            <h4
              className={`text-lg font-semibold ${
                task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
              } break-words`}
            >
              {task.title}
            </h4>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <span className={`badge badge-${task.priority}`}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </span>
              <span className={`badge badge-${task.status}`}>
                {task.status === 'completed' ? 'Done' : 'Pending'}
              </span>
              {overdue && <span className="badge bg-red-100 text-red-800">⚠️ Overdue</span>}
              {dueSoon && <span className="badge bg-orange-100 text-orange-800">⏰ Due Soon</span>}
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{task.description}</p>
          )}

          {/* Footer */}
          <div className="flex flex-wrap gap-4 text-xs text-gray-500">
            {task.dueDate && (
              <span className="flex items-center gap-1">
                📅 {formatDate(task.dueDate)}
                {daysUntilDue !== null && (
                  <span
                    className={`ml-1 font-semibold ${
                      overdue ? 'text-red-600' : 'text-purple-600'
                    }`}
                  >
                    {overdue ? `${Math.abs(daysUntilDue)}d overdue` : `${daysUntilDue}d left`}
                  </span>
                )}
              </span>
            )}
            <span>Created {formatDate(task.createdAt)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(task)}
            title="Edit task"
          >
            ✏️
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(task._id)}
            title="Delete task"
          >
            🗑️
          </Button>
        </div>
      </div>
    </div>
  );
}
