import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import Styles from './styles';

export interface Props {
  label: string;
  index: number;
  isMorphed?: boolean;
}
export interface State {}

export default class SingleDayItem extends React.Component<Props, State> {
  render() {
    const {label, index, isMorphed} = this.props;
    const color = {
      color: isMorphed ? 'white' : 'black',
    };

    return (
      <TouchableOpacity
        style={Styles.containerStyle}
        onPress={() => {
          console.log('click index is', index);
        }}>
        <Text style={[Styles.noramalTextStyle, color]}>{label}</Text>
      </TouchableOpacity>
    );
  }
}
