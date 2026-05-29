export default function StatCard({ title, value, subtitle, icon: Icon, colorClass, shadowColor }: any) {
    return (
        <div className={`relative overflow-hidden bg-white/2 backdrop-blur-xl border border-white/5 p-6 rounded-3xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${shadowColor}`}>
        <div className="absolute top-0 right-0 p-4 opacity-10">
            <Icon size={80} />
        </div>
        <div className="relative z-10 flex flex-col gap-4">
            <div className={`p-3 w-fit rounded-2xl bg-[#0f081a] border border-white/10 ${colorClass}`}>
            <Icon size={24} />
            </div>
            <div>
            <p className="text-purple-300/60 text-xs font-bold uppercase tracking-[0.2em] mb-1">{title}</p>
            <div className="flex items-end gap-3">
                <h3 className="text-4xl font-black text-white">{value}</h3>
                <span className="text-sm text-purple-400/50 mb-1">{subtitle}</span>
            </div>
            </div>
        </div>
        </div>
    )
}