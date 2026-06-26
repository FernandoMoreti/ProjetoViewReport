'use client'

import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, Clock, X, Plus, Trash2 } from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';

interface Bank {
  id: number;
  name: string;
  reports?: Array<{ notreceived?: boolean, received?: boolean; processed?: boolean }>;
}

interface BankByDay {
  id: number;
  bankId: number;
  dayOfWeek: string;
  time: string;
  bank?: Bank;
}

export default function DayOfWeek() {
  const [banks, setBanks] = useState<Bank[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState('');
  const [filteredDayOfWeek, setFilteredDayOfWeek] = useState('');
  const [formData, setFormData] = useState({ bankId: '', time: '08:00' });
  const [bankByDay, setBankByDay] = useState<BankByDay[]>([])

  const daysOfWeek = [
    { day: 'Segunda' },
    { day: 'Terça' },
    { day: 'Quarta' },
    { day: 'Quinta' },
    { day: 'Sexta' },
  ];

  useEffect(() => {
    async function fetchBank() {
      try {
          const response = await axios.get('http://192.168.1.90:30000/banks')

          const banks = response.data

          setBanks(banks)
      } catch (error) {
        throw error
      }

    }

    fetchBank()
  }, [])

  async function fetchBankByDay() {
    try {
        const response = await axios.get('http://192.168.1.90:30000/dayOfWeek')

        if(!response.data) {
          console.error("Erro ao buscar")
          return "erro ao buscar"
        }

        setBankByDay(response.data)
    } catch (error) {
      throw error
    }

  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBankByDay()
  }, [])

  function openModal(day: string) {
    setSelectedDay(day);
    setIsModalOpen(true);
  };

  async function handleSave() {
    try {

      await axios.post('http://192.168.1.90:30000/dayofweek', {
        bankId: formData.bankId,
        dayOfWeek: selectedDay,
        time: formData.time
      });

      setIsModalOpen(false);
      fetchBankByDay()
      alert('Banco adicionado com sucesso!');
    } catch (error) {
      alert('Erro ao salvar agendamento');
      console.error(error)
    }
  };

  async function handleDelete(id: number) {
    if (confirm("Deseja realmente remover este agendamento?")) {
      try {
        await axios.delete(`http://192.168.1.90:30000/dayofweek/${id}`);
        fetchBankByDay();
      } catch (error) {
        alert("Erro ao excluir agendamento");
        console.error(error)
      }
    }
  }

  const filteredDay = useMemo(() => {
    return bankByDay
    .filter(bank => bank.dayOfWeek === filteredDayOfWeek)
    .sort((a, b) => {
      const nomeA = a.bank?.name || "";
      const nomeB = b.bank?.name || "";
      
      return nomeA.localeCompare(nomeB);
    });
  }, [bankByDay, filteredDayOfWeek]);

  return (
    <div className="min-h-screen bg-[#1a0b2e] p-8 text-gray-100 font-sans relative">
      <header className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            Fluxo Semanal de Processamento
          </h1>
          <p className="text-gray-400 mt-2">Acompanhamento de bancos</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            onChange={(e) => setFilteredDayOfWeek(e.target.value)} 
            name="dayFilter" 
            id="dayFilter"
            className="bg-[#1a1a1a] border border-purple-500/30 text-gray-300 p-3 rounded-xl outline-none focus:border-purple-500 hover:border-purple-500/60 transition-all cursor-pointer text-sm font-medium shadow-sm"
          >
            <option className="hidden text-gray-500" value="">Selecione o Dia</option>
            <option className="bg-[#1e132f] text-gray-200" value="Segunda">Segunda</option>
            <option className="bg-[#1e132f] text-gray-200" value="Terça">Terça</option>
            <option className="bg-[#1e132f] text-gray-200" value="Quarta">Quarta</option>
            <option className="bg-[#1e132f] text-gray-200" value="Quinta">Quinta</option>
            <option className="bg-[#1e132f] text-gray-200" value="Sexta">Sexta</option>
            <option className="bg-[#1e132f] text-purple-400 font-bold" value="">Todos os dias</option>
          </select>
          <div className="bg-[#1a1a1a] p-3 rounded-xl border border-purple-500/30">
            <Calendar className="text-purple-500" />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredDay.map((bank, index) => (
          <Link
            href={`/?bank=${bank.bank?.name}`}
            key={index}
            className="flex items-center justify-between bg-[#1c1c1c] px-4 py-2 rounded-xl border border-gray-800 shadow-lg relative group overflow-hidden"
          >
              <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-200">
                  {bank.bank?.name || 'Banco Indefinido'}
              </span>
              <span className="text-[12px] text-gray-500 flex items-center gap-1">
                  <Clock size={12}/> {bank.time}
              </span>
              </div>

              <div className="flex items-center gap-3">
                  <button
                      onClick={() => handleDelete(bank.id)}
                      className="text-gray-600 hover:text-red-500 transition-colors p-1"
                      title="Excluir agendamento"
                  >
                  <Trash2 size={16} />
                  </button>

                  {!bank.bank?.reports?.[0]?.received ? (
                    <input
                      type="checkbox"
                      readOnly
                      checked={!!bank.bank?.reports?.[0]?.notreceived}
                      className="accent-[#ff0000] w-5 h-5 cursor-default"
                  />)
                  : <></>
                  }
                  {!bank.bank?.reports?.[0]?.notreceived ? (
                    <>
                      <input
                        type="checkbox"
                        readOnly
                        checked={!!bank.bank?.reports?.[0]?.received}
                        className="accent-purple-500 w-5 h-5 cursor-default"
                      />
                      <input
                        type="checkbox"
                        readOnly
                        checked={!!bank.bank?.reports?.[0]?.processed}
                        className="accent-[#ff6b3d] w-5 h-5 cursor-default"
                      />
                    </>
                  ) : <></>
                }
              </div>

              <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
          ))
        }
        {filteredDayOfWeek ? null : daysOfWeek.map((item) => (
          <div key={item.day} className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]"></div>
              <h2 className="text-lg font-semibold text-gray-300">{item.day}</h2>
            </div>

            <div className="bg-[#1e132f] overflow-y-auto max-h-100 rounded-2xl p-4 border border-gray-800 flex-1 flex flex-col gap-3">
                {bankByDay
                    ?.filter((b) => b.dayOfWeek === item.day).map((bank, index) => (
                    <Link
                      href={`/?bank=${bank.bank?.name}`}
                      key={index}
                      className="flex items-center justify-between bg-[#1c1c1c] px-4 py-7 rounded-xl border border-gray-800 shadow-lg relative group overflow-hidden"
                    >
                        <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-200">
                            {bank.bank?.name || 'Banco Indefinido'}
                        </span>
                        <span className="text-[12px] text-gray-500 flex items-center gap-1">
                            <Clock size={12}/> {bank.time}
                        </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => handleDelete(bank.id)}
                                className="text-gray-600 hover:text-red-500 transition-colors p-1"
                                title="Excluir agendamento"
                            >
                            <Trash2 size={16} />
                            </button>

                            {!bank.bank?.reports?.[0]?.received ? (
                              <input
                                type="checkbox"
                                readOnly
                                checked={!!bank.bank?.reports?.[0]?.notreceived}
                                className="accent-[#ff0000] w-5 h-5 cursor-default"
                            />)
                            : <></>
                            }
                            {!bank.bank?.reports?.[0]?.notreceived ? (
                              <>
                                <input
                                  type="checkbox"
                                  readOnly
                                  checked={!!bank.bank?.reports?.[0]?.received}
                                  className="accent-purple-500 w-5 h-5 cursor-default"
                                />
                                <input
                                  type="checkbox"
                                  readOnly
                                  checked={!!bank.bank?.reports?.[0]?.processed}
                                  className="accent-[#ff6b3d] w-5 h-5 cursor-default"
                                />
                              </>
                            ) : <></>
                          }
                        </div>

                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                    ))
                }

                {bankByDay?.filter((b) => b.dayOfWeek === item.day).length === 0 && (
                    <div className="flex flex-col items-center justify-center py-8 text-gray-600 border-2 border-dashed border-gray-800 rounded-xl">
                    <p className="text-xs italic">Nenhum banco agendado</p>
                    </div>
                )}
                </div>

            <button
              onClick={() => openModal(item.day)}
              className="bg-[#2f0b3e] w-full p-3 rounded-xl border border-purple-900/50 hover:border-purple-500 transition-all flex items-center justify-center gap-2 text-sm font-medium hover:bg-[#540377]"
            >
              <Plus size={16} /> Adicionar
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-[#1e132f] w-full max-w-md p-6 rounded-3xl border border-purple-500/30 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-purple-300">Novo Banco: {selectedDay}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 font-bold mb-2">Selecionar Banco</label>
                <select
                  className="w-full bg-[#0f081a] border border-gray-800 p-3 rounded-xl focus:border-purple-500 outline-none text-gray-200"
                  onChange={(e) => setFormData({ ...formData, bankId: e.target.value })}
                >
                  <option className='hidden' value="">Selecione um banco...</option>
                  {banks.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 font-bold mb-2">Horário de Início</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full bg-[#0f081a] border border-gray-800 p-3 rounded-xl focus:border-purple-500 outline-none text-gray-200"
                />
              </div>

              <button
                onClick={handleSave}
                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)] mt-4"
              >
                Salvar Agendamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};