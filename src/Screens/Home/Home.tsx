import React from 'react';
import {View} from 'react-native';
import moment, {Moment} from 'moment';

import Styles from './styles';
import {MiniCalendar} from '../../Component';
import * as DateUtils from '../../Utils/DateUtils';

export interface Props {}
export interface State {
  weeksArray: Array<Array<Moment>>;
  monthArray: Array<string>;
}

export default class Home extends React.Component<Props, State> {
  previousWeeks: number = 10;
  forwardWeeks: number = 10;

  constructor(props: Props) {
    super(props);

    const weeksArray = DateUtils.GetWeekArray(
      this.forwardWeeks,
      this.previousWeeks,
    );
    const monthNameArray = this.getMonthFromWeekArray(weeksArray);

    this.state = {
      weeksArray,
      monthArray: monthNameArray,
    };
  }

  getMonthFromWeekArray = (weeksArray: Array<Array<Moment>>): Array<string> => {
    const firstDate = weeksArray[0][0];
    const lastDate = weeksArray[weeksArray.length - 1][6];

    let monthNameArray: Array<string> = [];

    let now = moment(firstDate);

    while (lastDate.isSameOrAfter(now)) {
      const monthName = now.format('MMMM');
      now = now.add(1, 'month');
      monthNameArray.push(monthName);
    }

    return monthNameArray;
  };

  render() {
    const {weeksArray, monthArray} = this.state;

    return (
      <View style={Styles.containerStyle}>
        <MiniCalendar
          weeksArray={weeksArray}
          previousWeeks={this.previousWeeks}
          forwardWeeks={this.forwardWeeks}
          monthArray={monthArray}
        />
      </View>
    );
  }
}
