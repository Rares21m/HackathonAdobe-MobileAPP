// components/Logo.jsx
import React from 'react';
import {View, Text} from 'react-native';
import {colors, theme} from '../constants/theme';

export default function Logo({size = 56, showText = true}) {
    return (
        <View style={{alignItems: 'center', gap: theme.spacing(1)}}>
            <View
                style={{
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 2,
                    borderColor: 'rgba(255,255,255,0.6)',
                    shadowColor: '#000',
                    shadowOpacity: 0.15,
                    shadowRadius: 8,
                    elevation: 3,
                }}
            >
                <Text style={{color: colors.primary, fontWeight: '800', fontSize: size * 0.38}}>CS</Text>
            </View>
            {showText && (
                <Text style={{color: '#fff', fontSize: 26, fontWeight: '800', letterSpacing: 0.5}}>
                    Corp Social
                </Text>
            )}
        </View>
    );
}
