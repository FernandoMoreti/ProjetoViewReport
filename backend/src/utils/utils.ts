export const getCurrentDayOfWeek = (dateOfReport: string): string => {
  const days = [
    'Domingo',
    'Segunda',
    'Terça',
    'Quarta',
    'Quinta',
    'Sexta',
    'Sábado'
  ];

  const date = new Date(dateOfReport).getUTCDay();
  return days[date];
};