
import { AppRegistry, YellowBox } from 'react-native';
import App from './src/index';
import { name as appName } from './app.json';

// YellowBox.ignoreWarnings([
//     'VirtualizedLists should never be nested', // TODO: Remove when fixed
// ])
console.disableYellowBox = true;

AppRegistry.registerComponent(appName, () => App);
