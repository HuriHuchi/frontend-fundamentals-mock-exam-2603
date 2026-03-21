import { Equipment } from '_tosslib/server/types';
import { useSearchParams } from 'react-router-dom';
import { formatDate } from 'utils/date';

export type Filters = {
  date: string;
  startTime: string;
  endTime: string;
  attendees: number;
  equipment: Equipment[];
  floor: number | null;
};

type Params = {
  onFilterChange: () => void;
};

export function useFilters({ onFilterChange }: Params) {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: Readonly<Filters> = {
    date: searchParams.get('date') || formatDate(new Date()),
    startTime: searchParams.get('startTime') || '',
    endTime: searchParams.get('endTime') || '',
    attendees: Number(searchParams.get('attendees')) || 1,
    equipment: searchParams.get('equipment')
      ? searchParams
          .get('equipment')!
          .split(',')
          .filter(Boolean)
          .map(e => e as Equipment)
      : [],
    floor: searchParams.get('floor') ? Number(searchParams.get('floor')) : null,
  };

  const setFilter = (values: Partial<Filters>) => {
    setSearchParams(
      prev => {
        const newParams = new URLSearchParams(prev);

        Object.entries(values).forEach(([key, value]) => {
          if (value != null && value !== '') {
            newParams.set(key, value.toString());
          } else {
            newParams.delete(key);
          }
        });

        return newParams;
      },
      { replace: true }
    );

    onFilterChange();
  };

  return [filters, setFilter] as const;
}

export const validateFilters = (filters: Filters) => {
  const { startTime, endTime, attendees } = filters;

  const hasTimeInputs = startTime !== '' && endTime !== '';
  let validationError: string | null = null;

  if (hasTimeInputs) {
    if (endTime <= startTime) {
      validationError = '종료 시간은 시작 시간보다 늦어야 합니다.';
    } else if (attendees < 1) {
      validationError = '참석 인원은 1명 이상이어야 합니다.';
    }
  }

  return { error: validationError };
};
