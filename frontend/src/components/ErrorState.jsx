export default function ErrorState({ message = "We couldn't load this. Please try again.", onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <h3 className="text-base font-semibold text-text mb-1.5">Something went wrong</h3>
      <p className="text-sm text-muted max-w-xs mb-5">{message}</p>
      {onRetry && (
        <button className="btn-secondary" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
