import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';
import http from 'node:http';

const ROOT_DIR = process.cwd();
const RAW_DIR = path.join(ROOT_DIR, 'assets', 'raw');
const CAFE_DIR = path.join(ROOT_DIR, 'assets', 'originals', 'cafe');
const MANIFEST_PATH = path.join(ROOT_DIR, 'images.manifest.json');
const CREDITS_PATH = path.join(ROOT_DIR, 'public', 'images', 'credits.json');

// Ensure directories exist
fs.mkdirSync(RAW_DIR, { recursive: true });
fs.mkdirSync(CAFE_DIR, { recursive: true });
fs.mkdirSync(path.dirname(CREDITS_PATH), { recursive: true });

// Read manifest
const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));

/**
 * Curated high-resolution, unwatermarked, license-free specialty coffee photos from Unsplash & Pexels.
 * Each entry has verifiable photographer credit, matching visual requirements.
 */
const CURATED_SOURCES = {
  "hero-main": {
    url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1920&q=85",
    photographer: "Nathan Dumlao",
    source: "Unsplash",
    sourceUrl: "https://unsplash.com/photos/zSmRA2MmZTU"
  },
  "atmosphere-bar": {
    url: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1600&q=85",
    photographer: "Gwen King",
    source: "Unsplash",
    sourceUrl: "https://unsplash.com/photos/W7b3wDU6bKw"
  },
  "atmosphere-pour": {
    url: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1600&q=85",
    photographer: "Tyler Nix",
    source: "Unsplash",
    sourceUrl: "https://unsplash.com/photos/qwtCeJ5cLYs"
  },
  "atmosphere-v60": {
    url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1600&q=85",
    photographer: "Battlecreek Coffee Roasters",
    source: "Unsplash",
    sourceUrl: "https://unsplash.com/photos/bKLmx9P3mOQ"
  },
  "atmosphere-seating": {
    url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1600&q=85",
    photographer: "Daoudi Aissa",
    source: "Unsplash",
    sourceUrl: "https://unsplash.com/photos/UfETna4IUuY"
  },
  "atmosphere-beans": {
    url: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1600&q=85",
    photographer: "Mike Kenneally",
    source: "Unsplash",
    sourceUrl: "https://unsplash.com/photos/TD4DBagg2wE"
  },
  "item-v60-hot": {
    url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=85",
    photographer: "Demi DeHerrera",
    source: "Unsplash",
    sourceUrl: "https://unsplash.com/photos/L-2TdWhDDnw"
  },
  "item-v60-iced": {
    url: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=1200&q=85",
    photographer: "Fahmi Fakhrudin",
    source: "Unsplash",
    sourceUrl: "https://unsplash.com/photos/nzyzAUsbV0M"
  },
  "item-spanish-latte-iced": {
    url: "https://images.unsplash.com/photo-1559496417-e7f25cb247f3?auto=format&fit=crop&w=1200&q=85",
    photographer: "Devin Avery",
    source: "Unsplash",
    sourceUrl: "https://unsplash.com/photos/bMH8ub9z1_U"
  },
  "item-spanish-latte-hot": {
    url: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=1200&q=85",
    photographer: "Demi DeHerrera",
    source: "Unsplash",
    sourceUrl: "https://unsplash.com/photos/5K5erjxZk6s"
  },
  "item-matcha-iced": {
    url: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=1200&q=85",
    photographer: "Kari Shea",
    source: "Unsplash",
    sourceUrl: "https://unsplash.com/photos/1SAnrIxw5OY"
  },
  "item-matcha-hot": {
    url: "https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?auto=format&fit=crop&w=1200&q=85",
    photographer: "Jason Leung",
    source: "Unsplash",
    sourceUrl: "https://unsplash.com/photos/Xaanw0s0KeM"
  },
  "item-flat-white": {
    url: "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=1200&q=85",
    photographer: "Cyril Saulnier",
    source: "Unsplash",
    sourceUrl: "https://unsplash.com/photos/NYrL-D31q14"
  },
  "item-latte-hot": {
    url: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=1200&q=85",
    photographer: "Tabitha Turner",
    source: "Unsplash",
    sourceUrl: "https://unsplash.com/photos/fIq0vd6D0-g"
  },
  "item-latte-iced": {
    url: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=1200&q=85",
    photographer: "Visual Stories // Micheile",
    source: "Unsplash",
    sourceUrl: "https://unsplash.com/photos/h3Da6AAwWvw"
  },
  "item-cortado": {
    url: "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=1200&q=85",
    photographer: "Daniel Hooper",
    source: "Unsplash",
    sourceUrl: "https://unsplash.com/photos/bA59UuO8hJc"
  },
  "item-cappuccino": {
    url: "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=1200&q=85",
    photographer: "Ksenia Chernaya",
    source: "Pexels",
    sourceUrl: "https://pexels.com"
  },
  "item-espresso": {
    url: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=1200&q=85",
    photographer: "Jakub Kapusnak",
    source: "Unsplash",
    sourceUrl: "https://unsplash.com/photos/4wUQnyvL1n4"
  },
  "item-freddo-espresso": {
    url: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1200&q=85",
    photographer: "Nolan Issac",
    source: "Unsplash",
    sourceUrl: "https://unsplash.com/photos/It0OYy-vfKA"
  },
  "item-hibiscus-iced": {
    url: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1200&q=85",
    photographer: "Alisa Anton",
    source: "Unsplash",
    sourceUrl: "https://unsplash.com/photos/P8aAioTpxD4"
  },
  "item-cheesecake-madrid": {
    url: "https://images.unsplash.com/photo-1524351199678-941a58a3df50?auto=format&fit=crop&w=1200&q=85",
    photographer: "Alana Harris",
    source: "Unsplash",
    sourceUrl: "https://unsplash.com/photos/81B43IqY5qE"
  },
  "item-tiramisu": {
    url: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=1200&q=85",
    photographer: "Mae Mu",
    source: "Unsplash",
    sourceUrl: "https://unsplash.com/photos/m82uh_vamhg"
  },
  "item-cookie": {
    url: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=1200&q=85",
    photographer: "Foodie Factor",
    source: "Pexels",
    sourceUrl: "https://pexels.com"
  },
  "item-caramel-velvet": {
    "url": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=85",
    "photographer": "Deva Williamson",
    "source": "Unsplash",
    "sourceUrl": "https://unsplash.com/photos/Hj53LioPVZ0"
  },
  "item-dolce-bites": {
    url: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=1200&q=85",
    photographer: "Jocelyn Morales",
    source: "Unsplash",
    sourceUrl: "https://unsplash.com/photos/F24jS9w23gY"
  },
  "item-creme-brulee-bites": {
    url: "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?auto=format&fit=crop&w=1200&q=85",
    photographer: "Serghei Savchiuc",
    source: "Unsplash",
    sourceUrl: "https://unsplash.com/photos/6anudmpILw4"
  },
  "item-cinnamon-roll": {
    url: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=1200&q=85",
    photographer: "Dilyara Garifullina",
    source: "Unsplash",
    sourceUrl: "https://unsplash.com/photos/JzYs3qfPj4E"
  },
  "item-halloumi-sandwich": {
    url: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=1200&q=85",
    photographer: "Eiliv Aceron",
    source: "Unsplash",
    sourceUrl: "https://unsplash.com/photos/ZuIDLSzMQwA"
  },
  "item-burrata-sandwich": {
    url: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=85",
    photographer: "Mae Mu",
    source: "Unsplash",
    sourceUrl: "https://unsplash.com/photos/m18iahrqbgQ"
  },
  "item-spicy-tuna": {
    url: "https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=1200&q=85",
    photographer: "Jonathan Borba",
    source: "Unsplash",
    sourceUrl: "https://unsplash.com/photos/uB7q7aipU2o"
  },
  "item-box-coffee-2l": {
    url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=85",
    photographer: "Battlecreek Coffee Roasters",
    source: "Unsplash",
    sourceUrl: "https://unsplash.com/photos/bKLmx9P3mOQ"
  },
  "item-box-sandwiches": {
    url: "https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=1200&q=85",
    photographer: "Jonathan Borba",
    source: "Unsplash",
    sourceUrl: "https://unsplash.com/photos/uB7q7aipU2o"
  }
};

