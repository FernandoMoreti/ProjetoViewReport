import Link from 'next/link';

export default function Header() {
  return (
    <header className="h-20 w-full bg-[#1a0b2e]/80 backdrop-blur-md border-b border-purple-900/20 flex items-center justify-between px-8 sticky top-0 z-10">

      <div className="flex flex-col">
        <h1 className="text-xl font-bold text-white tracking-tight">
          Painel de Processamento
        </h1>
      </div>

      <nav className="flex items-center gap-6">
        <Link
          href={`?bank=`}
        >
          Adicionar
        </Link>
      </nav>
    </header>
  );
}