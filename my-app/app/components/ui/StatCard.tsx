export const StatCard = ({ title, value, subtitle, icon: Icon, colorClass, shadowColor }) => (
  <div className={`bg-white/5 border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 ${shadowColor}`}>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-purple-300/60 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-white">{value}</h3>
        <p className="text-xs text-purple-300/40 mt-2">{subtitle}</p>
      </div>
      <div className={`p-3 rounded-lg bg-white/5 ${colorClass}`}>
        <Icon size={24} />
      </div>
    </div>
  </div>
)