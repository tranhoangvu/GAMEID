/* @flow */
import React from "react";

import { Platform, StatusBar } from "react-native";
//import { Root } from "native-base";
// import { StackNavigator } from "react-navigation";
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Drawer from "./drawer";
import Notifi from "../components/SideBar/notification.js";

const AppNavigator = createStackNavigator(
    {
        Drawer: {
            screen: Drawer
            // screen: () => <Drawer />
        },
        Notifi: {
            screen: Notifi
            // screen: () => <Notifi />
        }
    },
    {
        initialRouteName: "Drawer",
        headerMode: "none",
    }
);

const App = createAppContainer(AppNavigator);
export default createAppContainer(App);