import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import Styles from './styles';
import {Moment} from 'moment';

export interface Props {
  label: string;
  index: number;
  isMorphed?: boolean;
  onClick: ((date: Moment) => void) | null;
  data: Moment | null;
}
export interface State {}

export default class SingleDayItem extends React.Component<Props, State> {
  render() {
    const {label, isMorphed, onClick, data} = this.props;
    const color = {
      color: isMorphed ? 'white' : 'black',
    };

    return (
      <TouchableOpacity
        style={Styles.containerStyle}
        onPress={() => {
          if (onClick) {
            onClick(data);
          }
        }}>
        <Text style={[Styles.noramalTextStyle, color]}>{label}</Text>
      </TouchableOpacity>
    );
  }
}
