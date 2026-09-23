import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Instagram, Clock, ExternalLink, ShieldCheck } from 'lucide-react';

interface Props {
  lang: 'ar' | 'en';
  t: any;
}

export const Footer: React.FC<Props> = ({ lang, t }) => {
  return (
    <footer className="bg-espresso-950 text-espresso-200 border-t border-espresso-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-espresso-900">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-espresso-950 font-display font-black text-base">
                A
              </div>
              <span className="font-display font-extrabold text-xl text-white tracking-tight">
                {lang === 'ar' ? 'أيم كوفي بار' : 'AIM COFFEE BAR'}
              </span>
            </div>
            <p className="text-sm text-espresso-400 leading-relaxed">
              {t.footer.description}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com/aimcoffee.sa"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-espresso-900 hover:bg-brand-500 hover:text-espresso-950 flex items-center justify-center text-espresso-300 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://maps.google.com/?q=24.8028,46.6119"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-espresso-900 hover:bg-brand-500 hover:text-espresso-950 flex items-center justify-center text-espresso-300 transition-colors"
                aria-label="Google Maps"
              >
                <MapPin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-display font-bold text-sm tracking-wider uppercase mb-4">
              {t.footer.quickLinks}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/menu" className="hover:text-brand-400 transition-colors">
                  {t.nav.menu}
                </Link>
              </li>
              <li>
                <Link to="/reservation" className="hover:text-brand-400 transition-colors">
                  {t.nav.reservation}
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-brand-400 transition-colors">
                  {t.nav.about}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-brand-400 transition-colors">
                  {t.faq.title}
                </Link>
              </li>
              <li>
                <Link to="/credits" className="hover:text-brand-400 transition-colors flex items-center gap-1">
                  {t.footer.creditsLink}
                  <ExternalLink className="w-3 h-3 text-brand-500" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Operating Hours */}
          <div>
            <h3 className="text-white font-display font-bold text-sm tracking-wider uppercase mb-4 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-brand-400" />
              {t.footer.hours}
            </h3>
            <ul className="space-y-2 text-sm text-espresso-400 tabular-nums">
              <li>{t.footer.satWed}</li>
              <li>{t.footer.thu}</li>
              <li>{t.footer.fri}</li>
              <li className="pt-2 text-xs text-brand-400">
                * {lang === 'ar' ? 'أوقات الرياض (Asia/Riyadh)' : 'Riyadh Local Time (Asia/Riyadh)'}
              </li>
            </ul>
          </div>

          {/* Branches info */}
          <div>
            <h3 className="text-white font-display font-bold text-sm tracking-wider uppercase mb-4 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-brand-400" />
              {lang === 'ar' ? 'فروعنا في الرياض' : 'Riyadh Locations'}
            </h3>
            <div className="space-y-3 text-sm text-espresso-400">
              <div>
                <p className="font-medium text-espresso-200">
                  {lang === 'ar' ? 'فرع الملقا (الرئيسي)' : 'Al Malqa (Flagship)'}
                </p>
                <p className="text-xs text-espresso-500 mt-0.5">
                  {lang === 'ar' ? 'شارع عبدالله الخرجي، حي الملقا' : 'Abdullah Al Kharji St, Al Malqa'}
                </p>
              </div>
              <div>
                <p className="font-medium text-espresso-200">
                  {lang === 'ar' ? 'فرع النرجس' : 'Al Narjis Branch'}
                </p>
                <p className="text-xs text-espresso-500 mt-0.5">
                  {lang === 'ar' ? 'شارع سعود بن عبدالله جلوي' : 'Saud Bin Abdullah Jalawi St'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Concept Disclaimer Box */}
        <div className="mt-8 p-4 rounded-2xl bg-espresso-900/60 border border-espresso-800 text-xs text-espresso-400 flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {t.footer.disclaimer}
          </p>
        </div>

        {/* Bottom Credits */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-espresso-500">
          <p>{t.footer.allRightsReserved}</p>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-brand-500"></span>
            <p className="font-medium text-brand-400">
              {t.footer.designerCredit}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
