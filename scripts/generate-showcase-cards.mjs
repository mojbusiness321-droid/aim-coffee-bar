import path from 'node:path';
import fs from 'node:fs';
import sharp from 'sharp';

const ROOT_DIR = process.cwd();
const SHOWCASE_DIR = path.join(ROOT_DIR, 'showcase');
const SCREENSHOTS_DIR = path.join(ROOT_DIR, 'showcase', 'raw');

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const igPosts = [
  {
    source: '01-mobile-hero.png',
    output: 'instagram-01-hero.png',
    badge: 'RIYADH SPECIALTY COFFEE · أيم كوفي بار',
    title: 'تجربة رقمية استثنائية لقهوة الرياض',
    sub: 'هوية بصرية دافئة ومحتوى ثنائي اللغة مع ساعات عمل حية',
  },
  {
    source: '03-mobile-menu.png',
    output: 'instagram-02-menu.png',
    badge: 'SFDA NUTRITION AND CALORIES · القائمة الذكية',
    title: 'قائمة طازجة بأسعار حقيقية وسعرات معتمدة',
    sub: 'تصنيفات تفاعلية وفلاتر سريعة لمشروبات الإسبريسو والتقطير',
  },
  {
    source: '04-mobile-item-modal.png',
    output: 'instagram-03-customize.png',
    badge: 'PRECISION BREWING · خيارات التخصيص',
    title: 'تخصيص كامل للمحاصيل، الحليب، والحلاوة',
    sub: 'اقتراحات ذكية لتنسيق الحلا مع القهوة لرفع متوسط قيمة السلة',
  },
  {
    source: '05-mobile-cart.png',
    output: 'instagram-04-cart.png',
    badge: 'SMART CART AND VAT · سلة مشتريات سلسة',
    title: 'سلة مشتريات تفاعلية مع حساب الضريبة والخصم',
    sub: 'حفظ تلقائي للمشتريات مع دعم كامل لأكواد الخصم الترويجية',
  },
  {
    source: '06-mobile-checkout.png',
    output: 'instagram-05-curbside.png',
    badge: 'CURBSIDE CAR PICKUP · خدمة السيارات',
    title: 'خدمة الاستلام من السيارة لأول مرة في الملقا',
    sub: 'تسجيل نوع السيارة ورقم اللوحة لاستلام فوري بدون نزول',
  },
  {
    source: '07-mobile-tracking.png',
    output: 'instagram-06-tracking.png',
    badge: 'LIVE STAGE PROGRESSION · تتبع حي',
    title: 'متابعة حية للطلب وزر "أنا عند الباب"',
    sub: 'إشعار فوري لطاقم الباريستا مع حساب دقيق لوقت الجاهزية',
  },
];

async function generate() {
  console.log('--- Generating 6 Instagram Posts (1080x1350) ---');

  for (const post of igPosts) {
    const srcPath = path.join(SCREENSHOTS_DIR, post.source);
    if (!fs.existsSync(srcPath)) {
      console.warn(`Source not found: ${srcPath}`);
      continue;
    }

    const screenWidth = 560;
    const screenHeight = 940;
    const screenBuffer = await sharp(srcPath)
      .resize(screenWidth, screenHeight, { fit: 'cover', position: 'top' })
      .toBuffer();

    const svgOverlay = `
      <svg width="1080" height="1350" viewBox="0 0 1080 1350" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#141416" />
            <stop offset="50%" stop-color="#1A191D" />
            <stop offset="100%" stop-color="#0E0E10" />
          </linearGradient>
          <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="25" stdDeviation="30" flood-color="#000000" flood-opacity="0.6"/>
          </filter>
        </defs>

        <!-- Background -->
        <rect width="1080" height="1350" fill="url(#bgGrad)" />

        <!-- Subtle Ambient Glow -->
        <circle cx="540" cy="200" r="350" fill="#C98A4B" opacity="0.08" filter="blur(60px)" />

        <!-- Header Category Badge -->
        <g transform="translate(540, 75)">
          <rect x="-190" y="0" width="380" height="32" rx="16" fill="#25242A" stroke="#C98A4B" stroke-width="1.2" />
          <text x="0" y="20" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="700" fill="#C98A4B" text-anchor="middle" letter-spacing="1">
            ${escapeXml(post.badge)}
          </text>
        </g>

        <!-- Title -->
        <text x="540" y="150" font-family="'Alexandria', system-ui, sans-serif" font-size="34" font-weight="800" fill="#FAF7F2" text-anchor="middle">
          ${escapeXml(post.title)}
        </text>

        <!-- Subtitle -->
        <text x="540" y="195" font-family="'Alexandria', system-ui, sans-serif" font-size="16" font-weight="400" fill="#A19D95" text-anchor="middle">
          ${escapeXml(post.sub)}
        </text>

        <!-- Phone Device Frame Outline -->
        <rect x="250" y="240" width="580" height="960" rx="46" fill="none" stroke="#333238" stroke-width="8" filter="url(#shadow)" />
        <rect x="254" y="244" width="572" height="952" rx="42" fill="none" stroke="#C98A4B" stroke-opacity="0.3" stroke-width="2" />

        <!-- Footer Portfolio Attribution -->
        <g transform="translate(540, 1270)">
          <text x="0" y="0" font-family="'Alexandria', system-ui, sans-serif" font-size="14" font-weight="600" fill="#88847C" text-anchor="middle">
            تصميم وتطوير: محمد أبو العسل · محفظة أعمال 2026
          </text>
          <text x="0" y="24" font-family="system-ui, sans-serif" font-size="12" font-weight="500" fill="#5E5B54" text-anchor="middle">
            github.com/mohammed-abu-al-asal · instagram.com/abu.al.asal
          </text>
        </g>
      </svg>
    `;

    await sharp(Buffer.from(svgOverlay))
      .composite([
        {
          input: screenBuffer,
          top: 250,
          left: 260,
        },
        {
          input: Buffer.from(svgOverlay),
          top: 0,
          left: 0,
        },
      ])
      .png({ quality: 95 })
      .toFile(path.join(SHOWCASE_DIR, post.output));

    console.log(`[GENERATED IG POST] ${post.output} (1080x1350)`);
  }

  console.log('--- All 6 Instagram Posts Generated Successfully ---');
}

generate().catch(console.error);
