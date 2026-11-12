# ADR-0022: Strict parsing and a visible invalid state for typed dates in the Date/Time pickers

## Status

Proposed

## Context

DatePicker, DatePickerRange, MonthPicker and TimePicker can accept typed input (`SetEditableInput`). The typed
text is parsed by Flatpickr against `altFormat` when the input loses focus or Enter is pressed. OutSystems UI
loads Flatpickr from the OutSystems fork (`OutSystems/flatpickr`, based on 4.6.13), which already carries
OutSystems UI fixes in this code (ROU-10854: case-insensitive month and weekday names and the Enter key;
ROU-12898: change detection on blur).

The default parser is lenient in four ways:

- Every literal in the format (`-`, `/`, space) becomes `.` in the regex, so it matches any character.
- The regex is not anchored, and a token that does not match is skipped without an error.
- Values are applied with `Date` setters, which roll over: with `DD-MM-YYYY`, typing `23062024` reads day
  `23`, month `62` and no year, and is saved as 23-02-2029.
- A typed date that parses but is disabled or outside `MinDate`/`MaxDate` is dropped from the selection,
  so the value is cleared without notice. In Range mode, one bad side leaves a partial selection.

In every case the bound variable gets a different date or no date, and the end user is not told. This has
been reported in the community forum, by MVPs, and in a customer escalation with financial impact
(ROU-12031, RPM-5943). The workaround given to customers is an application-level `parseDate` passed through
`DatePickerAPI.SetProviderConfigs`.

## Decision Drivers

- A typed date is never saved as a different date than the one the user typed.
- The end user is told when the typed text is not accepted (WCAG 3.3.1 Error identification), and the
  developer can react (for example set `Valid` and `ValidationMessage` on the input).
- Parsing of values that do not come from typing (InitialDate, MinDate, MaxDate, DisabledDays,
  `UpdateInitialDate`) does not change.
- Applications that already pass their own `parseDate` keep working.
- The same behaviour for all four pickers.
- The platform keeps owning the `not-valid` class and the validation message (same principle as ADR-0002).

## Considered Options

- Option 1 — Strict `parseDate` set by OutSystems UI in the provider configs
    - Pros: no change to the Flatpickr fork; only this repository and the OutSystems UI modules change.
    - Cons: `parseDate` is used for every parse, so the strict check has to tell typed text apart by
      comparing the format with `altFormat`, and pass everything else to `flatpickr.parseDate` with the
      locale. It cannot see dates dropped because they are disabled or out of range. Keeping the typed text
      means writing it back after Flatpickr has cleared the input. An application's own `parseDate`
      replaces it completely.
- Option 2 — Opt-in strict input parsing and an invalid-input hook in the Flatpickr fork, wired by OutSystems UI
    - Pros: fixed in the library where the parsing happens, and only on the typing paths (blur, Enter). It
      knows both failure reasons (cannot be parsed, or disabled/out of range). Range input is accepted or
      rejected as a whole. The typed text is kept without a second write. The parser is covered by the
      fork's unit tests. New options are off by default, so the fork's other behaviour is unchanged.
    - Cons: one more delivery step (fork release, and a new Flatpickr script in the O11 and ODC modules).
      The fork moves further away from upstream Flatpickr, which has had no release since 4.6.13.
- Option 3 — Input mask built from `DateFormat`
    - Pros: wrong text cannot be typed.
    - Cons: does not fit month and weekday names, locales, Range input or pasted text; needs a new dependency
      or a lot of custom code.
- Option 4 — Documentation and a sample with the application-level `parseDate` only
    - Pros: no code change.
    - Cons: the default behaviour still saves wrong dates without telling the user.

## Decision Outcome

Chosen option: "Option 2", because it is the only option that covers both silent paths (lenient parsing and
dropped disabled or out-of-range dates) and keeps parsing of non-typed values unchanged without a workaround.

The library side (parser rules, option names and defaults) is recorded in the fork's own ADR
(`OutSystems/flatpickr`, `docs/adr/ADR-0001`). This ADR records how OutSystems UI uses it.

- **Off by default, turned on per picker.** New boolean config `StrictInputValidation` (default `False`) on
  DatePicker, DatePickerRange, MonthPicker and TimePicker. In the modules it is a new field of the block's
  `OptionalConfigs` structure (MonthPicker has no such structure yet, so it needs one or a new block
  parameter). When it is off, typed input behaves exactly as before. Changing it at runtime redraws the
  picker.
