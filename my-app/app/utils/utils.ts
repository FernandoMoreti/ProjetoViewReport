export function generateLast30Days() {
  const dates = [];
  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates; // Retorna [hoje, ontem, anteontem...]
};
