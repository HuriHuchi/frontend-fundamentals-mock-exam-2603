import { css } from '@emotion/react';
import { Spacing, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { Equipment } from '_tosslib/server/types';
import { EQUIPMENT_LABELS } from 'pages/const';

const ALL_EQUIPMENT: Equipment[] = ['tv', 'whiteboard', 'video', 'speaker'];

interface EquipmentsProps {
  equipment: Equipment[];
  onToggle: (equipment: Equipment) => void;
}

export function Equipments({ equipment, onToggle }: EquipmentsProps) {
  return (
    <div>
      <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
        필요 장비
      </Text>
      <Spacing size={8} />
      <div
        css={css`
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        `}
      >
        {ALL_EQUIPMENT.map(eq => {
          const selected = equipment.includes(eq);
          return (
            <button
              key={eq}
              type="button"
              onClick={() => {
                onToggle(eq);
              }}
              aria-label={EQUIPMENT_LABELS[eq]}
              aria-pressed={selected}
              css={css`
                padding: 8px 16px;
                border-radius: 20px;
                border: 1px solid ${selected ? colors.blue500 : colors.grey200};
                background: ${selected ? colors.blue50 : colors.grey50};
                color: ${selected ? colors.blue600 : colors.grey700};
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.15s;
                &:hover {
                  border-color: ${selected ? colors.blue500 : colors.grey400};
                }
              `}
            >
              {EQUIPMENT_LABELS[eq]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
