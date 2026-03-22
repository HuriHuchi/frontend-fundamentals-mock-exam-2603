import { queryOptions } from '@tanstack/react-query';
import { getMyReservations, getReservations } from 'pages/remotes';

export const reservationQueries = {
  keys: {
    all: () => ['reservations'],
    list: (date: string) => [...reservationQueries.keys.all(), date],
    myReservations: () => [...reservationQueries.keys.all(), 'myReservations'],
  },
  list: (date: string) =>
    queryOptions({
      queryKey: reservationQueries.keys.list(date),
      queryFn: () => getReservations(date),
      enabled: !!date,
    }),
  myReservations: () =>
    queryOptions({
      queryKey: reservationQueries.keys.myReservations(),
      queryFn: () => getMyReservations(),
    }),
};
