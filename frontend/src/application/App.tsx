"use client";

import React from "react";
import "dayjs/locale/ja";
import "./App.css";
import { AppRouter } from "./AppRouter";
import { AppContextProvider } from '@/provider/AppContextProvider';
import { AppThemeProvider } from '@/provider/AppThemeProvider';
import { AuthContextProvider } from '@/provider/AuthContextProvider';
import { GlobalUIProvider } from '@/provider/GlobalUIProvider';
import { LanguageProvider } from '@/provider/LanguageProvider';
import { CartProvider } from '@/provider/CartProvider';

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContextProvider>
        <AppThemeProvider>
          <AuthContextProvider>
            <CartProvider>
              <GlobalUIProvider>
                <AppRouter />
              </GlobalUIProvider>
            </CartProvider>
          </AuthContextProvider>
        </AppThemeProvider>
      </AppContextProvider>
    </LanguageProvider>
  );
};
export default App;
