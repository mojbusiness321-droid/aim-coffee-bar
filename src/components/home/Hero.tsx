import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Clock, Car, Sparkles } from 'lucide-react';
import hoursData from '../../data/hours.json';

interface Props {
  lang: 'ar' | 'en';
  t: any;
}

export const Hero: React.FC<Props> = ({ lang, t }) => {
  const [liveStatus, setLiveStatus] = useState({
    isOpen: true,
    textAr: 'مفتوح الآن · يغلق عند منتصف الليل (12:00 ص)',
    textEn: 'Open Now · Closes at Midnight (12:00 AM)',
  });

  useEffect(() => {
    const updateRiyadhTime = () => {
      try {
        const now = new Date();
        const riyadhDay = new Intl.DateTimeFormat('en-US', {
          timeZone: 'Asia/Riyadh',
          weekday: 'long',
        }).format(now).toLowerCase();

        const riyadhHourStr = new Intl.DateTimeFormat('en-US', {
          timeZone: 'Asia/Riyadh',
          hour: 'numeric',
          minute: 'numeric',
          hour12: false,
        }).format(now);

        const [hour, minute] = riyadhHourStr.split(':').map(Number);
        const currentMins = hour * 60 + minute;

        // Schedule check (Al Malqa branch)
        // Thu: 06:00 - 01:00 next day
        // Fri: 13:00 - 01:00 next day
        // Sat-Wed: 06:00 - 00:00 (Midnight)
        let isOpen = false;
        let closeTextAr = '12:00 ص';
        let closeTextEn = '12:00 AM';

        if (riyadhDay === 'friday') {
          isOpen = currentMins >= 13 * 60 || currentMins <= 60; // 1pm to 1am next day
          closeTextAr = '1:00 ص';
          closeTextEn = '1:00 AM';
        } else if (riyadhDay === 'thursday') {
          isOpen = currentMins >= 6 * 60 || currentMins <= 60; // 6am to 1am next day
          closeTextAr = '1:00 ص';
          closeTextEn = '1:00 AM';
        } else {
          isOpen = currentMins >= 6 * 60 && currentMins <= 24 * 60; // 6am to midnight
        }

        if (isOpen) {
          setLiveStatus({
            isOpen: true,
            textAr: `مفتوح الآن · يغلق عند ${closeTextAr}`,
            textEn: `Open Now · Closes at ${closeTextEn}`,
          });
        } else {
          setLiveStatus({
            isOpen: false,
            textAr: riyadhDay === 'friday' ? 'مغلق الآن · يفتح 1:00 م' : 'مغلق الآن · يفتح 6:00 ص',
            textEn: riyadhDay === 'friday' ? 'Closed Now · Opens at 1:00 PM' : 'Closed Now · Opens at 6:00 AM',
          });
        }
      } catch (err) {
        console.warn('Could not calculate Riyadh time:', err);
      }
    };

    updateRiyadhTime();
    const interval = setInterval(updateRiyadhTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-espresso-950 text-white pt-8 pb-16 lg:py-24">
      {/* Background Image with Dark Vignette Gradient */}
      <div className="absolute inset-0 z-0">
        <picture>
          <source
            type="image/avif"
            srcSet="/images/hero-main-480.avif 480w, /images/hero-main-960.avif 960w, /images/hero-main-1600.avif 1600w"
            sizes="100vw"
          />
          <source
            type="image/webp"
            srcSet="/images/hero-main-480.webp 480w, /images/hero-main-960.webp 960w, /images/hero-main-1600.webp 1600w"
            sizes="100vw"
          />
          <img
            src="/images/hero-main-1600.jpg"
            alt="Aim Coffee Bar Barista Bar in Riyadh"
            className="w-full h-full object-cover object-center opacity-35 scale-105 transition-transform duration-1000 ease-out"
            loading="eager"
            fetchPriority="high"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-t from-espresso-950 via-espresso-950/70 to-espresso-950/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-espresso-950/50 to-espresso-950" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        {/* Live Status & District Badges */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {/* Live Status Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-espresso-900/80 border border-espresso-700/80 backdrop-blur-md text-xs sm:text-sm font-medium">
            <span
              className={`w-2 h-2 rounded-full ${
                liveStatus.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
              }`}
            />
            <span className="text-espresso-200">
              {lang === 'ar' ? liveStatus.textAr : liveStatus.textEn}
            </span>
          </div>

          {/* Curbside Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-500/20 border border-brand-500/40 text-brand-300 text-xs font-semibold backdrop-blur-md">
            <Car className="w-3.5 h-3.5 text-brand-400" />
            <span>{t.hero.curbsideBadge}</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight text-white leading-[1.15]">
            {lang === 'ar' ? (
              <>
                قهوتك موزونة <span className="text-brand-400 font-black underline decoration-brand-500/50 decoration-wavy decoration-2">بدقة</span>.. ومزاجك في أمان
              </>
            ) : (
              <>
                Precision Brewed. <span className="text-brand-400 font-black">Mindfully Crafted.</span>
              </>
            )}
          </h1>
          <p className="text-base sm:text-xl text-espresso-200/90 max-w-2xl mx-auto font-light leading-relaxed">
            {t.hero.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to="/menu"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-brand-500 hover:bg-brand-600 text-espresso-950 font-display font-bold text-base shadow-glow transition-all duration-300 hover:scale-[1.02] active:scale-95"
          >
            <span>{t.hero.orderNow}</span>
            {lang === 'ar' ? (
              <ArrowLeft className="w-4 h-4 icon-flip" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
          </Link>

          <Link
            to="/menu"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-espresso-900/80 hover:bg-espresso-800 border border-espresso-700/80 text-white font-display font-medium text-base backdrop-blur-sm transition-all duration-300 hover:border-espresso-500 active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-brand-400" />
            <span>{t.hero.viewMenu}</span>
          </Link>
        </div>

        {/* Bottom Social Proof / District Indicators */}
        <div className="pt-8 flex items-center justify-center gap-6 text-xs sm:text-sm text-espresso-400 border-t border-espresso-800/60 max-w-md mx-auto">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-espresso-200">حي الملقا</span>
            <span className="text-espresso-600">·</span>
            <span>شارع عبدالله الخرجي</span>
          </div>
          <span className="text-espresso-700">|</span>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-espresso-200">حي النرجس</span>
            <span className="text-espresso-600">·</span>
            <span>شارع جلوي</span>
          </div>
        </div>
      </div>
    </section>
  );
};
