// components/Input.jsx
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';

export default function Input({label, value, onChangeText, placeholder, secureTextEntry, keyboardType, autoCapitalize = 'none', style,
                              }) {
    return (
        <View style={[styles.wrap, style]}>
            {label ? <Text style={styles.label}>{label}</Text> : null}
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="rgba(255,255,255,0.6)"
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                autoCapitalize={autoCapitalize}
                style={styles.input}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: { width: '100%', gap: 6 },
    label: {
        color: 'rgba(255,255,255,0.9)',
        fontWeight: '700',
        fontSize: 13,
        letterSpacing: 0.2,
    },
    input: {
        paddingVertical: theme.spacing(1.25),
        paddingHorizontal: theme.spacing(1.75),
        borderRadius: theme.roundness,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.22)',
        backgroundColor: 'rgba(255,255,255,0.08)',
        color: '#fff',
    },
});
