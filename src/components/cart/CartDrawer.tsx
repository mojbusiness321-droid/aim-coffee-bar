import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { ResponsiveImage } from '../common/ResponsiveImage';
import { SaudiRiyalSymbol } from '../common/SaudiRiyalSymbol';
import menuData from '../../data/menu.json';

interface Props {
  lang: 'ar' | 'en';
  t: any;
}

export const CartDrawer: React.FC<Props> = ({ lang, t }) => {
  const navigate = useNavigate();
  const {
    items,
    isOpen,
    setIsOpen,
    updateQuantity,
    removeItem,
    clearCart,
    getSubtotal,
    getDeliveryFee,
    getDiscount,
    getVatAmount,
    getTotal,
    getTotalCount,
    fulfillmentType,
  } = useCartStore();

  if (!isOpen) return null;

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const discount = getDiscount();
  const vatAmount = getVatAmount();
  const total = getTotal();
  const totalCount = getTotalCount();

  const minOrder = 35.0;
  const isDelivery = fulfillmentType === 'delivery';
  const belowMinimum = isDelivery && subtotal < minOrder;
  const remainingForMin = Math.max(0, minOrder - subtotal);

  // Suggested Upsells (items not in cart)
  const cartItemIds = items.map((i) => i.menuItemId);
  const upsellItems = (menuData as any[])
    .filter((m) => !cartItemIds.includes(m.id) && (m.category === 'bakery' || m.isSignature))
    .slice(0, 3);

  const handleCheckout = () => {
    setIsOpen(false);
    navigate('/checkout');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-espresso-950/70 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
      onClick={() => setIsOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
    >
      <div
        className="w-full max-w-md bg-canvas-card dark:bg-darkcanvas-card h-full shadow-2xl flex flex-col border-s border-canvas-border dark:border-darkcanvas-border animate-in slide-in-from-end duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 sm:p-6 border-b border-canvas-border dark:border-darkcanvas-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-espresso-800 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="cart-drawer-title"
                className="font-display font-bold text-lg text-espresso-900 dark:text-espresso-50"
              >
                {t.cart.title}
              </h2>
              <span className="text-xs text-espresso-500">
                {totalCount} {t.cart.itemCount}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="text-xs text-rose-500 hover:text-rose-600 font-medium px-2 py-1"
              >
                {t.cart.clear}
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-9 h-9 rounded-full bg-canvas-subtle dark:bg-espresso-800 text-espresso-600 dark:text-espresso-300 hover:bg-canvas-border flex items-center justify-center transition-colors"
              aria-label="Close Cart"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 divide-y divide-canvas-border/50 dark:divide-darkcanvas-border/50">
          {/* Empty State */}
          {items.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-canvas-subtle dark:bg-espresso-800 text-espresso-400 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <p className="font-display font-bold text-lg text-espresso-900 dark:text-espresso-100">
                  {t.cart.empty}
                </p>
                <p className="text-xs text-espresso-500 mt-1 max-w-xs mx-auto">
                  {t.cart.emptySub}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-6 py-2.5 rounded-full bg-brand-500 text-espresso-950 text-xs font-bold shadow-sm"
              >
                {t.cart.browseMenu}
              </button>
            </div>
          ) : (
            <>
              {/* Item List */}
              <div className="space-y-4">
                {items.map((cartItem) => {
                  const name = lang === 'ar' ? cartItem.nameAr : cartItem.nameEn;
                  const itemTotal = cartItem.unitPrice * cartItem.quantity;
                  const opts = cartItem.options;

                  return (
                    <div
                      key={cartItem.id}
                      className="flex items-start gap-3 p-3 rounded-2xl bg-canvas-subtle dark:bg-darkcanvas-subtle border border-canvas-border dark:border-darkcanvas-border"
                    >
                      {/* Thumbnail */}
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-espresso-900">
                        <ResponsiveImage
                          imageKey={cartItem.imageKey}
                          alt={name}
                          aspectRatio="1:1"
                          className="w-full h-full"
                        />
                      </div>

                      {/* Info & Options */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-xs sm:text-sm text-espresso-900 dark:text-espresso-100 truncate">
                            {name}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeItem(cartItem.id)}
                            className="text-espresso-400 hover:text-rose-500 p-0.5"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Selected Options Summary */}
                        <div className="text-[11px] text-espresso-500 dark:text-espresso-400 space-y-0.5 leading-tight">
                          {opts.size && <span>{lang === 'ar' ? opts.size.nameAr : opts.size.nameEn} · </span>}
                          {opts.milk && <span>{lang === 'ar' ? opts.milk.nameAr : opts.milk.nameEn} · </span>}
                          {opts.beans && <span>{lang === 'ar' ? opts.beans.nameAr : opts.beans.nameEn} · </span>}
                          {opts.sweetness && <span>{lang === 'ar' ? opts.sweetness.nameAr : opts.sweetness.nameEn}</span>}
                          {opts.extraShot && <span className="block text-brand-600 dark:text-brand-400 font-semibold">+ شوت إضافي</span>}
                        </div>

                        {/* Quantity Controls & Price */}
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-2 bg-canvas-card dark:bg-espresso-800 rounded-lg border border-canvas-border dark:border-darkcanvas-border px-2 py-0.5">
                            <button
                              type="button"
                              onClick={() => updateQuantity(cartItem.id, -1)}
                              className="text-espresso-600 dark:text-espresso-300 hover:text-rose-500"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold tabular-nums min-w-[14px] text-center">
                              {cartItem.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(cartItem.id, 1)}
                              className="text-espresso-600 dark:text-espresso-300 hover:text-brand-500"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="text-end">
                            <span className="font-bold text-xs sm:text-sm text-espresso-900 dark:text-espresso-100 tabular-nums">
                              {itemTotal.toFixed(2)}
                            </span>
                            <SaudiRiyalSymbol className="w-3 h-3 text-brand-600 dark:text-brand-400 ms-0.5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* "Add something?" Upsell Suggestions */}
              {upsellItems.length > 0 && (
                <div className="pt-4 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-espresso-700 dark:text-espresso-300">
                    <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                    <span>{lang === 'ar' ? 'أضف مع قهوتك حلى طازج:' : 'Complete your order with dessert:'}</span>
                  </div>

                  <div className="space-y-2">
                    {upsellItems.map((up) => (
                      <div
                        key={up.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-canvas-subtle/70 dark:bg-darkcanvas-subtle border border-canvas-border/60 dark:border-darkcanvas-border/60"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                            <ResponsiveImage
                              imageKey={up.imageKey}
                              alt={lang === 'ar' ? up.nameAr : up.nameEn}
                              aspectRatio="1:1"
                              className="w-full h-full"
                            />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-espresso-900 dark:text-espresso-100">
                              {lang === 'ar' ? up.nameAr : up.nameEn}
                            </p>
                            <p className="text-[11px] text-brand-600 dark:text-brand-400 font-bold tabular-nums">
                              {up.price.toFixed(2)} {t.menu.sar}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            useCartStore.getState().addItem({
                              menuItemId: up.id,
                              nameAr: up.nameAr,
                              nameEn: up.nameEn,
                              imageKey: up.imageKey,
                              unitPrice: up.price,
                              quantity: 1,
                              options: {},
                            });
                          }}
                          className="px-2.5 py-1 rounded-lg bg-espresso-900 hover:bg-espresso-800 dark:bg-brand-500 dark:text-espresso-950 text-white text-[11px] font-bold"
                        >
                          + {lang === 'ar' ? 'إضافة' : 'Add'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Drawer Bottom Summary & Checkout */}
        {items.length > 0 && (
          <div className="p-5 sm:p-6 bg-canvas-card dark:bg-darkcanvas-card border-t border-canvas-border dark:border-darkcanvas-border space-y-4">
            {/* Delivery Minimum Warning */}
            {belowMinimum && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2 text-xs text-amber-700 dark:text-amber-300">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>
                  {t.cart.minOrderNotice.replace('{remaining}', remainingForMin.toFixed(2))}
                </span>
              </div>
            )}

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-espresso-600 dark:text-espresso-300 tabular-nums">
              <div className="flex justify-between">
                <span>{t.cart.subtotal}</span>
                <span className="font-semibold text-espresso-900 dark:text-espresso-100">
                  {subtotal.toFixed(2)} {t.menu.sar}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>{t.cart.discount} (15%)</span>
                  <span>-{discount.toFixed(2)} {t.menu.sar}</span>
                </div>
              )}

              {isDelivery && (
                <div className="flex justify-between">
                  <span>{t.cart.deliveryFee}</span>
                  <span>{deliveryFee.toFixed(2)} {t.menu.sar}</span>
                </div>
              )}

              <div className="flex justify-between text-espresso-400 text-[11px] pt-1">
                <span>{t.cart.vatNotice}</span>
                <span>({vatAmount.toFixed(2)} {t.menu.sar})</span>
              </div>

              <div className="flex justify-between items-baseline pt-2 border-t border-canvas-border dark:border-darkcanvas-border text-base font-bold text-espresso-900 dark:text-espresso-50">
                <span>{t.cart.total}</span>
                <div className="flex items-center gap-1 text-xl font-black">
                  <span>{total.toFixed(2)}</span>
                  <SaudiRiyalSymbol className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                </div>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              type="button"
              disabled={belowMinimum}
              onClick={handleCheckout}
              className={`w-full py-4 px-6 rounded-2xl font-display font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all ${
                belowMinimum
                  ? 'bg-espresso-300 dark:bg-espresso-800 text-espresso-500 cursor-not-allowed'
                  : 'bg-espresso-900 hover:bg-espresso-800 dark:bg-brand-500 dark:hover:bg-brand-600 text-white dark:text-espresso-950 active:scale-[0.98]'
              }`}
            >
              <span>{t.cart.checkout}</span>
              {lang === 'ar' ? (
                <ArrowLeft className="w-4 h-4 icon-flip" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
