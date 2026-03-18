export function TabButton({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`pb-2 text-sm font-bold uppercase tracking-widest transition-all relative ${
        active ? 'text-[#9823ff]' : 'text-purple-400/40 hover:text-purple-300'
      }`}
    >
      {label}
      {active && (
        <div className="absolute -bottom-4.25 left-0 w-full h-0.5 bg-[#9823ff] shadow-[0_0_10px_#9823ff]" />
      )}
    </button>
  );
}