import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Moon, Sun, Menu as MenuIcon, X, MapPin } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';

interface Props {
  lang: 'ar' | 'en';
  setLang: (l: 'ar' | 'en') => void;
  isDark: boolean;
  toggleDark: () => void;
  t: any;
}

export const Header: React.FC<Props> = ({ lang, setLang, isDark, toggleDark, t }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const totalCount = useCartStore((s) => s.getTotalCount());
  const toggleCart = useCartStore((s) => s.toggleCart);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: '/', label: t.nav.home },
    { to: '/menu', label: t.nav.menu },
    { to: '/#atmosphere', label: t.nav.atmosphere },
    { to: '/about', label: t.nav.about },
    { to: '/#location', label: t.nav.location },
    { to: '/reservation', label: t.nav.reservation },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? 'glass-panel border-b border-canvas-border dark:border-darkcanvas-border py-3 shadow-soft'
          : 'bg-canvas-base/80 dark:bg-darkcanvas-base/80 backdrop-blur-md py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo Wordmark */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-lg"
          aria-label={t.brand.name}
        >
          <div className="w-9 h-9 rounded-xl bg-espresso-900 dark:bg-brand-500 flex items-center justify-center text-brand-400 dark:text-espresso-950 font-display font-black text-lg transition-transform duration-300 group-hover:scale-105 shadow-sm">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-espresso-900 dark:text-espresso-50 leading-none">
              {lang === 'ar' ? 'أيم كوفي بار' : 'AIM COFFEE BAR'}
            </span>
            <span className="text-[10px] font-medium tracking-widest text-brand-600 dark:text-brand-400 uppercase mt-0.5">
              Riyadh · Al Malqa
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-espresso-800'
                    : 'text-espresso-600 dark:text-espresso-300 hover:text-espresso-900 dark:hover:text-espresso-100 hover:bg-canvas-subtle dark:hover:bg-espresso-800/60'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Header Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switch */}
          <button
            type="button"
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="px-2.5 py-1.5 rounded-full text-xs font-semibold bg-canvas-subtle dark:bg-espresso-800 text-espresso-700 dark:text-espresso-200 hover:bg-canvas-border dark:hover:bg-espresso-700 transition-colors"
            title="Switch Language"
            aria-label="Switch Language"
          >
            {lang === 'ar' ? 'EN' : 'العربية'}
          </button>

          {/* Dark Mode Toggle */}
          <button
            type="button"
            onClick={toggleDark}
            className="p-2 rounded-full text-espresso-600 dark:text-espresso-300 hover:bg-canvas-subtle dark:hover:bg-espresso-800 transition-colors"
            title={isDark ? 'Light Mode' : 'Dark Mode'}
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Cart Button */}
          <button
            type="button"
            onClick={toggleCart}
            className="relative flex items-center gap-2 px-3.5 py-2 rounded-full bg-espresso-900 hover:bg-espresso-800 dark:bg-brand-500 dark:hover:bg-brand-600 text-white dark:text-espresso-950 font-medium text-xs sm:text-sm shadow-sm transition-transform active:scale-95"
            aria-label={`Shopping Cart (${totalCount} items)`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">{t.nav.cart}</span>
            {totalCount > 0 && (
              <span className="flex items-center justify-center w-5 h-5 text-[11px] font-bold rounded-full bg-brand-500 dark:bg-espresso-900 text-white dark:text-brand-300">
                {totalCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-espresso-700 dark:text-espresso-200 hover:bg-canvas-subtle dark:hover:bg-espresso-800"
            aria-label="Toggle Mobile Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-canvas-border dark:border-darkcanvas-border bg-canvas-base dark:bg-darkcanvas-base px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="block px-4 py-2.5 rounded-xl text-base font-medium text-espresso-800 dark:text-espresso-100 hover:bg-canvas-subtle dark:hover:bg-espresso-800 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-canvas-border dark:border-darkcanvas-border flex items-center justify-between text-xs text-espresso-500">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-brand-500" />
              حي الملقا · الرياض
            </span>
            <span className="text-brand-600 dark:text-brand-400 font-semibold">مفتوح حتى 12 ص</span>
          </div>
        </div>
      )}
    </header>
  );
};
