import constants from '@/constants';
import { StyleSheet } from 'react-native';

export const headerStyles = StyleSheet.create({
  container: {
    backgroundColor: constants.colorSecondary,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginBottom: constants.margin * 10,
  },
  backButton: {
    padding: constants.padding,
  },
  title: {
    fontSize: constants.largeFontSize,
    fontWeight: constants.fontWeight,
    padding: constants.padding,
  },
  simpleContainer: {
    backgroundColor: constants.colorSecondary,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: constants.padding,
  },
});
