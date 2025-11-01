import React from 'react';
import { View, Text, StyleSheet, Dimensions, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { colors, theme } from '../constants/theme';
import Button from '../components/Button';
import Screen from '../components/Screen';

const { width, height } = Dimensions.get('window');
const BLOB = Math.max(width, height) * 0.6;

export default function Welcome() {
    return (
        <Screen style={{ alignItems: 'center', justifyContent: 'center' }}>
            <StatusBar barStyle="light-content" />

            {/* Fundal gradient vibrant */}
            <LinearGradient
                colors={[colors.primary, colors.secondary]}
                start={{ x: 0.1, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
            />

            {/* Forme subtile în fundal */}
            <View style={[styles.blob, styles.blobA, { backgroundColor: colors.tertiary, opacity: 0.1 }]} />
            <View style={[styles.blob, styles.blobB, { backgroundColor: '#ffffff', opacity: 0.08 }]} />
            <View style={[styles.blob, styles.blobC, { backgroundColor: '#FFD7AE', opacity: 0.08 }]} />

            <View style={styles.wrap}>
                <View style={styles.pill}>
                    <Text style={styles.pillText}>internal • team space</Text>
                </View>

                {/* CARD UNIFORM GRI TRANSPARENT */}
                <BlurView intensity={60} tint="dark" style={styles.glass}>
                    <View style={styles.cardOverlay} />

                    <Text style={styles.headTop}>Welcome back</Text>
                    <Text style={styles.headBottom}>Connect. Share. Grow.</Text>

                    <Text style={styles.sub}>
                        O platformă internă elegantă pentru echipa ta — sigură, simplă și frumoasă.
                    </Text>

                    <Button
                        title="Log in"
                        onPress={() => {}}
                        style={[styles.action, { width: '100%' }]}
                    />
                    <Button
                        title="Creează cont"
                        onPress={() => {}}
                        style={[
                            styles.action,
                            {
                                width: '100%',
                                backgroundColor: 'transparent',
                                borderWidth: 1.2,
                                borderColor: 'rgba(255,255,255,0.85)',
                            },
                        ]}
                        textStyle={{ color: '#fff' }}
                    />
                </BlurView>

                <Text style={styles.footer}>© 2025 — Corp Social</Text>
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    wrap: {
        width: '90%',
        alignItems: 'center',
        gap: theme.spacing(2),
    },

    /* Tag mic de sus */
    pill: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 999,
        backgroundColor: 'rgba(255,255,255,0.12)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.25)',
    },
    pillText: {
        color: 'rgba(255,255,255,0.95)',
        fontSize: 12,
        letterSpacing: 1,
        textTransform: 'uppercase',
        fontWeight: '700',
    },

    /* CARD UNIFORM */
    glass: {
        width: '100%',
        padding: theme.spacing(3),
        borderRadius: theme.roundness * 1.8,
        overflow: 'hidden',
        alignItems: 'center',
        gap: theme.spacing(1.5),
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 5,
    },

    /* strat uniform de gri transparent peste blur */
    cardOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(45, 45, 45, 0.55)', // gri uniform transparent
    },

    /* Titluri */
    headTop: {
        color: '#fff',
        fontSize: 26,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    headBottom: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '600',
        opacity: 0.9,
        marginTop: 3,
    },

    sub: {
        color: 'rgba(255,255,255,0.85)',
        textAlign: 'center',
        lineHeight: 20,
        marginTop: 8,
    },

    action: { marginTop: theme.spacing(1) },

    /* blobs decorative */
    blob: {
        position: 'absolute',
        width: BLOB,
        height: BLOB,
        borderRadius: BLOB / 1.8,
    },
    blobA: { top: -BLOB * 0.25, left: -BLOB * 0.18 },
    blobB: { top: -BLOB * 0.36, right: -BLOB * 0.22 },
    blobC: { bottom: -BLOB * 0.26, left: -BLOB * 0.1 },

    footer: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 12,
        marginTop: theme.spacing(2),
    },
});

