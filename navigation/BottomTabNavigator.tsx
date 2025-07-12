import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ExplorerScreen from '../screens/ExplorerScreen';
import ARNavigatorScreen from '../screens/ARNavigatorScreen';
import ParkingScreen from '../screens/ParkingScreen';
import NaviGenieScreen from '../screens/NaviGenieScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Home': 
              iconName = 'home';
              break;
            case 'Explorer': 
              iconName = 'map';
              break;
            case 'AR Navigator': 
              iconName = 'camera';
              break;
            case 'Parking': 
              iconName = 'car';
              break;
            case 'NaviGenie': 
              iconName = 'robot';
              break;
            case 'Profile': 
              iconName = 'person';
              break;
            default:
              iconName = 'home';
          }
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Explorer" component={ExplorerScreen} />
      <Tab.Screen name="AR Navigator" component={ARNavigatorScreen} />
      <Tab.Screen name="Parking" component={ParkingScreen} />
      <Tab.Screen name="NaviGenie" component={NaviGenieScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
