// app/auth/register.jsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, StatusBar, Alert } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, theme } from '../constants/theme';
import Screen from '../components/Screen';
import Button from '../components/Button';
import Input from '../components/Input';
import { Link, useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');
const BLOB = Math.max(width, height) * 0.6;

export default function Register() {
    const router = useRouter();
    const [fullName, setFullName] = useState('');
    const [invite, setInvite] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onCreate = async () => {
        try {
            if (!fullName || !invite || !email || !password) return Alert.alert('Completează toate câmpurile.');
            // TODO: Supabase flow (exemplu):
            // const { data: org } = await supabase.from('orgs').select('id').eq('invite_code', invite).single();
            // if (!org) throw new Error('Cod invitație invalid');
            // const { data: signUp, error } = await supabase.auth.signUp({ email, password });
            // if (error || !signUp.user) throw error || new Error('Sign up failed');
            // await supabase.from('profiles').insert({ id: signUp.user.id, org_id: org.id, full_name: fullName });
            Alert.alert('Cont creat (demo)');
            router.replace('/auth/login');
        } catch (e) {
            Alert.alert('Înregistrare eșuată', String(e?.message ?? e));
        }
    };

    return (
        <Screen style={{ alignItems: 'center', justifyContent: 'center' }}>
            <StatusBar barStyle="light-content" />
            <LinearGradient
                colors={[colors.primary, colors.secondary]}
                start={{ x: 0.1, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
            />

            <View style={[styles.blob, styles.blobA, { backgroundColor: colors.tertiary, opacity: 0.1 }]} />
            <View style={[styles.blob, styles.blobB, { backgroundColor: '#ffffff', opacity: 0.08 }]} />
            <View style={[styles.blob, styles.blobC, { backgroundColor: '#FFD7AE', opacity: 0.08 }]} />

            <View style={styles.wrap}>
                <View style={styles.pill}><Text style={styles.pillText}>create account</Text></View>

                <BlurView intensity={60} tint="dark" style={styles.glass}>
                    <View style={styles.overlay} />
                    <Text style={styles.title}>Creează cont</Text>
                    <Text style={styles.subtitle}>Alătură-te spațiului companiei tale.</Text>

                    <Input label="Nume complet" placeholder="Nume Prenume" value={fullName} onChangeText={setFullName} autoCapitalize="words" />
                    <Input label="Cod companie" placeholder="INVITE-2025" value={invite} onChangeText={setInvite} autoCapitalize="characters" />
                    <Input label="Email" placeholder="you@company.com" value={email} onChangeText={setEmail} keyboardType="email-address" />
                    <Input label="Parola" placeholder="••••••••" value={password} onChangeText={setPassword} secureTextEntry />

                    <Button title="Creează cont" onPress={onCreate} style={{ width: '100%', marginTop: theme.spacing(1) }} />

                    <Text style={styles.helper}>
                        Ai deja cont? <Link href="/auth/login" style={styles.link}>Log in</Link>
                    </Text>
                </BlurView>
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    wrap: { width: '90%', alignItems: 'center', gap: theme.spacing(2) },
    pill: {
        paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999,
        backgroundColor: 'rgba(255,255,255,0.12)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)',
    },
    pillText: { color: 'rgba(255,255,255,0.95)', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', fontWeight: '700' },

    glass: {
        width: '100%', padding: theme.spacing(3), borderRadius: theme.roundness * 1.8,
        overflow: 'hidden', alignItems: 'center', gap: theme.spacing(1.25),
        shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 18, elevation: 6,
    },
    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(45,45,45,0.55)' },

    title: { color: '#fff', fontSize: 22, fontWeight: '800' },
    subtitle: { color: 'rgba(255,255,255,0.85)', marginBottom: theme.spacing(1) },

    helper: { color: 'rgba(255,255,255,0.85)', marginTop: theme.spacing(1) },
    link: { color: '#fff', fontWeight: '800', textDecorationLine: 'underline' },

    blob: { position: 'absolute', width: BLOB, height: BLOB, borderRadius: BLOB / 1.8 },
    blobA: { top: -BLOB * 0.25, left: -BLOB * 0.18 },
    blobB: { top: -BLOB * 0.36, right: -BLOB * 0.22 },
    blobC: { bottom: -BLOB * 0.26, left: -BLOB * 0.1 },
});
