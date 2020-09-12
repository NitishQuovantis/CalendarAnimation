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
import moment, {Moment} from 'moment';
import MaskedView from '@react-native-community/masked-view';
import SingleDayItem from '../SingleDayItem/SingleDayItem';
import WeekComponent from '../WeekComponent/WeekComponent';
import MonthArray from '../MonthArray/MonthArray';
import {Width as ItemWidth} from '../SingleDayItem/styles';
import * as DateUtils from '../../Utils/DateUtils';

import Styles, {CircularHightlightSize} from './styles';
import {CalendarPadding} from '../../Screens/Home/styles';

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
    backwardWeeks: number;
  }
>(
  (
    {weeksArray, onScroll, isMorphed, onDateClick, onScrollStop, backwardWeeks},
    ref: any,
  ) => {
    return (
      <FlatList
        initialScrollIndex={backwardWeeks - 1}
        ref={ref}
        showsHorizontalScrollIndicator={false}
        getItemLayout={(data, index) => ({
          length: ScreenWidth - 2 * CalendarPadding,
          offset: (ScreenWidth - 2 * CalendarPadding) * index,
          index,
        })}
        pagingEnabled
        bounces={false}
        onScroll={onScroll}
        horizontal
        scrollEventThrottle={16}
        //   decelerationRate="fast"
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
  },
);

export interface Props {
  weeksArray: Array<Array<Moment>>;
  previousWeeks: number;
  forwardWeeks: number;
  monthArray: Array<string>;
}
export interface State {
  circularHightlightAnimated: Animated.Value;
  currentlySelectedDate: Moment;
  selectedDay: number;
  monthAnimation: Animated.Value;
}

const Days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default class MiniCalendar extends React.Component<Props, State> {
  realFlatListRef: React.RefObject<FlatList> | null = null;
  dummaryFlatListRef: React.RefObject<FlatList> | null = null;

  constructor(props: Props) {
    super(props);

    const currentDate = DateUtils.getCurrentDate();
    const currentWeekDay = DateUtils.getWeekDayOn(currentDate);
    const currentMonthIndex = DateUtils.getMonthIndex(
      props.monthArray,
      moment(),
    );

    this.state = {
      currentlySelectedDate: currentDate,
      selectedDay: currentWeekDay,
      circularHightlightAnimated: new Animated.Value(currentWeekDay - 1),
      monthAnimation: new Animated.Value(currentMonthIndex),
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
    const selectedMonthIndex = DateUtils.getMonthIndex(
      this.props.monthArray,
      selectedDate,
    );

    this.setState({currentlySelectedDate: selectedDate});
    this.startMonthNameAnimation(selectedMonthIndex);
  };

  getCircularHighlightStyle = () => {
    const {circularHightlightAnimated} = this.state;

    const leftPosition = 0;
    const finalPosition = ScreenWidth - ItemWidth - 2 * CalendarPadding;

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
    const finalPosition = ScreenWidth - ItemWidth + 4 - 2 * CalendarPadding;

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
    const currentMonthIndex = DateUtils.getMonthIndex(
      this.props.monthArray,
      date,
    );

    this.setState({
      currentlySelectedDate: date,
      selectedDay: currentDateInWeek,
    });
    this.startDateAnimation(currentDateInWeek);
    this.startMonthNameAnimation(currentMonthIndex);
  };

  startDateAnimation = (toValue: number) => {
    const {circularHightlightAnimated} = this.state;

    Animated.timing(circularHightlightAnimated, {
      toValue,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  startMonthNameAnimation = (toValue: number) => {
    console.log('month name animatino is', toValue);

    const {monthAnimation} = this.state;
    Animated.timing(monthAnimation, {
      toValue,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  render() {
    this.realFlatListRef = React.createRef<FlatList>();
    this.dummaryFlatListRef = React.createRef<FlatList>();

    const circularHightlightAnimatedStyle = this.getCircularHighlightStyle();
    const morphingViewAnimatedStyle = this.getMorphingListviewStyle();

    const {weeksArray, monthArray, previousWeeks} = this.props;
    const {monthAnimation} = this.state;

    return (
      <View style={Styles.containerStyle}>
        <MonthArray animation={monthAnimation} monthArray={monthArray} />

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
            key="Actual list"
            ref={this.realFlatListRef}
            weeksArray={weeksArray}
            onScroll={this.onScroll}
            backwardWeeks={previousWeeks}
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
                backwardWeeks={previousWeeks}
                onDateClick={null}
              />
            </MaskedView>
          </View>
        </View>
      </View>
    );
  }
}
