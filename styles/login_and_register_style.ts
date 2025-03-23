import { StyleSheet } from 'react-native';
import constants from '../constants';

export default StyleSheet.create({
  page: {
    flex: 1,
    display: "flex",
  },
  page_contentContainerStyle: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: constants.padding * 2,
  },
  content_container: {
    flex: 1,
    margin: constants.padding * 2,
    justifyContent: "center",
    alignItems: "center",
    gap: constants.padding * 3,
    width: "100%",
  },
  title: {
    fontWeight: constants.fontWeight,
    fontSize: constants.mediumFontSize,
  },
  subtitle_container: {
    fontWeight: constants.fontWeight,
    display: "flex",
    flexDirection: "row",
  },
  subtitle_part_two: {
    color: constants.colorPrimary,
  },
  inputs_container: {
    gap: constants.padding,
    width: "100%",
  },
  input_container: {
    position: "relative"
  },
  hide_password_container: {
    position: "absolute",
    top: "50%",
    transform: [{ translateY: "-50%" }], 
    right: 10,
    zIndex: 10
  },
  input: {
    backgroundColor: constants.colorPrimary,
    height: constants.padding * 5,
    padding: constants.padding,
    borderRadius: 5,
  },
  input_error: {
    color: constants.colorError,
  },
  forgot_password_container: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  forgot_password_link: {  
    color: constants.colorQuarternary,
    fontWeight: constants.fontWeight,
  }
  ,
  login_button: {
    borderRadius: 5,
    backgroundColor: constants.colorQuarternary,
    borderWidth: constants.borderWidth,
    borderColor: constants.colorQuarternary,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: constants.padding,
  },
  login_button_text: {
    width: "100%",
    textAlign: "center",
    color: constants.colorSecondary,
    fontWeight: constants.fontWeight,
    fontSize: constants.mediumFontSize,
  },
  or_content_container: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  line: {
    flex: 1,
    height: constants.borderWidth,
    backgroundColor: constants.colorPrimary,
  },
  or_text: {
    marginHorizontal: constants.padding,
    fontWeight: constants.fontWeight,
  },
  container_logo_container: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: constants.padding,
  },
  logo_container: {
    flex: 1,
    borderRadius: 5,
    borderColor: constants.colorPrimary,
    borderWidth: constants.borderWidth,
    padding: constants.margin,
    justifyContent: "center",
    alignItems: "center",
  },
});

// Template: https://dribbble.com/shots/24364001-Recognotes-Mobile-App-Design