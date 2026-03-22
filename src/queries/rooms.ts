import { queryOptions } from '@tanstack/react-query';
import { getRooms } from 'pages/remotes';

export const roomsQueries = {
  rooms: () => ['rooms'] as const,
  getRooms: () =>
    queryOptions({
      queryKey: roomsQueries.rooms(),
      queryFn: () => getRooms(),
    }),
};
