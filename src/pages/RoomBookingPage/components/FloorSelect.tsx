import { css } from '@emotion/react';
import { Select, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';

interface Props {
  value: number | null;
  onChange: (value: number | null) => void;
  children: React.ReactNode;
}

export function FloorSelect({ value, children, onChange }: Props) {
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        gap: 6px;
        flex: 1;
      `}
    >
      <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
        선호 층
      </Text>
      <Select
        value={value ?? ''}
        onChange={e => {
          const nextValue = e.target.value;
          onChange(nextValue === '' ? null : Number(nextValue));
        }}
        aria-label="선호 층"
      >
        <option value="">전체</option>
        {children}
      </Select>
    </div>
  );
}

export function FloorSelectOption({ floor }: { floor: number }) {
  return (
    <option key={floor} value={floor}>
      {floor}층
    </option>
  );
}
