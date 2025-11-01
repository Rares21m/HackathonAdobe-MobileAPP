import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
    View, Text, FlatList, Image, TouchableOpacity, Alert, StyleSheet, Modal, TextInput, StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Screen from '../components/Screen';
import NavBar from '../components/navbar';
import Button from '../components/Button';
import { colors, theme } from '../constants/theme';
import { supabase } from '../lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function PhotoFeed() {
    const [photos, setPhotos] = useState([]);
    const [reactions, setReactions] = useState([]);
    const [myReactions, setMyReactions] = useState(new Set());
    const [userId, setUserId] = useState(null);
    const [userEmail, setUserEmail] = useState('');

    // modal upload
    const [pickerVisible, setPickerVisible] = useState(false);
    const [pickedUri, setPickedUri] = useState(null);
    const [caption, setCaption] = useState('');

    const load = useCallback(async () => {
        const { data: sess } = await supabase.auth.getUser();
        const user = sess?.user;
        setUserId(user?.id || null);
        setUserEmail(user?.email || '');

        const { data: photoList, error: pErr } = await supabase
            .from('photos')
            .select('id, user_id, author_email, image_url, caption, created_at')
            .order('created_at', { ascending: false })
            .limit(50);
        if (pErr) return Alert.alert('Eroare', pErr.message);
        setPhotos(photoList || []);

        if ((photoList || []).length) {
            const ids = photoList.map(p => p.id);
            const { data: reacts, error: rErr } = await supabase
                .from('photo_reactions')
                .select('photo_id, user_id')
                .in('photo_id', ids);
            if (rErr) return Alert.alert('Eroare', rErr.message);
            setReactions(reacts || []);
            const mine = new Set(reacts.filter(r => r.user_id === user?.id).map(r => r.photo_id));
            setMyReactions(mine);
        } else {
            setReactions([]);
            setMyReactions(new Set());
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const counts = useMemo(() => {
        const m = new Map();
        reactions.forEach(r => m.set(r.photo_id, (m.get(r.photo_id) || 0) + 1));
        return m;
    }, [reactions]);

    // ---- Reacții (like)
    const toggleLike = async (photo_id) => {
        if (!userId) return Alert.alert('Trebuie să fii logat.');
        const liked = myReactions.has(photo_id);
        if (liked) {
            const { error } = await supabase.from('photo_reactions').delete()
                .eq('photo_id', photo_id).eq('user_id', userId);
            if (error) return Alert.alert('Eroare', error.message);
        } else {
            const { error } = await supabase.from('photo_reactions').insert({ photo_id, user_id: userId });
            if (error) return Alert.alert('Eroare', error.message);
        }
        await load();
    };

    // ---- Picker + Upload
    const openPicker = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') return Alert.alert('Atenție', 'Ai nevoie de permisiune la galerie.');
        const res = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.9,
            allowsEditing: true,
        });
        if (res.canceled) return;
        const uri = res.assets?.[0]?.uri;
        if (!uri) return;
        setPickedUri(uri);
        setCaption('');
        setPickerVisible(true);
    };

    const uploadPicked = async () => {
        try {
            if (!userId || !pickedUri) return;
            const resp = await fetch(pickedUri);
            const blob = await resp.blob();
            const ext = (blob.type?.split('/')?.[1]) || 'jpg';
            const path = `${userId}/${Date.now()}.${ext}`;

            const { error: upErr } = await supabase.storage.from('media').upload(path, blob, {
                contentType: blob.type || 'image/jpeg',
                upsert: false,
            });
            if (upErr) return Alert.alert('Upload eșuat', upErr.message);

            const { data: pub } = supabase.storage.from('media').getPublicUrl(path);
            const publicUrl = pub?.publicUrl;
            if (!publicUrl) return Alert.alert('Eroare', 'Nu am putut genera URL-ul public.');

            const { error: insErr } = await supabase.from('photos').insert({
                user_id: userId,
                author_email: userEmail,
                image_url: publicUrl,
                caption: caption.trim() || null,
            });
            if (insErr) return Alert.alert('Eroare', insErr.message);

            setPickerVisible(false);
            setPickedUri(null);
            setCaption('');
            load();
        } catch (e) {
            Alert.alert('Eroare', String(e?.message ?? e));
        }
    };

    const cancelPicked = () => {
        setPickerVisible(false);
        setPickedUri(null);
        setCaption('');
    };

    return (
        <Screen style={{ flex: 1, backgroundColor: 'transparent' }}>
            <StatusBar barStyle="light-content" />

            {/* FUNDAL: gradient + „blobs” */}
            <LinearGradient
                colors={[colors.primary, colors.secondary]}
                start={{ x: 0.1, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
            />
            <View style={[styles.blob, styles.blobA, { backgroundColor: colors.tertiary, opacity: 0.12 }]} />
            <View style={[styles.blob, styles.blobB, { backgroundColor: '#ffffff', opacity: 0.08 }]} />
            <View style={[styles.blob, styles.blobC, { backgroundColor: '#FFD7AE', opacity: 0.1 }]} />

            {/* LISTĂ POZE */}
            <FlatList
                data={photos}
                keyExtractor={(i) => i.id}
                contentContainerStyle={{ padding: theme.spacing(2), paddingBottom: theme.spacing(14) }}
                ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
                renderItem={({ item }) => {
                    const liked = myReactions.has(item.id);
                    const likeCount = counts.get(item.id) || 0;
                    return (
                        <View style={styles.card}>
                            <View style={styles.header}>
                                <View style={styles.avatarMini}><Text style={styles.avatarLetter}>{(item.author_email || 'A')[0].toUpperCase()}</Text></View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.author}>{item.author_email || 'Anon'}</Text>
                                    <Text style={styles.time}>{new Date(item.created_at).toLocaleString()}</Text>
                                </View>
                            </View>

                            <Image source={{ uri: item.image_url }} style={styles.image} resizeMode="cover" />

                            {item.caption ? <Text style={styles.caption}>{item.caption}</Text> : null}

                            <View style={styles.actions}>
                                <TouchableOpacity onPress={() => toggleLike(item.id)} style={styles.likeBtn}>
                                    <Ionicons name={liked ? 'heart' : 'heart-outline'} size={20} color={liked ? '#E11D48' : colors.text} />
                                    <Text style={styles.likeText}>{likeCount}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    );
                }}
                ListEmptyComponent={
                    <Text style={{ color: 'rgba(255,255,255,0.9)', textAlign: 'center', marginTop: 35 }}>
                        Încă nu sunt poze. Apasă butonul „+” pentru a adăuga una.
                    </Text>
                }
            />

            {/* FAB „+” */}
            <TouchableOpacity style={styles.fab} onPress={openPicker} activeOpacity={0.85}>
                <Ionicons name="add" size={28} color="#fff" />
            </TouchableOpacity>

            {/* MODAL: preview + caption + Upload */}
            <Modal visible={pickerVisible} transparent animationType="fade">
                <View style={styles.modalWrap}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>Nouă fotografie</Text>
                        {pickedUri ? <Image source={{ uri: pickedUri }} style={styles.modalImage} /> : null}
                        <TextInput
                            value={caption}
                            onChangeText={setCaption}
                            placeholder="Scrie un comentariu (optional)…"
                            placeholderTextColor="#888"
                            style={styles.modalInput}
                        />
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <Button title="Renunță" onPress={cancelPicked} style={{ flex: 1, backgroundColor: '#111827' }} />
                            <Button title="Încarcă" onPress={uploadPicked} style={{ flex: 1 }} />
                        </View>
                    </View>
                </View>
            </Modal>

            <NavBar user={{ email: userEmail }} />
        </Screen>
    );
}

