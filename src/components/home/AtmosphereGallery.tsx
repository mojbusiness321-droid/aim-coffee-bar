import React, { useState } from 'react';
import { Wifi, Laptop, Sun, Car, Sparkles } from 'lucide-react';
import { ResponsiveImage } from '../common/ResponsiveImage';

interface Props {
  lang: 'ar' | 'en';
  t: any;
}

export const AtmosphereGallery: React.FC<Props> = ({ lang, t }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'bar' | 'seating' | 'beans'>('all');

  const galleryItems = [
    {
      key: 'atmosphere-bar',
      titleAr: 'بار الإسبريسو المتخصص',
      titleEn: 'Precision Espresso Bar',
      category: 'bar',
      ratio: '4:3' as const,
    },
    {
      key: 'atmosphere-pour',
      titleAr: 'رسم الحليب واللاتيه آرت',
      titleEn: 'Silky Latte Art Pour',
      category: 'bar',
      ratio: '4:3' as const,
    },
    {
      key: 'atmosphere-seating',
      titleAr: 'جلسات العمل والدراسة الهادئة',
      titleEn: 'Quiet Work & Study Lounges',
      category: 'seating',
      ratio: '4:3' as const,
    },
    {
      key: 'atmosphere-v60',
      titleAr: 'محطة التقطير اليدوي V60',
      titleEn: 'Manual Drip V60 Station',
      category: 'bar',
      ratio: '4:3' as const,
    },
    {
      key: 'atmosphere-beans',
      titleAr: 'محاصيل البن المختص المنتقاة',
      titleEn: 'Curated Specialty Beans',
      category: 'beans',
      ratio: '4:3' as const,
    },
  ];

  const filteredItems =
    activeTab === 'all'
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeTab);

  const amenities = [
    { icon: Wifi, text: t.atmosphere.amenities.wifi },
    { icon: Laptop, text: t.atmosphere.amenities.quiet },
    { icon: Sun, text: t.atmosphere.amenities.outdoor },
    { icon: Car, text: t.atmosphere.amenities.parking },
    { icon: Sparkles, text: t.atmosphere.amenities.curbside },
  ];

  return (
    <section id="atmosphere" className="py-20 bg-canvas-base dark:bg-darkcanvas-base transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 text-xs font-bold uppercase tracking-wider">
            <span>{t.atmosphere.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-espresso-900 dark:text-espresso-50">
            {t.atmosphere.title}
          </h2>
          <p className="text-base sm:text-lg text-espresso-600 dark:text-espresso-300 font-light leading-relaxed">
            {t.atmosphere.subtitle}
          </p>
        </div>

        {/* Amenities Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {amenities.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-canvas-card dark:bg-darkcanvas-card border border-canvas-border dark:border-darkcanvas-border shadow-sm hover:border-brand-500/50 transition-all duration-300"
              >
                <div className="w-8 h-8 rounded-xl bg-brand-50 dark:bg-espresso-800 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-espresso-800 dark:text-espresso-100 leading-tight">
                  {item.text}
                </span>
              </div>
            );
          })}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center gap-2 pt-4">
          {[
            { id: 'all', labelAr: 'كافة الأجواء', labelEn: 'All Spaces' },
            { id: 'bar', labelAr: 'البار والاستخلاص', labelEn: 'Coffee Bar' },
            { id: 'seating', labelAr: 'الجلسات والمكان', labelEn: 'Seating & Ambiance' },
            { id: 'beans', labelAr: 'البن والمحاصيل', labelEn: 'Specialty Beans' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-espresso-900 dark:bg-brand-500 text-white dark:text-espresso-950 shadow-sm'
                  : 'bg-canvas-card dark:bg-darkcanvas-card text-espresso-600 dark:text-espresso-400 border border-canvas-border dark:border-darkcanvas-border hover:bg-canvas-subtle'
              }`}
            >
              {lang === 'ar' ? tab.labelAr : tab.labelEn}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => (
            <div
              key={item.key}
              className={`group relative rounded-3xl overflow-hidden shadow-soft border border-canvas-border dark:border-darkcanvas-border bg-canvas-card dark:bg-darkcanvas-card transition-all duration-500 hover:-translate-y-1 hover:shadow-lg ${
                idx === 0 ? 'sm:col-span-2 lg:col-span-2' : ''
              }`}
            >
              <ResponsiveImage
                imageKey={item.key}
                alt={lang === 'ar' ? item.titleAr : item.titleEn}
                aspectRatio={idx === 0 ? '16:9' : item.ratio}
                className="w-full h-full transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso-950/80 via-espresso-950/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
              <div className="absolute bottom-0 inset-x-0 p-6 text-white">
                <span className="text-xs font-semibold text-brand-300 uppercase tracking-wider block mb-1">
                  Aim Coffee Bar · Riyadh
                </span>
                <h3 className="text-lg sm:text-xl font-display font-bold">
                  {lang === 'ar' ? item.titleAr : item.titleEn}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
