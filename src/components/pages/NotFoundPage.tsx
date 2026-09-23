import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee, ArrowLeft, ArrowRight } from 'lucide-react';

interface Props {
  lang: 'ar' | 'en';
  t: any;
}

export const NotFoundPage: React.FC<Props> = ({ lang, t }) => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-6 bg-canvas-base dark:bg-darkcanvas-base">
      <div className="max-w-md mx-auto text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-brand-50 dark:bg-espresso-800 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto shadow-md">
          <Coffee className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-5xl font-display font-black text-brand-500 tabular-nums">404</span>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-espresso-900 dark:text-espresso-50">
            {lang === 'ar' ? 'القهوة انسكبت!' : 'Spilled Coffee!'}
          </h1>
          <p className="text-xs sm:text-sm text-espresso-600 dark:text-espresso-300 font-light leading-relaxed">
            {lang === 'ar'
              ? 'يبدو أن الصفحة التي تبحث عنها غير موجودة أو تم نقلها. خذ رشفة واستكشف قائمتنا الطازجة.'
              : 'The page you are looking for does not exist or has been relocated. Take a sip and browse our fresh menu.'}
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-espresso-900 dark:bg-brand-500 text-white dark:text-espresso-950 text-xs font-bold shadow-md transition-transform active:scale-95"
        >
          <span>{lang === 'ar' ? 'العودة للرئيسية' : 'Return to Home'}</span>
          {lang === 'ar' ? <ArrowLeft className="w-4 h-4 icon-flip" /> : <ArrowRight className="w-4 h-4" />}
        </Link>
      </div>
    </div>
  );
};
