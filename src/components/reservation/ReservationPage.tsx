import React, { useState } from 'react';
import { Calendar, Users, Clock, MapPin, CheckCircle2, Sparkles, Coffee } from 'lucide-react';
import confetti from 'canvas-confetti';
import hoursData from '../../data/hours.json';

interface Props {
  lang: 'ar' | 'en';
  t: any;
}

export const ReservationPage: React.FC<Props> = ({ lang, t }) => {
  const [selectedBranch, setSelectedBranch] = useState('al-malqa');
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('18:00');
  const [guests, setGuests] = useState(2);
  const [seatingArea, setSeatingArea] = useState('quiet');
  const [occasion, setOccasion] = useState('none');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [resId, setResId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedId = `AIM-RES-${Math.floor(1000 + Math.random() * 9000)}`;
    setResId(generatedId);
    setConfirmed(true);

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#C98A4B', '#141416', '#FAF7F2'],
      });
    } catch (err) {}
  };

  const branch = hoursData.branches.find((b) => b.id === selectedBranch) || hoursData.branches[0];

  return (
    <div className="min-h-screen py-12 bg-canvas-base dark:bg-darkcanvas-base">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brand-100 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.reservation.title}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-espresso-900 dark:text-espresso-50">
            {t.reservation.subtitle}
          </h1>
          <p className="text-xs sm:text-sm text-espresso-500">
            {lang === 'ar'
              ? 'احجز مقعدك المفضل مسبقاً لجلسات العمل، الاجتماعات، أو الاستمتاع بقهوتك.'
              : 'Reserve your desired table in advance for work, study, or coffee catchups.'}
          </p>
        </div>

        {/* Confirmation State */}
        {confirmed ? (
          <div className="p-8 rounded-3xl bg-canvas-card dark:bg-darkcanvas-card border border-canvas-border dark:border-darkcanvas-border shadow-float text-center space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-display font-bold text-espresso-900 dark:text-espresso-50">
                {t.reservation.successTitle}
              </h2>
              <p className="text-sm text-espresso-600 dark:text-espresso-300 max-w-md mx-auto">
                {t.reservation.successSub}
              </p>
              <div className="inline-block px-4 py-1.5 rounded-full bg-brand-50 dark:bg-espresso-800 text-brand-600 dark:text-brand-400 font-bold text-xs tracking-wider">
                {lang === 'ar' ? 'رقم الحجز:' : 'Booking Reference:'} #{resId}
              </div>
            </div>

            {/* Summary Details */}
            <div className="p-4 rounded-2xl bg-canvas-subtle dark:bg-darkcanvas-subtle border border-canvas-border dark:border-darkcanvas-border text-xs text-start space-y-2 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-espresso-500">{t.reservation.branch}:</span>
                <span className="font-bold text-espresso-900 dark:text-espresso-100">{lang === 'ar' ? branch.nameAr : branch.nameEn}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-espresso-500">{t.reservation.date} & {t.reservation.time}:</span>
                <span className="font-bold tabular-nums text-espresso-900 dark:text-espresso-100">{date} · {time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-espresso-500">{t.reservation.guests}:</span>
                <span className="font-bold tabular-nums text-espresso-900 dark:text-espresso-100">{guests} {lang === 'ar' ? 'أشخاص' : 'guests'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-espresso-500">{t.reservation.area}:</span>
                <span className="font-bold text-brand-600 dark:text-brand-400">
                  {seatingArea === 'quiet' ? t.reservation.areaQuiet : seatingArea === 'outdoor' ? t.reservation.areaOutdoor : t.reservation.areaIndoor}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setConfirmed(false)}
              className="px-6 py-3 rounded-full bg-espresso-900 dark:bg-brand-500 text-white dark:text-espresso-950 text-xs font-bold shadow-sm"
            >
              {t.reservation.newBooking}
            </button>
          </div>
        ) : (
          /* Booking Form */
          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-8 rounded-3xl bg-canvas-card dark:bg-darkcanvas-card border border-canvas-border dark:border-darkcanvas-border shadow-soft space-y-6"
          >
            {/* Branch Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-espresso-700 dark:text-espresso-300 block">
                {t.reservation.branch}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {hoursData.branches.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelectedBranch(b.id)}
                    className={`p-3 rounded-2xl border text-xs font-bold text-start transition-all ${
                      selectedBranch === b.id
                        ? 'border-brand-500 bg-brand-50 dark:bg-espresso-800 text-espresso-900 dark:text-espresso-50 shadow-sm'
                        : 'border-canvas-border dark:border-darkcanvas-border text-espresso-600 dark:text-espresso-400'
                    }`}
                  >
                    <div>{lang === 'ar' ? b.nameAr : b.nameEn}</div>
                    <div className="text-[11px] font-normal text-espresso-500 truncate">{lang === 'ar' ? b.addressAr : b.addressEn}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Date, Time & Guests Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-espresso-700 dark:text-espresso-300 block mb-1">
                  {t.reservation.date}
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-espresso-400 absolute start-3 top-3 pointer-events-none" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full ps-9 pe-3 py-2.5 rounded-xl bg-canvas-subtle dark:bg-darkcanvas-subtle border border-canvas-border dark:border-darkcanvas-border text-xs font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-espresso-700 dark:text-espresso-300 block mb-1">
                  {t.reservation.time}
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-espresso-400 absolute start-3 top-3 pointer-events-none" />
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full ps-9 pe-3 py-2.5 rounded-xl bg-canvas-subtle dark:bg-darkcanvas-subtle border border-canvas-border dark:border-darkcanvas-border text-xs font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-espresso-700 dark:text-espresso-300 block mb-1">
                  {t.reservation.guests}
                </label>
                <div className="relative">
                  <Users className="w-4 h-4 text-espresso-400 absolute start-3 top-3 pointer-events-none" />
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full ps-9 pe-3 py-2.5 rounded-xl bg-canvas-subtle dark:bg-darkcanvas-subtle border border-canvas-border dark:border-darkcanvas-border text-xs font-medium"
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? (lang === 'ar' ? 'شخص واحد' : 'Guest') : lang === 'ar' ? 'أشخاص' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Seating Area Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-espresso-700 dark:text-espresso-300 block">
                {t.reservation.area}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: 'quiet', label: t.reservation.areaQuiet, icon: Coffee },
                  { id: 'outdoor', label: t.reservation.areaOutdoor, icon: Sparkles },
                  { id: 'indoor', label: t.reservation.areaIndoor, icon: MapPin },
                ].map((ar) => (
                  <button
                    key={ar.id}
                    type="button"
                    onClick={() => setSeatingArea(ar.id)}
                    className={`p-3 rounded-2xl border text-xs font-semibold text-center transition-all ${
                      seatingArea === ar.id
                        ? 'border-brand-500 bg-brand-50 dark:bg-espresso-800 text-espresso-900 dark:text-espresso-50 shadow-xs'
                        : 'border-canvas-border dark:border-darkcanvas-border text-espresso-600 dark:text-espresso-400'
                    }`}
                  >
                    {ar.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-xs font-semibold text-espresso-700 dark:text-espresso-300 block mb-1">
                  {t.checkout.fullName} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="محمد السعد"
                  className="w-full p-3 rounded-xl bg-canvas-subtle dark:bg-darkcanvas-subtle border border-canvas-border dark:border-darkcanvas-border text-xs font-medium"
                  required
                />
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
                  className="w-full p-3 rounded-xl bg-canvas-subtle dark:bg-darkcanvas-subtle border border-canvas-border dark:border-darkcanvas-border text-xs font-medium text-left ltr"
                  required
                />
              </div>
            </div>

            {/* Special Request Notes */}
            <div>
              <label className="text-xs font-semibold text-espresso-700 dark:text-espresso-300 block mb-1">
                {t.reservation.notes}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder={t.reservation.notesPlaceholder}
                className="w-full p-3 rounded-xl bg-canvas-subtle dark:bg-darkcanvas-subtle border border-canvas-border dark:border-darkcanvas-border text-xs"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-espresso-900 hover:bg-espresso-800 dark:bg-brand-500 dark:hover:bg-brand-600 text-white dark:text-espresso-950 font-display font-bold text-sm shadow-md transition-all active:scale-[0.98]"
            >
              {t.reservation.submit}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
