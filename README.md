# Threads of Calm

A Next.js storefront and brand website for handcrafted lifestyle products.

## Local development

```bash
npm install
npm run dev
```

Then open http://localhost:3000 in your browser.

## Production build

```bash
npm run build
npm run start
```

## Deploy to GitHub + Vercel

1. Create a GitHub repository.
2. Push this project to GitHub.
3. Go to Vercel and import the repo.
4. Vercel will detect the Next.js app automatically.
5. Deploy.

## Record WhatsApp checkout attempts in Google Sheets

The cart records an order when a customer clicks **Place order on WhatsApp**. This records a checkout attempt, not confirmation that the customer sent the WhatsApp message or completed the purchase.

1. Open the order spreadsheet and select **Extensions → Apps Script**.
2. Replace the editor contents with [`google-apps-script/Code.gs`](./google-apps-script/Code.gs), then save the project.
3. In Apps Script, open **Project Settings → Script Properties → Add script property**. Set the property name to `WEBHOOK_SECRET` and its value to a long random secret. Use the same value only in the website's server-side environment variables.
4. Select **Deploy → New deployment → Web app**. Choose **Execute as: Me** and **Who has access: Anyone**, authorize it, and deploy. Copy the web app URL ending in `/exec`.
5. Add these environment variables to the website's local `.env.local` and hosting provider (for Vercel, **Project Settings → Environment Variables**):
   - `GOOGLE_SHEETS_WEB_APP_URL`: the deployed Apps Script `/exec` URL.
   - `GOOGLE_SHEETS_WEBHOOK_SECRET`: the exact same secret from step 3.
   Use [`.env.example`](./.env.example) as a template. Never put the secret in client-side code or commit it.
6. Restart/redeploy the website. The first sheet tab must have the headers `Date/time`, `Items`, `Subtotal`, `Shipping`, `Total`, `Status` in its first row. If the tab is empty, the script adds them automatically.

## Project structure

- `app/` - main website pages and UI
- `public/` - static assets
- `product_images/` - image assets used by the project
- `package.json` - project scripts and dependencies

## Notes

This project is ready to be uploaded to GitHub and connected to Vercel for public hosting.

git add .
git commit -m "Excel Log maintain for website order"
git push origin main