## Project Structure

Bellow there is some comments about the application structure.

The namespaces should follow application directories, this way we should find files and objects using the same path.

    .
    ├── ...
    ├── src                  # Where the code lives
    |   ├── scripts              # Contains the TS code (+ patterns partials) of the framework.
    |   |   ├── OSUIFramework        # Internal code to orchestrate the usage of provider. **Should not** be invoked directly.
    |   |   |   ├── Callbacks            # Contains the callbacks signatures of the OutSystems code to be invoked.
    |   |   |   ├── Event                # Contains the classes related with event management.
    |   |   |   ├── Helper               # Contains several classes that isolate behaviors and simplify the code.
    |   |   |   ├── Interface            # Contains several generic interfaces to be used by different patterns.
    |   |   |   ├── Pattern              # Contains the code (TS + SCSS partial) of each pattern of OutSystems UI - divided in folders with the pattern name.
    |   |   |   |   ├── Accordion
    |   |   |   |   ├── AccordionItem
    |   |   |   |   ├── AnimatedLabel
    |   |   |   |   ├── ButtonLoading
    |   |   |   |   ├── Carousel
    |   |   |   |   ├── DatePicker
    |   |   |   |   ├── Dropdown
    |   |   |   |   ├── FlipContent
    |   |   |   |   ├── FloatingActions
    |   |   |   |   ├── FloatingActionsItem
    |   |   |   |   ├── Gallery
    |   |   |   |   ├── Notification
    |   |   |   |   ├── Progress
    |   |   |   |   ├── RangeSlider
    |   |   |   |   ├── Rating
    |   |   |   |   ├── Search
    |   |   |   |   ├── Sidebar
    |   |   |   |   ├── SubMenu
    |   |   |   |   ├── SwipeEvents
    |   |   |   |   ├── Tabs
    |   |   |   |   ├── TabsContentItem
    |   |   |   |   ├── TabesHeaderItem
    |   |   |   |   ├── Tooltip
    |   |   |   |   └── TouchEvents
    |   |   |   ├── Constants.ts         # File that constains all the constants, strings, names, etc to be used in the internal framework.
    |   |   |   └── GlobalEnum.ts        # Contains all the enumerates.
    |   |   ├── OutSystems           # Folder that constains **all public** APIs.
    |   |   |   ├── Menu                 # Contains the APIs to deal Menu in the layout.
    |   |   |   └── OSUI                 # OutSystems UI public APIs.
    |   |   |       ├── Network              # Contains the APIs to return the network type and status.
    |   |   |       ├── Patterns             # Patterns public APIs.
    |   |   |       ├── Utils                # Useful APIs to be used in OutSystems code module.
    |   |   |       └── GetVersion.ts        # File that contains the API to return the OSUI version.
    |   |   ├── Providers            # Folder containing provider specific code.
    |   |   |   ├── Carousel             # Contains the providers used by the **Carousel** pattern.
    |   |   |   |   └── Splide               # Splide specific code.
    |   |   |   ├── Datepicker           # Contains the providers used by the **DatePicker** pattern.
    |   |   |   |   └── Flatpickr            # Flatpickr specific code.
    |   |   |   ├── Dropdown             # Contains the providers used by the **DropdownSearch** & **DropdownTags** pattern.
    |   |   |   |   └── Virtual_Select       # VirtualSelect specific code.
    |   |   |   |       ├── Search               # Specific code for the DropdownSearch.
    |   |   |   |       └── Tags                 # Specific code for the DropdownTags search.
    |   |   |   └── RangeSlider          # Contains the providers used by the **RangeSlider** & **RangeSliderInterval** pattern.
    |   |   |       └── NoUiSlider           # Flatpickr specific code.
    |   |   ├── Global.d.ts          # Used to declare development time variables and imports, that will not be *used* in runtime - for better intellisense in Visual Code.
    |   |   └── osui.ts              # Defines the (old) `osui` API, retrocompatibility, but now invoking the methods correctly organized under `OutSystems.OSUI`.
    |   ├── scss                 # Contains all the SCSS partials that are **not** related with any pattern.
    └── ...
