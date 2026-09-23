import React, { useState, useEffect } from 'react';
import { ExternalLink, Camera, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Credit {
  key: string;
  photographer: string;
  source: string;
  sourceUrl: string;
  isOfficial?: boolean;
}

interface Props {
  lang: 'ar' | 'en';
  t: any;
}

export const CreditsPage: React.FC<Props> = ({ lang, t }) => {
  const [credits, setCredits] = useState<Credit[]>([]);

  useEffect(() => {
    fetch('/images/credits.json')
      .then((res) => res.json())
      .then((data) => setCredits(data))
      .catch((err) => console.warn('Could not load credits.json:', err));
  }, []);

  return (
    <div className="min-h-screen py-16 bg-canvas-base dark:bg-darkcanvas-base">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brand-100 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 text-xs font-bold uppercase tracking-wider">
            <Camera className="w-3.5 h-3.5" />
            <span>{t.credits.title}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-espresso-900 dark:text-espresso-50">
            {t.credits.subtitle}
          </h1>
          <p className="text-xs sm:text-sm text-espresso-500 max-w-xl mx-auto leading-relaxed">
            {t.credits.notice}
          </p>
        </div>

        {/* Concept Notice Box */}
        <div className="p-5 rounded-2xl bg-canvas-card dark:bg-darkcanvas-card border border-canvas-border dark:border-darkcanvas-border shadow-soft flex items-start gap-3 text-xs text-espresso-600 dark:text-espresso-300">
          <ShieldCheck className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {lang === 'ar'
              ? 'تتم استضافة كافة الصور محلياً ومضغوطة بصيغ WebP وAVIF لتحقيق أقصى سرعة تحميل. نحرص التزاماً بالمعايير الأخلاقية والمهنية على توثيق كافة المصادر والمصورين.'
              : 'All assets are locally self-hosted and optimized in modern WebP & AVIF formats to maximize performance. We proudly credit every creator in accordance with ethical open-license standards.'}
          </p>
        </div>

        {/* Credits Table / List */}
        <div className="rounded-3xl bg-canvas-card dark:bg-darkcanvas-card border border-canvas-border dark:border-darkcanvas-border overflow-hidden shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-canvas-subtle dark:bg-darkcanvas-subtle text-espresso-500 font-bold uppercase tracking-wider border-b border-canvas-border dark:border-darkcanvas-border">
                <tr>
                  <th className="px-6 py-4">{lang === 'ar' ? 'معرّف الصورة / العنصر' : 'Asset Key'}</th>
                  <th className="px-6 py-4">{t.credits.photographer}</th>
                  <th className="px-6 py-4">{t.credits.source}</th>
                  <th className="px-6 py-4 text-end">{t.credits.originalLink}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-canvas-border/50 dark:divide-darkcanvas-border/50 text-espresso-800 dark:text-espresso-200">
                {credits.map((cr) => (
                  <tr key={cr.key} className="hover:bg-canvas-subtle/50 transition-colors">
                    <td className="px-6 py-3.5 font-mono text-espresso-500 font-medium">
                      {cr.key}
                    </td>
                    <td className="px-6 py-3.5 font-semibold text-espresso-900 dark:text-espresso-100">
                      {cr.photographer}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-canvas-subtle dark:bg-espresso-800 text-[11px] font-medium">
                        {cr.source}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-end">
                      <a
                        href={cr.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-brand-600 dark:text-brand-400 hover:underline font-semibold"
                      >
                        <span>{t.credits.viewPhoto}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Back Home Link */}
        <div className="text-center pt-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-espresso-900 dark:bg-brand-500 text-white dark:text-espresso-950 text-xs font-bold shadow-sm hover:opacity-90 transition-opacity"
          >
            {lang === 'ar' ? <ArrowRight className="w-4 h-4 icon-flip" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{t.credits.backHome}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
