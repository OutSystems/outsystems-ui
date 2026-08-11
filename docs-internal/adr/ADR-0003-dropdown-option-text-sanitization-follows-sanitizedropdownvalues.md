<!-- This ADR revises the option text sanitization decision taken in ADR-0002 (section B) -->

# ADR-0003: Dropdown Option Text Sanitization Follows SanitizeDropdownValues

## Status

Accepted (supersedes section B of ADR-0002)

## Context

OSUI's Dropdown exposes `SanitizeDropdownValues`, which `getProviderConfig()` forwards to VirtualSelect as `enableSecureText`. Alongside it, `getProviderConfig()` also ran `OSFramework.OSUI.Helper.Sanitize()` over the option `label` and, since ADR-0002, over `description` - unconditionally, whatever the property was set to. A follow-up review of the grouped Dropdown added `group_name` to that list for the same reason, since it becomes the group's rendered title.

Reading VirtualSelect 1.4.0 rather than the 1.1.0 in `node_modules` shows the unconditional pass sits on the wrong side of the property in both of its positions:

- With `SanitizeDropdownValues` **True**, `prepareOption()` already runs every option label - group titles included, since they go through the same function - and every description through `secureText()` before storing them, and escapes them again at each attribute boundary it writes (`aria-label` through `getAriaLabelText()`, `data-tooltip` through `getAttributesText()`, `data-value` through `escapeAttributeValue()`). OSUI's pass is redundant.
- With `SanitizeDropdownValues` **False**, the library escapes nothing. OSUI's pass is then the only thing acting - overriding an app that explicitly asked for its markup to render.

The two escaping strategies are also not equivalent. `Helper.Sanitize()` substitutes `<` and `>` for `‹` and `›` and never undoes it, so the substitution reaches the app back through `getSelectedValues()`, is announced as a guillemet by assistive technology, and makes the text unsearchable because the label the library stores is the substituted one. The library escapes to HTML entities, derives `labelNormalized` from the raw text so search still matches what the developer authored, and decodes the entities back through `decodeSecureText()` when building accessible names.

`image_url_or_class` is a separate case: it is OSUI's own field, consumed by our `labelRenderer` and never passed to the library, so no value of `SanitizeDropdownValues` has ever protected it.

## Decision Drivers

-   `SanitizeDropdownValues` should determine whether option text is sanitized; today both settings end up escaped and only the style differs.
-   Apps that render markup in labels, descriptions or group names must keep working when they leave the property False.
-   When an app opts in with True, every text field must be escaped, including the group title.
-   Escaping must not degrade search or the accessible name.
-   Values an app hands in should come back from `getSelectedValues()` as provided.

## Considered Options

-   Option 1: Keep the unconditional `Helper.Sanitize()` pass (ADR-0002 section B)
    -   Pros: Secure whatever the property is set to; no app change needed; consistent with the long-standing `label` treatment.
    -   Cons: Ignores the property in both positions; markup in `group_name`, `label` and `description` stops rendering for apps that opted out; the `‹`/`›` substitution is lossy in `getSelectedValues()`, unsearchable and mis-announced.
-   Option 2: Gate the OSUI pass on `SanitizeDropdownValues` and let the library escape (Chosen)
    -   Pros: The property means what it says; no behaviour change for apps leaving it False; when True the library's escaping is complete and better - entities rather than lookalikes, search on the raw text, accessible names decoded; `getSelectedValues()` returns what the app provided.
    -   Cons: The default (False) renders markup, so an app taking untrusted data into option text is unprotected until it sets the property or the default is flipped.
-   Option 3: Keep the pass unconditional but escape to entities instead of lookalike characters
    -   Pros: Secure by default; fixes the announcement and round-trip artefacts.
    -   Cons: Still ignores the property; markup still stops rendering; changes `getSelectedValues()` shape a second time for data already stored in the ADR-0002 form.

## Decision Outcome

Chosen option: "Option 2", because it is the only one under which the property controls the behaviour it names, and because the library's escaping is strictly better than ours everywhere the two overlap.

-   **Remove the `Helper.Sanitize()` pass** over `label`, `description` and `group_name` from `getProviderConfig()`, `_groupOptions()` and `_getGroupedOptionsList()`. Escaping option text is `enableSecureText`'s job, which `SanitizeDropdownValues` already maps to.
-   **Keep building the icon and image prefixes through the DOM**, unconditionally. `image_url_or_class` reaches an attribute OSUI writes itself and no library setting covers it.
-   **Leave `group_name` untouched as the grouping key.** With no sanitization applied to it, two group names differing only by their angle brackets can no longer collapse into one group.

Positive consequences:

-   Apps leaving `SanitizeDropdownValues` False keep the behaviour they have today, including markup in group titles, labels and descriptions.
-   Apps setting it True get every text field escaped, the group title included, with search and accessible names intact.
-   `getSelectedValues()` returns `label`, `description` and `group_name` exactly as the app provided them, removing the ADR-0002 round-trip and persisted-data concern.
-   The option icon and image can no longer break out of the `class` and `src` attributes, in either setting.

Negative consequences:

-   The default configuration renders markup found in option text. An app taking untrusted data into a label, description or group name must set `SanitizeDropdownValues` to True. Flipping that default remains the durable fix and stays a platform decision, as ADR-0002 recorded.
-   Apps that adopted the ADR-0002 behaviour and persisted descriptions in the `‹`/`›` form keep that stored text; nothing rewrites it.

### Changes Made

| File | Change | Rationale |
|------|--------|-----------|
| `src/scripts/Providers/OSUI/Dropdown/VirtualSelect/AbstractVirtualSelectConfig.ts` | Remove the `Helper.Sanitize()` pass over `label`, `description` and `group_name` | Let `SanitizeDropdownValues` control sanitization through `enableSecureText` |
| `src/scripts/Providers/OSUI/Dropdown/VirtualSelect/AbstractVirtualSelectConfig.ts` | Build the icon and image prefixes with `createElement` + `outerHTML` | `image_url_or_class` reaches an attribute OSUI writes itself, which no library setting covers |
| `src/scripts/OSFramework/OSUI/GlobalEnum.ts` | Add `Icon`/`Image` to `HTMLElement` and `Src` to `HTMLAttributes` | Support building those elements without literal strings |

## Links

-   JIRA Epic: [ROU-12946](https://outsystemsrd.atlassian.net/browse/ROU-12946)
-   Supersedes: section B of [ADR-0002](./ADR-0002-virtualselect-140-upgrade-and-osui-validation-ownership.md)
-   VirtualSelect 1.4.0 escaping: `prepareOption()`, `secureText()`, `Utils.getAriaLabelText()`, `Utils.getAttributesText()`, `Utils.escapeAttributeValue()`, `Utils.decodeSecureText()`

## Date

2026-08-12
