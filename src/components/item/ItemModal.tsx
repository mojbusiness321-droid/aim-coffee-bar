import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Check, Flame, AlertCircle, Sparkles, Coffee } from 'lucide-react';
import { MenuItem } from '../menu/MenuCard';
import { ResponsiveImage } from '../common/ResponsiveImage';
import { SaudiRiyalSymbol } from '../common/SaudiRiyalSymbol';
import menuData from '../../data/menu.json';

interface Props {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (configuredItem: any) => void;
  lang: 'ar' | 'en';
  t: any;
}

export const ItemModal: React.FC<Props> = ({ item, isOpen, onClose, onAddToCart, lang, t }) => {
  if (!isOpen || !item) return null;

  // Selected Option States
  const [selectedSize, setSelectedSize] = useState<any>(
    item.options?.sizes ? item.options.sizes[0] : null
  );
  const [selectedMilk, setSelectedMilk] = useState<any>(
    item.options?.milks ? item.options.milks[0] : null
  );
  const [selectedBean, setSelectedBean] = useState<any>(
    item.options?.beans ? item.options.beans[0] : null
  );
  const [selectedSweetness, setSelectedSweetness] = useState<any>(
    item.options?.sweetness ? item.options.sweetness[0] : null
  );
  const [selectedIce, setSelectedIce] = useState<any>(
    item.options?.iceLevels ? item.options.iceLevels[0] : null
  );
  const [extraShot, setExtraShot] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [shakeError, setShakeError] = useState<boolean>(false);

  // Reset states when item changes
  useEffect(() => {
    setSelectedSize(item.options?.sizes ? item.options.sizes[0] : null);
    setSelectedMilk(item.options?.milks ? item.options.milks[0] : null);
    setSelectedBean(item.options?.beans ? item.options.beans[0] : null);
    setSelectedSweetness(item.options?.sweetness ? item.options.sweetness[0] : null);
    setSelectedIce(item.options?.iceLevels ? item.options.iceLevels[0] : null);
    setExtraShot(false);
    setNotes('');
    setQuantity(1);
    setShakeError(false);
  }, [item]);

  // Calculate live unit price
  const sizeDelta = selectedSize?.priceDelta || 0;
  const milkDelta = selectedMilk?.priceDelta || 0;
  const beanDelta = selectedBean?.priceDelta || 0;
  const extraShotDelta = extraShot ? 4.0 : 0;
  const unitPrice = item.price + sizeDelta + milkDelta + beanDelta + extraShotDelta;
  const totalPrice = unitPrice * quantity;

  // Pairing dessert
  const pairedItem = item.pairingId ? (menuData as MenuItem[]).find((m) => m.id === item.pairingId) : null;

  const handleAdd = () => {
    onAddToCart({
      menuItemId: item.id,
      nameAr: item.nameAr,
      nameEn: item.nameEn,
      imageKey: item.imageKey,
      unitPrice,
      quantity,
      options: {
        size: selectedSize,
        milk: selectedMilk,
        beans: selectedBean,
        sweetness: selectedSweetness,
        ice: selectedIce,
        extraShot,
        notes,
      },
    });
    onClose();
  };

  const name = lang === 'ar' ? item.nameAr : item.nameEn;
  const description = lang === 'ar' ? item.descriptionAr : item.descriptionEn;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-espresso-950/75 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-item-title"
    >
      <div
        className={`relative w-full max-w-2xl bg-canvas-card dark:bg-darkcanvas-card rounded-3xl sm:rounded-4xl shadow-2xl border border-canvas-border dark:border-darkcanvas-border overflow-hidden my-8 max-h-[90vh] flex flex-col ${
          shakeError ? 'animate-bounce' : ''
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 end-4 z-20 w-10 h-10 rounded-full bg-espresso-900/80 hover:bg-espresso-900 text-white flex items-center justify-center backdrop-blur-sm transition-transform active:scale-90"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto flex-1 divide-y divide-canvas-border/50 dark:divide-darkcanvas-border/50">
          {/* Header Image */}
          <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-espresso-900">
            <ResponsiveImage
              imageKey={item.imageKey}
              alt={name}
              aspectRatio="16:9"
              className="w-full h-full object-cover"
              priority={true}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-canvas-card dark:from-darkcanvas-card via-transparent to-transparent" />
          </div>

          {/* Item Meta & Details */}
          <div className="p-6 sm:p-8 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="modal-item-title"
                  className="text-2xl sm:text-3xl font-display font-extrabold text-espresso-900 dark:text-espresso-50"
                >
                  {name}
                </h2>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-espresso-500 dark:text-espresso-400">
                  <span className="inline-flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                    <Flame className="w-3.5 h-3.5" />
                    {item.calories} {t.menu.calories}
                  </span>
                  {item.allergens && item.allergens.length > 0 && (
                    <span className="flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-espresso-400" />
                      {t.itemModal.allergens}: {item.allergens.join('، ')}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-2xl sm:text-3xl font-display font-black text-espresso-900 dark:text-espresso-50 tabular-nums">
                  {unitPrice.toFixed(2)}
                </span>
                <SaudiRiyalSymbol className="w-4 h-4 text-brand-600 dark:text-brand-400 ms-1" />
              </div>
            </div>

            <p className="text-sm sm:text-base text-espresso-600 dark:text-espresso-300 font-light leading-relaxed">
              {description}
            </p>

            {/* Specialty Bean Origin Box (If applicable) */}
            {selectedBean && (
              <div className="p-4 rounded-2xl bg-brand-50/80 dark:bg-espresso-800/60 border border-brand-200 dark:border-espresso-700 flex items-start gap-3 text-xs">
                <Coffee className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-espresso-900 dark:text-espresso-100 block">
                    {lang === 'ar' ? 'إيحاءات المحصول:' : 'Bean Profile:'}{' '}
                    {lang === 'ar' ? selectedBean.tastingNotesAr : selectedBean.tastingNotesEn}
                  </span>
                  <span className="text-espresso-500 dark:text-espresso-400">
                    {lang === 'ar' ? 'المصدر:' : 'Origin:'} {selectedBean.origin}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Customization Options */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* 1. Size Selection */}
            {item.options?.sizes && (
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-espresso-700 dark:text-espresso-300 block">
                  {t.itemModal.size} <span className="text-brand-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {item.options.sizes.map((s: any) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border text-xs sm:text-sm font-semibold transition-all ${
                        selectedSize?.id === s.id
                          ? 'border-brand-500 bg-brand-50 dark:bg-espresso-800 text-espresso-900 dark:text-espresso-50 shadow-sm'
                          : 'border-canvas-border dark:border-darkcanvas-border bg-canvas-card dark:bg-darkcanvas-card text-espresso-600 dark:text-espresso-400 hover:border-brand-300'
                      }`}
                    >
                      <span>{lang === 'ar' ? s.nameAr : s.nameEn}</span>
                      {s.priceDelta > 0 && (
                        <span className="text-xs text-brand-600 dark:text-brand-400 font-bold tabular-nums">
                          +{s.priceDelta.toFixed(2)} {t.menu.sar}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Bean Selection */}
            {item.options?.beans && (
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-espresso-700 dark:text-espresso-300 block">
                  {t.itemModal.beans}
                </label>
                <div className="space-y-2">
                  {item.options.beans.map((b: any) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setSelectedBean(b)}
                      className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-xs sm:text-sm font-medium transition-all ${
                        selectedBean?.id === b.id
                          ? 'border-brand-500 bg-brand-50 dark:bg-espresso-800 text-espresso-900 dark:text-espresso-50 shadow-sm'
                          : 'border-canvas-border dark:border-darkcanvas-border bg-canvas-card dark:bg-darkcanvas-card text-espresso-600 dark:text-espresso-400 hover:border-brand-300'
                      }`}
                    >
                      <div className="text-start">
                        <p className="font-bold">{lang === 'ar' ? b.nameAr : b.nameEn}</p>
                        <p className="text-[11px] text-espresso-500">
                          {lang === 'ar' ? b.tastingNotesAr : b.tastingNotesEn}
                        </p>
                      </div>
                      {b.priceDelta > 0 && (
                        <span className="text-xs text-brand-600 dark:text-brand-400 font-bold tabular-nums shrink-0">
                          +{b.priceDelta.toFixed(2)} {t.menu.sar}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Milk Selection */}
            {item.options?.milks && (
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-espresso-700 dark:text-espresso-300 block">
                  {t.itemModal.milk}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {item.options.milks.map((m: any) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedMilk(m)}
                      className={`p-3 rounded-2xl border text-xs font-semibold text-center transition-all ${
                        selectedMilk?.id === m.id
                          ? 'border-brand-500 bg-brand-50 dark:bg-espresso-800 text-espresso-900 dark:text-espresso-50'
                          : 'border-canvas-border dark:border-darkcanvas-border bg-canvas-card dark:bg-darkcanvas-card text-espresso-600 dark:text-espresso-400'
                      }`}
                    >
                      <div>{lang === 'ar' ? m.nameAr : m.nameEn}</div>
                      {m.priceDelta > 0 && (
                        <div className="text-[11px] text-brand-600 dark:text-brand-400 font-bold mt-0.5 tabular-nums">
                          +{m.priceDelta.toFixed(2)} {t.menu.sar}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Sweetness Selection */}
            {item.options?.sweetness && (
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-espresso-700 dark:text-espresso-300 block">
                  {t.itemModal.sweetness}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {item.options.sweetness.map((sw: any) => (
                    <button
                      key={sw.id}
                      type="button"
                      onClick={() => setSelectedSweetness(sw)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        selectedSweetness?.id === sw.id
                          ? 'border-brand-500 bg-brand-50 dark:bg-espresso-800 text-espresso-900 dark:text-espresso-50'
                          : 'border-canvas-border dark:border-darkcanvas-border text-espresso-600 dark:text-espresso-400'
                      }`}
                    >
                      {lang === 'ar' ? sw.nameAr : sw.nameEn}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Extra Shot & Ice */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {item.options?.extraShot && (
                <label className="flex items-center gap-3 p-3.5 rounded-2xl border border-canvas-border dark:border-darkcanvas-border cursor-pointer hover:bg-canvas-subtle dark:hover:bg-espresso-800">
                  <input
                    type="checkbox"
                    checked={extraShot}
                    onChange={(e) => setExtraShot(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-500 focus:ring-brand-500"
                  />
                  <div className="text-xs font-semibold">
                    <span className="block text-espresso-900 dark:text-espresso-100">{t.itemModal.extraShot}</span>
                    <span className="text-brand-600 dark:text-brand-400 font-bold">{t.itemModal.extraShotPrice}</span>
                  </div>
                </label>
              )}

              {item.options?.iceLevels && (
                <div className="flex items-center gap-2">
                  {item.options.iceLevels.map((ic: any) => (
                    <button
                      key={ic.id}
                      type="button"
                      onClick={() => setSelectedIce(ic)}
                      className={`flex-1 p-3 rounded-2xl border text-xs font-semibold transition-all ${
                        selectedIce?.id === ic.id
                          ? 'border-brand-500 bg-brand-50 dark:bg-espresso-800 text-espresso-900 dark:text-espresso-50'
                          : 'border-canvas-border dark:border-darkcanvas-border text-espresso-600 dark:text-espresso-400'
                      }`}
                    >
                      {lang === 'ar' ? ic.nameAr : ic.nameEn}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Special Instructions */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-espresso-700 dark:text-espresso-300 block">
                {t.itemModal.notes}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder={t.itemModal.notesPlaceholder}
                className="w-full p-3 rounded-2xl bg-canvas-subtle dark:bg-darkcanvas-subtle border border-canvas-border dark:border-darkcanvas-border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* "Goes Well With" Pairing */}
            {pairedItem && (
              <div className="p-4 rounded-2xl bg-canvas-subtle dark:bg-darkcanvas-subtle border border-canvas-border dark:border-darkcanvas-border space-y-2">
                <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider block">
                  {t.itemModal.goesWellWith}
                </span>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                      <ResponsiveImage
                        imageKey={pairedItem.imageKey}
                        alt={lang === 'ar' ? pairedItem.nameAr : pairedItem.nameEn}
                        aspectRatio="1:1"
                        className="w-full h-full"
                      />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-espresso-900 dark:text-espresso-100">
                        {lang === 'ar' ? pairedItem.nameAr : pairedItem.nameEn}
                      </p>
                      <p className="text-xs text-brand-600 dark:text-brand-400 font-bold tabular-nums">
                        {pairedItem.price.toFixed(2)} {t.menu.sar}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onAddToCart({
                        menuItemId: pairedItem.id,
                        nameAr: pairedItem.nameAr,
                        nameEn: pairedItem.nameEn,
                        imageKey: pairedItem.imageKey,
                        unitPrice: pairedItem.price,
                        quantity: 1,
                        options: {},
                      });
                    }}
                    className="px-3 py-1.5 rounded-xl bg-espresso-900 dark:bg-brand-500 text-white dark:text-espresso-950 text-xs font-semibold hover:opacity-90 transition-opacity shrink-0"
                  >
                    + {lang === 'ar' ? 'إضافة' : 'Add'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Bottom Sticky Bar */}
        <div className="p-4 sm:p-6 bg-canvas-card dark:bg-darkcanvas-card border-t border-canvas-border dark:border-darkcanvas-border flex items-center justify-between gap-4">
          {/* Quantity Counter */}
          <div className="flex items-center gap-3 bg-canvas-subtle dark:bg-espresso-800 p-1.5 rounded-2xl border border-canvas-border dark:border-darkcanvas-border">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-xl bg-canvas-card dark:bg-espresso-700 text-espresso-800 dark:text-espresso-200 flex items-center justify-center hover:bg-canvas-border transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-6 text-center font-bold text-sm tabular-nums text-espresso-900 dark:text-espresso-100">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-xl bg-canvas-card dark:bg-espresso-700 text-espresso-800 dark:text-espresso-200 flex items-center justify-center hover:bg-canvas-border transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleAdd}
            className="flex-1 flex items-center justify-between px-6 py-3.5 rounded-2xl bg-espresso-900 hover:bg-espresso-800 dark:bg-brand-500 dark:hover:bg-brand-600 text-white dark:text-espresso-950 font-display font-bold text-sm shadow-md transition-all active:scale-[0.98]"
          >
            <span>{t.itemModal.addToCart}</span>
            <div className="flex items-center gap-1 tabular-nums">
              <span>{totalPrice.toFixed(2)}</span>
              <SaudiRiyalSymbol className="w-3.5 h-3.5 text-current" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
