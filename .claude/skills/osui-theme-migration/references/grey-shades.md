# Grey shades flipped — role overrides and the hazards around them

> Read this when triage puts the stylesheet in **Category H**: a dark-mode block that overrides three or more `--color-neutral-*` steps. `SKILL.md` § 2 carries the detection pattern and the one rule you need before opening this file; everything below is the remediation.

This file is **writable** — a migration that discovers a new symptom or a new role mapping is expected to add it here. See `SKILL.md` Phase 5.

---

## The breakage


The highest-impact dark-mode breakage. In the **old theme**, role variables were defined directly in terms of grey shades:

```css
/* Old theme internals — roles read neutrals directly */
--color-text: var(--color-neutral-9);
--color-background-header: var(--color-neutral-0);
--color-background-surface: var(--color-neutral-0);
--color-border: var(--color-neutral-3);
```

Customers who built dark mode by flipping all eleven grey shades (swapping `--color-neutral-0` ↔ `--color-neutral-10`, `--color-neutral-1` ↔ `--color-neutral-9`, etc.) got dark text, surfaces, and borders "for free" because every role cascaded through the grey shades.

In the **new theme**, roles resolve through `$token-*` variables that do **not** reference `--color-neutral-*`. Flipping the grey shades still changes elements that read neutrals directly (custom backgrounds, custom borders), but the framework's own text, surfaces, headers, and borders are unaffected — they keep their light-mode token values on a now-dark background, producing:

- **Invisible / faded body text** — `--color-text` still resolves to dark text
- **Invisible button labels** — `--osui-btn-color` still reads the light-mode token
- **Invisible outline / secondary button text** — transparent-background buttons get white text on white fill
- **Blue links instead of themed links** — link color is hardcoded to `$token-semantics-primary-base` (not `--color-primary`), so the customer's `--color-primary` override has no effect on links
- **Link hover invisible** — `a:hover` uses `--token-semantics-primary-900` which stays at its light value; when links are overridden to match body text, hover must be overridden too (e.g. to `--color-text-subtle`)
- **Missing header background** — `--color-background-header` still resolves to the light default
- **Missing surface contrast** — `--color-background-surface` unchanged
- **Invisible borders** — `--color-border` still resolves to its light value
- **White feedback messages** — `--token-bg-info-subtle-default`, `--token-bg-danger-subtle-default`, `--token-bg-success-subtle-default`, and `--token-bg-warning-subtle-default` stay at light values. `.os-dark-theme` flips them to the generated dark palette, which is a different theme from custom grey shades. Set the four tokens in the customer's dark block so the banners match the brand with or without that class.
- **Selected nav item lost its underline** — the classic current page is `border-block-end` in `--color-primary`. The new theme clears that border and a hover fill (`--token-bg-neutral-subtlest-hover`) can cover the active item. On a dark custom header that fill stays a light grey, so the label washes out. Restore the underline on `.active` and `.active:hover`; keep the fill for non-active hover only.
- **Grey blank-slate icons** — `--osui-blank-slate-icon-color` defaults to `--color-text-disabled` (grey) in the new theme; was closer to primary in the old theme

**Detection pattern:** a dark-mode block (`:root.dark-mode`, `:root.os-dark-theme`, `body.dark`, etc.) that overrides **3 or more** `--color-neutral-*` steps. This is the signature of a scale-flip strategy.

```
:root\.(dark-mode|os-dark-theme)[^{]*\{[^}]*--color-neutral-[0-9]+:.*--color-neutral-[0-9]+:.*--color-neutral-[0-9]+:
```

**The fix:** add explicit role overrides, mapping each role to the customer's intended grey shade — and write them at **`:root`**, not in the dark block.

The breakage is reported in dark mode, so the instinct is to fix it there. Resist that. These roles are expressed through the grey shades and the scale flips on its own, so one declaration at `:root` serves both modes. Dark-only overrides fix the reported symptom and leave light mode sitting on the framework's neutral greys — a palette the customer never chose and has never seen, because none of these roles existed in the classic theme.

