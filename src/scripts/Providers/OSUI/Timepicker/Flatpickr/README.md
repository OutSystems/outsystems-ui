# <img alt="Flatpickr" src="https://flatpickr.js.org/images/logo.png" width="24"> Flatpickr · ![flatpickr version](https://img.shields.io/badge/version-4.6.13-informational)

All info about this Provider <a href="https://flatpickr.js.org/">here</a>.

The Fork in use on OSUI context is <a href="https://github.com/OutSystems/flatpickr/">github/OutSystems/flatpickr</a>.

Typed input (`SetEditableInput`) can be validated strictly with the `StrictInputValidation` config (off by default). When it is on, the fork options `strictInputParsing` and `keepInvalidInput` are turned on: text that does not match the date format, or a date that is disabled or out of range, is rejected and reported through the `OnInvalidInput` event instead of being saved as another date, and the typed text is kept. When it is off, typed input behaves as before. See `docs-internal/adr/ADR-0022-strict-typed-date-parsing-and-invalid-state.md`.
