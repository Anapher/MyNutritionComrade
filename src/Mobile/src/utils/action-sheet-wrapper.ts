import { ActionSheetProps } from '@expo/react-native-action-sheet';
import i18next from 'src/services/i18n';

type SheetButton = {
   label: string;
   onPress?: () => void;
   isCancel?: boolean;
   destructive?: boolean;
};

export function CancelButton(): SheetButton {
   return { label: i18next.t('common:cancel'), isCancel: true };
}

type Options = {
   title?: string;
};

export default function wrapActionSheet(
   func: ActionSheetProps['showActionSheetWithOptions'],
   buttons: SheetButton[],
   options?: Options,
) {
   func(
      {
         options: buttons.map((x) => x.label),
         cancelButtonIndex: indexNotFoundIsUndefined(buttons.findIndex((x) => x.isCancel)),
         destructiveButtonIndex: indexNotFoundIsUndefined(buttons.findIndex((x) => x.destructive)),
         title: options?.title,
      },
      (index) => buttons[index].onPress?.(),
   );
}

function indexNotFoundIsUndefined(index: number): number | undefined {
   return index === -1 ? undefined : index;
}