- **One switch.** `StrictInputValidation` is the only parameter the developer sees. When it is on, the
  configs turn on `strictInputParsing`, `keepInvalidInput` and `autoCorrectInput` together;
  `onInvalidInput` is always registered (the fork only fires it when an option is on). This goes through the
  shared helper `Providers.OSUI.SharedProviderResources.Flatpickr.InvalidInput`. `keepInvalidInput` and
  `autoCorrectInput` are not exposed as parameters: clearing rejected text only makes the user retype it (and
  `OnInvalidInput` already gives the typed text to a developer who wants to clear it), and the correction
  only accepts text that can be read one way. These configs are merged before the ones an application passes
  with `SetProviderConfigs`, so an application can still override each option (advanced use) or replace the
  parser with its own `parseDate`.
- **Auto-correction before rejection.** A date typed without separators, with full-width values
  (`13122020` for `DD-MM-YYYY`), or with other separators (`13/12/2020`), is rebuilt with the format's
  separators (`13-12-2020`) before it is checked. Single-digit days or months without separators are not
  accepted, so nothing is guessed. It only applies to full numeric dates (DatePicker and DatePickerRange,
  with or without time); the fork leaves month/year formats, time-only pickers, names and AM/PM alone.
- **Invalid state.** On `onInvalidInput` the provider sets `aria-invalid="true"` on the input the user types
  in and the modifier class `osui-datepicker--invalid-input` (`osui-monthpicker--…`, `osui-timepicker--…`)
  on the pattern. The SCSS gives that input the danger border. The state is removed on the next `onChange`
  (a valid selection, or `Clear`) and when the provider is redrawn (for example after `UpdateInitialDate`
  or a parameter change). The `not-valid` class is not used, because the platform owns it and it is removed
  on redraw.
- **Platform event.** New event `OnInvalidInput` on DatePicker and DatePickerRange with the picker id, an
  error code, the typed text and the reason (`unparsable` or `disabled`). The error code is `OSUI-PRO-02002`
  (`Providers.OSUI.Datepicker.Flatpickr.ErrorCodes.InvalidTypedInput`), without a message: OutSystems UI
  shows no message of its own, the developer sets the validation message. `onChange` with an empty value
  fires first, then `OnInvalidInput`.
- **MonthPicker and TimePicker.** Not part of this change: their providers do not set the invalid state or
  trigger `OnInvalidInput`.
- **After rejected input.** The typed text stays in the input so the user can correct it, and the value is
  empty. Blurring again without editing the text does not fire the event again.
- **Range.** The typed text must contain both dates; a single date is rejected as `unparsable`.
- **OutSystems UI modules (O11 and ODC).** New Flatpickr script, `StrictInputValidation` in the
  `OptionalConfigs` of DatePicker and DatePickerRange, and the new block event `OnInvalidInput` on both.

Positive consequences:

- Typed text is either saved as the date the user typed or rejected, with a visible and announced state.
- Developers can show their own message through the platform validation.
- InitialDate, MinDate, MaxDate and DisabledDays parsing is unchanged.
- An application `parseDate` passed through `SetProviderConfigs` replaces the strict parser, so the existing
  workaround keeps working (disabled and out-of-range typed dates are still reported).

Negative consequences:

- Applications keep the lenient behaviour until a developer turns `StrictInputValidation` on, picker by
  picker. When it is on, typed text that used to be accepted through rollover or partial matching (for
  example digits without separators) is rejected, and a typed disabled or out-of-range date shows as invalid
  instead of being cleared silently.
- The OutSystems UI JavaScript and the Flatpickr script must ship together in the same module version. With
  an older Flatpickr script the new options are ignored and the pickers behave as before.
- Further divergence of the fork from upstream Flatpickr.

Decisions taken in the implementation, to confirm before the status changes to Accepted:

- Rejected input keeps the typed text with an empty value (instead of clearing both, or going back to the
  previous date).
- The event carries an error code and no default message (a message would need translations).
- Strict parsing is off by default and turned on with `StrictInputValidation` (agreed in the team
  discussion on ROU-11357).
- `StrictInputValidation` is the single switch; it also turns on keeping the typed text and the
  auto-correction, which are not exposed as parameters.
- MonthPicker and TimePicker are left out of this change.
- Disabled and out-of-range typed dates are reported as invalid.
- The Enter key behaviour (ROU-11455) is left to its own ticket.

## Links

- ROU-11357 (this decision), ROU-13210 (input mask follow-up), ROU-11455, ROU-10854, ROU-12898, ROU-12031, RPM-5943
- Flatpickr fork: https://github.com/OutSystems/flatpickr (`docs/adr/ADR-0001`)
- Upstream issue about lenient parsing: https://github.com/flatpickr/flatpickr/issues/2444
- ADR-0002 (validation ownership)

## Date

2026-11-12
