import React, { Component } from "react";

import MenuBar from "../components/SideBar/menuBar";

import MainScreenNavigator from "../components/MainScreen";
import MyBagScreenNavigator from "../components/MyBagScreen";
import TransactionScreenNavigator from "../components/TransactionScreen";
import RechargeScreenNavigator from "../components/RechargeScreen";
import EventScreenNavigator from "../components/EventScreen";
import SupportScreenNavigator from "../components/SupportScreen";
import CardScreenNavigator from "../components/CardScreen";
import LoginScreenNavigator from "../components/LoginScreen";
import WebviewScreenNavigator from "../components/CommonScreen/WebviewScreen";
import H5PlayScreenNavigator from "../components/CommonScreen/H5PlayScreen";
import GiftcodeDetailScreenNavigator from '../components/GiftcodeScreen/giftcodeDetail';
import PolicylScreenNavigator from '../components/PolicyScreen';
import InfoScreenNavigator from '../components/InfoScreen';
import PhoneLoginScreenNavigator from '../components/LoginScreen/PhoneLogin';
import PhoneVerificationScreenNavigator from '../components/ProfileScreen/PhoneVerification';
import NewsDetailsScreenNavigator from '../components/NewsDetailsScreen';

// import { DrawerNavigator } from "react-navigation";
import { createDrawerNavigator } from 'react-navigation-drawer';

const HomeScreenRouter = createDrawerNavigator(
    {
        Main: {
            screen: MainScreenNavigator
            // screen: () => <MainScreenNavigator />
        },
        MyBag: {
            // screen: () => <MyBagScreenNavigator />
            screen: MyBagScreenNavigator
        },
        Transaction: {
            screen: TransactionScreenNavigator
            // screen: () => <TransactionScreenNavigator />
        },
        Event: {
            screen: EventScreenNavigator
            // screen: () => <EventScreenNavigator />
        },
        Support: {
            screen: SupportScreenNavigator
            // screen: () => <SupportScreenNavigator />
        },
        Recharge: {
            screen: RechargeScreenNavigator
            // screen: () => <RechargeScreenNavigator />
        },
        Card: {
            screen: CardScreenNavigator
            // screen: () => <CardScreenNavigator />
        },
        Login: {
            screen: LoginScreenNavigator
            // screen: () => <LoginScreenNavigator />
        },
        Webview: {
            screen: WebviewScreenNavigator
            // screen: () => <WebviewScreenNavigator />
        },
        H5Play: {
            screen: H5PlayScreenNavigator
            // screen: () => <H5PlayScreenNavigator />
        },
        GiftcodeDetail: {
            screen: GiftcodeDetailScreenNavigator
            // screen: () => <GiftcodeDetailScreenNavigator />
        },
        Policy: {
            screen: PolicylScreenNavigator
            // screen: () => <PolicylScreenNavigator />
        },
        Info: {
            screen: InfoScreenNavigator
            // screen: () => <InfoScreenNavigator />
        },
        PhoneVerification: {
            screen: PhoneVerificationScreenNavigator
            // screen: () => <PhoneVerificationScreenNavigator />
        },
        PhoneLogin: {
            screen: PhoneLoginScreenNavigator
            // screen: () => <PhoneLoginScreenNavigator />
        },
        NewsDetails: {
            screen: NewsDetailsScreenNavigator
            // screen: () => <PhoneLoginScreenNavigator />
        },
    },
    {
        contentComponent: props => <MenuBar {...props} />
    }
);
export default HomeScreenRouter;