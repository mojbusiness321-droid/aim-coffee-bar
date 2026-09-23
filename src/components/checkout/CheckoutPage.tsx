import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Car,
  Truck,
  Store,
  MapPin,
  Clock,
  Phone,
  User,
  CreditCard,
  Tag,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { useCartStore, FulfillmentType } from '../../store/useCartStore';
import districtsData from '../../data/districts.json';
import hoursData from '../../data/hours.json';
import { SaudiRiyalSymbol } from '../common/SaudiRiyalSymbol';

interface Props {
  lang: 'ar' | 'en';
  t: any;
}

export const CheckoutPage: React.FC<Props> = ({ lang, t }) => {
  const navigate = useNavigate();
  const {
    items,
    fulfillmentType,
    setFulfillmentType,
    selectedDistrictId,
    setSelectedDistrictId,
    selectedBranchId,
    setSelectedBranchId,
    promoCode,
    applyPromoCode,
    removePromoCode,
    getSubtotal,
    getDeliveryFee,
    getDiscount,
    getVatAmount,
    getTotal,
    clearCart,
  } = useCartStore();

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-canvas-subtle dark:bg-espresso-800 text-espresso-400 flex items-center justify-center">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-display font-bold text-espresso-900 dark:text-espresso-100">
          {t.cart.empty}
        </h2>
        <p className="text-sm text-espresso-500 max-w-sm">
          {t.cart.emptySub}
        </p>
        <button
          type="button"
          onClick={() => navigate('/menu')}
          className="px-6 py-3 rounded-full bg-brand-500 text-espresso-950 font-bold text-sm shadow-sm"
        >
          {t.cart.browseMenu}
        </button>
      </div>
    );
  }

  // Form Fields
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [building, setBuilding] = useState('');
  const [nationalAddress, setNationalAddress] = useState('');
  const [landmark, setLandmark] = useState('');

  // Curbside Fields
  const [carMake, setCarMake] = useState('');
  const [carColor, setCarColor] = useState('');
  const [carPlate, setCarPlate] = useState('');

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<'mada' | 'apple_pay' | 'stc_pay' | 'card' | 'tamara' | 'tabby' | 'cash'>('mada');

  // Time Option
  const [timeSlot, setTimeSlot] = useState<'asap' | 'scheduled'>('asap');
  const [scheduledTime, setScheduledTime] = useState('18:30');

  // Promo Input
  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Errors & Simulation
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const selectedDistrict = districtsData.find((d) => d.id === selectedDistrictId) || districtsData[0];
  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const discount = getDiscount();
  const vatAmount = getVatAmount();
  const total = getTotal();

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const success = applyPromoCode(promoInput);
    if (success) {
      setPromoMessage({ type: 'success', text: t.checkout.promoApplied });
      setPromoInput('');
    } else {
      setPromoMessage({ type: 'error', text: t.checkout.promoInvalid });
    }
  };

  const handleUseLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setStreet(lang === 'ar' ? 'موقعي الحالي (تم تحديده عبر GPS)' : 'Current Location (GPS Verified)');
          setLandmark(lang === 'ar' ? `إحداثيات: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}` : `Coords: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
        },
        () => {
          alert(lang === 'ar' ? 'تعذر الوصول للموقع. يرجى إدخال العنوان يدوياً.' : 'Location access denied. Please enter address manually.');
        }
      );
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!customerName.trim()) {
      errs.name = lang === 'ar' ? 'يرجى إدخال الاسم الكريم' : 'Please enter your full name';
    }

    // Saudi phone validation (+966 5X XXX XXXX or 05XXXXXXXX)
    const phoneClean = phone.replace(/[\s-]/g, '');
    const saudiPhoneRegex = /^(05|5|\+9665)[0-9]{8}$/;
    if (!saudiPhoneRegex.test(phoneClean)) {
      errs.phone = lang === 'ar' ? 'يرجى إدخال رقم جوال سعودي صالح (مثال: 0512345678)' : 'Please enter a valid Saudi mobile number (e.g. 0512345678)';
    }

    if (fulfillmentType === 'delivery') {
      if (!street.trim()) {
        errs.street = lang === 'ar' ? 'يرجى إدخال اسم الشارع' : 'Please enter street name';
      }
    }

    if (fulfillmentType === 'curbside') {
      if (!carMake.trim()) {
        errs.carMake = lang === 'ar' ? 'يرجى إدخال نوع وموديل السيارة' : 'Please enter vehicle make';
      }
      if (!carColor.trim()) {
        errs.carColor = lang === 'ar' ? 'يرجى تحديد لون السيارة' : 'Please enter vehicle color';
      }
      if (!carPlate.trim()) {
        errs.carPlate = lang === 'ar' ? 'يرجى إدخال رقم اللوحة' : 'Please enter license plate';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      // Auto-scroll to first error
      window.scrollTo({ top: 200, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    setRedirecting(true);

    // Realistic simulation of payment gateway redirect (demo)
    setTimeout(() => {
      const orderId = `AIM-${Math.floor(1000 + Math.random() * 9000)}`;
      const orderData = {
        orderId,
        customerName,
        phone,
        fulfillmentType,
        selectedDistrict: selectedDistrict.nameAr,
        street,
        carMake,
        carColor,
        carPlate,
        items,
        total,
        createdAt: new Date().toISOString(),
      };

      // Save order to sessionStorage for tracking page
      sessionStorage.setItem('aim_last_order', JSON.stringify(orderData));
      clearCart();
      navigate(`/tracking?orderId=${orderId}`);
    }, 2000);
  };

  return (
    <div className="min-h-screen py-10 bg-canvas-base dark:bg-darkcanvas-base">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-espresso-900 dark:text-espresso-50">
              {t.checkout.title}
            </h1>
            <p className="text-xs sm:text-sm text-espresso-500 mt-1">
              {lang === 'ar' ? 'حدد تفاصيل طلبك وطريقة الاستلام المفضلة' : 'Select fulfillment and contact details'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/menu')}
            className="text-xs sm:text-sm text-brand-600 dark:text-brand-400 font-semibold hover:underline"
          >
            ← {lang === 'ar' ? 'العودة للقائمة' : 'Back to Menu'}
          </button>
        </div>

        {/* Concept Demo Notice Alert */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-800 dark:text-amber-300">
          <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>{lang === 'ar' ? 'تنبيه استعراضي للطلب:' : 'Demo Order Notice:'}</strong>{' '}
            {t.checkout.demoWarning}
          </p>
        </div>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Form (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Fulfillment Selection Tabs */}
            <div className="p-6 rounded-3xl bg-canvas-card dark:bg-darkcanvas-card border border-canvas-border dark:border-darkcanvas-border shadow-soft space-y-4">
              <label className="text-xs font-bold uppercase tracking-wider text-espresso-700 dark:text-espresso-300 block">
                {t.checkout.fulfillmentType}
              </label>

              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { type: 'curbside', label: t.checkout.curbside, icon: Car, badge: 'الأسرع' },
                  { type: 'pickup', label: t.checkout.pickup, icon: Store, badge: null },
                  { type: 'delivery', label: t.checkout.delivery, icon: Truck, badge: null },
                ].map((f) => {
                  const Icon = f.icon;
                  const isSelected = fulfillmentType === f.type;
                  return (
                    <button
                      key={f.type}
                      type="button"
                      onClick={() => setFulfillmentType(f.type as FulfillmentType)}
                      className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all ${
                        isSelected
                          ? 'border-brand-500 bg-brand-50 dark:bg-espresso-800 text-espresso-900 dark:text-espresso-50 shadow-sm'
                          : 'border-canvas-border dark:border-darkcanvas-border bg-canvas-card dark:bg-darkcanvas-card text-espresso-600 dark:text-espresso-400 hover:border-brand-300'
                      }`}
                    >
                      {f.badge && (
                        <span className="absolute -top-2 px-2 py-0.5 rounded-full bg-brand-500 text-espresso-950 text-[10px] font-black shadow-xs">
                          {f.badge}
                        </span>
                      )}
                      <Icon className={`w-5 h-5 mb-1.5 ${isSelected ? 'text-brand-500' : 'text-espresso-400'}`} />
                      <span className="text-xs font-bold">{f.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Branch Selector for Pickup / Curbside */}
              {fulfillmentType !== 'delivery' && (
                <div className="pt-3 border-t border-canvas-border/50 dark:border-darkcanvas-border/50 space-y-2">
                  <label className="text-xs font-semibold text-espresso-600 dark:text-espresso-400 block">
                    {lang === 'ar' ? 'فرع الاستلام:' : 'Pickup Location:'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {hoursData.branches.map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setSelectedBranchId(b.id)}
                        className={`p-3 rounded-xl border text-xs font-semibold text-start transition-all ${
                          selectedBranchId === b.id
                            ? 'border-brand-500 bg-brand-50 dark:bg-espresso-800 text-espresso-900 dark:text-espresso-50'
                            : 'border-canvas-border dark:border-darkcanvas-border text-espresso-600 dark:text-espresso-400'
                        }`}
                      >
                        <div className="font-bold">{lang === 'ar' ? b.nameAr : b.nameEn}</div>
                        <div className="text-[11px] text-espresso-500 truncate">{lang === 'ar' ? b.addressAr : b.addressEn}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Curbside Vehicle Details (If Curbside) */}
            {fulfillmentType === 'curbside' && (
              <div className="p-6 rounded-3xl bg-canvas-card dark:bg-darkcanvas-card border border-brand-500/40 shadow-soft space-y-4">
                <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400">
                  <Car className="w-5 h-5" />
                  <h3 className="font-display font-bold text-base text-espresso-900 dark:text-espresso-50">
                    {t.checkout.curbsideDetails}
                  </h3>
                </div>
                <p className="text-xs text-espresso-500 leading-relaxed">
                  {t.checkout.curbsideNotice}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-espresso-700 dark:text-espresso-300 block mb-1">
                      {t.checkout.carMake} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={carMake}
                      onChange={(e) => setCarMake(e.target.value)}
                      placeholder={t.checkout.carMakePlaceholder}
                      className="w-full p-3 rounded-xl bg-canvas-subtle dark:bg-darkcanvas-subtle border border-canvas-border dark:border-darkcanvas-border text-xs focus:ring-2 focus:ring-brand-500"
                    />
                    {errors.carMake && <p className="text-[11px] text-rose-500 mt-1">{errors.carMake}</p>}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-espresso-700 dark:text-espresso-300 block mb-1">
                      {t.checkout.carColor} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={carColor}
                      onChange={(e) => setCarColor(e.target.value)}
                      placeholder={t.checkout.carColorPlaceholder}
                      className="w-full p-3 rounded-xl bg-canvas-subtle dark:bg-darkcanvas-subtle border border-canvas-border dark:border-darkcanvas-border text-xs focus:ring-2 focus:ring-brand-500"
                    />
                    {errors.carColor && <p className="text-[11px] text-rose-500 mt-1">{errors.carColor}</p>}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-espresso-700 dark:text-espresso-300 block mb-1">
                      {t.checkout.carPlate} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={carPlate}
                      onChange={(e) => setCarPlate(e.target.value)}
                      placeholder={t.checkout.carPlatePlaceholder}
                      className="w-full p-3 rounded-xl bg-canvas-subtle dark:bg-darkcanvas-subtle border border-canvas-border dark:border-darkcanvas-border text-xs focus:ring-2 focus:ring-brand-500"
                    />
                    {errors.carPlate && <p className="text-[11px] text-rose-500 mt-1">{errors.carPlate}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* 3. Delivery Address (If Delivery) */}
            {fulfillmentType === 'delivery' && (
              <div className="p-6 rounded-3xl bg-canvas-card dark:bg-darkcanvas-card border border-canvas-border dark:border-darkcanvas-border shadow-soft space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-espresso-900 dark:text-espresso-100 font-bold text-base">
                    <MapPin className="w-5 h-5 text-brand-500" />
                    <span>{t.checkout.deliveryDetails}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleUseLocation}
                    className="text-xs text-brand-600 dark:text-brand-400 font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>{t.checkout.useLocation}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-espresso-700 dark:text-espresso-300 block mb-1">
                      {t.checkout.district}
                    </label>
                    <select
                      value={selectedDistrictId}
                      onChange={(e) => setSelectedDistrictId(e.target.value)}
                      className="w-full p-3 rounded-xl bg-canvas-subtle dark:bg-darkcanvas-subtle border border-canvas-border dark:border-darkcanvas-border text-xs focus:ring-2 focus:ring-brand-500"
                    >
                      {districtsData.map((d) => (
                        <option key={d.id} value={d.id}>
                          {lang === 'ar' ? d.nameAr : d.nameEn} ({d.fee} ر.س · {lang === 'ar' ? d.eta : d.etaEn})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-espresso-700 dark:text-espresso-300 block mb-1">
                      {t.checkout.street} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder={t.checkout.streetPlaceholder}
                      className="w-full p-3 rounded-xl bg-canvas-subtle dark:bg-darkcanvas-subtle border border-canvas-border dark:border-darkcanvas-border text-xs focus:ring-2 focus:ring-brand-500"
                    />
                    {errors.street && <p className="text-[11px] text-rose-500 mt-1">{errors.street}</p>}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-espresso-700 dark:text-espresso-300 block mb-1">
                      {t.checkout.building}
                    </label>
                    <input
                      type="text"
                      value={building}
                      onChange={(e) => setBuilding(e.target.value)}
                      placeholder="مثال: مبنى 14، شقة 3"
                      className="w-full p-3 rounded-xl bg-canvas-subtle dark:bg-darkcanvas-subtle border border-canvas-border dark:border-darkcanvas-border text-xs focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-espresso-700 dark:text-espresso-300 block mb-1">
                      {t.checkout.nationalAddress}
                    </label>
                    <input
                      type="text"
                      value={nationalAddress}
                      onChange={(e) => setNationalAddress(e.target.value)}
                      placeholder="مثال: RDRY1234"
                      className="w-full p-3 rounded-xl bg-canvas-subtle dark:bg-darkcanvas-subtle border border-canvas-border dark:border-darkcanvas-border text-xs focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 4. Customer Contact Details */}
            <div className="p-6 rounded-3xl bg-canvas-card dark:bg-darkcanvas-card border border-canvas-border dark:border-darkcanvas-border shadow-soft space-y-4">
              <h3 className="font-display font-bold text-base text-espresso-900 dark:text-espresso-50 flex items-center gap-2">
                <User className="w-5 h-5 text-brand-500" />
                <span>{t.checkout.contactDetails}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-espresso-700 dark:text-espresso-300 block mb-1">
                    {t.checkout.fullName} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="محمد السعد"
                    className="w-full p-3 rounded-xl bg-canvas-subtle dark:bg-darkcanvas-subtle border border-canvas-border dark:border-darkcanvas-border text-xs focus:ring-2 focus:ring-brand-500"
                  />
                  {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="text-xs font-semibold text-espresso-700 dark:text-espresso-300 block mb-1">
                    {t.checkout.phone} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="05XXXXXXXX"
                    className="w-full p-3 rounded-xl bg-canvas-subtle dark:bg-darkcanvas-subtle border border-canvas-border dark:border-darkcanvas-border text-xs focus:ring-2 focus:ring-brand-500 text-left ltr tabular-nums"
                  />
                  {errors.phone && <p className="text-[11px] text-rose-500 mt-1">{errors.phone}</p>}
                </div>
              </div>
            </div>

            {/* 5. Demo Payment Method (Display Only - No Card Numbers / CVV!) */}
            <div className="p-6 rounded-3xl bg-canvas-card dark:bg-darkcanvas-card border border-canvas-border dark:border-darkcanvas-border shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-base text-espresso-900 dark:text-espresso-50 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-brand-500" />
                  <span>{t.checkout.paymentMethod}</span>
                </h3>
                <span className="text-[11px] font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-espresso-800 px-2.5 py-1 rounded-full">
                  محاكاة تجريبية آمنة
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'mada', label: 'مدى (mada)', badge: 'شائع' },
                  { id: 'apple_pay', label: 'Apple Pay', badge: 'سريع' },
                  { id: 'stc_pay', label: 'STC Pay', badge: null },
                  { id: 'card', label: 'Visa / MC', badge: null },
                  { id: 'tamara', label: 'تمارا (قسّم 4)', badge: null },
                  { id: 'tabby', label: 'تابي (قسّم 4)', badge: null },
                  { id: 'cash', label: 'عند الاستلام', badge: null },
                ].map((pm) => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id as any)}
                    className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                      paymentMethod === pm.id
                        ? 'border-brand-500 bg-brand-50 dark:bg-espresso-800 text-espresso-900 dark:text-espresso-50 shadow-xs'
                        : 'border-canvas-border dark:border-darkcanvas-border text-espresso-600 dark:text-espresso-400 hover:border-brand-300'
                    }`}
                  >
                    <div>{pm.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Order Summary (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-canvas-card dark:bg-darkcanvas-card border border-canvas-border dark:border-darkcanvas-border shadow-soft space-y-5 sticky top-24">
              <h3 className="font-display font-bold text-lg text-espresso-900 dark:text-espresso-50 pb-3 border-b border-canvas-border dark:border-darkcanvas-border">
                {lang === 'ar' ? 'ملخص الطلب' : 'Order Summary'} ({items.length})
              </h3>

              {/* Items List */}
              <div className="max-h-56 overflow-y-auto divide-y divide-canvas-border/40 dark:divide-darkcanvas-border/40 space-y-2 pr-1">
                {items.map((item) => (
                  <div key={item.id} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-brand-600 dark:text-brand-400 tabular-nums">
                        {item.quantity}×
                      </span>
                      <span className="font-medium text-espresso-800 dark:text-espresso-200">
                        {lang === 'ar' ? item.nameAr : item.nameEn}
                      </span>
                    </div>
                    <span className="font-bold tabular-nums text-espresso-900 dark:text-espresso-100">
                      {(item.unitPrice * item.quantity).toFixed(2)} {t.menu.sar}
                    </span>
                  </div>
                ))}
              </div>

              {/* Promo Code Input */}
              <div className="pt-3 border-t border-canvas-border/50 dark:border-darkcanvas-border/50">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-espresso-400 absolute start-3 top-3" />
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder={t.checkout.promoPlaceholder}
                      className="w-full ps-9 pe-3 py-2.5 rounded-xl bg-canvas-subtle dark:bg-darkcanvas-subtle border border-canvas-border dark:border-darkcanvas-border text-xs uppercase font-medium focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="px-4 py-2.5 rounded-xl bg-espresso-900 dark:bg-brand-500 text-white dark:text-espresso-950 text-xs font-bold shrink-0 hover:opacity-90"
                  >
                    {t.checkout.applyPromo}
                  </button>
                </div>
                {promoMessage && (
                  <p
                    className={`text-[11px] font-semibold mt-1.5 ${
                      promoMessage.type === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'
                    }`}
                  >
                    {promoMessage.text}
                  </p>
                )}
              </div>

              {/* Calculation Breakdown */}
              <div className="pt-3 border-t border-canvas-border/50 dark:border-darkcanvas-border/50 space-y-2 text-xs text-espresso-600 dark:text-espresso-300 tabular-nums">
                <div className="flex justify-between">
                  <span>{t.cart.subtotal}</span>
                  <span className="font-semibold text-espresso-900 dark:text-espresso-100">
                    {subtotal.toFixed(2)} {t.menu.sar}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>{t.cart.discount} (15%)</span>
                    <span>-{discount.toFixed(2)} {t.menu.sar}</span>
                  </div>
                )}

                {fulfillmentType === 'delivery' && (
                  <div className="flex justify-between">
                    <span>{t.cart.deliveryFee}</span>
                    <span>{deliveryFee.toFixed(2)} {t.menu.sar}</span>
                  </div>
                )}

                <div className="flex justify-between text-espresso-400 text-[11px]">
                  <span>{t.cart.vatNotice}</span>
                  <span>({vatAmount.toFixed(2)} {t.menu.sar})</span>
                </div>

                <div className="flex justify-between items-baseline pt-3 border-t border-canvas-border dark:border-darkcanvas-border text-base font-bold text-espresso-900 dark:text-espresso-50">
                  <span>{t.cart.total}</span>
                  <div className="flex items-center gap-1 text-2xl font-black">
                    <span>{total.toFixed(2)}</span>
                    <SaudiRiyalSymbol className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                  </div>
                </div>
              </div>

              {/* Submit Order Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-2xl bg-espresso-900 hover:bg-espresso-800 dark:bg-brand-500 dark:hover:bg-brand-600 text-white dark:text-espresso-950 font-display font-bold text-base shadow-glow flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{t.checkout.redirectingTitle}</span>
                  </>
                ) : (
                  <>
                    <span>{t.checkout.placeOrder}</span>
                    {lang === 'ar' ? (
                      <ArrowLeft className="w-4 h-4 icon-flip" />
                    ) : (
                      <ArrowRight className="w-4 h-4" />
                    )}
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-espresso-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>دفع تجريبي آمن ومشفر بنسبة 100%</span>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Redirecting Modal Simulation */}
      {redirecting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso-950/80 backdrop-blur-md">
          <div className="p-8 rounded-3xl bg-canvas-card dark:bg-darkcanvas-card shadow-2xl border border-canvas-border dark:border-darkcanvas-border text-center space-y-4 max-w-sm">
            <div className="w-16 h-16 rounded-full bg-brand-50 dark:bg-espresso-800 text-brand-500 flex items-center justify-center mx-auto">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <h3 className="font-display font-bold text-lg text-espresso-900 dark:text-espresso-50">
              {t.checkout.redirectingTitle}
            </h3>
            <p className="text-xs text-espresso-500 leading-relaxed">
              {t.checkout.redirectingSub}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
