/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View} from 'react-native';
import {ActivityIndicator, Colors, withTheme} from 'react-native-paper';

function SplashScreen({theme}) {
  return (
    <View
      style={{
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: theme.colors.primary,
        width: '100%',
      }}>
      <ActivityIndicator animating={true} color={Colors.white} />
    </View>
  );
}

export default withTheme(SplashScreen);
