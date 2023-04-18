import React from 'react';
import { Modal, Platform, Pressable, SafeAreaView, TouchableHighlight, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DateTime } from 'luxon';
import { useTheme } from 'react-native-paper';

type Props = {
   show: boolean;
   onClose: () => void;
   value: string;
   onChange: (date: string) => void;
};

export default function PlatformIndependentDateTimePicker(props: Props) {
   if (Platform.OS === 'ios') {
      return <IosDateTimePicker {...props} />;
   }

   return <AndroidPicker {...props} />;
}

function AndroidPicker({ show, onChange, value, onClose }: Props) {
   if (!show) return null;

   return (
      <DateTimePicker
         value={DateTime.fromISO(value).toJSDate()}
         mode="date"
         maximumDate={new Date()}
         display="inline"
         onChange={(_: any, date?: Date) => {
            onClose();
            if (date) onChange(DateTime.fromJSDate(date).toISODate()!);
         }}
      />
   );
}

function IosDateTimePicker({ show, onChange, value, onClose }: Props) {
   const theme = useTheme();
   const backgroundColor = theme.colors.surface;

   return (
      <Modal
         transparent={true}
         animationType="slide"
         visible={show}
         supportedOrientations={['portrait']}
         onRequestClose={() => onClose()}
      >
         <SafeAreaView style={{ flex: 1 }}>
            <Pressable style={{ flex: 1, alignItems: 'flex-end', flexDirection: 'row' }} onPress={() => onClose()}>
               <TouchableHighlight underlayColor="transparent" style={{ flex: 1 }}>
                  <View
                     style={{
                        backgroundColor,
                        overflow: 'hidden',
                        borderTopLeftRadius: 25,
                        borderTopRightRadius: 25,
                     }}
                  >
                     <View style={{ marginTop: 20, marginBottom: 20, backgroundColor }}>
                        <DateTimePicker
                           display="spinner"
                           mode="date"
                           value={DateTime.fromISO(value).toJSDate()}
                           maximumDate={new Date()}
                           onChange={(_: any, date?: Date) => {
                              if (date) onChange(DateTime.fromJSDate(date).toISODate()!);
                           }}
                        />
                     </View>
                  </View>
               </TouchableHighlight>
            </Pressable>
         </SafeAreaView>
         <SafeAreaView style={{ flex: 0, backgroundColor }} />
      </Modal>
   );
}
