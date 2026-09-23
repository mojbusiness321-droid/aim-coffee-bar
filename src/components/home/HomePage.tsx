import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Sparkles, Coffee, ShieldCheck, Heart } from 'lucide-react';
import { Hero } from './Hero';
import { AtmosphereGallery } from './AtmosphereGallery';
import { LocationSection } from './LocationSection';
import { MenuCard, MenuItem } from '../menu/MenuCard';
import { ItemModal } from '../item/ItemModal';
import { ResponsiveImage } from '../common/ResponsiveImage';
import { useCartStore } from '../../store/useCartStore';
import menuData from '../../data/menu.json';

interface Props {
  lang: 'ar' | 'en';
  t: any;
}

export const HomePage: React.FC<Props> = ({ lang, t }) => {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const addItem = useCartStore((s) => s.addItem);

  // Featured 6 items
  const featuredItems = (menuData as MenuItem[]).filter((m) => m.isSignature).slice(0, 6);

  // Category Showcases
  const categoryHighlights = [
    { id: 'filter', titleAr: 'القهوة المقطرة V60', titleEn: 'Manual Drip V60', imageKey: 'item-v60-hot', descAr: 'إيحاءات فاكهية وعطرية نقية' },
    { id: 'espresso', titleAr: 'بار الإسبريسو', titleEn: 'Espresso Bar', imageKey: 'item-flat-white', descAr: 'استخلاص متزن ورغوة مخملية' },
    { id: 'iced', titleAr: 'المشروبات الباردة', titleEn: 'Cold Bar & Refreshers', imageKey: 'item-spanish-latte-iced', descAr: 'سبانش لاتيه وكركديه منعش' },
    { id: 'matcha', titleAr: 'الماتشا الاحتفالية', titleEn: 'Ceremonial Matcha', imageKey: 'item-matcha-iced', descAr: 'ماتشا يابانية نقية مع حليب الشوفان' },
    { id: 'bakery', titleAr: 'المخبوزات والحلويات', titleEn: 'Artisan Bakery', imageKey: 'item-cheesecake-madrid', descAr: 'تشيز كيك مدريد وكوكيز ذائب' },
    { id: 'savory', titleAr: 'الساندوتشات الطازجة', titleEn: 'Fresh Sandwiches', imageKey: 'item-burrata-sandwich', descAr: 'بوراتا، حلومي، وشيباتا تونا' },
  ];

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
    <div className="space-y-0">
      {/* 1. Hero */}
      <Hero lang={lang} t={t} />

      {/* 2. Featured Items Section */}
      <section className="py-20 bg-canvas-base dark:bg-darkcanvas-base transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.featured.badge}</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-espresso-900 dark:text-espresso-50">
                {t.featured.title}
              </h2>
              <p className="text-sm sm:text-base text-espresso-600 dark:text-espresso-300 font-light max-w-xl">
                {t.featured.subtitle}
              </p>
            </div>

            <Link
              to="/menu"
              className="inline-flex items-center gap-2 text-sm font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 transition-colors"
            >
              <span>{lang === 'ar' ? 'عرض كامل القائمة' : 'View Full Menu'}</span>
              {lang === 'ar' ? <ArrowLeft className="w-4 h-4 icon-flip" /> : <ArrowRight className="w-4 h-4" />}
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredItems.map((item) => (
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
        </div>
      </section>

      {/* 3. Category Highlights Slider / Grid */}
      <section className="py-16 bg-canvas-subtle dark:bg-darkcanvas-subtle transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-espresso-900 dark:text-espresso-50">
              {lang === 'ar' ? 'تصنيفات أيم كوفي بار' : 'Explore Categories'}
            </h2>
            <p className="text-sm text-espresso-600 dark:text-espresso-300 font-light">
              {lang === 'ar' ? 'تنوع يرضي كافة الأذواق من المقطرة إلى الماتشا والحلويات' : 'From delicate pour-overs to ceremonial matcha and fresh bakes'}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categoryHighlights.map((cat) => (
              <Link
                key={cat.id}
                to="/menu"
                className="group flex flex-col rounded-2xl bg-canvas-card dark:bg-darkcanvas-card border border-canvas-border dark:border-darkcanvas-border overflow-hidden shadow-sm hover:shadow-md hover:border-brand-500/50 transition-all duration-300 p-3 text-center"
              >
                <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-espresso-900">
                  <ResponsiveImage
                    imageKey={cat.imageKey}
                    alt={lang === 'ar' ? cat.titleAr : cat.titleEn}
                    aspectRatio="1:1"
                    className="w-full h-full transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-display font-bold text-xs sm:text-sm text-espresso-900 dark:text-espresso-100 group-hover:text-brand-600 transition-colors">
                  {lang === 'ar' ? cat.titleAr : cat.titleEn}
                </h3>
                <p className="text-[10px] text-espresso-500 line-clamp-1 mt-1 font-light">
                  {cat.descAr}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Brand Philosophy / Craft Story */}
      <section className="py-20 bg-canvas-base dark:bg-darkcanvas-base transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Story Visuals (5 cols) */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-canvas-border dark:border-darkcanvas-border aspect-[4/5]">
                <ResponsiveImage
                  imageKey="atmosphere-v60"
                  alt="V60 Pour Over at Aim Coffee Bar"
                  aspectRatio="4:5"
                  className="w-full h-full"
                />
              </div>
              <div className="absolute -bottom-6 -start-6 w-48 p-4 rounded-2xl glass-panel shadow-float border border-canvas-border/80 dark:border-darkcanvas-border/80 hidden sm:block">
                <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-bold text-xs">
                  <Coffee className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'معايير تخصصية' : 'Specialty Standards'}</span>
                </div>
                <p className="text-[11px] text-espresso-600 dark:text-espresso-300 mt-1">
                  {lang === 'ar' ? 'محاصيل بن حاصلة على 85+ نقطة عالمية' : 'Beans scoring 85+ global specialty grade'}
                </p>
              </div>
            </div>

            {/* Story Content (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 text-xs font-bold uppercase tracking-wider">
                <Heart className="w-3.5 h-3.5" />
                <span>{t.story.badge}</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-espresso-900 dark:text-espresso-50 leading-tight">
                {t.story.title}
              </h2>

              <p className="text-base sm:text-lg text-espresso-600 dark:text-espresso-300 font-light leading-relaxed">
                {t.story.p1}
              </p>

              <p className="text-base sm:text-lg text-espresso-600 dark:text-espresso-300 font-light leading-relaxed">
                {t.story.p2}
              </p>

              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-espresso-900 dark:bg-brand-500 text-white dark:text-espresso-950 font-bold text-sm transition-transform active:scale-95 shadow-sm"
                >
                  <span>{lang === 'ar' ? 'اقرأ قصتنا كاملة' : 'Read Full Story'}</span>
                  {lang === 'ar' ? <ArrowLeft className="w-4 h-4 icon-flip" /> : <ArrowRight className="w-4 h-4" />}
                </Link>

                <Link
                  to="/reservation"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-canvas-subtle dark:bg-espresso-800 text-espresso-800 dark:text-espresso-200 border border-canvas-border dark:border-darkcanvas-border font-semibold text-sm hover:border-brand-500 transition-colors"
                >
                  <span>{t.nav.reservation}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Atmosphere Gallery */}
      <AtmosphereGallery lang={lang} t={t} />

      {/* 6. Location & Hours */}
      <LocationSection lang={lang} t={t} />

      {/* Modal Customizer */}
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
