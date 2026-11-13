# ADR-0022: Strict parsing and a visible invalid state for typed dates in the Date/Time pickers

## Status

Proposed

## Context

DatePicker, DatePickerRange, MonthPicker and TimePicker can accept typed input (`SetEditableInput`). The typed
text is parsed by Flatpickr against `altFormat` when the input loses focus, Enter is pressed, or the user clicks
outside the open calendar. OutSystems UI
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
- Existing applications keep their current behaviour until a developer opts in.
- Parsing of values that do not come from typing (InitialDate, MinDate, MaxDate, DisabledDays,
  `UpdateInitialDate`) does not change.
- Applications that already pass their own `parseDate` keep working.
- Simple developer experience: as few new parameters as possible.
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
    - Pros: fixed in the library where the parsing happens, and only on the typing paths (blur, Enter,
      clicking outside the open calendar). It knows every failure reason (cannot be parsed, out of range,
      disabled). Range input is accepted or
      rejected as a whole. The typed text is kept without a second write. The parser is covered by the
      fork's unit tests. New options are off by default, so the fork's other behaviour is unchanged.
    - Cons: one more delivery step (fork release, and a new Flatpickr script in the O11 and ODC modules).
      The fork moves further away from upstream Flatpickr, which has had no release since 4.6.13.
- Option 3 — Input mask built from `DateFormat`, inside the pickers
    - Pros: wrong text cannot be typed, and the user sees the expected format while typing.
    - Cons: does not fit month and weekday names, locales, Range input or pasted text; needs a new dependency
      or a lot of custom code in the framework for an edge case.
- Option 4 — Documentation and a sample with the application-level `parseDate` only
    - Pros: no code change.
    - Cons: the default behaviour still saves wrong dates without telling the user.
- Option 5 — Auto-correct typed input before rejecting it (complement to Option 2)
    - Pros: dates typed without separators (`13122020`), with other ones (`13/12/2020`) or a mix of both
      (`12122020 15:20`) are accepted when they can only be read one way, so fewer users meet the error at
      all. No mask and no second provider.
    - Cons: one more rule set in the fork; a correction that guessed would recreate the original problem, so
      the rules must stay strict (see below).

## Decision Outcome

Chosen option: "Option 2", together with "Option 5". Option 2 is the only option that covers both silent
paths (lenient parsing and dropped disabled or out-of-range dates) and keeps parsing of non-typed values
unchanged without a workaround. Option 5 removes the most common rejection (digits typed without separators)
without guessing. Option 3 was set aside in the team discussion on ROU-11357 (too complex for the framework);
a shared input mask provider that a developer could assign to any input is investigated separately in
ROU-13210.

The library side (parser and correction rules, option names and defaults) is recorded in the fork's own ADR
(`OutSystems/flatpickr`, `docs/adr/ADR-0001`). This ADR records how OutSystems UI uses it.

### Scope

- **DatePicker and DatePickerRange only.** MonthPicker and TimePicker are not part of this change and are left
  exactly as they were: no new parameter, no fork options turned on, no new event. A month/year format has no
  day and the TimePicker is time-only, so the fork's auto-correction would not apply to them anyway.

### Developer experience

- **Off by default.** New boolean `StrictInputValidation` (default `False`), a field of the blocks'
  `OptionalConfigs` structures (`DatePickerOptionalConfigs`, `DatePickerRangeOptionalConfigs`). When it is off,
  typed input behaves exactly as before. Agreed in the team discussion on ROU-11357.
- **One switch.** `StrictInputValidation` is the only parameter the developer sees. When it is on, the provider
  configs turn on the fork's `strictInputParsing`, `keepInvalidInput` and `autoCorrectInput` together (shared
  helper `Providers.OSUI.SharedProviderResources.Flatpickr.InvalidInput`). `keepInvalidInput` and
  `autoCorrectInput` are not exposed as parameters:
    - Clearing rejected text only makes the user retype it, and a developer who wants it cleared can do so
      when `OnInvalidInput` fires. Clearing invalid dates "for consistency" was already discarded (ROU-11455).
    - The correction only accepts text that can be read one way, and the user sees the corrected value in the
      input, so there is no case where a developer would need to turn it off.
    - These configs are merged before the ones an application passes with `SetProviderConfigs`, so an
      application can still override each option (advanced use, documented in the provider README) or
      replace the parser with its own `parseDate`.
