import { css } from '@emotion/react';
import { colors } from '_tosslib/constants/colors';
import { useNavigate } from 'react-router-dom';

export function GoBackButton({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  return (
    <div
      css={css`
        padding: 12px 24px 0;
      `}
    >
      <button
        type="button"
        onClick={() => navigate('/')}
        aria-label="뒤로가기"
        css={css`
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          font-size: 14px;
          color: ${colors.grey600};
          &:hover {
            color: ${colors.grey900};
          }
        `}
      >
        {children}
      </button>
    </div>
  );
}
