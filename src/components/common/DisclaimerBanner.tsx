import React from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  lang: 'ar' | 'en';
}

export const DisclaimerBanner: React.FC<Props> = ({ lang }) => {
  return (
    <div
      role="region"
      aria-label="Design Concept Disclaimer"
      className="bg-amber-950/90 text-amber-200 border-b border-amber-800/60 px-4 py-2 text-xs text-center relative z-50 backdrop-blur-sm"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
        <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" aria-hidden="true" />
        <p className="leading-tight font-medium">
          {lang === 'ar' ? (
            <>
              <strong>تنبيه تجريبي:</strong> هذا تصميم استعراضي (Concept Pitch) وليس الموقع الرسمي لـ أيم كوفي بار. القائمة والأسعار استرشادية؛ لا يتم قبول طلبات أو مدفوعات حقيقية.
            </>
          ) : (
            <>
              <strong>Concept Notice:</strong> Portfolio design concept, not the official website of Aim Coffee Bar. Menu & prices are illustrative; no actual payments or orders are accepted.
            </>
          )}
        </p>
      </div>
    </div>
  );
};