- **Runtime changes.** Changing `StrictInputValidation` after the block is rendered is handled in
  `OnParametersChanged` (`DatePickerChangeBooleanProperty` with `"StrictInputValidation"`) and redraws the
  picker.

### Behaviour when it is on

- **When it runs.** When the input loses focus, Enter is pressed, or the user clicks outside the open
  calendar (the calendar of a date-and-time picker stays open while the user types).
- **Auto-correction first.** A date typed without separators, with full-width values (`13122020` for
  `DD-MM-YYYY`), with other separators (`13/12/2020`), or a mix of both (`12122020 15:20` or
  `12-12-2020 1520` for a date and time), is rebuilt with the format's separators (`13-12-2020`,
  `12-12-2020 - 15:20`) before it is checked. Single-digit days or months typed without separators are not
  accepted (`1312020` is not corrected), so nothing is guessed. Only for full numeric dates, with or without
  time.
- **Then strict validation.** Text that still does not match the format, or a date that is disabled or
  outside `MinDate`/`MaxDate`, is rejected.
- **After rejected input.** The typed text stays in the input so the user can correct it, and the value is
  empty (`onChange` fires with no date first). Blurring again without editing the text does not report it
  again.
- **Range.** The typed text must contain both dates; a single date is rejected.
- **Invalid state.** The provider sets `aria-invalid="true"` on the input the user types in and the modifier
  class `osui-datepicker--invalid-input` on the pattern; the SCSS gives that input the danger border. The
  state is removed on the next change (a valid selection, or `Clear`) and when the provider is redrawn. The
  `not-valid` class is not used, because the platform owns it and it is removed on redraw.

### Change compared with the previous behaviour

What the user sees after leaving the input, before (and still with `StrictInputValidation` off) and now (with
it on):

| Typed text                                           | Before                                                                           | Now                                                                                                                                                           |
| :--------------------------------------------------- | :------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Text that can't be read as a date (`abc`, `1312020`) | The input was emptied, or went back to the previous value. Nothing was reported. | The input **keeps the typed text** so the user can correct it; the value is empty; the input is marked invalid and `OnInvalidInput` reports `OSUI-PRO-02002`. |
| Text read leniently (`23062024` for `DD-MM-YYYY`)    | Saved as another date (23-02-2029).                                              | Corrected when it can only be read one way (23-06-2024); otherwise rejected as above.                                                                         |
| A disabled or out-of-range date                      | The value was cleared silently.                                                  | The text is kept, marked invalid, and `OnInvalidInput` reports `OSUI-PRO-02003` / `OSUI-PRO-02004`.                                                           |

The main change for developers: after a rejection the input shows text that is **not** the bound variable's
value. The variable is empty (NullDate, and `OnSelected` reports no date), while the field still shows what the
user typed until it is corrected. Before, the field never showed text that wasn't a date. A form that reads the
variable must not assume the field is empty: handle `OnInvalidInput` (for example set `Valid = False` and a
`ValidationMessage`).

### Event and error codes

