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
    // width: Width,
    height: 50,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },

  circleHighlightContainer: {
    width: Width,
    height: CircularHightlightSize,
    position: 'absolute',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },

  circularHighlight: {
    width: CircularHightlightSize,
    height: CircularHightlightSize,
    borderRadius: CircularHightlightSize / 2,
    backgroundColor: 'red',
  },

  maskedViewStyle: {
    flex: 1,
  },

  maskedElementStyle: {
    backgroundColor: 'transparent',
    width: '100%',
    height: '100%',
  },
});

export default styles;
