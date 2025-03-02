'use client';

import ThemeProvider from './ThemeProvider';

export default function ClientThemeProvider({ children }) {
    return <ThemeProvider>{children}</ThemeProvider>;
} 