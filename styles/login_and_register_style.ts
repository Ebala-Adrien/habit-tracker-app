import { StyleSheet } from 'react-native';
import constants from '../constants';

export default StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  page_contentContainerStyle: {
    flexGrow: 1,
  },
  content_container: {
    flex: 1,
    padding: constants.padding * 2,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: constants.padding * 2,
    textAlign: "center",
  },
  subtitle_container: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: constants.padding * 3,
  },
  subtitle_part_two: {
    color: "#007AFF",
    fontWeight: "600",
  },
  inputs_container: {
    gap: constants.padding,
    marginBottom: constants.padding * 2,
  },
  input_container: {
    position: "relative",
  },
  input: {
    backgroundColor: "#F5F5F5",
    padding: constants.padding * 1.5,
    borderRadius: 12,
    fontSize: 16,
    color: "#1A1A1A",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  input_error: {
    color: "#FF3B30",
    marginTop: 4,
    fontSize: 14,
  },
  hide_password_container: {
    position: "absolute",
    right: constants.padding,
    top: constants.padding,
    zIndex: 1,
  },
  forgot_password_container: {
    alignItems: "flex-end",
    marginTop: constants.padding,
  },
  forgot_password_link: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "500",
  },
  login_button: {
    backgroundColor: "#007AFF",
    padding: constants.padding * 1.5,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: constants.padding,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  login_button_text: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  or_content_container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: constants.padding * 2,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  or_text: {
    marginHorizontal: constants.padding,
    color: "#8E8E93",
    fontSize: 14,
  },
  container_logo_container: {
    flexDirection: "row",
    justifyContent: "center",
  },
  logo_container: {
    padding: constants.padding,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
});