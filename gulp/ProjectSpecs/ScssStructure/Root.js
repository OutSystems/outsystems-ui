const project = require('../DefaultSpecs');

/* 
* Section Info
**/
const sectionInfo = {
    "name": "Root - CSS Variables",
    "addToSectionIndex": true,

    "assets": [
        {
            "name": "",
            "path": "01-foundations/root"
        },
        {
            "name": "Icon library",
            "path": "01-foundations/icon-library-odc",
            "platform": project.globalConsts.platformTarget.odc
        },
        {
            "name": "Icon library",
            "path": "01-foundations/icon-library-o11",
            "platform": project.globalConsts.platformTarget.o11
        },
        {
            // Dark mode. Generated from the design tokens' dark mode by
            // `npm run build:tokens` (src/scss/tokens/ is gitignored). It re-maps the
            // ~447 --token-* values that differ in dark and self-applies them under
            // `.theme-dark`, so importing it is all dark mode needs.
            //
            // It belongs in THIS section, not in Resets: it is a CSS-variables file.
            //
            // It must stay AFTER '01-foundations/root'. Today the two never collide -
            // root declares only --color-*/--osui-* role knobs, this file declares only
            // --token-* - so source order is a no-op. But `:root` and `.theme-dark` are
            // both specificity 0-1-0, so the moment light --token-* values are emitted
            // at :root (i.e. if build:tokens is ever run with `--root true`), later
            // wins: dark ahead of root would silently lose to light.
            //
            // Registered HERE, in the spec, on purpose: this import used to be
            // hand-added straight into O11/ODC.OutSystemsUI.scss, which every build
            // regenerates - so the dark token values were silently dropped from the
            // bundle on any rebuild. Do not move it back into those files.
            "name": "Dark theme (opt-in via .theme-dark class)",
            "path": "tokens/theme-dark"
        }
    ]
};

// Expose section info!
exports.info = sectionInfo;