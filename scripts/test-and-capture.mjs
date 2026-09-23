import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import sharp from 'sharp';

const ROOT_DIR = process.cwd();
const SHOWCASE_DIR = path.join(ROOT_DIR, 'showcase');
const SCREENSHOTS_DIR = path.join(ROOT_DIR, 'showcase', 'raw');

fs.mkdirSync(SHOWCASE_DIR, { recursive: true });
fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

async function waitPort(url, timeout = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status === 404 || res.status === 200) return true;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Timeout waiting for server at ${url}`);
}

async function main() {
  console.log('--- Starting Preview Server ---');
  const server = spawn('npm.cmd', ['run', 'preview', '--', '--port', '4173', '--host'], {
    cwd: ROOT_DIR,
    stdio: 'ignore',
    shell: true,
  });

  const baseUrl = 'http://localhost:4173';
  await waitPort(baseUrl);
  console.log(`Server ready at ${baseUrl}`);

  const browser = await chromium.launch({ headless: true });
  console.log('--- Chromium Launched ---');

  // 1. Mobile Scenario (390 x 844 - iPhone 14/15)
  console.log('--- Testing Mobile Viewport (390x844) ---');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1',
  });

  const page = await mobileContext.newPage();

  // Test 1: Home Page Hero
  await page.goto(`${baseUrl}/#/`);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '01-mobile-hero.png'), fullPage: false });
  console.log('[CAPTURED] 01-mobile-hero.png');

  // Test 2: Atmosphere & Location on Home
  await page.evaluate(() => window.scrollTo(0, 1400));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '02-mobile-atmosphere.png'), fullPage: false });
  console.log('[CAPTURED] 02-mobile-atmosphere.png');

  // Test 3: Menu Page
  await page.goto(`${baseUrl}/#/menu`);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '03-mobile-menu.png'), fullPage: false });
  console.log('[CAPTURED] 03-mobile-menu.png');

  // Test 4: Open Item Modal & Customize
  const firstCard = page.locator('article button').first();
  await firstCard.click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '04-mobile-item-modal.png'), fullPage: false });
  console.log('[CAPTURED] 04-mobile-item-modal.png');

  // Test 5: Add to Cart & Open Cart Drawer
  const addToCartBtn = page.locator('button:has-text("إضافة إلى السلة"), button:has-text("Add to Order")').first();
  await addToCartBtn.click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '05-mobile-cart.png'), fullPage: false });
  console.log('[CAPTURED] 05-mobile-cart.png');

  // Test 6: Navigate to Checkout from drawer button
  const checkoutBtn = page.locator('button:has-text("متابعة لإتمام الطلب")').first();
  if (await checkoutBtn.isVisible()) {
    await checkoutBtn.click();
  } else {
    await page.goto(`${baseUrl}/#/checkout`);
  }
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '06-mobile-checkout.png'), fullPage: false });
  console.log('[CAPTURED] 06-mobile-checkout.png');

  // Fill in sample curbside details
  await page.fill('input[placeholder*="تويوتا"]', 'لكزس ES 350');
  await page.fill('input[placeholder*="أبيض"]', 'أبيض لؤلؤي');
  await page.fill('input[placeholder*="أ ب ج"]', 'د ن هـ 9090');
  await page.fill('input[placeholder*="محمد"]', 'عبدالله التميمي');
  await page.fill('input[placeholder*="05"]', '0501234567');
  await page.waitForTimeout(500);

  // Submit order to test tracking page
  const placeOrderBtn = page.locator('button:has-text("تأكيد الطلب التجريبي")');
  await placeOrderBtn.click();
  console.log('Submitted order, waiting for tracking redirect...');
  await page.waitForURL(/.*#\/tracking.*/, { timeout: 10000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '07-mobile-tracking.png'), fullPage: false });
  console.log('[CAPTURED] 07-mobile-tracking.png');

  // Test "I Have Arrived" curbside button
  const arrivedBtn = page.locator('button:has-text("وصلت أمام الفرع")');
  if (await arrivedBtn.isVisible()) {
    await arrivedBtn.click();
    await page.waitForTimeout(800);
    console.log('[VERIFIED] Curbside "I Have Arrived" trigger tested successfully');
  }

  // Test 7: Table Reservation Page
  await page.goto(`${baseUrl}/#/reservation`);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '08-mobile-reservation.png'), fullPage: false });
  console.log('[CAPTURED] 08-mobile-reservation.png');

  // Test 8: About Page
  await page.goto(`${baseUrl}/#/about`);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '09-mobile-about.png'), fullPage: false });
  console.log('[CAPTURED] 09-mobile-about.png');

  // Test 9: Credits & Transparency Page
  await page.goto(`${baseUrl}/#/credits`);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '10-mobile-credits.png'), fullPage: false });
  console.log('[CAPTURED] 10-mobile-credits.png');

  // 2. Desktop Scenario (1440 x 900)
  console.log('--- Testing Desktop Viewport (1440x900) ---');
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1.5,
  });
  const desktopPage = await desktopContext.newPage();

  await desktopPage.goto(`${baseUrl}/#/`);
  await desktopPage.waitForTimeout(1200);
  await desktopPage.screenshot({ path: path.join(SCREENSHOTS_DIR, 'desktop-01-home.png'), fullPage: false });
  console.log('[CAPTURED] desktop-01-home.png');

  await desktopPage.goto(`${baseUrl}/#/menu`);
  await desktopPage.waitForTimeout(1200);
  await desktopPage.screenshot({ path: path.join(SCREENSHOTS_DIR, 'desktop-02-menu.png'), fullPage: false });
  console.log('[CAPTURED] desktop-02-menu.png');

  await desktopPage.goto(`${baseUrl}/#/reservation`);
  await desktopPage.waitForTimeout(1200);
  await desktopPage.screenshot({ path: path.join(SCREENSHOTS_DIR, 'desktop-03-reservation.png'), fullPage: false });
  console.log('[CAPTURED] desktop-03-reservation.png');

  await browser.close();
  try {
    server.kill();
  } catch {}
  console.log('--- Browser tests completed ---');

  // 3. Generate 6 Instagram-Ready Carousel Cards (1080 x 1350)
  console.log('--- Generating 6 Instagram Posts (1080x1350) ---');
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
      badge: 'SFDA NUTRITION & CALORIES · القائمة الذكية',
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
      badge: 'SMART CART & VAT · سلة مشتريات سلسة',
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

  for (const post of igPosts) {
    const srcPath = path.join(SCREENSHOTS_DIR, post.source);
    if (!fs.existsSync(srcPath)) {
      console.warn(`Source not found: ${srcPath}`);
      continue;
    }

    // Resize screenshot to fit nicely inside mobile device frame
    const screenWidth = 560;
    const screenHeight = 940;
    const screenBuffer = await sharp(srcPath)
      .resize(screenWidth, screenHeight, { fit: 'cover', position: 'top' })
      .toBuffer();

    // Device frame overlay + Typography banner via SVG
    const svgOverlay = `
      <svg width="1080" height="1350" viewBox="0 0 1080 1350" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#141416" />
            <stop offset="50%" stop-color="#1A191D" />
            <stop offset="100%" stop-color="#0E0E10" />
          </linearGradient>
          <linearGradient id="amberGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#C98A4B" />
            <stop offset="100%" stop-color="#DFAC72" />
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
          <rect x="-170" y="0" width="340" height="32" rx="16" fill="#25242A" stroke="#C98A4B" stroke-width="1.2" />
          <text x="0" y="20" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="700" fill="#C98A4B" text-anchor="middle" letter-spacing="1">
            ${post.badge}
          </text>
        </g>

        <!-- Title -->
        <text x="540" y="150" font-family="'Alexandria', system-ui, sans-serif" font-size="34" font-weight="800" fill="#FAF7F2" text-anchor="middle">
          ${post.title}
        </text>

        <!-- Subtitle -->
        <text x="540" y="195" font-family="'Alexandria', system-ui, sans-serif" font-size="16" font-weight="400" fill="#A19D95" text-anchor="middle">
          ${post.sub}
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

    // Composite background + screen buffer inside device frame + overlay
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

  console.log('--- All Testing & Showcase Generation Completed ---');
}

main().catch((err) => {
  console.error('Test and capture failed:', err);
  process.exit(1);
});
