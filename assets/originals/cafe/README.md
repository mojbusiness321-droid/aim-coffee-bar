# Cafe Real Photos Override Directory

Drop any high-resolution photos provided by Aim Coffee Bar directly into this folder (`assets/originals/cafe/`).

### Naming Convention:
Name files using the manifest keys (e.g., `item-v60-hot.jpg`, `item-spanish-latte-iced.png`, `hero-main.jpg`).

When running `npm run process-images`, any photo placed in this directory will automatically be given **100% priority** over stock imagery, converted into responsive WebP & AVIF formats (480w, 960w, 1600w), and placed into `public/images/`.
