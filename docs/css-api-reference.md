# CSS API Reference

All `--osui-*` custom properties exposed by OutSystemsUI components for theming.
Override any property on the component's root element (or its ancestor) to customize appearance.

**Usage example:**
```css
.my-page .osui-sidebar {
  --osui-sidebar-background: #1a1a2e;
  --osui-sidebar-color: #ffffff;
}
```

---

## Table of Contents

- [Widgets](#widgets)
- [Patterns – Adaptive](#patterns-adaptive)
- [Patterns – Content](#patterns-content)
- [Patterns – Interaction](#patterns-interaction)
- [Patterns – Navigation](#patterns-navigation)
- [Patterns – Numbers](#patterns-numbers)
- [Patterns – Utilities](#patterns-utilities)

---

## Widgets

### Button (`.btn`)
_File: `src/scss/03-widgets/_btn.scss`_

| Property | Default | Notes |
|---|---|---|
| `--osui-btn-background` | `var(--token-bg-surface-default)` |  |
| `--osui-btn-color` | `var(--token-semantics-primary-base)` |  |
| `--osui-btn-border-color` | `currentColor` |  |
| `--osui-btn-border-radius` | `var(--token-border-radius-100)` |  |
| `--osui-btn-primary-background` | `var(--token-semantics-primary-base)` | Primary variant |
| `--osui-btn-primary-border-color` | `var(--token-semantics-primary-base)` |  |
| `--osui-btn-primary-color` | `var(--token-text-inverse)` |  |
| `--osui-btn-success-background` | `var(--token-semantics-success-base)` | Success variant |
| `--osui-btn-success-border-color` | `var(--token-semantics-success-base)` |  |
| `--osui-btn-success-color` | `var(--token-text-inverse)` |  |
| `--osui-btn-error-background` | `var(--token-semantics-danger-base)` | Error variant |
| `--osui-btn-error-border-color` | `var(--token-semantics-danger-base)` |  |
| `--osui-btn-error-color` | `var(--token-text-inverse)` |  |

### Button Group (`.button-group`)
_File: `src/scss/03-widgets/_button-group.scss`_

| Property | Default | Notes |
|---|---|---|
| `--osui-button-group-background` | `var(--token-bg-surface-default)` |  |
| `--osui-button-group-border-color` | `var(--token-semantics-primary-base)` |  |
| `--osui-button-group-color` | `var(--token-semantics-primary-base)` |  |

### Checkbox (`[data-checkbox]`)
_File: `src/scss/03-widgets/_checkbox.scss`_

| Property | Default | Notes |
|---|---|---|
| `--osui-checkbox-background` | `var(--token-bg-input-default)` |  |
| `--osui-checkbox-border-color` | `var(--token-border-input-default)` |  |
| `--osui-checkbox-border-radius` | `var(--token-border-radius-100)` |  |
| `--osui-checkbox-checked-color` | `var(--token-semantics-primary-base)` |  |

### Dropdown (Widget) (`.dropdown`)
_File: `src/scss/03-widgets/_dropdown.scss`_

| Property | Default | Notes |
|---|---|---|
| `--osui-dropdown-background` | `var(--token-bg-input-default)` |  |
| `--osui-dropdown-border-color` | `var(--token-border-input-default)` |  |
| `--osui-dropdown-color` | `var(--token-text-default)` |  |
| `--osui-dropdown-border-radius` | `var(--token-border-radius-100)` |  |

### Feedback Message (`.feedback-message`)
_File: `src/scss/03-widgets/_feedback-message.scss`_

| Property | Default | Notes |
|---|---|---|
| `--osui-feedback-message-background` | `transparent` |  |
| `--osui-feedback-message-color` | `var(--token-text-inverse)` |  |
| `--osui-feedback-message-border-radius` | `var(--token-border-radius-100)` |  |

### Inputs & Text Areas (`[data-input], [data-textarea]`)
_File: `src/scss/03-widgets/_inputs-and-textareas.scss`_

| Property | Default | Notes |
|---|---|---|
| `--osui-input-background` | `var(--token-bg-input-default)` |  |
| `--osui-input-border-color` | `var(--token-border-input-default)` |  |
| `--osui-input-color` | `var(--token-text-default)` |  |
| `--osui-input-border-radius` | `var(--token-border-radius-100)` |  |
| `--osui-input-focus-border-color` | `var(--token-semantics-primary-base)` |  |
| `--osui-input-error-border-color` | `var(--token-semantics-danger-base)` |  |

### List Item (`.list-item`)
_File: `src/scss/03-widgets/_list-item.scss`_

| Property | Default | Notes |
|---|---|---|
| `--osui-list-item-border-color` | `var(--token-border-default)` |  |
| `--osui-list-item-background` | `var(--token-bg-surface-default)` |  |
| `--osui-list-item-hover-background` | `var(--token-bg-neutral-subtle-default)` |  |
| `--osui-list-item-selected-background` | `var(--token-semantics-primary-base)` |  |

### Popover (`.osui-popover`)
_File: `src/scss/03-widgets/_popover.scss`_

| Property | Default | Notes |
|---|---|---|
| `--osui-popover-background` | `var(--token-bg-surface-default)` |  |
| `--osui-popover-border-color` | `var(--token-border-default)` |  |
| `--osui-popover-color` | `var(--token-text-default)` |  |
| `--osui-popover-border-radius` | `var(--token-border-radius-100)` |  |
| `--osui-popover-shadow` | `var(--token-elevation-1)` |  |

### Popup (`.popup-content`)
_File: `src/scss/03-widgets/_popup.scss`_

| Property | Default | Notes |
|---|---|---|
| `--osui-popup-background` | `var(--token-bg-surface-default)` |  |
| `--osui-popup-border-radius` | `var(--token-border-radius-100)` |  |
| `--osui-popup-shadow` | `var(--token-elevation-4)` |  |
| `--osui-popup-padding` | `var(--token-scale-600)` |  |

### Radio Button (`[data-radiobutton]`)
_File: `src/scss/03-widgets/_radio-button.scss`_

| Property | Default | Notes |
|---|---|---|
| `--osui-radio-background` | `var(--token-bg-input-default)` |  |
| `--osui-radio-border-color` | `var(--token-border-input-default)` |  |
| `--osui-radio-checked-color` | `var(--token-semantics-primary-base)` |  |

### Switch (`[data-switch]`)
_File: `src/scss/03-widgets/_switch.scss`_

| Property | Default | Notes |
|---|---|---|
| `--osui-switch-track-color` | `var(--token-border-input-default)` |  |
| `--osui-switch-track-border-color` | `var(--token-border-input-default)` |  |
| `--osui-switch-disabled-track-color` | `var(--token-bg-input-disabled)` |  |
| `--osui-switch-checked-track-color` | `var(--token-semantics-primary-base)` |  |
| `--osui-switch-thumb-color` | `var(--token-primitives-base-white)` |  |

### Table (`.table`)
_File: `src/scss/03-widgets/_table.scss`_

| Property | Default | Notes |
|---|---|---|
| `--osui-table-border-color` | `var(--token-border-default)` |  |
| `--osui-table-border-radius` | `var(--token-border-radius-100)` |  |
| `--osui-table-header-background` | `var(--token-bg-surface-default)` |  |
| `--osui-table-header-color` | `var(--token-text-subtlest)` |  |
| `--osui-table-cell-background` | `var(--token-bg-surface-default)` |  |
| `--osui-table-row-hover-background` | `var(--token-bg-input-disabled)` |  |
| `--osui-table-row-stripe-background` | `var(--token-bg-neutral-subtle-default)` |  |
| `--osui-table-sorted-color` | `var(--token-semantics-primary-base)` |  |
| `--osui-table-row-selected-background` | `var(--token-semantics-primary-base)` |  |

### Upload (`[data-upload]`)
_File: `src/scss/03-widgets/_upload.scss`_

| Property | Default | Notes |
|---|---|---|
| `--osui-upload-background` | `var(--token-bg-surface-default)` |  |
| `--osui-upload-border-color` | `var(--token-border-default)` |  |
| `--osui-upload-color` | `var(--token-text-default)` |  |
| `--osui-upload-border-radius` | `var(--token-border-radius-100)` |  |

---

## Patterns – Adaptive

### Bottom Sheet (`.osui-bottom-sheet`)
_File: `src/scss/04-patterns/01-adaptive/bottom-sheet/_bottomsheet.scss`_

| Property | Default | Notes |
|---|---|---|
| `--osui-bottom-sheet-background` | `var(--token-bg-surface-default)` |  |
| `--osui-bottom-sheet-shadow` | `var(--token-elevation-3)` |  |
| `--osui-bottom-sheet-padding` | `var(--token-scale-400)` |  |

### Master Detail (`.master-detail-content`)
_File: `src/scss/04-patterns/01-adaptive/_master-detail.scss`_

| Property | Default | Notes |
|---|---|---|
| `--osui-master-detail-background` | `var(--token-bg-surface-default)` |  |
| `--osui-master-detail-border-color` | `var(--token-border-default)` |  |
| `--osui-master-detail-border-radius` | `var(--token-border-radius-100)` |  |

---

## Patterns – Content

### Accordion Item (`.osui-accordion-item`)
_File: `src/scss/04-patterns/02-content/accordion-item/_accordion-item.scss`_

| Property | Default | Notes |
|---|---|---|
| `--osui-accordion-item-background` | `var(--token-bg-surface-default)` |  |
| `--osui-accordion-item-border-color` | `var(--token-border-default)` |  |
| `--osui-accordion-item-border-width` | `var(--token-border-size-025)` |  |
| `--osui-accordion-item-border-radius` | `var(--token-border-radius-100)` |  |
| `--osui-accordion-item-color` | `var(--token-text-default)` |  |
| `--osui-accordion-item-active-indicator-color` | `var(--token-semantics-primary-base)` |  |
| `--osui-accordion-item-icon-color` | `var(--token-semantics-primary-base)` |  |

### Alert (`.alert`)
_File: `src/scss/04-patterns/02-content/_alert.scss`_

| Property | Default | Notes |
|---|---|---|
| `--osui-alert-background` | `transparent` |  |
| `--osui-alert-color` | `var(--token-text-inverse)` |  |
| `--osui-alert-border-radius` | `var(--token-border-radius-100)` |  |
| `--osui-alert-padding` | `var(--token-scale-400)` |  |

### Blank Slate (`.blank-slate`)
_File: `src/scss/04-patterns/02-content/_blank-slate.scss`_

| Property | Default | Notes |
|---|---|---|
| `--osui-blank-slate-description-color` | `var(--token-text-default)` |  |
| `--osui-blank-slate-icon-color` | `var(--token-text-disabled)` |  |

### Card (`.card`)
_File: `src/scss/04-patterns/02-content/_card.scss`_

| Property | Default | Notes |
|---|---|---|
| `--osui-card-background` | `var(--token-bg-surface-default)` |  |
| `--osui-card-border-color` | `var(--token-border-default)` |  |
| `--osui-card-border-width` | `var(--token-border-size-025)` |  |
| `--osui-card-border-radius` | `var(--token-border-radius-100)` |  |
| `--osui-card-padding` | `var(--token-scale-600)` |  |

### Card Item (`.card-item`)
_File: `src/scss/04-patterns/02-content/_card-item.scss`_

| Property | Default | Notes |
|---|---|---|
| `--osui-card-detail-title-color` | `var(--token-text-default)` |  |
| `--osui-card-detail-text-color` | `var(--token-primitives-neutral-700)` |  |

### Carousel (`.osui-carousel`)
_File: `src/scss/04-patterns/02-content/carousel/_carousel.scss`_

| Property | Default | Notes |
|---|---|---|
| `--osui-carousel-arrow-background` | `var(--token-bg-surface-default)` |  |
| `--osui-carousel-arrow-shadow` | `var(--token-elevation-1)` |  |
| `--osui-carousel-arrow-icon-color` | `var(--token-primitives-neutral-700)` |  |
| `--osui-carousel-pagination-active-color` | `var(--token-semantics-primary-base)` |  |

### Chat Message (`.osui-chat-message`)
_File: `src/scss/04-patterns/02-content/_chat-message.scss`_

| Property | Default | Notes |
|---|---|---|
| `--osui-chat-message-background` | `var(--token-primitives-neutral-300)` |  |
| `--osui-chat-message-border-radius` | `var(--token-border-radius-100)` |  |
| `--osui-chat-message-sent-background` | `var(--token-semantics-primary-base)` |  |
| `--osui-chat-message-sent-color` | `var(--token-text-inverse)` |  |

### List Item Content (`.list-item-content`)
_File: `src/scss/04-patterns/02-content/_list-item-content.scss`_

| Property | Default | Notes |
|---|---|---|
| `--osui-list-item-content-title-color` | `var(--token-text-default)` |  |
| `--osui-list-item-content-text-color` | `var(--token-primitives-neutral-700)` |  |

### Section (`.section`)
_File: `src/scss/04-patterns/02-content/_section.scss`_

| Property | Default | Notes |
|---|---|---|
| `--osui-section-title-color` | `var(--token-text-default)` |  |
| `--osui-section-title-border-color` | `var(--token-border-default)` |  |

### Tag (`.tag`)
_File: `src/scss/04-patterns/02-content/_tag.scss`_

| Property | Default | Notes |
|---|---|---|
| `--osui-tag-color` | `var(--token-text-inverse)` |  |
| `--osui-tag-primary-color` | `var(--token-semantics-primary-base)` |  |
| `--osui-tag-on-light-color` | `var(--token-text-default)` |  |

### User Avatar (`.user-initials`)
_File: `src/scss/04-patterns/02-content/_user-avatar.scss`_

| Property | Default | Notes |
|---|---|---|
| `--osui-avatar-color` | `var(--token-text-inverse)` |  |
| `--osui-avatar-primary-color` | `var(--token-semantics-primary-base)` |  |
| `--osui-avatar-on-light-color` | `var(--token-text-default)` |  |

---

## Patterns – Interaction

### Action Sheet (`.osui-action-sheet`)
_File: `src/scss/04-patterns/03-interaction/_action-sheet.scss`_

| Property | Default | Notes |
|---|---|---|
| `--osui-action-sheet-background` | `var(--token-bg-surface-default)` |  |
| `--osui-action-sheet-cancel-color` | `var(--token-text-subtlest)` |  |
| `--osui-action-sheet-overlay-background` | `var(--token-backdrop)` |  |

### Animated Label (`.osui-animated-label`)
_File: `src/scss/04-patterns/03-interaction/animated-label/_animated-label.scss`_

| Property | Default | Notes |
|---|---|---|
| `--osui-animated-label-color` | `var(--token-text-subtlest)` |  |
| `--osui-animated-label-border-color` | `var(--token-border-input-default)` |  |
| `--osui-animated-label-focus-border-color` | `var(--token-semantics-primary-base)` |  |

### Balloon (`.osui-balloon`)
_File: `src/scss/04-patterns/03-interaction/balloon/_balloon.scss`_

| Property | Default | Notes |
|---|---|---|
| `--osui-balloon-background` | `var(--token-bg-surface-default)` |  |

### Date Picker (`.osui-datepicker`)
_File: `src/scss/04-patterns/03-interaction/date-picker/_datepicker.scss`_

| Property | Default | Notes |
|---|---|---|
| `--osui-datepicker-disabled-background` | `var(--token-bg-input-disabled)` |  |
| `--osui-datepicker-disabled-border-color` | `var(--token-border-default)` |  |
| `--osui-datepicker-disabled-color` | `var(--token-text-disabled)` |  |

### Dropdown (`.osui-dropdown`)
_File: `src/scss/04-patterns/03-interaction/dropdown/_dropdown.scss`_

| Property | Default | Notes |
|---|---|---|
| `--osui-dropdown-disabled-background` | `var(--token-bg-input-disabled)` |  |
| `--osui-dropdown-disabled-border-color` | `var(--token-border-default)` |  |
| `--osui-dropdown-disabled-color` | `var(--token-text-disabled)` |  |

### Dropdown Server Side (`.osui-dropdown-serverside`)
_File: `src/scss/04-patterns/03-interaction/dropdown/_dropdown-serverside.scss`_

| Property | Default | Notes |
|---|---|---|
| `--osui-dropdown-ss-background` | `var(--token-bg-surface-default)` |  |
| `--osui-dropdown-ss-border-color` | `var(--token-border-input-default)` |  |
| `--osui-dropdown-ss-color` | `var(--token-text-default)` |  |
| `--osui-dropdown-ss-disabled-background` | `var(--token-bg-input-disabled)` |  |
| `--osui-dropdown-ss-disabled-color` | `var(--token-text-disabled)` |  |

### Dropdown Server Side Item (`.osui-dropdown-serverside-item`)
_File: `src/scss/04-patterns/03-interaction/dropdown/_dropdownserversideitem.scss`_

| Property | Default | Notes |
|---|---|---|
| `--osui-dropdown-item-background` | `transparent` |  |
| `--osui-dropdown-item-color` | `var(--token-text-default)` |  |
| `--osui-dropdown-item-hover-bg` | `var(--token-bg-neutral-subtle-default)` |  |

### Floating Actions (`.osui-floating-actions`)
_File: `src/scss/04-patterns/03-interaction/_floating-actions.scss`_

| Property | Default | Notes |
|---|---|---|
| `--osui-floating-actions-button-background` | `var(--token-semantics-primary-base)` |  |
| `--osui-floating-actions-button-color` | `var(--token-text-inverse)` |  |
| `--osui-floating-actions-button-shadow` | `var(--token-elevation-4)` |  |
| `--osui-floating-actions-item-background` | `var(--token-bg-surface-default)` |  |
| `--osui-floating-actions-item-color` | `var(--token-semantics-primary-base)` |  |

### Input With Icon (`.input-with-icon`)
_File: `src/scss/04-patterns/03-interaction/_input-with-icon.scss`_

| Property | Default | Notes |
|---|---|---|
| `--osui-input-with-icon-icon-color` | `var(--token-primitives-neutral-700)` |  |
| `--osui-input-with-icon-icon-hover-color` | `var(--token-text-subtlest)` |  |

### Month Picker (`.osui-monthpicker`)
_File: `src/scss/04-patterns/03-interaction/month-picker/_monthpicker.scss`_

| Property | Default | Notes |
|---|---|---|
| `--osui-monthpicker-disabled-background` | `var(--token-bg-input-disabled)` |  |
| `--osui-monthpicker-disabled-border-color` | `var(--token-border-default)` |  |
| `--osui-monthpicker-disabled-color` | `var(--token-text-disabled)` |  |

### Notification (`.osui-notification`)
_File: `src/scss/04-patterns/03-interaction/notification/_notification.scss`_

| Property | Default | Notes |
|---|---|---|
| `--osui-notification-background` | `var(--token-bg-surface-default)` |  |
| `--osui-notification-border-color` | `var(--token-border-default)` |  |
| `--osui-notification-border-width` | `var(--token-border-size-025)` |  |
| `--osui-notification-border-radius` | `var(--token-border-radius-100)` |  |
| `--osui-notification-shadow` | `var(--token-elevation-4)` |  |
| `--osui-notification-color` | `var(--token-text-default)` |  |
| `--osui-notification-padding` | `var(--token-scale-600)` |  |

### Overflow Menu (`.osui-overflow-menu`)
_File: `src/scss/04-patterns/03-interaction/overflow-menu/_overflowmenu.scss`_

| Property | Default | Notes |
|---|---|---|
| `--osui-overflow-menu-background` | `var(--token-bg-surface-default)` |  |
| `--osui-overflow-menu-shadow` | `var(--token-elevation-2)` |  |
| `--osui-overflow-menu-color` | `var(--token-text-default)` |  |
| `--osui-overflow-menu-trigger-active-bg` | `var(--token-bg-neutral-subtle-default)` |  |

### Range Slider (`.osui-range-slider`)
_File: `src/scss/04-patterns/03-interaction/range-slider/_rangeslider.scss`_

| Property | Default | Notes |
|---|---|---|
| `--osui-range-slider-track-color` | `var(--token-border-input-default)` |  |
| `--osui-range-slider-handle-background` | `var(--token-bg-surface-default)` |  |
| `--osui-range-slider-handle-border-color` | `var(--token-border-input-default)` |  |
| `--osui-range-slider-handle-shadow` | `var(--token-elevation-1)` |  |
| `--osui-range-slider-disabled-track-color` | `var(--token-bg-neutral-subtle-default)` |  |
| `--osui-range-slider-disabled-color` | `var(--token-text-disabled)` |  |

### Stacked Cards (`.osui-stacked-cards`)
_File: `src/scss/04-patterns/03-interaction/_stacked-cards.scss`_

| Property | Default | Notes |
|---|---|---|
| `--osui-stacked-cards-background` | `var(--token-bg-surface-default)` |  |
| `--osui-stacked-cards-overlay-color` | `var(--token-text-inverse)` |  |
| `--osui-stacked-cards-overlay-top-background` | `var(--token-semantics-info-base)` |  |
| `--osui-stacked-cards-overlay-right-background` | `var(--token-semantics-success-base)` |  |
| `--osui-stacked-cards-overlay-left-background` | `var(--token-semantics-danger-base)` |  |

### Time Picker (`.osui-timepicker`)
_File: `src/scss/04-patterns/03-interaction/time-picker/_timepicker.scss`_

| Property | Default | Notes |
|---|---|---|
| `--osui-timepicker-disabled-background` | `var(--token-bg-input-disabled)` |  |
| `--osui-timepicker-disabled-border-color` | `var(--token-border-default)` |  |
| `--osui-timepicker-disabled-color` | `var(--token-text-disabled)` |  |

### Tooltip (`.osui-tooltip`)
_File: `src/scss/04-patterns/03-interaction/tooltip/_tooltip.scss`_

| Property | Default | Notes |
|---|---|---|
| `--osui-tooltip-background` | `var(--token-text-default)` |  |
| `--osui-tooltip-color` | `var(--token-text-inverse)` |  |
| `--osui-tooltip-border-radius` | `var(--token-border-radius-100)` |  |
| `--osui-tooltip-padding` | `var(--token-scale-200)` |  |
| `--osui-tooltip-font-size` | `var(--token-font-size-350)` |  |

---

## Patterns – Navigation

### Bottom Bar Item (`.bottom-bar-item`)
_File: `src/scss/04-patterns/04-navigation/_bottom-bar-item.scss`_

| Property | Default | Notes |
|---|---|---|
| `--osui-bottom-bar-background` | `var(--token-bg-surface-default)` |  |
| `--osui-bottom-bar-border-color` | `var(--token-primitives-neutral-300)` |  |
| `--osui-bottom-bar-item-color` | `var(--token-text-subtlest)` |  |
| `--osui-bottom-bar-item-active-color` | `var(--token-semantics-primary-base)` |  |

### Breadcrumbs (`.breadcrumbs`)
_File: `src/scss/04-patterns/04-navigation/_breadcrumbs.scss`_

| Property | Default | Notes |
|---|---|---|
| `--osui-breadcrumbs-item-color` | `var(--token-text-subtlest)` |  |
| `--osui-breadcrumbs-separator-color` | `var(--token-primitives-neutral-700)` |  |

### Pagination (`.pagination`)
_File: `src/scss/04-patterns/04-navigation/_pagination.scss`_

| Property | Default | Notes |
|---|---|---|
| `--osui-pagination-button-background` | `var(--token-bg-surface-default)` |  |
| `--osui-pagination-button-border-color` | `var(--token-border-default)` |  |
| `--osui-pagination-button-color` | `var(--token-text-subtlest)` |  |
| `--osui-pagination-button-hover-background` | `var(--token-bg-neutral-subtle-default)` |  |
| `--osui-pagination-active-color` | `var(--token-semantics-primary-base)` |  |

### Section Index (`.osui-section-index`)
_File: `src/scss/04-patterns/04-navigation/section-index/_sectionindex.scss`_

| Property | Default | Notes |
|---|---|---|
| `--osui-section-index-border-color` | `var(--token-border-default)` |  |
| `--osui-section-index-item-color` | `var(--token-text-subtlest)` |  |
| `--osui-section-index-item-active-color` | `var(--token-text-default)` |  |
| `--osui-section-index-active-indicator-color` | `var(--token-semantics-primary-base)` |  |

### Sidebar (`.osui-sidebar`)
_File: `src/scss/04-patterns/04-navigation/sidebar/_sidebar.scss`_

| Property | Default | Notes |
|---|---|---|
| `--osui-sidebar-background` | `var(--token-bg-surface-default)` |  |
| `--osui-sidebar-color` | `var(--token-text-default)` |  |
| `--osui-sidebar-shadow` | `var(--token-elevation-3)` |  |
| `--osui-sidebar-padding-x` | `var(--token-scale-600)` |  |
| `--osui-sidebar-padding-y` | `var(--token-scale-400)` |  |

### Submenu (`.osui-submenu`)
_File: `src/scss/04-patterns/04-navigation/submenu/_submenu.scss`_

| Property | Default | Notes |
|---|---|---|
| `--osui-submenu-items-background` | `var(--token-bg-surface-default)` |  |
| `--osui-submenu-items-border-color` | `var(--token-border-default)` |  |
| `--osui-submenu-items-shadow` | `var(--token-elevation-2)` |  |
| `--osui-submenu-item-color` | `var(--token-text-subtlest)` |  |
| `--osui-submenu-header-color` | `var(--token-text-default)` |  |
| `--osui-submenu-active-border-color` | `var(--osui-submenu-active-border-color)` |  |

### Tabs (`.osui-tabs`)
_File: `src/scss/04-patterns/04-navigation/tabs/_tabs.scss`_

| Property | Default | Notes |
|---|---|---|
| `--osui-tabs-border-color` | `var(--token-border-default)` |  |
| `--osui-tabs-header-item-color` | `var(--token-text-subtlest)` |  |
| `--osui-tabs-header-item-color-active` | `var(--token-text-default)` |  |
| `--osui-tabs-header-item-color-disabled` | `var(--token-text-disabled)` |  |
| `--osui-tabs-indicator-color` | `var(--token-semantics-primary-base)` |  |

### Timeline (`.timeline`)
_File: `src/scss/04-patterns/04-navigation/_timeline.scss`_

| Property | Default | Notes |
|---|---|---|
| `--osui-timeline-line-color` | `var(--token-bg-neutral-base-default)` |  |
| `--osui-timeline-icon-color` | `var(--token-text-inverse)` |  |
| `--osui-timeline-text-color` | `var(--token-text-subtlest)` |  |

### Wizard (`.wizard`)
_File: `src/scss/04-patterns/04-navigation/_wizard.scss`_

| Property | Default | Notes |
|---|---|---|
| `--osui-wizard-icon-background` | `var(--token-bg-surface-default)` |  |
| `--osui-wizard-icon-border-color` | `var(--token-border-input-default)` |  |
| `--osui-wizard-icon-color` | `var(--token-primitives-neutral-700)` |  |
| `--osui-wizard-label-color` | `var(--token-primitives-neutral-700)` |  |
| `--osui-wizard-active-color` | `var(--token-semantics-primary-base)` |  |
| `--osui-wizard-past-background` | `var(--token-semantics-primary-base)` |  |
| `--osui-wizard-past-color` | `var(--token-text-inverse)` |  |
| `--osui-wizard-connector-color` | `var(--token-bg-neutral-base-default)` |  |

---

## Patterns – Numbers

### Badge (`.badge`)
_File: `src/scss/04-patterns/05-numbers/_badge.scss`_

| Property | Default | Notes |
|---|---|---|
| `--osui-badge-color` | `var(--token-text-inverse)` |  |
| `--osui-badge-primary-color` | `var(--token-semantics-primary-base)` |  |
| `--osui-badge-on-light-color` | `var(--token-text-default)` |  |

### Rating (`.osui-rating`)
_File: `src/scss/04-patterns/05-numbers/rating/_rating.scss`_

| Property | Default | Notes |
|---|---|---|
| `--osui-rating-disabled-color` | `var(--token-text-disabled)` |  |
| `--osui-rating-disabled-empty-color` | `var(--token-border-default)` |  |

---

## Patterns – Utilities

### Provider Login Button (`.provider-login-button`)
_File: `src/scss/04-patterns/06-utilities/_provider-login-button.scss`_

| Property | Default | Notes |
|---|---|---|
| `--osui-provider-login-button-background` | `var(--token-bg-surface-default)` |  |
| `--osui-provider-login-button-border-color` | `var(--token-border-input-default)` |  |
| `--osui-provider-login-button-color` | `var(--token-primitives-neutral-700)` |  |

### Separator (`.separator`)
_File: `src/scss/04-patterns/06-utilities/_separator.scss`_

| Property | Default | Notes |
|---|---|---|
| `--osui-separator-color` | `var(--token-semantics-primary-base)` |  |

---