```css
:root {
    /* ... the light grey shades ... */

    /* ─── Role overrides (required in the new theme) ─── */
    --color-text:                var(--color-neutral-9);   /* what classic's html used */
    --color-text-subtle:         var(--color-neutral-8);
    --color-text-subtlest:       var(--color-neutral-7);
    --color-background-surface:  var(--color-neutral-1);
    --color-border:              var(--color-neutral-3);
    --color-border-subtle:       var(--color-neutral-2);
    --token-semantics-primary-base: var(--color-neutral-10);  /* links + primary */
    --token-semantics-primary-900:  var(--color-neutral-9);   /* link/primary hover */
    --token-icon-subtlest:       var(--color-neutral-N);

    /* Wire the customer's own surface variables to their framework roles here.
       Use whatever they named it; the old framework read it by convention. */
    --color-background-header:   var(--their-header-var);
}

:root.dark-mode,
:root.os-dark-theme {
    /* ... the scale flip — every role above follows it automatically ... */

    /* Only what the grey shades cannot express belongs here: a role that deliberately
       picks a different step than light, and dark-only literals. */
    --color-text: var(--color-neutral-10);  /* pure white rather than neutral-9 */

    /* Feedback banners. Point at a grey shade or an existing custom var.
       A hex is only for a tint that is not already declared in this block. */
    --token-bg-danger-subtle-default:  var(--existing-var); /* or a hex if no variable already holds that color */
    --token-bg-success-subtle-default: var(--color-neutral-N);
    --token-bg-warning-subtle-default: var(--color-neutral-N);
    --token-bg-neutral-subtlest-hover: rgba(255, 255, 255, 0.15);
}
```

**Verify with the symmetry audit** (`SKILL.md` § 2). Any property left in the dark block that reads `var(--color-neutral-N)` rather than a literal is almost certainly a light-mode gap.

---

## There are two primary blues, and fixing one does not fix the other

`--token-semantics-primary-base` and `--token-text-primary` are separate tokens with separate defaults (`#105cef` and `#0f54da`). Re-pointing the first at `--color-primary` fixes links, the active nav item, the dropdown checkmark and the range slider's connect — which is most of what a customer reports — so it is easy to call the problem solved. `--token-text-primary` is read a further 14 times and stays blue, most visibly as the Upload pattern's "select file" label.

After any primary re-point, sweep for the other one before declaring done:

```bash
grep -nE 'var\(--token-text-primary[,)]' dist/ODC.OutSystemsUI.css
```

Prefer the component knob where one exists (`--osui-upload-color: var(--color-text)`) over re-pointing `--token-text-primary` globally — classic coloured the upload label with body text, not with primary, so the two tokens genuinely do mean different things.

## A role override is global — never copy a local rule up into one

Every role you declare at `:root` reaches every framework rule that reads it, which is far more than the widget that prompted you to declare it. The failure is seductive: you find a customer rule that styles one widget, notice a role that looks like it means the same thing, and promote the rule's values into the role. The widget you were looking at is already handled by the customer's own rule, so nothing there changes and the edit looks free — while dozens of widgets you never looked at quietly change.

The input roles are where this happens most, because customers very often restyle text inputs and the role names read as if they are about text inputs:

```css
--color-background-input   /* read 17× */
--color-border-input       /* read 46× */
```

Those reads include **checkbox, radio, switch, wizard step icon, datepicker and the dropdown popup**, not just `.form-control[data-input]`. A customer rule like `background: var(--color-neutral-2); border: none;` is a normal thing to want on a text field and a disaster as a role: promoted, it strips the ring off every checkbox and radio in the app, and the customer reports "checkboxes disappeared" with nothing in their own CSS to explain it.

Map each role to **what classic gave the widgets that read it**, not to what the customer's narrowest rule says. Then leave the customer's rule where it is — it keeps winning on its own selectors, which is exactly the scope they wanted.

Before declaring any role, count its reads and look at what they are:

```bash
grep -nE 'var\(--color-border-input[,)]' dist/ODC.OutSystemsUI.css
```

If the list contains a widget the customer's CSS never mentions, the role is the wrong place for that value.

