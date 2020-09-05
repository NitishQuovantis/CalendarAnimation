import React from 'react';
import {View, Text, Animated, ViewStyle, Image} from 'react-native';
import Styles from './styles';
import * as Images from '../../Utils/Images';

export interface Props {
  animation: Animated.Value;
  monthArray: Array<string>;
}

function getAnimatedStyle(
  animated: Animated.Value,
): Animated.AnimatedProps<ViewStyle> {
  const interpolation = animated.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -50],
  });

  return {
    transform: [{translateY: interpolation}],
  };
}

const MonthArray: React.FC<Props> = (props: Props) => {
  const {animation, monthArray} = props;
  const animatedStyle = getAnimatedStyle(animation);

  return (
    <View style={Styles.containerStyle}>
      <Animated.View style={animatedStyle}>
        {monthArray.map((item) => {
          return <MonthItem key={item} name={item} />;
        })}
      </Animated.View>

      <View style={[Styles.imageContainerStyle]}>
        <Image
          source={Images.CalendarIcon}
          style={{width: 20, height: 20}}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

function MonthItem({name}) {
  return (
    <View style={Styles.monthNameContainer}>
      <Text style={Styles.monthNameTextStyle}>{name}</Text>
    </View>
  );
}

export default MonthArray;
