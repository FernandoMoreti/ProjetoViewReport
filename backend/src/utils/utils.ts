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

  const date = new Date().getDate();
  return days[date];
};