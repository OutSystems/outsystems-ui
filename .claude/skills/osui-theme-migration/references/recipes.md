# Recipes — "I used to do X"

> Read this when a customer describes a symptom that matches one of the titles below. `SKILL.md` § 10 carries the index; this file carries the fixes. Read the one recipe you need, not the file.

This file is **writable** — a migration that solves a new symptom cleanly is expected to add a recipe here. See `SKILL.md` Phase 5.

---



### "My dark primary button lost its label"

`--color-text-light` stays white. If dark mode turns `--color-primary` white, the label disappears. Set `--osui-btn-primary-color` **on `.btn-primary`**, not on `:root` (the framework re-declares it on `.btn`, so a `:root` override is inherited but loses):

```css
.dark-mode .btn-primary,
.os-dark-theme .btn-primary {
  --osui-btn-primary-color: var(--color-neutral-0);
}
.dark-mode .btn.background-white,
.os-dark-theme .btn.background-white {
  --osui-btn-color: var(--color-text-dark);
}
```

### "I re-branded the app by overriding `--color-primary`"

Still works, but add the interaction tiers and border:

```css
:root {
  --color-primary: #7c20f2;
  --color-primary-hover: #651ac5;
  --color-primary-active: #5817ab;
  --color-border-primary: #7c20f2;
}
```

Or go one level deeper for a full re-brand (focus halos recolour automatically):

```css
:root {
  --token-semantics-primary-base: #7c20f2;
  --token-semantics-primary-800: #651ac5;
  --token-semantics-primary-900: #5817ab;
}
```

### "I rounded (or squared) every corner by hand"

One switch covers most of it:

```css
:root { --border-radius-default: 0; }    /* every tier slot square */
:root { --border-radius-default: 12px; } /* every tier slot softer */
```

This reaches the seven `--border-radius-{2xs…2xl}` tier slots only. The three legacy roles — `--border-radius-none`, `-soft`, `-rounded` — resolve straight to their tokens and ignore it, and `soft` is the one customer CSS reads most. Set those explicitly as well; see the border-radius section above.

### "I restyled one component with `!important`"

Check the CSS API Reference for the component's `--osui-*` knobs first — there usually is one now:

```css
/* before */
.my-page .osui-sidebar { background: #1a1a2e !important; }

/* now */
.my-page .osui-sidebar {
  --osui-sidebar-background: #1a1a2e;
  --osui-sidebar-color: #ffffff;
}
```

### "I set my own body / header / menu backgrounds"

Use the surface roles:

```css
:root {
  --color-background-body: #f6f7fb;
  --color-background-surface: #ffffff;
  --color-background-header: #101828;
  --color-background-sidemenu: #101828;
  --color-background-footer: #101828;
  --color-background-login: #ffffff;
  --color-background-input: #ffffff;
}
```

### "My links are blue / invisible in dark mode"

The framework hardcodes link color to `$token-semantics-primary-base`, not `--color-primary`. Overriding `--color-primary` does not change links. Override the token in the dark block, or style links directly. When overriding link color, always override hover/focus too — `a:hover` reads `--token-semantics-primary-900` which also stays at its light value:

```css
/* Option 1: override the token (changes links AND primary) */
:root.dark-mode {
    --token-semantics-primary-base: var(--color-neutral-10);
    --token-semantics-primary-900: var(--color-neutral-9);
}

/* Option 2: style links directly (independent of primary) */
a[data-link] {
    color: var(--color-text);
}
a[data-link]:hover,
a[data-link]:focus {
    color: var(--color-text-subtle);
}
```

### "My active nav link is invisible in dark mode"

The classic top menu marks the current page with an underline, `border-block-end: var(--token-border-size-050) solid var(--color-primary)`, not a filled pill. The new theme clears that border (`border-block-end: transparent` on `.layout:not(.layout-side) .app-menu-links a.active`, and `border-block-end: none` under `.header-navigation`) and paints a hover fill. On a dark custom header that fill stays a light grey, so the label washes out.

**Do not add a hover fill.** Classic hover was `color: var(--color-primary); text-decoration: none;` and nothing else — no background. In many customer palettes `--color-primary` also equals the menu's resting text colour, so classic hover was a visual no-op. Painting a fill to "restore" it invents a state the app never had. Clear the background on hover, and mark only the current page.

**Restoring the border is not enough — the link's box changed too.** The new theme turns each header link into a centred pill:

```scss
.header-navigation .app-menu-links > a {
    align-self: center;                 // classic stretched to full header height
    border-block-end: none;             // classic: 2px, transparent until .active
    border-block-start: none;           // classic: 2px transparent, for balance
    border-radius: $token-border-radius-200;
    padding-block: $token-scale-200;    // 8px  — classic had none
    padding-inline: $token-scale-300;   // 12px — classic had none
}
```

