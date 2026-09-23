import React, { useState } from 'react';
import { MapPin, Clock, Phone, MessageSquare, ExternalLink, Navigation } from 'lucide-react';
import hoursData from '../../data/hours.json';

interface Props {
  lang: 'ar' | 'en';
  t: any;
}

export const LocationSection: React.FC<Props> = ({ lang, t }) => {
  const [activeBranchId, setActiveBranchId] = useState('al-malqa');
  const activeBranch = hoursData.branches.find((b) => b.id === activeBranchId) || hoursData.branches[0];

  const daysOfWeek = [
    { key: 'saturday', ar: 'السبت', en: 'Saturday' },
    { key: 'sunday', ar: 'الأحد', en: 'Sunday' },
    { key: 'monday', ar: 'الاثنين', en: 'Monday' },
    { key: 'tuesday', ar: 'الثلاثاء', en: 'Tuesday' },
    { key: 'wednesday', ar: 'الأربعاء', en: 'Wednesday' },
    { key: 'thursday', ar: 'الخميس', en: 'Thursday' },
    { key: 'friday', ar: 'الجمعة', en: 'Friday' },
  ];

  return (
    <section id="location" className="py-20 bg-canvas-subtle dark:bg-darkcanvas-subtle transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 text-xs font-bold uppercase tracking-wider">
            <span>{t.location.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-espresso-900 dark:text-espresso-50">
            {t.location.title}
          </h2>
          <p className="text-base sm:text-lg text-espresso-600 dark:text-espresso-300 font-light leading-relaxed">
            {t.location.subtitle}
          </p>
        </div>

        {/* Branch Selector Tabs */}
        <div className="flex items-center justify-center gap-3">
          {hoursData.branches.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setActiveBranchId(b.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeBranchId === b.id
                  ? 'bg-espresso-900 dark:bg-brand-500 text-white dark:text-espresso-950 shadow-md scale-105'
                  : 'bg-canvas-card dark:bg-darkcanvas-card text-espresso-700 dark:text-espresso-300 border border-canvas-border dark:border-darkcanvas-border hover:border-brand-500/60'
              }`}
            >
              <MapPin className="w-4 h-4 text-brand-400" />
              <span>{lang === 'ar' ? b.nameAr : b.nameEn}</span>
            </button>
          ))}
        </div>

        {/* Location Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Details & Hours Card (5 cols) */}
          <div className="lg:col-span-5 bg-canvas-card dark:bg-darkcanvas-card rounded-3xl p-6 sm:p-8 border border-canvas-border dark:border-darkcanvas-border shadow-soft space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                {lang === 'ar' ? 'بيانات الفرع' : 'Branch Information'}
              </span>
              <h3 className="text-2xl font-display font-bold text-espresso-900 dark:text-espresso-50 mt-1">
                {lang === 'ar' ? activeBranch.nameAr : activeBranch.nameEn}
              </h3>
              <p className="text-sm text-espresso-600 dark:text-espresso-300 mt-2 flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                <span>{lang === 'ar' ? activeBranch.addressAr : activeBranch.addressEn}</span>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
              <a
                href={activeBranch.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-espresso-950 text-xs font-bold transition-transform active:scale-95"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>{t.location.directions}</span>
              </a>

              <a
                href={`https://wa.me/${activeBranch.whatsapp}?text=${encodeURIComponent(
                  lang === 'ar' ? 'السلام عليكم، أود الاستفسار عن أيم كوفي بار' : 'Hello, inquiry regarding Aim Coffee Bar'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-transform active:scale-95"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{t.location.whatsapp}</span>
              </a>

              <a
                href={`tel:${activeBranch.phone}`}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-canvas-subtle dark:bg-espresso-800 text-espresso-800 dark:text-espresso-100 hover:bg-canvas-border text-xs font-bold transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{t.location.call}</span>
              </a>
            </div>

            {/* Weekly Schedule Table */}
            <div className="pt-4 border-t border-canvas-border dark:border-darkcanvas-border space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-espresso-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-brand-500" />
                <span>{t.location.hours}</span>
              </h4>

              <div className="divide-y divide-canvas-border/50 dark:divide-darkcanvas-border/50 text-xs sm:text-sm">
                {daysOfWeek.map((day) => {
                  const schedule = (activeBranch.schedule as any)[day.key];
                  const isWeekend = day.key === 'thursday' || day.key === 'friday';
                  return (
                    <div
                      key={day.key}
                      className="py-2 flex items-center justify-between font-medium text-espresso-700 dark:text-espresso-200"
                    >
                      <span className={isWeekend ? 'font-bold text-brand-600 dark:text-brand-400' : ''}>
                        {lang === 'ar' ? day.ar : day.en}
                      </span>
                      <span className="tabular-nums text-espresso-600 dark:text-espresso-300">
                        {schedule.open === '13:00' ? '1:00 PM' : '6:00 AM'} -{' '}
                        {schedule.close === '01:00' ? '1:00 AM' : '12:00 AM'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Interactive Map Visual (7 cols) */}
          <div className="lg:col-span-7 bg-canvas-card dark:bg-darkcanvas-card rounded-3xl overflow-hidden border border-canvas-border dark:border-darkcanvas-border shadow-soft h-[420px] relative">
            <iframe
              title={`Map of ${activeBranch.nameEn}`}
              src={`https://maps.google.com/maps?q=${activeBranch.coordinates.lat},${activeBranch.coordinates.lng}&z=15&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              className="w-full h-full grayscale-[20%] contrast-[1.1] dark:invert-[90%] dark:hue-rotate-180 transition-all duration-500"
            />
            {/* Map Overlay Card */}
            <div className="absolute bottom-4 inset-x-4 sm:inset-x-auto sm:end-4 p-4 rounded-2xl glass-panel shadow-md border border-canvas-border/80 dark:border-darkcanvas-border/80 flex items-center justify-between gap-4 max-w-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-500 text-espresso-950 flex items-center justify-center font-bold">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-xs sm:text-sm text-espresso-900 dark:text-espresso-100">
                    {lang === 'ar' ? activeBranch.nameAr : activeBranch.nameEn}
                  </p>
                  <p className="text-[11px] text-espresso-500">
                    {lang === 'ar' ? 'خدمة السيارات متوفرة' : 'Curbside pickup available'}
                  </p>
                </div>
              </div>
              <a
                href={activeBranch.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-espresso-900 text-white dark:bg-brand-500 dark:text-espresso-950 text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                {t.location.directions}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
