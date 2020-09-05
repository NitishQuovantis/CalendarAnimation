import React from 'react';
import {
  View,
  FlatList,
  ListRenderItemInfo,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Animated,
  Dimensions,
  ViewStyle,
} from 'react-native';
import {Moment} from 'moment';
import MaskedView from '@react-native-community/masked-view';
import SingleDayItem from '../SingleDayItem/SingleDayItem';
import WeekComponent from '../WeekComponent/WeekComponent';
import {Width as ItemWidth} from '../SingleDayItem/styles';
import * as DateUtils from '../../Utils/DateUtils';

import Styles, {CircularHightlightSize} from './styles';

const {width: ScreenWidth} = Dimensions.get('screen');

// eslint-disable-next-line no-spaced-func
const List = React.forwardRef<
  FlatList,
  {
    weeksArray: Array<Array<Moment>>;
    onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    onScrollStop?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    isMorphed: boolean;
    onDateClick: ((date: Moment) => void) | null;
  }
>(({weeksArray, onScroll, isMorphed, onDateClick, onScrollStop}, ref: any) => {
  return (
    <FlatList
      initialScrollIndex={10}
      ref={ref}
      showsHorizontalScrollIndicator={false}
      getItemLayout={(data, index) => ({
        length: ScreenWidth,
        offset: ScreenWidth * index,
        index,
      })}
      pagingEnabled
      bounces={false}
      onScroll={onScroll}
      horizontal
      scrollEventThrottle={16}
      decelerationRate="fast"
      onMomentumScrollEnd={onScrollStop}
      data={weeksArray}
      keyExtractor={(item, index) => {
        return index.toString();
      }}
      renderItem={({item}) => {
        return (
          <WeekComponent
            weekDays={item}
            isMorphed={isMorphed}
            onDateClick={onDateClick}
          />
        );
      }}
    />
  );
});

export interface Props {
  weeksArray: Array<Array<Moment>>;
  previousWeeks: number;
  forwardWeeks: number;
}
export interface State {
  circularHightlightAnimated: Animated.Value;
  currentlySelectedDate: Moment;
  selectedDay: number;
}

const Days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default class MiniCalendar extends React.Component<Props, State> {
  realFlatListRef: React.RefObject<FlatList> | null = null;
  dummaryFlatListRef: React.RefObject<FlatList> | null = null;

  constructor(props: Props) {
    super(props);

    const currentDate = DateUtils.getCurrentDate();
    const currentWeekDay = DateUtils.getWeekDayOn(currentDate);

    this.state = {
      currentlySelectedDate: currentDate,
      selectedDay: currentWeekDay,
      circularHightlightAnimated: new Animated.Value(currentWeekDay - 1),
    };
  }

  renderDayName = (props: ListRenderItemInfo<string>) => {
    const {item, index} = props;
    return (
      <SingleDayItem index={index} label={item} data={null} onClick={null} />
    );
  };

  onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    this.dummaryFlatListRef?.current?.scrollToOffset({
      animated: false,
      offset: event.nativeEvent.contentOffset.x,
    });
  };

  onScrollStop = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const {selectedDay} = this.state;
    const {weeksArray} = this.props;

    const offset = event.nativeEvent.contentOffset.x;
    const currentWeekItemIndex = Math.floor(offset / ScreenWidth);
    const currentWeek = weeksArray[currentWeekItemIndex];

    const selectedDate = currentWeek[selectedDay];

    this.setState({currentlySelectedDate: selectedDate});

    console.log('selected date is', selectedDate.format('YYYY-MM-DD'));
  };

  getCircularHighlightStyle = () => {
    const {circularHightlightAnimated} = this.state;

    const leftPosition = 0;
    const finalPosition = ScreenWidth - ItemWidth;

    const translationInterpolation = circularHightlightAnimated.interpolate({
      inputRange: [0, 6],
      outputRange: [leftPosition, finalPosition],
    });

    return {
      transform: [{translateX: translationInterpolation}],
    };
  };

  getMorphingListviewStyle = (): Animated.AnimatedProps<ViewStyle> => {
    const {circularHightlightAnimated} = this.state;

    const leftPosition = 4;
    const finalPosition = ScreenWidth - ItemWidth + 4;

    const translationInterpolation = circularHightlightAnimated.interpolate({
      inputRange: [0, 6],
      outputRange: [leftPosition, finalPosition],
    });

    return {
      transform: [{translateX: translationInterpolation}],
      width: CircularHightlightSize,
      height: CircularHightlightSize,
      backgroundColor: 'black',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    };
  };

  onDateClick = (date: Moment) => {
    const currentDateInWeek = DateUtils.getWeekDayOn(date) - 1;

    console.log('current date is', currentDateInWeek);

    this.setState({
      currentlySelectedDate: date,
      selectedDay: currentDateInWeek,
    });
    this.startDateAnimation(currentDateInWeek);
  };

  startDateAnimation = (toValue: number) => {
    const {circularHightlightAnimated} = this.state;

    Animated.timing(circularHightlightAnimated, {
      toValue,
      duration: 2000,
      useNativeDriver: true,
    }).start();
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
            onDateClick={this.onDateClick}
            onScrollStop={this.onScrollStop}
          />

          <Animated.View
            style={[
              Styles.circleHighlightContainer,
              circularHightlightAnimatedStyle,
            ]}>
            <View style={Styles.circularHighlight} />
          </Animated.View>

          <View style={[Styles.dummyList]} pointerEvents="none">
            <MaskedView
              style={Styles.maskedViewStyle}
              maskElement={
                <View style={Styles.maskedElementStyle}>
                  <Animated.View style={morphingViewAnimatedStyle} />
                </View>
              }>
              {/* <View style={{backgroundColor: 'red', width: 100, height: 50}} /> */}

              <List
                weeksArray={weeksArray}
                ref={this.dummaryFlatListRef}
                isMorphed={true}
                onDateClick={null}
              />
            </MaskedView>
          </View>
        </View>
      </View>
    );
  }
}
