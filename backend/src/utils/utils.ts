export const getCurrentDayOfWeek = (): string => {
  const days = [
    'Domingo',
    'Segunda',
    'Terça',
    'Quarta',
    'Quinta',
    'Sexta',
    'Sábado'
  ];

  const date = new Date().getDay();
  return days[date];
};