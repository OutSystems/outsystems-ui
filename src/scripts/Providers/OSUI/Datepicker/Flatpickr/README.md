# <img alt="Flatpickr" src="https://flatpickr.js.org/images/logo.png" width="24"> Flatpickr · ![flatpickr version](https://img.shields.io/badge/version-v4.6.13-informational)

All info about this Provider <a href="https://flatpickr.js.org/">here</a>.

The Fork in use on OSUI context is <a href="https://github.com/OutSystems/flatpickr/">github/OutSystems/flatpickr</a>.

Typed input (`SetEditableInput`) can be validated strictly with the `StrictInputValidation` config (off by default). It is the only switch: when it is on, the fork options `strictInputParsing`, `keepInvalidInput` and `autoCorrectInput` are all turned on. A date typed without separators, or with other ones, is first rebuilt with the format's separators when it can only be read one way (e.g. `13122020` becomes `13-12-2020` for `DD-MM-YYYY`). Text that still does not match the date format, or a date that is disabled or out of range, is rejected and reported through the `OnInvalidInput` event (error code `OSUI-PRO-02002`) instead of being saved as another date, and the typed text is kept. When it is off, typed input behaves as before. The fork options can still be overridden one by one through `SetProviderConfigs` (advanced use). See `docs-internal/adr/ADR-0022-strict-typed-date-parsing-and-invalid-state.md`.
