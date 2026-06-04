export default function Alert({ type = 'error', message, onClose }) {
  const typeClasses = {
    error: 'alert-error',
    success: 'alert-success',
    info: 'alert-info',
  };

  const typeIcons = {
    error: '❌',
    success: '✅',
    info: 'ℹ️',
  };

  return (
    <div className={`alert ${typeClasses[type]} flex items-center justify-between`}>
      <div className="flex items-center gap-3">
        <span className="text-lg">{typeIcons[type]}</span>
        <span>{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 text-lg font-semibold hover:opacity-70 transition-opacity"
        >
          ×
        </button>
      )}
    </div>
  );
}
