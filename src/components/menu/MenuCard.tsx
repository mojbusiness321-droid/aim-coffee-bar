import React from 'react';
import { Plus, Sparkles, Flame, AlertCircle } from 'lucide-react';
import { ResponsiveImage } from '../common/ResponsiveImage';
import { SaudiRiyalSymbol } from '../common/SaudiRiyalSymbol';

export interface MenuItem {
  id: string;
  imageKey: string;
  category: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  price: number;
  calories: number;
  allergens: string[];
  badgeAr?: string;
  badgeEn?: string;
  temperature?: 'hot' | 'iced' | 'both';
  isSignature?: boolean;
  options?: any;
  pairingId?: string;
}

interface Props {
  item: MenuItem;
  lang: 'ar' | 'en';
  t: any;
  onOpenModal: (item: MenuItem) => void;
  onQuickAdd: (item: MenuItem) => void;
}

export const MenuCard: React.FC<Props> = ({ item, lang, t, onOpenModal, onQuickAdd }) => {
  const badge = lang === 'ar' ? item.badgeAr : item.badgeEn;
  const name = lang === 'ar' ? item.nameAr : item.nameEn;
  const description = lang === 'ar' ? item.descriptionAr : item.descriptionEn;

  return (
    <article
      className="group relative flex flex-col rounded-3xl bg-canvas-card dark:bg-darkcanvas-card border border-canvas-border dark:border-darkcanvas-border overflow-hidden shadow-soft hover:shadow-float hover:border-brand-500/50 transition-all duration-300"
    >
      {/* Photo Container */}
      <div
        className="relative cursor-pointer overflow-hidden"
        onClick={() => onOpenModal(item)}
      >
        <ResponsiveImage
          imageKey={item.imageKey}
          alt={name}
          aspectRatio="4:5"
          className="w-full transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badge Overlay */}
        {badge && (
          <div className="absolute top-3 start-3 z-10 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-espresso-900/90 dark:bg-brand-500/95 text-white dark:text-espresso-950 text-xs font-bold shadow-md backdrop-blur-sm">
            <Sparkles className="w-3 h-3 text-brand-400 dark:text-espresso-900" />
            <span>{badge}</span>
          </div>
        )}

        {/* SFDA Calories Pill */}
        <div className="absolute bottom-3 end-3 z-10 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-espresso-950/75 text-espresso-200 text-[11px] font-medium backdrop-blur-md tabular-nums">
          <Flame className="w-3 h-3 text-amber-400" />
          <span>
            {item.calories} {t.menu.calories}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-5 sm:p-6 justify-between space-y-4">
        <div className="space-y-2">
          {/* Header row: Name & Price */}
          <div className="flex items-start justify-between gap-3">
            <h3
              onClick={() => onOpenModal(item)}
              className="text-lg sm:text-xl font-display font-bold text-espresso-900 dark:text-espresso-50 group-hover:text-brand-600 dark:group-hover:text-brand-400 cursor-pointer transition-colors leading-snug"
            >
              {name}
            </h3>
            <div className="text-right shrink-0">
              <span className="text-lg sm:text-xl font-display font-black text-espresso-900 dark:text-espresso-50 tabular-nums">
                {item.price.toFixed(2)}
              </span>
              <SaudiRiyalSymbol className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 ms-1" />
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-espresso-600 dark:text-espresso-300 font-light line-clamp-2 leading-relaxed">
            {description}
          </p>

          {/* Allergen tags */}
          {item.allergens && item.allergens.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {item.allergens.map((alg) => (
                <span
                  key={alg}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-canvas-subtle dark:bg-darkcanvas-subtle text-espresso-500 dark:text-espresso-400 text-[10px] font-medium"
                >
                  <AlertCircle className="w-2.5 h-2.5 text-amber-500" />
                  {alg}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Card Footer Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-canvas-border/50 dark:border-darkcanvas-border/50">
          <button
            type="button"
            onClick={() => onOpenModal(item)}
            className="flex-1 py-2.5 px-4 rounded-xl bg-canvas-subtle hover:bg-canvas-border dark:bg-espresso-800 dark:hover:bg-espresso-700 text-espresso-800 dark:text-espresso-100 text-xs sm:text-sm font-semibold transition-colors"
          >
            {t.menu.customize}
          </button>

          <button
            type="button"
            onClick={() => onQuickAdd(item)}
            className="w-10 h-10 rounded-xl bg-espresso-900 hover:bg-espresso-800 dark:bg-brand-500 dark:hover:bg-brand-600 text-white dark:text-espresso-950 flex items-center justify-center transition-transform active:scale-90 shrink-0 shadow-sm"
            title={t.menu.quickAdd}
            aria-label={`${t.menu.quickAdd} ${name}`}
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </article>
  );
};
