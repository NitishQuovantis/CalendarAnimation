import React from 'react';
import {View} from 'react-native';
import {Moment} from 'moment';

import Styles from './styles';
import {MiniCalendar} from '../../Component';
import * as DateUtils from '../../Utils/DateUtils';

export interface Props {}
export interface State {
  weeksArray: Array<Array<Moment>>;
}

export default class Home extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const weeksArray = DateUtils.GetWeekArray(10, 10);

    this.state = {
      weeksArray,
    };
  }

  render() {
    const {weeksArray} = this.state;

    return (
      <View style={Styles.containerStyle}>
        <MiniCalendar weeksArray={weeksArray} />
      </View>
    );
  }
}
