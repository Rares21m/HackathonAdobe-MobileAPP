
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';


const extra =
    Constants.expoConfig?.extra ??
    Constants.manifest?.extra ??
    {};

const url = extra.EXPO_PUBLIC_SUPABASE_URL;
const key = extra.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
    console.warn('ENV missing ->', { url, hasKey: !!key });
    throw new Error('supabaseUrl is required.');
}

export const supabase = createClient(url, key, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
        storage: AsyncStorage,
    },
});
