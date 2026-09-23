import React from 'react';
import { Sparkles, Coffee, Droplets, Award, Heart } from 'lucide-react';
import { ResponsiveImage } from '../common/ResponsiveImage';

interface Props {
  lang: 'ar' | 'en';
  t: any;
}

export const AboutPage: React.FC<Props> = ({ lang, t }) => {
  const craftSteps = [
    {
      icon: Award,
      title: t.about.craft1Title,
      desc: t.about.craft1Desc,
    },
    {
      icon: Droplets,
      title: t.about.craft2Title,
      desc: t.about.craft2Desc,
    },
    {
      icon: Coffee,
      title: t.about.craft3Title,
      desc: t.about.craft3Desc,
    },
  ];

  return (
    <div className="min-h-screen py-16 bg-canvas-base dark:bg-darkcanvas-base">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-16">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brand-100 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 text-xs font-bold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5" />
            <span>{t.nav.about}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-espresso-900 dark:text-espresso-50 leading-tight">
            {t.about.title}
          </h1>
          <p className="text-base sm:text-xl text-espresso-600 dark:text-espresso-300 font-light">
            {t.about.subtitle}
          </p>
        </div>

        {/* Hero Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="rounded-3xl overflow-hidden shadow-soft border border-canvas-border dark:border-darkcanvas-border aspect-[4/3]">
            <ResponsiveImage
              imageKey="atmosphere-bar"
              alt="Aim Coffee Bar Interior"
              aspectRatio="4:3"
              className="w-full h-full"
            />
          </div>
          <div className="rounded-3xl overflow-hidden shadow-soft border border-canvas-border dark:border-darkcanvas-border aspect-[4/3]">
            <ResponsiveImage
              imageKey="atmosphere-pour"
              alt="Latte Art Pour at Aim Coffee Bar"
              aspectRatio="4:3"
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Story Content */}
        <div className="p-8 sm:p-12 rounded-3xl bg-canvas-card dark:bg-darkcanvas-card border border-canvas-border dark:border-darkcanvas-border shadow-soft space-y-6 text-base sm:text-lg text-espresso-700 dark:text-espresso-200 font-light leading-relaxed">
          <p>{t.story.p1}</p>
          <p>{t.story.p2}</p>
          <p>
            {lang === 'ar'
              ? 'نهدف في كل فنجان نسكبه إلى خلق تجربة تتناغم مع إيقاع الرياض العصري، سواء كنت تبحث عن استراحة هادئة وسط يوم عمل شاق، أو جلسة دافئة مع الأصدقاء في ليالي العاصمة الجميلة.'
              : 'Our aim in every cup is to resonate with the modern rhythm of Riyadh, whether providing calm focus on a busy workday or welcoming evening gatherings with loved ones.'}
          </p>
        </div>

        {/* Craft Standards 3-Step */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-espresso-900 dark:text-espresso-50">
              {t.about.craftTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {craftSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-canvas-card dark:bg-darkcanvas-card border border-canvas-border dark:border-darkcanvas-border shadow-soft space-y-3"
                >
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-espresso-800 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-espresso-900 dark:text-espresso-50">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-espresso-600 dark:text-espresso-300 font-light leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
