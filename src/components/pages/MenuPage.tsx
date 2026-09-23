import React, { useState, useMemo } from 'react';
import { Search, Sparkles, Filter, X } from 'lucide-react';
import { MenuCard, MenuItem } from '../menu/MenuCard';
import { ItemModal } from '../item/ItemModal';
import { useCartStore } from '../../store/useCartStore';
import menuData from '../../data/menu.json';

interface Props {
  lang: 'ar' | 'en';
  t: any;
}

export const MenuPage: React.FC<Props> = ({ lang, t }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [temperatureFilter, setTemperatureFilter] = useState<'all' | 'hot' | 'iced' | 'signature'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const addItem = useCartStore((s) => s.addItem);

  const categories = [
    { id: 'all', label: t.categories.all },
    { id: 'filter', label: t.categories.filter },
    { id: 'espresso', label: t.categories.espresso },
    { id: 'iced', label: t.categories.iced },
    { id: 'matcha', label: t.categories.matcha },
    { id: 'bakery', label: t.categories.bakery },
    { id: 'savory', label: t.categories.savory },
    { id: 'boxes', label: t.categories.boxes },
  ];

  // Filtering Logic
  const filteredItems = useMemo(() => {
    return (menuData as MenuItem[]).filter((item) => {
      // Category check
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }

      // Temperature / Signature filter
      if (temperatureFilter === 'hot' && item.temperature !== 'hot') return false;
      if (temperatureFilter === 'iced' && item.temperature !== 'iced') return false;
      if (temperatureFilter === 'signature' && !item.isSignature) return false;

      // Search query check (bilingual)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchAr = item.nameAr.toLowerCase().includes(q) || item.descriptionAr.toLowerCase().includes(q);
        const matchEn = item.nameEn.toLowerCase().includes(q) || item.descriptionEn.toLowerCase().includes(q);
        return matchAr || matchEn;
      }

      return true;
    });
  }, [activeCategory, temperatureFilter, searchQuery]);

  const handleOpenModal = (item: MenuItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleQuickAdd = (item: MenuItem) => {
    addItem({
      menuItemId: item.id,
      nameAr: item.nameAr,
      nameEn: item.nameEn,
      imageKey: item.imageKey,
      unitPrice: item.price,
      quantity: 1,
      options: {
        size: item.options?.sizes ? item.options.sizes[0] : undefined,
        milk: item.options?.milks ? item.options.milks[0] : undefined,
        beans: item.options?.beans ? item.options.beans[0] : undefined,
        sweetness: item.options?.sweetness ? item.options.sweetness[0] : undefined,
        ice: item.options?.iceLevels ? item.options.iceLevels[0] : undefined,
      },
    });
  };

  return (
    <div className="min-h-screen py-8 bg-canvas-base dark:bg-darkcanvas-base">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Title & Search Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-4">
          <div>
            <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-espresso-900 dark:text-espresso-50">
              {t.nav.menu}
            </h1>
            <p className="text-xs sm:text-sm text-espresso-500 mt-1 font-light">
              {lang === 'ar'
                ? 'محاصيل مختصة، استخلاص دقيق، ومخبوزات طازجة يومياً في الرياض'
                : 'Specialty origins, precision extractions, and fresh bakes daily in Riyadh'}
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full md:w-80 relative">
            <Search className="w-4 h-4 text-espresso-400 absolute start-3.5 top-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.menu.searchPlaceholder}
              className="w-full ps-10 pe-9 py-2.5 rounded-full bg-canvas-card dark:bg-darkcanvas-card border border-canvas-border dark:border-darkcanvas-border text-xs sm:text-sm text-espresso-800 dark:text-espresso-100 placeholder:text-espresso-400 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute end-3.5 top-3 text-espresso-400 hover:text-espresso-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Sticky Filter Bar */}
        <div className="sticky top-16 z-30 py-3 -mx-4 px-4 sm:mx-0 sm:px-0 glass-panel border-y border-canvas-border/80 dark:border-darkcanvas-border/80 shadow-xs space-y-2.5">
          {/* Categories Horizontal Scroll */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 shrink-0 ${
                  activeCategory === cat.id
                    ? 'bg-espresso-900 dark:bg-brand-500 text-white dark:text-espresso-950 shadow-sm scale-105'
                    : 'bg-canvas-card dark:bg-darkcanvas-card text-espresso-600 dark:text-espresso-300 border border-canvas-border dark:border-darkcanvas-border hover:border-brand-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Temperature & Tag Sub-filters */}
          <div className="flex items-center justify-between text-xs text-espresso-500 pt-1">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {[
                { id: 'all', label: t.menu.filterAll },
                { id: 'hot', label: t.menu.filterHot },
                { id: 'iced', label: t.menu.filterIced },
                { id: 'signature', label: t.menu.filterSignature },
              ].map((tf) => (
                <button
                  key={tf.id}
                  type="button"
                  onClick={() => setTemperatureFilter(tf.id as any)}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                    temperatureFilter === tf.id
                      ? 'bg-brand-100 dark:bg-espresso-800 text-brand-700 dark:text-brand-300 font-bold'
                      : 'hover:text-espresso-800 dark:hover:text-espresso-200'
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>

            <span className="tabular-nums font-medium shrink-0">
              {filteredItems.length} {lang === 'ar' ? 'صنفاً' : 'items'}
            </span>
          </div>
        </div>

        {/* Menu Cards Grid */}
        {filteredItems.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <p className="text-base text-espresso-500 font-medium">
              {t.menu.noResults}
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory('all');
                setTemperatureFilter('all');
                setSearchQuery('');
              }}
              className="px-5 py-2 rounded-full bg-brand-500 text-espresso-950 text-xs font-bold shadow-sm"
            >
              {t.menu.clearFilter}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <MenuCard
                key={item.id}
                item={item}
                lang={lang}
                t={t}
                onOpenModal={handleOpenModal}
                onQuickAdd={handleQuickAdd}
              />
            ))}
          </div>
        )}
      </div>

      {/* Item Customization Modal */}
      <ItemModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={(configured) => addItem(configured)}
        lang={lang}
        t={t}
      />
    </div>
  );
};
