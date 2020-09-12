import {StyleSheet, Dimensions} from 'react-native';
import {CalendarPadding} from '../../Screens/Home/styles';

export const Height = 50;
export const Width = (Dimensions.get('screen').width - 2 * CalendarPadding) / 7;

const styles = StyleSheet.create({
  containerStyle: {
    width: Width,
    height: Height,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },

  noramalTextStyle: {
    fontSize: 20,
  },
});

export default styles;
