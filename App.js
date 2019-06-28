import React from 'react';
import LoginScreen from './components/Login';
import SignupScreen from './components/Signup';
import ProfileScreen from './components/Profile';
import PlotScreen from './components/Plot';
import ReportScreen from './components/Report';
import SummaryScreen from './components/Summary';
import NotificationScreen from './components/Notification';
import RequestScreen from './components/Request'
import ConfigScreen from './components/Config';
import ConfigUpdateScreen from './components/ConfigUpdate';
import {
  createStackNavigator,
  createAppContainer,
  createMaterialTopTabNavigator,
  createBottomTabNavigator,
  createSwitchNavigator,
  NavigationScreenProps,
  NavigationTransitionProps,
  StackViewTransitionConfigs,
  TabScene,
  TransitionConfig,
} from 'react-navigation';
import { Platform } from 'react-native';
import { Icon } from 'react-native-elements';

const HomeTab = createMaterialTopTabNavigator(
  {
    Report: ReportScreen,
    Plot: PlotScreen,
    Summary: SummaryScreen,
  },
  {
    navigationOptions: {
      title: 'Home',
    },
  }
);

const HomeStack = createStackNavigator({
  Homee: HomeTab,
});

const ProfileStack = createStackNavigator({
  Profile: ProfileScreen,
  Request: RequestScreen,
});

ProfileStack.navigationOptions = ({ navigation }: NavigationScreenProps) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  } 

  return {
    tabBarLabel: 'profile',
    tabBarIcon: ({ tintColor }: TabScene) => {
      return <Icon name="profile" type="antdesign" color={tintColor} />;
    },
    tabBarVisible,
  };
};

HomeStack.navigationOptions = ({ navigation }: NavigationScreenProps) => {
  return {
    tabBarLabel: 'Home',
    tabBarIcon: ({ tintColor }: TabScene) => {
      let iconName = Platform.select({ ios: 'ios-home', android: 'md-home' });
      return <Icon name={iconName} type="ionicon" color={tintColor} />;
    },
  };
};

const MainNavigator = createBottomTabNavigator({
  Home: HomeStack,
  ProfileT: ProfileStack,
});

const ConfigStack = createStackNavigator({
  Config: ConfigScreen,
  ConfigUpdate: ConfigUpdateScreen,
});

ConfigStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ tintColor }) => (
    <Icon name="ios-cog" type="ionicon" color={tintColor} />
  ),
};

const NotificationStack = createStackNavigator({
  Notification: NotificationScreen,
});

NotificationStack.navigationOptions = {
  tabBarLabel: 'Notification',
  tabBarIcon: ({ tintColor }) => (
    <Icon name="notifications-active" type="Mmterialicons" color={tintColor} />
  ),
};

const MainNavigatorAdmin = createBottomTabNavigator({
  Configuration: ConfigStack,
  NotificationS: NotificationStack,
});

const LoginStack = createStackNavigator({
  Login: LoginScreen,
});

LoginStack.navigationOptions = ({ navigation }: NavigationScreenProps) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarLabel: 'Login',
    tabBarIcon: ({ tintColor }: TabScene) => {
      return <Icon name='login' type="simple-line-icon"color={tintColor} />;
    },
    tabBarVisible,
  };
};

const SignupStack = createStackNavigator({
  Signup: SignupScreen,
});

SignupStack.navigationOptions = {
  tabBarLabel: 'Register',
  tabBarIcon: ({ tintColor }: TabScene) => {
    let iconName = Platform.select({
      ios: 'ios-person-add',
      android: 'md-person-add',
    });
    return <Icon name={iconName} type="ionicon" color={tintColor} />;
  },
};

const AuthTab = createBottomTabNavigator({
  Login: LoginStack,
  Signup: SignupStack,
});

const RouteSwitch = createSwitchNavigator({
  AuthTab,
  MainNavigatorAdmin,
  MainNavigator,
});

export default createAppContainer(RouteSwitch);
