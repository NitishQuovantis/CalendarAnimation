import React from 'react';
import {
  View,
  FlatList,
  ListRenderItemInfo,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Animated,
  Dimensions,
} from 'react-native';
import {Moment} from 'moment';
import SingleDayItem from '../SingleDayItem/SingleDayItem';
import WeekComponent from '../WeekComponent/WeekComponent';
import {Width as ItemWidth} from '../SingleDayItem/styles';

import Styles, {CircularHightlightSize} from './styles';

const {width: ScreenWidth} = Dimensions.get('screen');

// eslint-disable-next-line no-spaced-func
const List = React.forwardRef<
  FlatList,
  {
    weeksArray: Array<Array<Moment>>;
    onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    isMorphed: boolean;
  }
>(({weeksArray, onScroll, isMorphed}, ref: any) => {
  return (
    <FlatList
      ref={ref}
      showsHorizontalScrollIndicator={false}
      pagingEnabled
      bounces={false}
      onScroll={onScroll}
      horizontal
      decelerationRate="fast"
      data={weeksArray}
      keyExtractor={(item, index) => {
        return index.toString();
      }}
      renderItem={({item}) => {
        return <WeekComponent weekDays={item} isMorphed={isMorphed} />;
      }}
    />
  );
});

export interface Props {
  weeksArray: Array<Array<Moment>>;
}
export interface State {
  circularHightlightAnimated: Animated.Value;
}

const Days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default class MiniCalendar extends React.Component<Props, State> {
  realFlatListRef: React.RefObject<FlatList> | null = null;
  dummaryFlatListRef: React.RefObject<FlatList> | null = null;

  constructor(props: Props) {
    super(props);

    this.state = {
      circularHightlightAnimated: new Animated.Value(6),
    };
  }

  renderDayName = (props: ListRenderItemInfo<string>) => {
    const {item, index} = props;
    return <SingleDayItem index={index} label={item} />;
  };

  onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    this.dummaryFlatListRef?.current?.scrollToOffset({
      animated: false,
      offset: event.nativeEvent.contentOffset.x,
    });
  };

  getCircularHighlightStyle = () => {
    const {circularHightlightAnimated} = this.state;

    const leftPosition = (ItemWidth - CircularHightlightSize) / 2;
    const finalPosition = ScreenWidth - leftPosition;

    const translationInterpolation = circularHightlightAnimated.interpolate({
      inputRange: [0, 7], // input is actually 0 to 6 but to show 6 value in the view either input range to 7 or subtract width of 1 item from final position
      outputRange: [leftPosition, finalPosition],
    });

    return {
      transform: [{translateX: translationInterpolation}],
    };
  };

  getMorphingListviewStyle = () => {
    const {circularHightlightAnimated} = this.state;

    const leftPosition = 0;
    const finalPosition = ScreenWidth - leftPosition;

    const translationInterpolation = circularHightlightAnimated.interpolate({
      inputRange: [0, 7], // input is actually 0 to 6 but to show 6 value in the view either input range to 7 or subtract width of 1 item from final position
      outputRange: [leftPosition, finalPosition],
    });

    return {
      transform: [{translateX: translationInterpolation}],
    };
  };

  render() {
    this.realFlatListRef = React.createRef<FlatList>();
    this.dummaryFlatListRef = React.createRef<FlatList>();

    const circularHightlightAnimatedStyle = this.getCircularHighlightStyle();
    const morphingViewAnimatedStyle = this.getMorphingListviewStyle();

    const {weeksArray} = this.props;

    return (
      <View style={Styles.containerStyle}>
        <View>
          <FlatList
            bounces={false}
            horizontal
            data={Days}
            keyExtractor={(item, index) => {
              return index.toString();
            }}
            renderItem={this.renderDayName}
          />
        </View>

        <View>
          <List
            ref={this.realFlatListRef}
            weeksArray={weeksArray}
            onScroll={this.onScroll}
            isMorphed={false}
          />

          <Animated.View
            style={[Styles.circleHighlight, circularHightlightAnimatedStyle]}
          />

          <Animated.View
            style={[Styles.dummyList, morphingViewAnimatedStyle]}
            pointerEvents="none">
            <List
              weeksArray={weeksArray}
              ref={this.dummaryFlatListRef}
              isMorphed={true}
            />
          </Animated.View>
        </View>
      </View>
    );
  }
}
