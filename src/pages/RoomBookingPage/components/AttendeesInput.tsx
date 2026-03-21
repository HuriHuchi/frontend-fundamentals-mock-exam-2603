import { css } from '@emotion/react';
import { colors } from '_tosslib/constants/colors';
import { Text } from '_tosslib/components';

interface Props {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export function AttendeesInput({ label, value, onChange }: Props) {
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
        {label}
      </Text>
      <input
        type="number"
        min={1}
        value={value}
        onChange={e => {
          onChange(Number(e.target.value));
        }}
        aria-label="참석 인원"
        css={css`
          box-sizing: border-box;
          font-size: 16px;
          font-weight: 500;
          line-height: 1.5;
          height: 48px;
          background-color: ${colors.grey50};
          border-radius: 12px;
          color: ${colors.grey800};
          width: 100%;
          border: 1px solid ${colors.grey200};
          padding: 0 16px;
          outline: none;
          transition: border-color 0.15s;
          &:focus {
            border-color: ${colors.blue500};
          }
        `}
      />
    </div>
  );
}
