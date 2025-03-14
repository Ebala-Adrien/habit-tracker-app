import constants from '@/constants';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    page_content_container: {
        flex: 1,
        paddingBottom: constants.padding * 2,
    },
    page_title: {
         margin: constants.padding,
        fontWeight: constants.fontWeight,
        fontSize: constants.largeFontSize,
    },
    page_flex_row_block: {
        margin: constants.padding,
        padding: constants.padding,
        gap: constants.padding * 4,
        backgroundColor: constants.colorSecondary,
        borderRadius: 10,
        display: "flex",
        flexDirection: "row",
    },
    subtitle_text: {
        fontWeight: constants.fontWeight,
        fontSize: constants.mediumFontSize,
    },
    h3_text: {
        fontWeight: constants.fontWeight,
        fontSize: constants.smallFontSize,
    }
})