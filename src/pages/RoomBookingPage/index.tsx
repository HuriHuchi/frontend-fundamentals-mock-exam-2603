import { css } from '@emotion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Top, Spacing, Border, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { createReservation } from 'pages/remotes';
import axios from 'axios';
import { useFilters, validateFilters } from './filters';
import { roomsQueries } from 'queries/rooms';
import { reservationQueries } from 'queries/reservation';
import { getTimeSlots } from 'utils/time';
import {
  DatePicker,
  GoBackButton,
  Equipments,
  ErrorMessage,
  ValidationError,
  AttendeesInput,
  TimeSelect,
  AvailableRoomsSection,
  FloorSelect,
} from './components';
import { Reservation, Room } from '_tosslib/server/types';

const TIME_SLOTS = getTimeSlots();

export function RoomBookingPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [filters, setFilters] = useFilters({
    onFilterChange: () => {
      setSelectedRoomId(null);
      setErrorMessage(null);
    },
  });

  const { date, startTime, endTime, attendees, equipment, floor: preferredFloor } = filters;

  const { data: rooms = [] } = useQuery(roomsQueries.getRooms());
  const { data: reservations = [] } = useQuery(reservationQueries.list(date));

  const createMutation = useMutation((data: Omit<Reservation, 'id'>) => createReservation(data), {
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: reservationQueries.keys.all() });
    },
  });

  const { error: validationError } = validateFilters(filters);
  const isFilterComplete = !validationError;

  const conditions: Array<(room: Room) => boolean> = [
    room => room.capacity >= attendees,
    room => equipment.every(eq => room.equipment.includes(eq)),
    room => preferredFloor === null || room.floor === preferredFloor,
    room => {
      const hasConflict = reservations.some(
        r => r.roomId === room.id && r.date === date && r.start < endTime && r.end > startTime
      );
      return !hasConflict;
    },
  ];

  const availableRooms = isFilterComplete
    ? rooms
        .filter(room => conditions.every(c => c(room)))
        .sort((a, b) => {
          if (a.floor !== b.floor) return a.floor - b.floor;
          return a.name.localeCompare(b.name);
        })
    : [];

  const floors = [...new Set(rooms.map(r => r.floor))].sort((a, b) => a - b);

  const handleBook = async () => {
    if (!selectedRoomId) {
      setErrorMessage('회의실을 선택해주세요.');
      return;
    }
    if (!startTime || !endTime) {
      setErrorMessage('시작 시간과 종료 시간을 선택해주세요.');
      return;
    }

    try {
      const result = await createMutation.mutateAsync({
        roomId: selectedRoomId,
        date,
        start: startTime,
        end: endTime,
        attendees,
        equipment,
      });

      if (result.ok) {
        navigate('/', { state: { message: '예약이 완료되었습니다!' } });
        return;
      }

      setErrorMessage(result.message ?? '예약에 실패했습니다.');
      setSelectedRoomId(null);
    } catch (err: unknown) {
      let serverMessage = '예약에 실패했습니다.';
      if (axios.isAxiosError(err)) {
        const data = err.response?.data as { message?: string } | undefined;
        serverMessage = data?.message ?? serverMessage;
      }
      setErrorMessage(serverMessage);
      setSelectedRoomId(null);
    }
  };

  return (
    <div
      css={css`
        background: ${colors.white};
        padding-bottom: 40px;
      `}
    >
      <GoBackButton>← 예약 현황으로</GoBackButton>

      <Top.Top03
        css={css`
          padding-left: 24px;
          padding-right: 24px;
        `}
      >
        예약하기
      </Top.Top03>

      {errorMessage && <ErrorMessage message={errorMessage} />}

      <Spacing size={24} />

      {/* 예약 조건 입력 */}
      <div
        css={css`
          padding: 0 24px;
        `}
      >
        <Text typography="t5" fontWeight="bold" color={colors.grey900}>
          예약 조건
        </Text>
        <Spacing size={16} />

        {/* 날짜 */}
        <DatePicker date={date} setDate={date => setFilters({ date })} label="날짜" />

        <Spacing size={14} />

        {/* 시간 */}
        <div
          css={css`
            display: flex;
            gap: 12px;
          `}
        >
          <TimeSelect
            label="시작 시간"
            value={startTime}
            options={TIME_SLOTS.slice(0, -1)}
            onChange={startTime => setFilters({ startTime })}
          />
          <TimeSelect
            label="종료 시간"
            value={endTime}
            options={TIME_SLOTS.slice(1)}
            onChange={endTime => setFilters({ endTime })}
          />
        </div>
        <Spacing size={14} />

        {/* 참석 인원 + 선호 층 */}
        <div
          css={css`
            display: flex;
            gap: 12px;
          `}
        >
          <AttendeesInput label="참석 인원" value={attendees} onChange={attendees => setFilters({ attendees })} />
          <FloorSelect value={preferredFloor} options={floors} onChange={floor => setFilters({ floor })} />
        </div>
        <Spacing size={14} />

        {/* 장비 */}
        <Equipments
          equipment={equipment}
          onToggle={eq => {
            const selected = equipment.includes(eq);
            const next = selected ? equipment.filter(e => e !== eq) : [...equipment, eq];
            setFilters({ equipment: next });
          }}
        />
      </div>

      {validationError && <ValidationError message={validationError} />}

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {/* 예약 가능 회의실 목록 */}
      {isFilterComplete && (
        <AvailableRoomsSection
          rooms={availableRooms}
          selectedRoomId={selectedRoomId}
          onSelectRoom={setSelectedRoomId}
          onBook={handleBook}
          isBooking={createMutation.isLoading}
        />
      )}

      <Spacing size={24} />
    </div>
  );
}
