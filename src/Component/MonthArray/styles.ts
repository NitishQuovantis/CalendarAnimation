import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  containerStyle: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    overflow: 'hidden',
    paddingLeft: 20,
    marginBottom: 10,
    // alignItems: 'center',
  },

  monthNameContainer: {
    height: 50,
    justifyContent: 'center',
  },

  monthNameTextStyle: {
    fontSize: 30,
    fontWeight: 'bold',
  },

  imageContainerStyle: {
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 40,
  },
});

export default styles;
