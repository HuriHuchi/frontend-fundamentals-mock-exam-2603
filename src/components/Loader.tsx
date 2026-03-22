import { css, type SerializedStyles } from '@emotion/react';
import { colors } from '_tosslib/constants/colors';

interface LoaderProps {
  size?: number;
  css?: SerializedStyles;
}

const baseStyles = (size: number) => css`
  width: ${size}px;
  height: ${size}px;
  border: 3px solid ${colors.grey200};
  border-top-color: ${colors.blue500};
  border-radius: 50%;
  margin: 0 auto;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export function Loader({ size = 24, css: cssOverride }: LoaderProps) {
  return <div role="progressbar" aria-label="로딩 중" css={[baseStyles(size), cssOverride]} />;
}
