import MainScreen from '../../screens/MainScreen/index';
import AboutUs from '../../screens/AboutUs/index';
import Bookmarks from '../../screens/Bookmarks/index';
import Categories from '../../screens/Categories/index';
import ContactUs from '../../screens/ContactUs/index';
import FAQ from '../../screens/FAQ/index';
import Home from '../../screens/Home/index';
import More from '../../screens/More/index';
import ShareApp from '../../screens/ShareApp/index';
import Details from '../../screens/Details/index';
import PostList from '../../screens/PostList/index';
import SearchCategoriesList from '../../screens/SearchCtegoriesList/index';
import { StackNavigator } from "react-navigation";

export default (Project = StackNavigator({
    MainScreen: {
      screen: MainScreen
    },
    AboutUs:
    {
      screen: AboutUs
    },
    Bookmarks:
    {
      screen:Bookmarks
    },
    Categories:
    {
      screen:Categories,
    },
    ContactUs:
    {
      screen:ContactUs
    },
    FAQ:
    {
      screen:FAQ
    },
    Home:
    {
      screen:Home,
    },
    More:
    {
      screen:More
    },
    // Search:
    // {
    //   screen:Search,
    // },
    ShareApp:
    {
      screen:ShareApp
    },
    Details:
    {
      screen:Details
    },
    PostList:
    {
      screen:PostList,
      
    },
    SearchCategoriesList:
    {
      screen:SearchCategoriesList,
    }
  }))
  