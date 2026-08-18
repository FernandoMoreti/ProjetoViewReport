'use client'

import React, { useState } from 'react'
import axios from 'axios';
import { findBank } from '../utils/utils'

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

  const [banco, setBanco] = useState("")
  const [loading, setLoading] = useState(false)
  const [validar, setValidar] = useState(false)
  const [mostrar, setMostrar] = useState(false)
  const [mensagem, setMensagem] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [date, setDate] = useState(todayStr)
  const [logs, setLogs] = useState<string[]>([])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!banco) {
      setMensagem(true)
      return
    }

    if (loading) {
      return
    }

    setLogs([])
    setLoading(true)

    try {

      const responseFile = await fetch('http://localhost:3008/api/rpa/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bank: banco }),
      });

      if (!responseFile.body) throw new Error("Sem corpo de resposta");

      const reader = responseFile.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (!line.trim()) continue;

          try {
            const parsed = JSON.parse(line);

            if (parsed.type === 'log') {
              setLogs((prev) => [...prev, parsed.message]);
            } else if (parsed.type === 'error') {
              setErrorMessage(parsed.message);
              setValidar(false);
              setMostrar(true);
            } else if (parsed.type === 'success') {
              setValidar(true);
              setMostrar(true);
            } else if (parsed.type === 'file') {
              const { fileData, filename } = parsed;

              const formData = new FormData()
              formData.append('banco', banco)
              formData.append('arquivo', fileData)

              const response = await fetch("http://127.0.0.1:5000/execute", {
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
                const responseProposals = await axios.post("http://localhost:3003/proposal", listOfProposal)

                if (!responseProposals.status) throw new Error("Erro ao salvar propostas no banco de dados")

              } catch (e) {
                throw new Error("Erro ao salvar propostas no banco de dados: " + e)
              }

              const byteCharacters = atob(fileData);
              const byteNumbers = new Array(byteCharacters.length);
              for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
              }
              const blob = new Blob([new Uint8Array(byteNumbers)], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
              });

              const newFilename = filename.replace(".xlsx", "") + " - EDITADO.xlsx" || "arquivo.xlsx";
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = newFilename;
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

              await axios.post("http://localhost:3003/reports", { bank, reports: [report] });

              alert("Dados salvos com sucesso!");
              setValidar(true);
              setMostrar(true);
            }
          } catch (err) {
            console.error("Erro ao processar linha do stream:", err);
          }
        }
      }
    } catch (error) {
      console.error("Erro na conexão:", error);
      setErrorMessage("Erro de conexão com o servidor.");
      setValidar(false);
      setMostrar(true);
    } finally {
      setLoading(false);
      setTimeout(() => {
        setMostrar(false);
        setErrorMessage("");
      }, 5000);
    }
  }

  const bancos = [
    "C6 bank Comissao",
    "Grandino",
    "Jbcred",
    "Novo Saque",
    "Novo Saque Cartao",
    "Baixa Automatica",
    // "NBC",
  ]

  return (
      <div className='flex flex-col h-full'>
        <section className='flex flex-col h-full items-center bg-[#1a0b2e] text-gray-100 font-sans'>
          <p className={`absolute z-10 p-3 text-white transition-opacity duration-500 rounded-b-2xl font-bold text-center ${mostrar ? ' opacity-100 ' : ' opacity-0 '}${validar ? 'bg-purple-600 shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'bg-red-600'}`}>
            {validar ? "Editado com sucesso" : mensagem ? "Faltando credenciais" : errorMessage}
          </p>

          <div className='flex-1 flex gap-10 p-20 justify-center items-center backdrop-blur-sm'>
            <div className='flex flex-col justify-center items-center p-10 gap-20 h-full w-150 bg-[#1e132f] border border-purple-500/20 shadow-2xl shadow-black/50 rounded-4xl'>
              <header className='text-center'>
                <h1 className='text-2xl font-bold bg-linear-to-r from-purple-300 to-purple-600 bg-clip-text text-transparent'>
                  Extração de Relatórios
                </h1>
              </header>

              <form onSubmit={handleSubmit} className='flex flex-col justify-center gap-5 w-full' action="">

                <div>
                  <p className='text-sm font-bold text-gray-400 uppercase tracking-tighter mb-2'>Escolha o banco:</p>
                  <select
                    onChange={(e) => {setBanco(e.target.value)}}
                    className='w-full bg-[#0f081a] border border-gray-800 mt-1 rounded-xl p-4 text-gray-200 shadow-inner cursor-pointer focus:border-purple-500 outline-none appearance-none transition-all' 
                    required
                    name="Banco"
                    id=""
                  >
                    <option className='hidden'>Escolha um banco</option>
                      {bancos.map((banco) => (
                        <option key={banco} value={banco} className="bg-[#1e132f]">{banco}</option>
                      ))}
                  </select>
                </div>

                <button
                    className='bg-purple-600 text-white font-bold rounded-xl p-5 transition-all duration-300 cursor-pointer hover:bg-purple-500 hover:-translate-y-1 shadow-[0_0_20px_rgba(168,85,247,0.3)] active:scale-95' 
                    type='submit'
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Carregando...
                    </span>
                  ) : "Extrair arquivo"}
                </button>
              </form>
            </div>
            <div className='flex flex-col h-full w-full bg-[#1e132f] border border-purple-500/20 shadow-xl rounded-2xl p-5'>
              <p className='text-sm font-bold text-gray-400 uppercase tracking-tighter mb-2'>Console de Execução:</p>
              <div className='bg-[#0f081a] text-green-400 font-mono p-4 rounded-xl h-full overflow-y-auto'>
                {logs.map((log, index) => <div key={index}>{log}</div>)}
              </div>
            </div>
          </div>
        </section>
      </div>
  )
}

export default App
