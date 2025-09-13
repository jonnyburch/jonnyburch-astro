# Jonny Burch dot com is on astro now

Ooh look at me. I'm swanky.

### New post

```bash
npm run new-post "My new post" "My new post description"
```

### Run the dev server

```bash
npm run dev
```

### Build the site

```bash
npm run build
```

### Preview the site

```bash
npm run preview
```

### Build manually on cloudflare
`curl -X POST "https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/af7bac81-dbdf-4708-8960-08b47dc2705b"`

### Import contacts

Add a csv file to root with Headers `Email, Name, Subscription Date` (called contacts_import.csv)