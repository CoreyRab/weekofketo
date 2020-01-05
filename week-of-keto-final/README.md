# Week of Keto - Gridsome 🖖 Prismic

Prismic Status - https://status.prismic.io/

### Develop

1. `yarn install --global @gridsome/cli`
2. Run Project using `gridsome develop` starting local dev server at `http://localhost:8080`
3. Update CSS `npx tailwind build src/main.css -o src/output.css`

### Deploy

1. Add site to Netlify - Build & Deploy > Continouse Depoloyment > Build Settings

    - Repository - pick this github repo, make sure netlify has access to it
    - Build Command: `gridsome build`
    - Publish directory: `dist`

2. Add Environment Variables (Build & Deploy > Environment > Environment Variables)

    - EMAIL_OCTOPUS_API_KEY
    - EMAIL_OCTOPUS_LIST
    - GRIDSOME_NETLIFY: `true`
    - PRISMIC_AUTH_TOKEN
    - PRISMIC_REF
    - PRISMIC_URL
    - SENTRY_DSN
    - GA_ID=GTM-XXXXXXX
    - GTM_ID=UA-XXXXXXXXX-X

3. Netlify Add Build Hook (Build & Deploy > Continouse Depoloyment > Build Hooks)

4. Ensure `gridsome.config.js` contains the correct `siteUrl`
