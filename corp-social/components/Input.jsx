import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';

export default function Input({ label, variant = 'dark', style, inputStyle, ...props }) {
    const isLight = variant === 'light';
    return (
        <View style={styles.wrap}>
            {label ? (
                <Text style={[styles.label, isLight && { color: '#111827' }]}>{label}</Text>
            ) : null}
            <TextInput
                placeholderTextColor={isLight ? '#6B7280' : 'rgba(255,255,255,0.6)'}
                style={[
                    styles.input,
                    isLight
                        ? {
                            backgroundColor: '#FFFFFF',
                            borderColor: '#E5E7EB',
                            color: '#111827',
                        }
                        : {
                            backgroundColor: 'rgba(255,255,255,0.08)',
                            borderColor: 'rgba(255,255,255,0.22)',
                            color: '#fff',
                        },
                    inputStyle,
                    style,
                ]}
                {...props}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: { width: '100%', gap: 6 },
    label: { color: 'rgba(255,255,255,0.9)', fontWeight: '700', fontSize: 13 },
    input: {
        paddingVertical: theme.spacing(1.25),
        paddingHorizontal: theme.spacing(1.75),
        borderRadius: theme.roundness,
        borderWidth: 1,
    },
});
