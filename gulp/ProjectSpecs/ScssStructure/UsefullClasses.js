/* 
* Section Info
**/
const sectionInfo = {
    "name": "Usefull Classes",
    "addToSectionIndex": true,

    "assets": [
        {
            "name": "a11y (Accessibility)",
            "path": "05-useful/a11y"
        },
        {
            "name": "Colors - Brand",
            "path": "05-useful/colors-brand"
        },
        {
            "name": "Colors - Neutral",
            "path": "05-useful/colors-neutral"
        },
        {
            "name": "Colors - Palette",
            "path": "05-useful/colors-palette"
        },
        {
            "name": "Colors - Semantic",
            "path": "05-useful/colors-semantic"
        },
        {
            "name": "Colors - Others",
            "path": "05-useful/colors-others"
        },
        {
            "name": "Text",
            "path": "05-useful/text"
        },
        {
            "name": "Typography",
            "path": "05-useful/typography"
        },
        {
            "name": "Border Size",
            "path": "05-useful/border-size"
        },
        {
            "name": "Border Radius",
            "path": "05-useful/border-radius"
        },
        {
            "name": "Space - Margin",
            "path": "05-useful/space-margin"
        },
        {
            "name": "Space - Padding",
            "path": "05-useful/space-padding"
        },
        {
            "name": "Shadow",
            "path": "05-useful/shadow"
        },
        {
            "name": "Box Width",
            "path": "05-useful/box-width"
        },
        {
            "name": "Box Height",
            "path": "05-useful/box-height"
        },
        {
            "name": "Display",
            "path": "05-useful/display"
        },
        {
            "name": "Display - Flex",
            "path": "05-useful/display-flex"
        },
        {
            "name": "Display - Align",
            "path": "05-useful/display-align"
        },
        {
            "name": "Images",
            "path": "05-useful/images"
        },
        {
            "name": "Overflow",
            "path": "05-useful/overflow"
        },
        {
            "name": "Visibility",
            "path": "05-useful/visibility"
        },
        {
            "name": "Position",
            "path": "05-useful/positioning"
        },
        {
            "name": "Position - Absolute",
            "path": "05-useful/positioning-absolute"
        },
        {
            "name": "Miscellaneous",
            "path": "05-useful/miscellaneous"
        },
        {
            // Generated `.token-*` utility classes (typography, spacing, colour,
            // border, elevation) - written by `npm run build:tokens` into the
            // gitignored src/scss/tokens/. Requires `--utilities true` on that
            // command; without it this partial does not exist and the build fails.
            //
            // Last in the section on purpose: it is generated, so keeping it apart
            // from the hand-written 05-useful/* partials makes the compiled output
            // easy to locate. It declares no Sass members, so `@use ... as *` in the
            // entry file cannot collide with anything; its own `@use "variables"`
            // resolves to the same tokens module the rest of the tree already loads.
            "name": "Design tokens - .token-* classes",
            "path": "tokens/utilities"
        }
    ]
};

// Expose section info!
exports.info = sectionInfo;