export default function EmptyState({ title, description, action, icon }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-text mb-1.5">{title}</h3>
      <p className="text-sm text-muted max-w-xs mb-5">{description}</p>
      {action}
    </div>
  );
}
