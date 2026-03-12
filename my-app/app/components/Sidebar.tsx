'use client'
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LayoutGrid, ChevronDown, Landmark, ChevronRight } from 'lucide-react';
import axios from 'axios';

interface Bank {
  id: string;
  name: string;
  active: boolean;
}


export default function Sidebar() {

  const [ isActivate, setIsActivate ] = useState<string>('')
  const [ banks, setBanks ] = useState<Bank[]>([])
  const [isBanksOpen, setIsBanksOpen] = useState<boolean>(false);

  useEffect(() => {
    async function getBanks() {
      try {
        const response = await axios.get('http://localhost:3003/banks')
        setBanks(response.data)
      } catch (error) {
        console.error(error)
      }
    }

    getBanks()
  }, [])

  return (

    <div className="flex flex-col h-screen w-76 bg-[#1a0b2e] text-gray-300 font-sans border-r border-purple-900/30">

      <div className="flex items-center justify-between p-5 mb-2 border-b border-purple-900/30">
        <div className="flex items-center gap-3">
          <div className="bg-linear-to-br from-[#ff6b3d] to-[#9823ff] p-1.5 rounded-lg shadow-lg">
            <LayoutGrid size={18} className="text-white" />
          </div>
          <span className="font-bold text-sm tracking-widest text-white uppercase opacity-90">
            Controle de Relatorios
          </span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 space-y-1">
        <button
          onClick={() => setIsBanksOpen(!isBanksOpen)}
          className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 text-purple-100 transition-all duration-200 group"
        >
          <div className="flex items-center gap-3">
            <Landmark size={18} className="text-purple-400" />
            <span className="text-sm font-semibold tracking-wide">Bancos</span>
          </div>
          {isBanksOpen ? <ChevronDown size={16} className="text-purple-500" /> : <ChevronRight size={16} className="text-purple-500" />}
        </button>

        <div className={`space-y-1 overflow-hidden transition-all duration-300 ${isBanksOpen ? 'max-h-250 opacity-100' : 'max-h-0 opacity-0'}`}>
          {banks.map((bank) => (
            <Link
              href={`?bank=${bank.name}`}
              key={bank.id}
              className={`ml-4 flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 group ${
                isActivate === bank.name
                  ? 'bg-linear-to-r from-[#9823ff] to-[#7022ff] text-white shadow-lg'
                  : 'hover:bg-white/5 text-purple-200/60 hover:text-white'
              }`}
              onClick={() => setIsActivate(bank.name)}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${isActivate === bank.name ? 'bg-white' : 'bg-purple-900 group-hover:bg-purple-500'}`} />
              <span className="text-sm font-medium">{bank.name}</span>
            </Link>
          ))}
          <Link
              href={`?bank=Adicionar Banco`}
              onClick={() => setIsActivate('ADICIONAR BANCO')}
              key={1}
              className={`ml-4 flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 group ${
                isActivate === 'ADICIONAR BANCO'
                  ? 'bg-linear-to-r from-[#9823ff] to-[#7022ff] text-white shadow-lg'
                  : 'hover:bg-white/5 text-purple-200/60 hover:text-white'
              }`}
            >
              <span className="text-sm font-medium">ADICIONAR BANCO</span>
            </Link>
        </div>

        <Link
          href={'?bank=Todos os Bancos'}
          onClick={() => setIsActivate('')}
          className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 text-purple-100 transition-all duration-200 group"
        >
          <div className="flex items-center gap-3">
            <Landmark size={18} className="text-purple-400" />
            <span className="text-sm font-semibold tracking-wide">Todos os Bancos</span>
          </div>
        </Link>
      </nav>
    </div>
  );
}