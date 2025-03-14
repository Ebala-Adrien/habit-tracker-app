import { StyleSheet } from 'react-native';
import constants from '@/constants';

export const tabHeaderStyles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: constants.padding,
  },
});
