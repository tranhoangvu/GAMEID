const React = require("react-native");

const { StyleSheet } = React;

export default {
    container: {
        backgroundColor: "#FFF",
        flex: 1,
        justifyContent: 'center'
    },
    mainView: {
        flexDirection: "row",
        height: 57,
        backgroundColor: "#fff"
    },
    Title: {
        alignSelf: "flex-start",
        color: "#041A33",
        fontSize: 24,
        textAlign: "justify",
        justifyContent: "center",
        //marginTop:5
        // fontWeight:'400'
    },

    ListContentText: {
        alignSelf: "flex-start",
        marginTop: 15,
        color: "#041A33",
        // fontSize: 14,
        textAlign: "justify"
    },
    imageWrapper: {
        borderRadius: 10,
        width: 298,
        height: 190,
        alignSelf: "center"
    },
    itemContainer: {
        backgroundColor: "#fff",
        shadowOffset: { width: 5, height: 5 },
        width: 298,
        // height: 230,
        marginBottom: 10,
        marginRight: 3,
        marginLeft: 15,
        paddingTop: 5
        // flex:1
    },
    indicator: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        color: '#041A33',
        height: 80
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10
    },
    mb: {
        right: 0,
        flex: 1,
        position: 'absolute'
    },
    icon_mb: {
        right: 10
    },
    row: {
        // width: screen.width - 30,
        flexDirection: 'row',
    },
    containerModal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent'
    },
    MainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ModalInsideView: {
        alignItems: 'center',
        backgroundColor: "#fff",
        height: '75%',
        width: '90%',
        borderRadius: 10,
        borderWidth: 0.1,
        borderColor: '#000',
    },
    TextStyle: {
        marginTop: 10,
        fontSize: 16,
        color: "#000",
    },
    ModalButton: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
    },
    closeView: {
        position: 'absolute',
        top: 0,
        right: 2,
        // marginTop: Platform.OS === "android" ? 5 : 15,
        // margin: 6,
        // alignItems: 'flex-end',
    },
};
