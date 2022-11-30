## Project Structure

Bellow there is some comments about the application structure.

The namespaces should follow application directories, this way we should find files and objects using the same path.

    .
    ├── ...
    ├── src                                      # Where the code lives
    |   ├── scripts                              # Contains the TS code (+ patterns partials) of the framework.
    |   |   ├── OSFramework                      # Internal code to orchestrate the usage of provider. **Should not** be invoked directly.
    |   |   |   ├── Behaviours                   # Contains the classes used to set/define pattern behaviours.
    |   |   |   ├── Event                        # Contains the classes related with event management.
    |   |   |   |   └── GestureEvents            # Contains the classes related with gesture events.
    |   |   |   ├── Helper                       # Contains several classes that isolate behaviors and simplify the code.
    |   |   |   ├── Interface                    # Contains several generic interfaces to be used by different patterns.
    |   |   |   ├── Pattern                      # Contains the code (TS + SCSS partial) of each pattern of OutSystems UI - divided in folders with the pattern name.
    |   |   |   |   ├── Accordion
    |   |   |   |   ├── AccordionItem
    |   |   |   |   ├── AnimatedLabel
    |   |   |   |   ├── BottomSheet
    |   |   |   |   ├── ButtonLoading
    |   |   |   |   ├── Carousel
    |   |   |   |   ├── DatePicker
    |   |   |   |   ├── Dropdown
    |   |   |   |   |   └── ServerSide
    |   |   |   |   ├── DropdownServerSideItem
    |   |   |   |   ├── FlipContent
    |   |   |   |   ├── Gallery
    |   |   |   |   ├── MonthPicker
    |   |   |   |   ├── Notification
    |   |   |   |   ├── Progress
    |   |   |   |   |   ├── Bar
    |   |   |   |   |   └── Circle
    |   |   |   |   ├── RangeSlider
    |   |   |   |   ├── Rating
    |   |   |   |   ├── SectionIndex
    |   |   |   |   ├── SectionIndexItem
    |   |   |   |   ├── Sidebar
    |   |   |   |   ├── SubMenu
    |   |   |   |   ├── SwipeEvents
    |   |   |   |   ├── Tabs
    |   |   |   |   ├── TabsContentItem
    |   |   |   |   ├── TabesHeaderItem
    |   |   |   |   ├── TimePicker
    |   |   |   |   ├── Tooltip
    |   |   |   |   └── TouchEvents
    |   |   |   |
    |   |   |   ├── Constants.ts                 # File that constains all the constants, strings, names, etc to be used in the internal framework.
    |   |   |   ├── ErrorCodes.ts                # Contains all the Framework Error codes per pattern.
    |   |   |   └── ClobalCallbacks.ts           # Contains global events callbacks types.
    |   |   |   └── GlobalEnum.ts                # Contains all the enumerates.
    |   |   |
    |   |   ├── OutSystems                       # Folder that constains **all public** APIs.
    |   |   |   └── OSUI                         # OutSystems UI public APIs.
    |   |   |       ├── Patterns                 # Contains all patterns public APIs.
    |   |   |       ├── Utils                    # Useful APIs to be used in OutSystems code module.
    |   |   |       └── ErrorCodes.ts            # Contains all the API Error codes per pattern.
    |   |   |       └── GetVersion.ts            # File that contains the API to return the OSUI version.
    |   |   |
    |   |   ├── Providers                        # Folder containing provider specific code.
    |   |   |   ├── Carousel                     # Contains the providers used by the **Carousel** pattern.
    |   |   |   |   └── Splide                   # Splide specific code.
    |   |   |   |
    |   |   |   ├── DatePicker                   # Contains the providers used by the **DatePicker** pattern.
    |   |   |   |   └── Flatpickr                # Flatpickr specific code.
    |   |   |   |       ├── l10ns                # Contains all the translations needed for the nonTranslated calendar elements by library;
    |   |   |   |       ├── RangeDate            # Specific code for the **DatePicker** pattern with **RangeDate** Mode.
    |   |   |   |       └── SingleDate           # Specific code for the **DatePicker** pattern with **SingleDate** Mode.
    |   |   |   |
    |   |   |   ├── Dropdown                     # Contains the providers used by the **DropdownSearch** & **DropdownTags** pattern.
    |   |   |   |   └── VirtualSelect            # VirtualSelect specific code.
    |   |   |   |       ├── scss                 # Contains all styles for the datepicker based on library;
    |   |   |   |       ├── Search               # Specific code for the DropdownSearch.
    |   |   |   |       └── Tags                 # Specific code for the DropdownTags search.
    |   |   |   |
    |   |   |   ├── MonthPicker                  # Contains the providers used by the **MonthPicker** pattern.
    |   |   |   |   └── Flatpickr                # Flatpickr specific code.
    |   |   |   |
    |   |   |   ├── RangeSlider                  # Contains the providers used by the **RangeSlider** & **RangeSliderInterval** pattern.
    |   |   |   |   └── NoUiSlider               # NoUiSlider specific code.
    |   |   |   |
    |   |   |   ├── TimePicker                   # Contains the providers used by the **MonthPicker** pattern.
    |   |   |   |       └── Flatpickr            # Flatpickr specific code.
    |   |   |   |
    |   |   |   └── SharedProviderResources      # Contains the providers used by the patterns that share this info/structure.
    |   |   |       └── Flatpickr                # Flatpickr specific code.
    |   |   |
    |   |   |
    |   |   ├── Global.d.ts                      # Used to declare development time variables and imports, that will not be *used* in runtime - for better intellisense in Visual Code.
    |   |   └── osui.ts                          # Defines the (old) `osui` API, retrocompatibility, but now invoking the methods correctly organized under `OutSystems.OSUI`.
    |   |
    |   ├── scss                                 # Contains all the SCSS partials that are **not** related with any pattern.
    └── ...
