import React from 'react';
import { Pressable, Text } from 'react-native';
import { colors, theme } from '../constants/theme';

export default function Button({ title, onPress, disabled, style, textStyle }) {
    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            style={({ pressed }) => [
                {
                    backgroundColor: disabled ? '#C7D2FE' : colors.primary,
                    paddingVertical: theme.spacing(1.5),
                    paddingHorizontal: theme.spacing(2),
                    borderRadius: theme.roundness,
                    opacity: pressed ? 0.9 : 1,
                    alignItems: 'center',
                },
                style,
            ]}
        >
            <Text
                style={[
                    { color: colors.surface, fontWeight: '700' },
                    textStyle,
                ]}
            >
                {title}
            </Text>
        </Pressable>
    );
}
