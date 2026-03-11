import { Calendar } from 'lucide-react';

export default function Header() {
  return (
    <header className="h-20 w-full bg-[#1a0b2e]/80 backdrop-blur-md border-b border-purple-900/20 flex items-center justify-between px-8 sticky top-0 z-10">

      <div className="flex flex-col">
        <h1 className="text-xl font-bold text-white tracking-tight">
          Painel de Processamento
        </h1>
      </div>

      <div className="flex items-center gap-6">

        <button className="p-2 hover:bg-white/5 text-purple-300/70 hover:text-white rounded-lg transition-all">
        <Calendar size={18} />
        </button>
      </div>
    </header>
  );
}