import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  Car,
  Coffee,
  Check,
  MessageSquare,
  RefreshCw,
  Zap,
  MapPin,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SaudiRiyalSymbol } from '../common/SaudiRiyalSymbol';

interface Props {
  lang: 'ar' | 'en';
  t: any;
}

export const TrackingPage: React.FC<Props> = ({ lang, t }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('orderId') || 'AIM-4821';

  // Read order data from session storage
  const [orderData, setOrderData] = useState<any>(null);
  const [currentStage, setCurrentStage] = useState<number>(2); // 1 = Received, 2 = Brewing, 3 = Ready, 4 = Delivered
  const [timeRemaining, setTimeRemaining] = useState<number>(12); // minutes
  const [arrivedNotified, setArrivedNotified] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('aim_last_order');
      if (saved) {
        setOrderData(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('No saved session order');
    }

    // Celebration confetti on mount
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#C98A4B', '#141416', '#FAF7F2'],
      });
    } catch (e) {}
  }, []);

  // Timer countdown simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setCurrentStage(4);
          return 0;
        }
        if (prev <= 6 && currentStage < 3) {
          setCurrentStage(3);
        }
        return prev - 1;
      });
    }, 4000 / speedMultiplier);

    return () => clearInterval(timer);
  }, [speedMultiplier, currentStage]);

  const handleArrived = () => {
    setArrivedNotified(true);
    try {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.7 },
        colors: ['#16A34A', '#C98A4B'],
      });
    } catch (e) {}
  };

  const stages = [
    { num: 1, label: t.tracking.stage1, descAr: 'تم استلام طلبك وتأكيد التخصيص', descEn: 'Order confirmed by barista' },
    { num: 2, label: t.tracking.stage2, descAr: 'طحن البن واستخلاص الإسبريسو الطازج', descEn: 'Grinding beans & manual extraction' },
    { num: 3, label: t.tracking.stage3, descAr: 'الطلب في انتظارك للاستلام السريع', descEn: 'Packed & ready at the counter' },
    { num: 4, label: t.tracking.stage4, descAr: 'بالعافية عليك! نتمنى لك يوماً رائعاً', descEn: 'Enjoy your coffee! Have a great day' },
  ];

  const isCurbside = orderData?.fulfillmentType === 'curbside';

  // WhatsApp order link
  const waText = encodeURIComponent(
    lang === 'ar'
      ? `مرحباً أيم كوفي بار، أتابع طلبي رقم #${orderId}.`
      : `Hello Aim Coffee Bar, checking on order #${orderId}.`
  );

  return (
    <div className="min-h-screen py-12 bg-canvas-base dark:bg-darkcanvas-base">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header Badge */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/15 text-brand-600 dark:text-brand-400 border border-brand-500/30 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.tracking.title}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-espresso-900 dark:text-espresso-50">
            #{orderId}
          </h1>

          <p className="text-xs sm:text-sm text-espresso-500">
            {lang === 'ar'
              ? 'نشكرك لاختيارك أيم كوفي بار. يتم تحضير مشروبك بشغف ودقة.'
              : 'Thank you for choosing Aim Coffee Bar. Your cup is being calibrated with care.'}
          </p>
        </div>

        {/* Live Timer Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-canvas-card dark:bg-darkcanvas-card border border-canvas-border dark:border-darkcanvas-border shadow-soft text-center space-y-4 relative overflow-hidden">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-50 dark:bg-espresso-800 text-brand-600 dark:text-brand-400 mx-auto shadow-sm">
            <Coffee className="w-8 h-8 animate-pulse" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-espresso-500 block">
              {t.tracking.estTime}
            </span>
            <div className="text-4xl sm:text-5xl font-display font-black text-espresso-900 dark:text-espresso-50 tabular-nums">
              {timeRemaining > 0 ? (
                <>
                  {timeRemaining} <span className="text-xl font-normal text-espresso-500">{t.tracking.mins}</span>
                </>
              ) : (
                <span className="text-emerald-600 dark:text-emerald-400 text-2xl font-bold">
                  {lang === 'ar' ? 'جاهز تماماً للاستلام!' : 'Ready for pickup!'}
                </span>
              )}
            </div>
          </div>

          {/* Curbside "I've arrived" Prompt */}
          {isCurbside && (
            <div className="pt-4 border-t border-canvas-border/50 dark:border-darkcanvas-border/50 space-y-3">
              {!arrivedNotified ? (
                <div className="space-y-2">
                  <p className="text-xs text-espresso-600 dark:text-espresso-300 font-medium">
                    {t.tracking.curbsidePrompt}
                  </p>
                  <button
                    type="button"
                    onClick={handleArrived}
                    className="w-full py-4 px-6 rounded-2xl bg-brand-500 hover:bg-brand-600 text-espresso-950 font-display font-bold text-sm shadow-glow transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Car className="w-5 h-5" />
                    <span>{t.tracking.arrivedBtn}</span>
                  </button>
                  <p className="text-[11px] text-espresso-400">
                    سيارتك: {orderData.carMake} · {orderData.carColor} · لوحة {orderData.carPlate}
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>{t.tracking.arrivedAlert}</span>
                </div>
              )}
            </div>
          )}

          {/* Demo Speedup Control */}
          <div className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={() => setSpeedMultiplier(speedMultiplier === 1 ? 4 : 1)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-canvas-subtle dark:bg-espresso-800 text-espresso-500 text-[11px] hover:text-espresso-800 transition-colors"
            >
              <Zap className="w-3 h-3 text-amber-500" />
              <span>{t.tracking.speedUp} ({speedMultiplier}x)</span>
            </button>
          </div>
        </div>

        {/* 4-Stage Progression */}
        <div className="p-6 sm:p-8 rounded-3xl bg-canvas-card dark:bg-darkcanvas-card border border-canvas-border dark:border-darkcanvas-border shadow-soft space-y-6">
          <h3 className="font-display font-bold text-base text-espresso-900 dark:text-espresso-50">
            {lang === 'ar' ? 'مراحل الطلب' : 'Order Timeline'}
          </h3>

          <div className="space-y-6 relative before:absolute before:top-3 before:bottom-3 before:start-4 before:w-0.5 before:bg-canvas-border dark:before:bg-darkcanvas-border">
            {stages.map((st) => {
              const isDone = currentStage > st.num;
              const isCurrent = currentStage === st.num;

              return (
                <div key={st.num} className="relative flex items-start gap-4 ps-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors z-10 ${
                      isDone
                        ? 'bg-emerald-500 text-white'
                        : isCurrent
                        ? 'bg-brand-500 text-espresso-950 ring-4 ring-brand-500/20'
                        : 'bg-canvas-border dark:bg-espresso-800 text-espresso-400'
                    }`}
                  >
                    {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : st.num}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-bold ${
                        isCurrent
                          ? 'text-brand-600 dark:text-brand-400'
                          : isDone
                          ? 'text-espresso-900 dark:text-espresso-100'
                          : 'text-espresso-400'
                      }`}
                    >
                      {st.label}
                    </p>
                    <p className="text-xs text-espresso-500 dark:text-espresso-400 mt-0.5">
                      {lang === 'ar' ? st.descAr : st.descEn}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href={`https://wa.me/966500000000?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-transform active:scale-95"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{t.tracking.whatsappBtn}</span>
          </a>

          <button
            type="button"
            onClick={() => navigate('/menu')}
            className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-espresso-900 hover:bg-espresso-800 dark:bg-brand-500 dark:hover:bg-brand-600 text-white dark:text-espresso-950 font-bold text-xs sm:text-sm shadow-sm transition-transform active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{t.tracking.reorder}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
