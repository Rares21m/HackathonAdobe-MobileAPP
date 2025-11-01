import React, { useEffect, useState } from 'react';
import { Slot, useRouter, usePathname } from 'expo-router';
import { supabase } from '../lib/supabase';
import { StatusBar } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';

export default function RootLayout() {
    const [ready, setReady] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    // 🔹 1) Configurare bara de sistem Android (transparentă)
    useEffect(() => {
        (async () => {
            try {
                // Bara de navigație devine transparentă (jos)
                await NavigationBar.setBackgroundColorAsync('rgba(0,0,0,0)');
                await NavigationBar.setButtonStyleAsync('light');
                await NavigationBar.setBehaviorAsync('overlay-swipe');
            } catch (err) {
                console.log('NavigationBar setup failed:', err.message);
            }
        })();
    }, []);

    // 🔹 2) Verifică autentificarea și rutează utilizatorul
    useEffect(() => {
        (async () => {
            const { data } = await supabase.auth.getSession();
            const isAuthed = !!data.session;
            const openRoutes = ['/', '/login', '/register'];

            // dacă nu e logat și încearcă o pagină protejată → trimite-l la login
            if (!isAuthed && !openRoutes.includes(pathname)) {
                router.replace('/login');
            }
            setReady(true);
        })();

        // ascultă schimbarea sesiunii
        const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session && (pathname === '/login' || pathname === '/register')) {
                router.replace('/feed'); // după login mergem în feed
            }
            if (!session && pathname === '/feed') {
                router.replace('/login');
            }
        });

        return () => sub.subscription?.unsubscribe();
    }, [pathname]);

    // 🔹 3) Așteaptă verificarea sesiunii
    if (!ready) return null;

    // 🔹 4) Returnează layout global
    return (
        <>
            {/* StatusBar: text alb, transparent peste gradient */}
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            <Slot />
        </>
    );
}
