import React from 'react';
import {Moment} from 'moment';
import SingleItem from '../SingleDayItem/SingleDayItem';
import {View} from 'react-native';

export interface Props {
  weekDays: Array<Moment>;
  isMorphed: boolean;
  onDateClick: ((date: Moment) => void) | null;
}
export interface State {}

export default class WeekComponent extends React.Component<Props, State> {
  render() {
    const {weekDays, isMorphed, onDateClick} = this.props;

    return (
      <View style={{flexDirection: 'row'}}>
        {weekDays.map((item, index) => {
          const date = item.get('date');
          return (
            <SingleItem
              isMorphed={isMorphed}
              key={index}
              label={date.toString()}
              index={index}
              data={item}
              onClick={onDateClick}
            />
          );
        })}
      </View>
    );
  }
}
