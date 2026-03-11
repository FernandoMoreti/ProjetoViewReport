'use client'
import { useState } from 'react';
import Link from 'next/link';
import { Search, LayoutGrid } from 'lucide-react';

interface Bank {
  id: string;
  name: string;
  active: boolean;
}

const banks: Bank[] = [
  { id: 'bradesco8', name: 'Dashboard', active: false },
  { id: 'all', name: 'ALL BAnks to process', active: false },
  { id: 'c6', name: 'C6 Bank', active: false },
  { id: 'pan', name: 'Banco PAN', active: false },
  { id: 'daycoval', name: 'Daycoval', active: false },
  { id: 'inter', name: 'Inter', active: false },
  { id: 'itau', name: 'Itaú Unibanco', active: false },
  { id: 'bradesco7', name: 'Bradesco', active: false },
  { id: 'daycoval1', name: 'Daycoval1', active: false },
  { id: 'inter2', name: 'Inter1', active: false },
  { id: 'itau3', name: 'Itaú Unibanco1', active: false },
  { id: 'bradesco', name: 'Bradesco1', active: false },
  { id: 'bradesco1', name: 'Bradesco1', active: false },
  { id: 'bradesco3', name: 'Bradesco1', active: false },
  { id: 'bradesco4', name: 'Bradesco1', active: false },
];

export default function Sidebar() {

  const [ isActivate, setIsActivate ] = useState<string>('')

  return (

    <div className="flex flex-col h-screen w-76 bg-[#1a0b2e] text-gray-300 font-sans border-r border-purple-900/30">

      <div className="flex items-center justify-between p-5 mb-2">
        <div className="flex items-center gap-3">
          <div className="bg-linear-to-br from-[#ff6b3d] to-[#9823ff] p-1.5 rounded-lg shadow-lg">
            <LayoutGrid size={18} className="text-white" />
          </div>
          <span className="font-bold text-sm tracking-widest text-white uppercase opacity-90">
            Controle de Relatorios
          </span>
        </div>
      </div>

      <div className="px-4 mb-6">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-purple-300/50">
            <Search size={16} />
          </span>
          <input
            type="text"
            className="w-full bg-[#2d1b4d]/50 text-sm text-white placeholder-purple-300/30 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-[#9823ff] border border-purple-500/10 transition-all"
            placeholder="Buscar unidade..."
          />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 space-y-2">
        {banks.map((bank) => (
          <Link
            href={`?bank=${bank.name}`}
            key={bank.id}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
              isActivate == bank.name
                ? 'bg-linear-to-r from-[#9823ff] to-[#7022ff] text-white shadow-[0_4px_20px_rgba(152,35,255,0.3)]'
                : 'hover:bg-white/5 text-purple-200/70 hover:text-white'
            }`}
            onClick={() => {
                setIsActivate(bank.name)
            }}
          >
            <span className="text-sm font-medium tracking-wide">{bank.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}