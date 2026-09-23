import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';

import arTranslations from './i18n/ar.json';
import enTranslations from './i18n/en.json';

import { DisclaimerBanner } from './components/common/DisclaimerBanner';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { useCartStore } from './store/useCartStore';

import { HomePage } from './components/home/HomePage';
import { MenuPage } from './components/pages/MenuPage';
import { AboutPage } from './components/pages/AboutPage';
import { FAQPage } from './components/pages/FAQPage';
import { CreditsPage } from './components/pages/CreditsPage';
import { ReservationPage } from './components/reservation/ReservationPage';
import { CheckoutPage } from './components/checkout/CheckoutPage';
import { TrackingPage } from './components/tracking/TrackingPage';
import { NotFoundPage } from './components/pages/NotFoundPage';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    useCartStore.getState().setIsOpen(false);
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

export function App() {
  const [lang, setLang] = useState<'ar' | 'en'>(() => {
    try {
      const saved = localStorage.getItem('aim_lang');
      return saved === 'en' ? 'en' : 'ar';
    } catch {
      return 'ar';
    }
  });

  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('aim_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  // Apply Language & Direction
  useEffect(() => {
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    try {
      localStorage.setItem('aim_lang', lang);
    } catch {}
  }, [lang]);

  // Apply Dark Mode Class
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      try {
        localStorage.setItem('aim_theme', 'dark');
      } catch {}
    } else {
      document.documentElement.classList.remove('dark');
      try {
        localStorage.setItem('aim_theme', 'light');
      } catch {}
    }
  }, [isDark]);

  // Smooth Scroll with Lenis (respects prefers-reduced-motion)
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const t = lang === 'ar' ? arTranslations : enTranslations;

  return (
    <HashRouter>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-canvas-base dark:bg-darkcanvas-base transition-colors duration-300">
        {/* Top Concept Disclaimer Banner */}
        <DisclaimerBanner lang={lang} />

        {/* Global Navigation Header */}
        <Header
          lang={lang}
          setLang={setLang}
          isDark={isDark}
          toggleDark={() => setIsDark(!isDark)}
          t={t}
        />

        {/* Main Content Area */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage lang={lang} t={t} />} />
            <Route path="/menu" element={<MenuPage lang={lang} t={t} />} />
            <Route path="/about" element={<AboutPage lang={lang} t={t} />} />
            <Route path="/faq" element={<FAQPage lang={lang} t={t} />} />
            <Route path="/reservation" element={<ReservationPage lang={lang} t={t} />} />
            <Route path="/checkout" element={<CheckoutPage lang={lang} t={t} />} />
            <Route path="/tracking" element={<TrackingPage lang={lang} t={t} />} />
            <Route path="/credits" element={<CreditsPage lang={lang} t={t} />} />
            <Route path="*" element={<NotFoundPage lang={lang} t={t} />} />
          </Routes>
        </main>

        {/* Global Cart Slide-Over Drawer */}
        <CartDrawer lang={lang} t={t} />

        {/* Global Footer */}
        <Footer lang={lang} t={t} />
      </div>
    </HashRouter>
  );
}
export default App;
