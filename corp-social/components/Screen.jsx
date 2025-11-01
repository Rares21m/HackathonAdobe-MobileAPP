import React from 'react';
import { View, StatusBar } from 'react-native';
import { colors } from '../constants/theme';

export default function Screen({ children, style }) {
    return (
        <View style={[{ flex: 1, backgroundColor: colors.background }, style]}>
            <StatusBar barStyle="dark-content" />
            {children}
        </View>
    );
}