So an underline put back on that box renders **under the label instead of on the header's bottom edge**, and **24px wider than the word**. Customers describe this as "the highlight is in the wrong place and too long", which sounds like a styling preference and is really a geometry change. Undo the box on *all* the links, not just the active one, or the active link ends up a different size from its neighbours:

```css
.desktop .header-navigation .app-menu-links > a {
    align-self: stretch;
    border-block-start: var(--token-border-size-050, 2px) solid transparent;
    border-radius: 0;
    margin-inline: 0 var(--token-scale-400, 16px);
    padding-block: 0;
    padding-inline: 0;
}
```

Keep the transparent top border: classic carried one so active and inactive links stayed the same height and the labels did not shift.

**The `margin-inline` is not optional, and this is the trap.** The same framework rule sets `margin-inline: $token-scale-025` (1px) at specificity 0-3-0, which outranks any `margin-*` utility class the app puts on the link — `.margin-right-base` is 0-1-0. So in the new theme those utilities are already dead and the entire visible gap between items is the `padding-inline` you just removed. Take the padding away without putting a margin back and the links collide. Classic set no margin on the link at all, which is why the app's utilities worked there and why nobody noticed they had stopped.

**Restate the utilities per class, not as one flat value.** Links in the same menu routinely carry different utilities, and the gap between two of them is the sum of the left link's end margin and the right link's start margin — commonly from two different classes. Collapsing that to a single `margin-inline` on every link both undershoots the gap and leaves a stray margin outside the first and last item, which a flat value cannot avoid. Scope each utility at the framework's specificity instead:

```css
.desktop .header-navigation .app-menu-links > a { margin-inline: 0; }
.desktop .header-navigation .app-menu-links > a.margin-right-base { margin-inline-end: var(--token-scale-400, 16px); }
.desktop .header-navigation .app-menu-links > a.<grid-gutter-class> { margin-inline-start: <declared value>; }
```

Take the **declared** value for any platform grid class, not the computed pixel figure — grid gutters are usually percentages and often have media-query variants, so a measured px will drift at other viewport widths. Expect the declared rule to come as a *pair*: a physical `margin-left` plus an `.is-rtl` override flipping it to `margin-right`. Restate it as the single logical `margin-inline-start`, which covers both directions — the same conversion the framework applied to its own utilities, where classic's `margin-right` on `.margin-right-base` is now `margin-inline-end`. Read the rules out of the live stylesheets:

```js
[...document.styleSheets]
  .flatMap(s => { try { return [...s.cssRules] } catch { return [] } })
  .filter(r => r.selectorText && /<grid-gutter-class>/.test(r.selectorText))
  .forEach(r => console.log(r.selectorText, '=>', r.style.cssText));
```

Measure the classic gap rather than assuming — different links often carry different utilities, so one value may not fit all of them:

```js
console.table([...document.querySelectorAll('.app-menu-links > a')].map(a => {
    const c = getComputedStyle(a);
    return { text: a.textContent.trim().slice(0, 14), cls: a.className,
             padInline: c.paddingInline, marInline: c.marginInline };
}));
```

Then, on `.active` and `.active:hover`, clear the background and restore the underline. `.desktop .header-navigation .app-menu-links > a.active:hover` beats a plain `.active` rule, so include `:hover`.

```css
.app-menu-links > a:hover,
.desktop .header-navigation .app-menu-links > a:hover {
    background-color: transparent;
}

.layout:not(.layout-side) .app-menu-links a.active,
.desktop .header-navigation .app-menu-links > a.active,
.desktop .header-navigation .app-menu-links > a.active:hover {
    background-color: transparent;
    border-block-end: var(--token-border-size-050, 2px) solid var(--color-primary);
    border-radius: 0;
    color: var(--color-primary);
}
```

### "My blank-slate icons turned grey"

The new theme changed `--osui-blank-slate-icon-color` from a primary-adjacent colour to `--color-text-disabled` (grey). Override on the component:

```css
.blank-slate-icon {
    color: var(--color-primary);
}
```

### "I hand-built a dark mode"

Consider adopting the built-in `.os-dark-theme` alongside the custom class — it's implemented purely as variable overrides and composes with custom `--osui-*` and `--color-*` overrides. Toggle the class on `<html>` via the `SetDarkTheme` client action. Without it, ~447 `--token-*` overrides (feedback messages, input backgrounds, shadows, etc.) stay at light-mode values.

### "I built dark mode by flipping the grey shades"

This is Category H. See **[`references/grey-shades.md`](references/grey-shades.md)** for the full remediation and a worked example — the short version is that the role overrides belong at `:root`, not in the dark block.

### "I changed all the shadows / all the spacing / all the type"

Override the tokens directly:

```css
:root {
  --token-elevation-2: 0 2px 8px rgba(0, 0, 0, 0.12);
  --token-scale-400: 20px;     /* every 16px gap becomes 20px */
  --token-font-size-400: 15px;
}
```

---
