import React, { Component } from "react";
// import { TabNavigator } from "react-navigation";
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Platform, StyleSheet } from 'react-native';
import { Header, Left, Right, Body, Title, Button, Text, Icon, Item, Footer, FooterTab, Label } from "native-base";

import NewsScreen from "../NewsScreen";
import GameListScreen from "../GameListScreen";
import GiftcodeScreen from "../GiftcodeScreen";
import ProfileScreen from "../ProfileScreen";

import { releaseStatus } from '../../index.js';

export default (HomeScreenNavigator = createBottomTabNavigator(
    {
        // News: {
        //     screen: () => <NewsScreen />
        // },
        // Games: {
        //     screen: () => <GameListScreen />
        // },
        // Giftcode: {
        //     screen: () => <GiftcodeScreen />
        // },
        // Profile: {
        //     screen: () => <ProfileScreen />
        // }
        News: { screen: NewsScreen },
        Games: { screen: GameListScreen },
        Giftcode: { screen: GiftcodeScreen },
        Profile: { screen: ProfileScreen }
    },
    {
        tabBarPosition: "bottom",
        swipeEnabled: true,
        lazy: false,
        animationEnabled: false,
        tabBarComponent: props => {
            return (
                <Footer>
                    <FooterTab style={{ backgroundColor: '#fff' }}>
                        <Button
                            vertical
                            active={props.navigation.state.index === 0}
                            onPress={() => props.navigation.navigate("News")}
                        >
                            <Icon name="book" />
                            <Text>Tin Tức</Text>
                        </Button>
                        {releaseStatus() ? <Button
                            vertical
                            active={props.navigation.state.index === 1}
                            onPress={() => props.navigation.navigate("Games")}
                        >
                            <Icon name="logo-game-controller-b" />
                            <Text>Game</Text>
                        </Button> : null}
                        {releaseStatus() ? <Button
                            vertical
                            active={props.navigation.state.index === 2}
                            onPress={() => props.navigation.navigate("Giftcode")}
                        >
                            <Icon name="folder-open" />
                            <Text>Giftcode</Text>
                        </Button> : null}
                        <Button
                            vertical
                            active={props.navigation.state.index === 3}
                            onPress={() => props.navigation.navigate("Profile")}
                        >
                            <Icon name="contact" />
                            <Text>Tài khoản</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            );
        }
    }
));
