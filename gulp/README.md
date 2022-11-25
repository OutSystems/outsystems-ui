# Gulp · ![Gulp CLI version](https://img.shields.io/badge/gulp--cli-v2.3.0-informational) ![Gulp Local version](https://img.shields.io/badge/gulp--local-v4.0.2-informational)

<p align="center">
  <a href="https://gulpjs.com">
    <img height="113" width="50" src="https://raw.githubusercontent.com/gulpjs/artwork/master/gulp-2x.png">
  </a>
  <p align="center">Our streaming build system</p>
</p>


## This folder contains:

<ul>
    <li>
        Gulp tasks:
            <ul>
                <li>Create New Pattern</li>
                <li>SCSS Transpile</li>
                <li>TypeScript Transpile</li>
            </ul>
    </li>
    <li>Templates used to automagically create new pattern:</li>
</ul>

## Project Structure

Bellow there is some comments about the application structure.

<strong>DatePicker</strong> with <strong>Flatpickr</strong> as a Provider and <strong>SingleDate</strong> as Mode will be in use at comments as an example.

    .
    |
    ├── gulpfile.js                                 # gulp orchestrator
    ├── ...
    ├── gulp                                        # Contains gulp specific tasks and templates
    |   ├── tasks
    |   |   ├── NewPattern.js                       # New Pattern task definition
    |   |   ├── ScssTranspile.js                    # SCSS transpile task definition
    |   |   └── TsTranspile.js                      # TypeScript transpile task definition
    |   |
    |   ├── templates
    |   |   ├── index.html                          # File to be added to ./dist when development mode is in use.
    |   |   ├── PatternAPI.ts                       # File used to create the API file related to the Pattern
    |   |   ├── PatternAPI_HasProvider.ts           # Same as above but when Provider without Mode should also be added
    |   |   └── PatternAPI_HasProviderAndMode.ts    # Same as above but when Provider with Mode should also be added
    |   |
    |   |   ├── PatternFramework                    # './.../OSFramework/Pattern/DatePicker/' when Provider is NOT to be added.
    |   |   |   ├── scss
    |   |   |   |   └── _pattern.scss               # Used to create _datepicker.scss
    |   |   |   |
    |   |   |   ├── IPattern.ts                     # Used to create IDatePicker.ts
    |   |   |   ├── Pattern.ts                      # Used to create DatePicker.ts
    |   |   |   ├── PatternConfig.ts                # Used to create DatePickerConfig.ts
    |   |   |   └── PatternEnum.ts                  # Used to create DatePickerEnum.ts
    |   |   |
    |   |   ├── PatternFramework_HasProvider        # './.../OSFramework/Pattern/DatePicker/' when Provider(Flatpickr) SHOULD be added
    |   |   |   ├── Provider                        # './.../Providers/DatePicker/Flatpickr/' when Mode(SingleDate) is NOT to be added
    |   |   |   |   ├── PatternFactory.ts           # Used to create DatePickerFactory.ts that will be added to './.../OSFramework/Pattern/DatePicker/'
    |   |   |   |   ├── Provider.ts                 # Used to create Flatpickr.ts
    |   |   |   |   ├── ProviderConfig.ts           # Used to create FlatpickrConfig.ts
    |   |   |   |   └── ProviderEnum.ts             # Used to create FlatpickrEnum.ts
    |   |   |   |
    |   |   |   ├── Provider_HasMode                # './.../Providers/DatePicker/Flatpickr/' when Mode(SingleDate) SHOULD be added
    |   |   |   |   ├── IProvider.ts                # Used to create IFlatpickr.ts
    |   |   |   |   ├── PatternFactory.ts           # Used to create DatePickerFactory.ts that will be added to './.../OSFramework/Pattern/DatePicker/'
    |   |   |   |   ├── Provider.ts                 # Used to create AbstractFlatpickr.ts
    |   |   |   |   ├── ProviderConfig.ts           # Used to create AbstractFlatpickrConfig.ts
    |   |   |   |   ├── ProviderEnum.ts             # Used to create AbstractFlatpickrEnum.ts
    |   |   |   |   ├── ProviderFactory.ts          # Used to create FlatpickrFactory.ts
    |   |   |   |   ├── ProviderMode.ts             # Used to create FlatpickrSingleDate.ts that will be added to './.../Providers/DatePicker/Flatpickr/SingleDate/'
    |   |   |   |   ├── ProviderModeConfig.ts       # Used to create FlatpickrSingleDateConfig.ts that will be added to './.../Providers/DatePicker/Flatpickr/SingleDate/'
    |   |   |   |   ├── ProviderModeEnum.ts         # Used to create Enum.ts that will be added to './.../Providers/DatePicker/Flatpickr/SingleDate/'
    |   |   |   |   └── ProviderReadMe.md           # Used to create README.md that will be added to './.../Providers/DatePicker/Flatpickr/'
    |   |   |   |
    |   |   |   ├── scss
    |   |   |   |   ├── _pattern.scss               # Used to create _datepicker.scss
    |   |   |   |   ├── _provider-lib.scss          # Used to create _flatpickr-lib.scss
    |   |   |   |   └── _provider.scss              # Used to create _flatpickr.scss
    |   |   |   |
    |   |   |   ├── IPattern.ts                     # Used to create IDatePicker.ts
    |   |   |   ├── Pattern.ts                      # Used to create AbstractDatePicker.ts
    |   |   |   ├── PatternConfig.ts                # Used to create AbstractDatePickerConfig.ts
    |   |   |   └── PatternEnum.ts                  # Used to create AbstractDatePickerEnum.ts
    |
    ├── ...
