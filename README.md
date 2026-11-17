# Where to Next?

An editorial travel personality experience. A responsive travel personality quiz with preference-based destination scoring, an animated globe reveal, destination results, a local passport and bucket list, and sharing.

## Run locally

Install Node.js 18 or newer, then run:

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. Run `npm run build` to create a production build and `npm run preview` to preview it.

## GitHub Pages

Vite is configured for the repository path `/Spin-The-Globe/`. The included GitHub Actions workflow builds and deploys the site when changes are pushed to `main`. In the repository's Settings → Pages, select **GitHub Actions** as the source. The eventual URL is `https://kaitlyncoakley.github.io/Spin-The-Globe/` once deployment succeeds. 

## Assets

Destination photography comes from Wikimedia Commons, with creator, license, and source links shown on each result. The Earth texture is the [Three.js example texture](https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg); its original rights still require confirmation. Fonts are provided by Google Fonts (Bodoni Moda and DM Sans). The globe has a fallback if WebGL fails; external images and fonts require a network connection.
