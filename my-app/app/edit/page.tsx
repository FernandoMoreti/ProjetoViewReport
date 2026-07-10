'use client'

import React, { useState } from 'react'
import logo from "../../public/logo.jpg"
import Image from 'next/image';
import axios from 'axios';
import { findBank, extractFilename } from '../utils/utils'

interface ReportAttributes {
  dateOfReport: string;
  bankId: string;
  filename: string;
  notreceived: boolean;
  received: boolean;
  processed: boolean;
  processedAt: string | null;
}

function App() {

  const todayStr = new Date().toISOString().split('T')[0];

  const [file, setFile] = useState<File | null>(null)
  const [banco, setBanco] = useState("")
  const [loading, setLoading] = useState(false)
  const [validar, setValidar] = useState(false)
  const [mostrar, setMostrar] = useState(false)
  const [mensagem, setMensagem] = useState(false)
  const [date, setDate] = useState(todayStr)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!file || !banco) {
      setMensagem(true)
      return
    }

    setLoading(true)

    const formData = new FormData();
    formData.append("banco", banco)
    formData.append("arquivo", file)


    try {

      const response = await fetch("http://192.168.1.90:5000/execute", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Erro no processamento do arquivo");

      const responseData = await response.json()
      const bank = await findBank(banco);

      if (bank == "Banco não localizado") {
        throw new Error(`Banco '${banco}' não esta mapeado no sistema.`);
      }

      const listOfProposal = responseData.listOfProposal;
      try {
        const responseProposals = await axios.post("http://192.168.1.90:30000/proposal", listOfProposal)

        if (!responseProposals.status) throw new Error("Erro ao salvar propostas no banco de dados")

      } catch (e) {
        throw new Error("Erro ao salvar propostas no banco de dados: " + e)
      }

      const byteCharacters = atob(responseData.arquivo_base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });

      const filename = responseData.nome_arquivo || "arquivo.xlsx";
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);

      const report: ReportAttributes = {
        dateOfReport: date,
        bankId: bank,
        filename: filename,
        notreceived: false,
        received: true,
        processed: false,
        processedAt: null
      }

      await axios.post("http://192.168.1.90:30000/reports", { bank, reports: [report] });

      alert("Dados salvos com sucesso!");
      setValidar(true)
    } catch(error) {
      console.error("Erro ao enviar:", error)
      setValidar(false)
    } finally {
      setMostrar(true)
      setLoading(false)

      setTimeout(() => {
        setMensagem(false)
        setMostrar(false)
      }, 2000)
    }
  }

  const bancos = [
    "Aki",
    "Amigoz",
    "Bmg Bonus 34362",
    "Bmg Cartao Beneficio 34362",
    "Bmg Saldo 34362",
    "Bmg Seguro 34362",
    "Bmg Bonus 53259",
    "Bmg Cartao Beneficio 53259",
    "Bmg Saldo 53259",
    "Bmg Seguro 53259",
    "BRB 360",
    "BRB Inconta Validar",
    "BRB Red",
    "BTW",
    "Bv",
    "C6 Auto",
    "C6 bank Comissao",
    // "C6_BANK",
    "C6 Equity",
    "Caixa",
    "CAPITAL CONSIG Cancelados",
    "CAPITAL CONSIG Comissao",
    "CAPITAL CONSIG Seguro",
    "Comissao Zerada",
    "Crefaz",
    "Crefaz CLT",
    // "CrefisaJN",
    // "CrefisaWL",
    "Daycoval Cartao",
    "Daycoval Cartao EX",
    "Daycoval Consig",
    "Daycoval Consig EX",
    "Digio",
    "EmpresteiCred",
    "Euro",
    "Evol",
    "Facta",
    "Grandino",
    "Happy",
    "Hope",
    "Icred",
    "Jbcred",
    "Kardbank",
    "NBC",
    "NEO",
    "Novo Saque",
    "Novo Saque Cartao",
    "NYC",
    "Parana Bank",
    "PAN LAFY",
    "PHtech",
    "Presenca",
    "QualiBank",
    "Safra Comissao Zero CBU",
    "Safra Comissao Zero CBSU",
    "Safra Debitos",
    "Santander Fit",
    "Santander FVEVI",
    "OLE_FVE",
    "Total Cash",
    "V8",
    "VCtex NOVA",
    "VCtex WL",
    "Viacerta",
    "WebCash"
   ]

  return (
      <div className='flex flex-col h-full'>
        <section className='flex flex-col h-full items-center bg-[#1a0b2e] text-gray-100 font-sans'>
          <p className={`absolute z-10 p-3 text-white transition-opacity duration-500 rounded-b-2xl font-bold text-center ${mostrar ? ' opacity-100 ' : ' opacity-0 '}${validar ? 'bg-purple-600 shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'bg-red-600'}`}>
            {validar ? "Editado com sucesso" : mensagem ? "Faltando credenciais" : "Não foi possivel editar"}
          </p>

          <div className='flex-1 flex justify-center items-center backdrop-blur-sm'>
            <div className='flex flex-col p-10 h-120 w-120 bg-[#1e132f] border border-purple-500/20 shadow-2xl shadow-black/50 rounded-l-4xl'>
              <header className='mb-8 text-center'>
                <h1 className='text-2xl font-bold bg-linear-to-r from-purple-300 to-purple-600 bg-clip-text text-transparent'>
                    Conversor WORKBANK
                </h1>
                </header>

                <form onSubmit={handleSubmit} className='flex flex-col justify-center h-full gap-5' action="">
                <div>
                  <p className='text-sm font-bold text-gray-400 uppercase tracking-tighter mb-2'>Importe o relatório:</p>
                  <input
                    className="w-full bg-[#0f081a] border border-gray-800 mt-1 rounded-xl p-4 text-sm text-gray-300 shadow-inner cursor-pointer focus:border-purple-500 outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-purple-900/30 file:text-purple-400 hover:file:bg-purple-900/50"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => e.target.files && setFile(e.target.files[0])}
                    type="file"
                  />
                </div>

                <div className='flex gap-5'>
                  <div>
                    <p className='text-sm font-bold text-gray-400 uppercase tracking-tighter mb-2'>Escolha o banco:</p>
                    <select
                      onChange={(e) => {setBanco(e.target.value)}}
                      className='w-full bg-[#0f081a] border border-gray-800 mt-1 rounded-xl p-4 text-gray-200 shadow-inner cursor-pointer focus:border-purple-500 outline-none appearance-none transition-all' 
                      name="Banco"
                      id=""
                    >
                      <option className='hidden'>Escolha um banco</option>
                        {bancos.map((banco) => (
                          <option key={banco} value={banco} className="bg-[#1e132f]">{banco}</option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <p className='text-sm font-bold text-gray-400 uppercase tracking-tighter mb-2'>Data do Relatório:</p>
                    <input
                      className='w-full bg-[#0f081a] border border-gray-800 mt-1 rounded-xl p-4 text-gray-200 shadow-inner cursor-pointer focus:border-purple-500 outline-none appearance-none transition-all' 
                      onChange={(e) => setDate(e.target.value)}
                      type="date"
                      value={date}
                    />
                  </div>

                </div>

                <button
                    className='mt-4 bg-purple-600 text-white font-bold rounded-xl p-5 transition-all duration-300 cursor-pointer hover:bg-purple-500 hover:-translate-y-1 shadow-[0_0_20px_rgba(168,85,247,0.3)] active:scale-95' 
                    type='submit'
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Carregando...
                    </span>
                  ) : "Criar arquivo"}
                </button>
              </form>
            </div>

            <div className="h-120 flex items-center bg-[#1e132f] rounded-r-4xl border border-l-0 border-purple-500/20 shadow-2xl">
              <Image
                className='logo w-120 rounded-br-4xl rounded-tr-4xl'
                src={logo}
                alt="Logo Workbank"
                width={120}
                height={120}
              />
            </div>
          </div>
        </section>
      </div>
  )
}

export default App
