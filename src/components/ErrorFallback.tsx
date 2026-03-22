import { css } from '@emotion/react';
import { Button, Spacing, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { FallbackProps } from 'react-error-boundary';

export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const message = error instanceof Error ? error.message : '잠시 후 다시 시도해주세요.';

  return (
    <div
      role="alert"
      css={css`
        padding: 24px;
      `}
    >
      <div
        css={css`
          padding: 16px;
          border-radius: 12px;
          background: ${colors.red50};
        `}
      >
        <Text typography="t6" fontWeight="bold" color={colors.grey900}>
          데이터를 불러오지 못했습니다.
        </Text>
        <Spacing size={6} />
        <Text typography="t7" fontWeight="medium" color={colors.red500}>
          {message}
        </Text>
        <Spacing size={12} />
        <Button size="small" onClick={resetErrorBoundary}>
          다시 시도
        </Button>
      </div>
    </div>
  );
}
