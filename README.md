# Velora — brand web (Amazon)

Premium beauty / personal-care landing for **Velora**.  
Static site: HTML + CSS + JS. Free hosting friendly.

## Local preview

Open `index.html` in the browser:

```powershell
Invoke-Item C:\Users\alber\velora-web\index.html
```

## Features

- Modern dark UI + animations
- Product grid with photos
- Prices in **USD** (`$`)
- Language switch **EN / ES** (top right)
- Link target: Amazon.com (placeholder)

## Publish FREE (Cloudflare Pages)

1. Sign up at [Cloudflare](https://dash.cloudflare.com/sign-up)
2. **Workers & Pages → Create → Pages → Upload assets**
3. Upload this folder
4. Get a free URL like `https://velora.pages.dev`

Also works with GitHub Pages or [Netlify Drop](https://app.netlify.com/drop).

## Custom domain later

Cloudflare Registrar or Porkbun — typically ~$8–15/year.  
Connect under Pages → **Custom domains**.

## Customize

1. Amazon link in `index.html` (`#amazon-link`)
2. Prices already in USD
3. Translations in `i18n.js`
4. Real product photos when ready

## Structure

```
velora-web/
├── index.html
├── styles.css
├── script.js
├── i18n.js
├── MARCA.md
└── README.md
```

## Next steps

1. Publish free on Cloudflare Pages
2. Paste your real Amazon storefront / ASIN
3. Optional: buy `velora.*` domain
