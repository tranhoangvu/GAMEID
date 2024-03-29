const React = require("react-native");
const { StyleSheet, Platform, Dimensions } = React;
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default {
    sidebar: {
        flex: 1,
        backgroundColor: "#fff"
    },
    drawerCover: {
        alignSelf: "stretch",
        // resizeMode: 'cover',
        height: deviceHeight / 3.5,
        width: null,
        position: "relative",
        marginBottom: 10
    },
    drawerImage: {
        position: 'absolute',
        // left: (Platform.OS === 'android') ? 30 : 40,
        left: Platform.OS === "android" ? deviceWidth / 10 : deviceWidth / 9,
        // top: (Platform.OS === 'android') ? 45 : 55,
        top: Platform.OS === "android" ? deviceHeight / 13 : deviceHeight / 12,
        width: 210,
        height: 75,
        //resizeMode: "cover"
    },
    listItemContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    iconContainer: {
        width: 37,
        height: 37,
        borderRadius: 18,
        marginRight: 12,
        paddingTop: Platform.OS === "android" ? 7 : 5
    },
    sidebarIcon: {
        fontSize: 21,
        color: "#fff",
        lineHeight: Platform.OS === "android" ? 21 : 25,
        backgroundColor: "transparent",
        alignSelf: "center"
    },
    text: {
        fontWeight: Platform.OS === "ios" ? "500" : "400",
        fontSize: 16,
        marginLeft: 20
    },
    badgeText: {
        fontSize: Platform.OS === "ios" ? 13 : 11,
        fontWeight: "400",
        textAlign: "center",
        marginTop: Platform.OS === "android" ? -3 : undefined
    },
    profile: {
        flex: 1,
        // position: 'absolute',
        // left: 10,
        // bottom: 10,
        // left: (Platform.OS === 'android') ? 30 : 40,
        // left: Platform.OS === "android" ? deviceWidth / 5.5 : deviceWidth / 4.5,
        // top: (Platform.OS === 'android') ? 45 : 55,
        // top: Platform.OS === "android" ? deviceHeight / 13 : deviceHeight / 12,
        justifyContent: 'center',           // Center vertically
        alignItems: 'center',               // Center horizontally
        // alignSelf: 'center',

    },
    avatar: {
        width: 96,                          // Set width
        height: 96,                         // Set height
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 96 / 2
    },
    textTitle: {
        color: '#fff',                      // White text color
        backgroundColor: 'transparent',     // No background
        //fontFamily: 'Avenir',               // Change default font
        fontWeight: 'bold',                 // Bold font
        fontSize: 16,
        textAlign: "center",
        marginTop: 6,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        // Add text shadow
        // textShadowColor: '#222',
        // textShadowOffset: { width: 1, height: 1 },
        // textShadowRadius: 4,
    },
    buttonLogin_out: {
        marginTop: 6,
        justifyContent: 'center',           // Center vertically
        alignItems: 'center',               // Center horizontally
        alignSelf: 'center',
    }
};
