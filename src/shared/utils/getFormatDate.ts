import { format as fnsFormat, isSameDay, subDays } from 'date-fns';
import { es } from 'date-fns/locale';

export const getFmtDate = (date: string | number | Date, format: string) => {
  if (format) {
    return fnsFormat(date, format, { locale: es });
  }

  const fmtDate = fnsFormat(date, 'dd/MMM/yyyy hh:mm/aaa', { locale: es });
  const parts = fmtDate.split(' ');
  const time = parts[1].toUpperCase();

  return `${parts[0]} ${time.toUpperCase()}`;
}

export const getPartDate = (date: string | number | Date) => {
  let [weekday, day, month, year, strDate] = getFmtDate(date, 'EEEE dd MMMM yyyy yyyy-MM-dd').split(' ');

  weekday = weekday[0].toUpperCase() + weekday.slice(1);
  month = month[0].toUpperCase() + month.slice(1);

  const regressiveWeekday = isSameDay(date, new Date())
    ? 'Hoy' : isSameDay(date, subDays(new Date(), 1))
      ? 'Ayer' : weekday;

  const splitStrDate = strDate.split('-');

  return {
    strDate,
    date: date.toLocaleString(),
    weekday,
    day,
    month,
    year,
    regressiveWeekday,
    weekdayStyle: {
      long: weekday,
      short: weekday.slice(0, 3),
    },
    monthStyle: {
      long: month,
      short: month.slice(0, 3),
      number: splitStrDate[1]
    },
  }
}