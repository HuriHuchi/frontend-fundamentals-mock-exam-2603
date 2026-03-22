import { useSearchParams } from 'react-router-dom';
import { formatDate } from 'utils/date';

export function useDate() {
  const [searchParams, setSearchParams] = useSearchParams();
  const date = searchParams.get('date') ?? formatDate(new Date());

  const setDate = (date: string) => {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set('date', date);
    setSearchParams(nextSearchParams);
  };

  return [date, setDate] as const;
}
