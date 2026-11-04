# PassSafe deployment checklist

## Before publishing
- [ ] `npm install` completes without errors.
- [ ] `npm run build` completes and creates `dist/`.
- [ ] Test the page on desktop and mobile widths.
- [ ] Test empty input, mixed password, common password, and generator.
- [ ] Confirm breach check only sends the 5-character SHA-1 prefix.
- [ ] Do not use real personal passwords during the demonstration.

## GitHub
Run these commands from the project folder (replace the URL with your own GitHub repository URL):

```bash
git init
git add .
git commit -m "Initial PassSafe project"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/passsafe.git
git push -u origin main
```

## Vercel
1. Open https://vercel.com/ and sign in.
2. Select **Add New → Project**.
3. Import the PassSafe GitHub repository.
4. Select Vite if prompted.
5. Build command: `npm run build`.
6. Output directory: `dist`.
7. Select Deploy and wait for the build.
8. Open the generated HTTPS URL and test the site.

## Screenshots to capture for the presentation
1. PassSafe landing page.
2. Weak password result.
3. Strong password result.
4. Requirements checklist.
5. Breach check result (use a made-up test password).
6. GitHub repository.
7. Vercel deployment success and live URL.