- **Block event `OnInvalidInput`** on DatePicker and DatePickerRange, with `DatePickerId`, `ErrorCode` and
  `InputText` (the text the user typed, which the developer cannot read otherwise: the bound variable is empty
  and the typed text lives in the provider's own input).
- **One error code per case**, without a message (a default message would need translations; the developer
  sets the validation message), in `Providers.OSUI.Datepicker.Flatpickr.ErrorCodes`:
    - `OSUI-PRO-02002` (`InvalidTypedInput`): the text can't be read as a date in the input format, even after
      auto-correction (including a Range with only one date).
    - `OSUI-PRO-02003` (`DisabledTypedDate`): the text is a valid date that is disabled (`DisabledDays`,
      `DisabledWeekDays`).
    - `OSUI-PRO-02004` (`OutOfRangeTypedDate`): the text is a valid date before `MinDate` or after `MaxDate`.
      Checked before the disabled days, so a date that is both gets this code.
- Disabled and out-of-range dates have separate codes so the developer can write a specific message ("that
  day isn't available" vs "choose a date between X and Y"); the event does not carry the date, so the
  developer could not tell them apart otherwise.
- The fork's hook gives a `reason` (`unparsable`, `outOfRange` or `disabled`); OutSystems UI turns it into the
  error code and does not pass the reason on. The JavaScript callback to the block is
  `(pickerId, errorCode, inputText)`.

### Delivery

- **Flatpickr fork:** new options `strictInputParsing`, `keepInvalidInput`, `autoCorrectInput` and the hook
  `onInvalidInput`, all off by default (fork ADR-0001).
- **OutSystems UI modules (O11 and ODC):** the new Flatpickr script and the new `OutSystemsUI.js` must ship
  together; `StrictInputValidation` in both `OptionalConfigs` structures and internal configs; the
  `OnInvalidInput` event, handler and callback registration (`RegisteredCallbackEvents.DatePicker_OnInvalidInput`)
  on both blocks.

Positive consequences:

- Typed text is either saved as the date the user typed (after an unambiguous correction) or rejected, with a
  visible and announced state.
- Developers can show their own message through the platform validation.
- Existing applications are not affected until they turn `StrictInputValidation` on.
- InitialDate, MinDate, MaxDate and DisabledDays parsing is unchanged.
- An application `parseDate` passed through `SetProviderConfigs` replaces the strict parser and the
  correction, so the existing workaround keeps working (disabled and out-of-range typed dates are still
  reported).

Negative consequences:

- Applications keep the lenient behaviour until a developer turns `StrictInputValidation` on, picker by
  picker. When it is on, typed text that used to be accepted through rollover or partial matching and can't be
  corrected unambiguously is rejected, and a typed disabled or out-of-range date shows as invalid instead of
  being cleared silently.
- The OutSystems UI JavaScript and the Flatpickr script must ship together in the same module version. With
  an older Flatpickr script the new options are ignored and the pickers behave as before.
- MonthPicker and TimePicker keep the lenient parsing.
- After a rejection the input shows the typed text while the bound variable is empty. Before, the field was
  emptied or went back to the previous value. Apps that relied on that must handle `OnInvalidInput`.
- Further divergence of the fork from upstream Flatpickr.

Decisions taken so far, to confirm before the status changes to Accepted:

- Fork route (Option 2), with auto-correction (Option 5); no mask in the pickers, shared mask provider
  investigated in ROU-13210.
- Off by default, turned on with `StrictInputValidation` in `OptionalConfigs` (team discussion on ROU-11357).
- `StrictInputValidation` is the single switch; keeping the typed text and the auto-correction are always on
  with it and not exposed as parameters.
- Auto-correction never accepts single-digit values typed without separators.
- DatePicker and DatePickerRange only; MonthPicker and TimePicker unchanged.
- Rejected input keeps the typed text with an empty value (instead of clearing both, or going back to the
  previous date).
- Disabled and out-of-range typed dates are reported as invalid.
- The event carries an error code and the typed text, and no default message: `OSUI-PRO-02002` for text
  that can't be read, `OSUI-PRO-02003` for a disabled date, `OSUI-PRO-02004` for a date outside
  `MinDate`/`MaxDate`. No separate reason parameter.

Open points:

- The Enter key behaviour on typed input is out of scope.

## Links

- ROU-11357 (this decision), ROU-13210 (shared input mask provider), ROU-11455 (discarded: clear invalid
  dates), ROU-10854, ROU-12898, ROU-12031, RPM-5943
- Flatpickr fork: https://github.com/OutSystems/flatpickr (`docs/adr/ADR-0001`)
- Upstream issue about lenient parsing: https://github.com/flatpickr/flatpickr/issues/2444
- ADR-0002 (validation ownership)

## Date

2026-11-13