**Icons.** Framework icons moved from `--color-neutral-6` to `--token-icon-subtlest`. App icons with class `.icon` do not read that token; set `color: var(--color-neutral-N)` on `.icon`, and `color: inherit` on icons inside buttons, colored cards, and other blocks that set their own text color. When the icon color follows the flipped grey shades, use the same `--color-neutral-N` in both modes. Use a different step in dark only when the hex must stay the same, because a flip moves that hex onto another step. Do not paste the hex.

**A color that must not flip.** The same rule applies to text or a fill on a custom block. Set `color` and, when descendants read it, `--color-text` to the `--color-neutral-N` that holds that hex in that mode. A single `var(--color-neutral-N)` on `:root` changes after the dark scale flip.

The exact grey shade for each role depends on the customer's palette. Map the four `--token-bg-*-subtle-default` feedback tokens to that palette too — the generated `.os-dark-theme` values are a different dark theme, so adding the class does not reproduce a custom brand. Use the highest-contrast readable step for text (usually the one that flipped to near-white) and the closest-to-background step for surfaces/borders. A feedback tint that is not a grey shade and not an existing custom variable keeps one hex; that hex is the definition.

**`--token-semantics-primary-base` is a shared root.** Overriding it changes both link color AND `--color-primary` (buttons, focus rings, etc.) because they all resolve through the same token. This is usually what scale-flip customers want — their `--color-primary` already points at a grey shade that flipped. But if a customer needs links and primary to diverge in dark mode, skip the token override and add a direct rule instead:

```css
.dark-mode a,
.os-dark-theme a {
    color: var(--color-neutral-10);
}
```

**Custom surface variables need wiring too.** If the customer declares custom variables like `--header-color` or `--sidebar-bg` that the old framework read by convention, these must now be wired to the framework's role variables explicitly. The new framework reads `--color-background-header`, not `--header-color`:

```css
:root {
    --color-background-header: var(--header-color);
}
```

---

## Worked example — a full scale flip, corrected

The shape of a corrected stylesheet. Roles live at `:root` so one declaration serves both modes; the dark block carries only what the grey shades cannot express.

```css
:root {
    /* Light grey shades */
    --color-neutral-0: #ffffff;
    --color-neutral-10: #101828;
    /* ... rest of the scale ... */

    /* Role overrides — required in the new theme. They belong HERE so both modes
       get them; the flip below carries them into dark at no extra cost. */
    --color-text:                   var(--color-neutral-9);
    --color-text-subtle:            var(--color-neutral-8);
    --color-text-subtlest:          var(--color-neutral-7);
    --color-background-surface:     var(--color-neutral-1);
    --color-border:                 var(--color-neutral-3);
    --color-border-subtle:          var(--color-neutral-2);
    --token-semantics-primary-base: var(--color-neutral-10);  /* links + primary */
    --token-semantics-primary-900:  var(--color-neutral-9);   /* link/primary hover */
    --token-icon-subtlest:          var(--color-neutral-6);
}

:root.dark-mode,
:root.os-dark-theme {
    /* The flip. Every role above follows it automatically. */
    --color-neutral-0: #101828;
    --color-neutral-10: #ffffff;
    /* ... rest of the scale ... */

    /* Only what cannot be expressed through the grey shades belongs here: dark-only
       literals, and roles that deliberately pick a different step than light. */
    --color-text: var(--color-neutral-10);   /* pure white rather than neutral-9 */

    --token-bg-danger-subtle-default:  #3d1a2a;
    --token-bg-success-subtle-default: #1a3d2a;
    --token-bg-warning-subtle-default: #3d3a1a;
    --token-bg-neutral-subtlest-hover: rgba(255, 255, 255, 0.15);
}
```

Wire any app-specific surface variable to its framework role at `:root` as well, using whatever the app named it:

```css
:root {
    --color-background-header: var(--app-header-color);
}
```

Then run the light/dark symmetry audit in `SKILL.md` § 2. Anything still declared only in the dark block that reads `var(--color-neutral-N)` is a light-mode gap, not a dark-mode fix.
