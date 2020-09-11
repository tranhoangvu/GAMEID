import { Path } from 'path-parser';
import { NavigationActions } from 'react-navigation';
import store from '../reducers';

const paths = [
    {
        routeName: 'NewsDetailsNotify',
        path: new Path('post/:postid'),
    },
];

const findPath = url => paths.find(path => path.path.test(url));

export default url => {
    const pathObject = findPath(url);

    if (!pathObject) return;

    const navigateAction = NavigationActions.navigate({
        routeName: pathObject.routeName,
        params: pathObject.path.test(url),
    });

    store.dispatch(navigateAction);
};