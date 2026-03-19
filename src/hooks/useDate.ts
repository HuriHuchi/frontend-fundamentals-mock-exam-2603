import { useSearchParams } from 'react-router-dom';
import { formatDate } from 'utils/date';

export function useDate() {
  const [searchParams, setSearchParams] = useSearchParams();
  const date = searchParams.get('date') || formatDate(new Date());

  const setDate = (date: string) => {
    searchParams.set('date', date);
    setSearchParams(searchParams);
  };

  return [date, setDate] as const;
}