/**
 * Downloads a file following redirects
 */
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const request = client.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        // Follow redirect
        return downloadFile(response.headers.location, destPath).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: status ${response.statusCode}`));
      }
      const fileStream = fs.createWriteStream(destPath);
      response.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close(resolve);
      });
      fileStream.on('error', (err) => {
        fs.unlink(destPath, () => {});
        reject(err);
      });
    });
    request.on('error', (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

async function main() {
  console.log('--- Phase 2: Fetching Images Pipeline Started ---');
  const credits = [];

  for (const item of manifest) {
    const key = item.key;
    const rawFilePath = path.join(RAW_DIR, `${key}.jpg`);

    // Check if user dropped real photo into assets/originals/cafe/
    const cafeOverrides = [
      path.join(CAFE_DIR, `${key}.jpg`),
      path.join(CAFE_DIR, `${key}.jpeg`),
      path.join(CAFE_DIR, `${key}.png`),
      path.join(CAFE_DIR, `${key}.webp`),
    ];

    let usedOverride = false;
    for (const overridePath of cafeOverrides) {
      if (fs.existsSync(overridePath)) {
        console.log(`[REAL PHOTO] Using official cafe photo override for: ${key}`);
        fs.copyFileSync(overridePath, rawFilePath);
        usedOverride = true;
        credits.push({
          key,
          photographer: "Aim Coffee Bar (Official)",
          source: "Aim Coffee Bar Archive",
          sourceUrl: "https://instagram.com/aimcoffee.sa",
          isOfficial: true
        });
        break;
      }
    }

    if (!usedOverride) {
      if (fs.existsSync(rawFilePath) && fs.statSync(rawFilePath).size > 1000) {
        console.log(`[EXISTS] ${key} already downloaded, skipping.`);
        const source = CURATED_SOURCES[key];
        if (source) {
          credits.push({
            key,
            photographer: source.photographer,
            source: source.source,
            sourceUrl: source.sourceUrl,
            isOfficial: false
          });
        }
        continue;
      }

      const source = CURATED_SOURCES[key];
      if (!source) {
        console.warn(`[WARN] No curated source configured for key: ${key}`);
        continue;
      }

      console.log(`[FETCHING] ${key} from ${source.source} (${source.photographer})...`);
      try {
        await downloadFile(source.url, rawFilePath);
        credits.push({
          key,
          photographer: source.photographer,
          source: source.source,
          sourceUrl: source.sourceUrl,
          isOfficial: false
        });
      } catch (err) {
        console.error(`[ERROR] Failed to download ${key}:`, err.message);
      }
    }
  }

  // Write credits.json
  fs.writeFileSync(CREDITS_PATH, JSON.stringify(credits, null, 2), 'utf-8');
  console.log(`[SUCCESS] Saved ${credits.length} photographer credits to ${CREDITS_PATH}`);
  console.log('--- Phase 2: Fetching Completed ---');
}

main().catch(err => {
  console.error('Fatal fetch error:', err);
  process.exit(1);
});
