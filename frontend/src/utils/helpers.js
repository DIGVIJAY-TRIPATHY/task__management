export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

export const getDaysUntilDue = (dueDate) => {
  if (!dueDate) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const isOverdue = (dueDate, status) => {
  if (!dueDate || status === 'completed') return false;
  return getDaysUntilDue(dueDate) < 0;
};

export const isDueSoon = (dueDate, status) => {
  if (!dueDate || status === 'completed') return false;
  const days = getDaysUntilDue(dueDate);
  return days >= 0 && days <= 3;
};