const BLOB = 320; // mărime forme; ajustează dacă vrei

const styles = StyleSheet.create({
    // fundal decorativ
    blob: { position: 'absolute', width: BLOB, height: BLOB, borderRadius: BLOB / 1.6 },
    blobA: { top: -BLOB * 0.25, left: -BLOB * 0.18 },
    blobB: { top: -BLOB * 0.36, right: -BLOB * 0.22 },
    blobC: { bottom: -BLOB * 0.26, left: -BLOB * 0.1 },

    // card foto
    card: {
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 14,
        elevation: 3,
    },
    header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, paddingTop: 12, paddingBottom: 8 },
    avatarMini: {
        width: 32, height: 32, borderRadius: 16, backgroundColor: '#EEF2FF',
        alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E5E7EB',
    },
    avatarLetter: { color: colors.primary, fontWeight: '800' },
    author: { color: '#111827', fontWeight: '700' },
    time: { color: '#6B7280', fontSize: 12 },
    image: { width: '100%', height: 260, backgroundColor: '#111111' },
    caption: { color: '#111827', paddingHorizontal: 12, paddingTop: 10, paddingBottom: 6 },
    actions: { paddingHorizontal: 12, paddingBottom: 12, paddingTop: 4, flexDirection: 'row', alignItems: 'center' },
    likeBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        backgroundColor: '#F3F4F6', borderColor: '#E5E7EB', borderWidth: 1,
        borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6,
    },
    likeText: { color: '#111827', fontWeight: '700' },

    // buton plus
    fab: {
        position: 'absolute',
        right: 18, bottom: 120,
        width: 56, height: 56, borderRadius: 28,
        alignItems: 'center', justifyContent: 'center',
        backgroundColor: colors.primary,
        shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 12, elevation: 8,
    },

    // modal
    modalWrap: {
        flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center', justifyContent: 'center', padding: 20,
    },
    modalCard: { width: '100%', maxWidth: 420, backgroundColor: '#fff', borderRadius: 16, padding: 14, gap: 10 },
    modalTitle: { color: '#111827', fontWeight: '800', fontSize: 16 },
    modalImage: { width: '100%', height: 220, backgroundColor: '#eee', borderRadius: 12 },
    modalInput: {
        backgroundColor: '#fff', borderColor: '#E5E7EB', borderWidth: 1,
        borderRadius: theme.roundness, paddingHorizontal: 12, paddingVertical: 10, color: '#111827',
    },
});
