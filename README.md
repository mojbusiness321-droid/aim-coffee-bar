# أيم كوفي بار | Aim Coffee Bar — Riyadh (Concept Build)

> **تصميم وتطوير:** محمد أبو العسل (Mohammed Abu Al Asal)  
> **رابط الموقع الحي (Live Website):** [https://mojbusiness321-droid.github.io/aim-coffee-bar/](https://mojbusiness321-droid.github.io/aim-coffee-bar/)  
> **مستودع الأكواد (GitHub Repository):** [https://github.com/mojbusiness321-droid/aim-coffee-bar](https://github.com/mojbusiness321-droid/aim-coffee-bar)  
> **حالة المشروع:** نموذج استعراضي تفاعلي متكامل (Production-Ready Concept Piece)  
> **المدينة والحي:** الرياض، حي الملقا (الرئيسي) وحي النرجس  

---

## 🌟 نظرة عامة على المشروع (Arabic Overview)

هذا المشروع هو موقع ويب متكامل وتفاعلي فائق الواقعية صُمم خصيصاً لمقهى **"أيم كوفي بار" (Aim Coffee Bar)** — أحد أبرز مقاهي القهوة المختصة في شمال مدينة الرياض (حي الملقا وحي النرجس) والذي لا يمتلك موقعاً إلكترونياً رسمياً حالياً.

تم بناء هذا الموقع كنموذج استعراضي قابل للإطلاق المباشر ليقدم تجربة تفوق معظم مواقع المقاهي في السوق السعودي من حيث:
1. **خدمة الاستلام من السيارة (Curbside Car Pickup):** إمكانية إدخال بيانات السيارة (النوع، اللون، اللوحة) وزر "أنا عند الباب" لإشعار الباريستا فور الوصول.
2. **ساعات العمل المباشرة بتوقيت الرياض:** حساب فوري لحالة المقهى الحالية ("مفتوح الآن · يغلق 12:00 ص" أو "مفتوح الآن · يغلق 1:00 ص") وفق توقيت الرياض `Asia/Riyadh`.
3. **قائمة الأسعار الحقيقية وحساب السعرات:** منيو كامل بأصناف وأسعار حقيقية مدعومة بالسعرات الحرارية ومسببات الحساسية المعتمدة من هيئة الغذاء والدواء (SFDA).
4. **دعم ثنائي اللغة (عربي / إنجليزي) وتوافق كامل مع الاتجاه من اليمين لليسار (RTL):** خطوط عربية حديثة (`Alexandria` و`IBM Plex Sans Arabic`) وتبديل فوري للغة وللاتجاه.
5. **الوضع الداكن (Dark Mode):** متوافق مع تفضيلات النظام مع إمكانية التبديل اليدوي السلس.
6. **سلة مشتريات تفاعلية ومحاكاة دفع آمنة:** بدون أي حقول لبطاقات ائتمانية حقيقية، مع حساب ضريبة القيمة المضافة 15% ورمز الريال السعودي الجديد.
7. **نظام حجز الطاولات المسبق:** حجز مناطق العمل الهادئة أو التراس الخارجي.

---

## 🇬🇧 English Overview

A production-grade, hyper-realistic specialty café web application built for **Aim Coffee Bar** in Riyadh (Al Malqa & Al Narjis). The platform provides an exceptional digital ordering experience, featuring:
- **Curbside Vehicle Pickup:** Enter car make, color, and plate number, with an interactive "I Have Arrived" trigger alerting baristas outside the cafe.
- **Live Operating Status:** Calculates real-time opening status based on Riyadh local time (`Asia/Riyadh`), including midnight and extended 1:00 AM weekend closing hours.
- **SFDA Nutrition & Customization:** Calorie counts, allergen tags, and deep customization (milk alternatives, origin beans, sweetness, and temperature).
- **Smooth Motion & Micro-interactions:** Smooth scrolling powered by Lenis and GSAP animations, strictly respecting `prefers-reduced-motion`.
- **Full RTL & Bilingual Support:** Native Saudi Arabic and English with seamless document language/direction flipping.

---

## 🛠️ التقنيات المستخدمة (Tech Stack)

- **Framework:** Vite 5 + React 18 + TypeScript
- **Styling:** Tailwind CSS + Vanilla CSS Tokens + CSS Logical Properties (RTL)
- **State Management:** Zustand (with localStorage persistence & error handling)
- **Routing:** React Router DOM (HashRouter for 100% reliable GitHub Pages support)
- **Motion & Smooth Scroll:** GSAP + Lenis
- **Image Pipeline:** Sharp (automated conversion to WebP & AVIF at 480w, 960w, 1600w with blur placeholders)
- **Icons:** Lucide React + Accessible Custom Saudi Riyal SVG Symbol
- **PWA:** PWA Web App Manifest + standalone display mode

---

## 🚀 التشغيل المحلي (How to Run Locally)

```bash
# 1. استنساخ المشروع / الانتقال لمجلد العمل
cd riyadh-cafe

# 2. تثبيت الحزم البرمجية
npm install

# 3. تشغيل الخادم المحلي للتطوير
npm run dev
```
افتح المتصفح على: `http://localhost:5173`

---

## 📸 خط معالجة وتحديث الصور (Image Pipeline)

تمت أتمتة معالجة الصور عبر سكريبتين في مجلد `scripts/`:

1. **إضافة صور المقهى الحقيقية:**  
   قم بإسقاط أي صور رسمية من المقهى في مجلد `assets/originals/cafe/` بنفس مفتاح العنصر (مثال: `item-v60-hot.jpg`). سيعطيها النظام **أولوية 100%** على أي صور أخرى.
2. **جلب الصور ومعالجتها:**  
   ```bash
   npm run fetch-images
   npm run process-images
   ```
   سيقوم السكريبت بقص الصور بالنسبة المطلوبة وإنتاج صيغ WebP وAVIF بثلاثة أحجام (480px, 960px, 1600px) وحفظ سجل المصورين في `public/images/credits.json`.

---

## 📝 تعديل وتحديث قائمة الطعام (Menu Customization)

توجد جميع أصناف المنيو في ملف JSON منفصل ومنظم:  
[`src/data/menu.json`](file:///src/data/menu.json)

يمكنك إضافة أو تعديل أي صنف، تحديد سعره، سعراته الحرارية، مسببات الحساسية، وخيارات الحجم ونوع الحليب والمحصول بسهولة تامة.

---

## ⚖️ الشفافية والمسؤولية الأخلاقية (Transparency & Ethics)

- يحتوي الموقع على شريط علوي بارز وإشعار في التذييل يوضح أن هذا الموقع هو **نموذج تصميم استعراضي (Concept Pitch)**، ولا يتم قبول أي طلبات تجارية أو مدفوعات مالية فعلية من خلاله.
- تم توثيق حقوق جميع المصورين والمصادر في صفحة خاصة ومتاحة من أسفل الموقع [`/credits`](file:///#/credits).
- تم تفعيل وسم `noindex, nofollow` في محركات البحث لحين اعتماد الموقع رسمياً من أصحاب المقهى.

---

## 👨‍💻 المطور والمصمم (Author & Credits)

**محمد أبو العسل (Mohammed Abu Al Asal)**  
Senior Web Designer & Front-End Developer  
Riyadh, Saudi Arabia  
© 2026 Aim Coffee Bar Concept Build
