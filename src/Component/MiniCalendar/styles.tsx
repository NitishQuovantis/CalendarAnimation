import {StyleSheet} from 'react-native';
import {Width} from '../SingleDayItem/styles';

export const CircularHightlightSize = 50;

const styles = StyleSheet.create({
  containerStyle: {
    height: 200,
    width: '100%',
    justifyContent: 'center',
    alignContent: 'center',
  },

  dummyList: {
    width: Width,
    height: 50,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },

  circleHighlight: {
    width: CircularHightlightSize,
    height: CircularHightlightSize,
    position: 'absolute',
    borderRadius: CircularHightlightSize / 2,
    backgroundColor: 'gray',
  },
});

export default styles;
