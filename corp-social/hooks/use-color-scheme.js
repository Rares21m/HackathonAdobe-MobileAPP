import { useColorScheme as useSystemColorScheme } from 'react-native';

export function useColorScheme() {
    const scheme = useSystemColorScheme();
    return scheme ?? 'light';
}

export default useColorScheme;
