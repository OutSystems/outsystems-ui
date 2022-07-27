# OutSystems UI · ![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg) ![NPM version](https://img.shields.io/badge/npm-v8.3.1-informational)

## About the component

Create modern experiences with fully customizable responsive Screen Templates and UI Patterns for Native Mobile and Reactive Web Apps.

| `One Framework` | `Fully Integrated` | `Responsive by Default` | `Limitless Possibilities` |
| ------------- | ---------------- | --------------------- | ----------------------- |
Create seamless experiences for Reactive Web and Native Mobile Applications. | Drag and drop UI Patterns and Screen Templates from OutSystems Service Studio. | Ready to use Layouts and UI Patterns that automatically adapt to the device size. | Extend the styles of over 70 UI Patterns and Screen Templates to make them yours. |

### Key features

-   More than 70 UI patterns
-   Easily customizable and extendable design system
-   Responsive UI
-   Right-to-left support
-   Accessibility compliance with WCAG 2.1
-   Actions to deal with different device types
-   Built for Reactive Web and Mobile apps

Find out more in [OutSystems UI website](www.outsystems.com/outsystems-ui).

### Where can you find the component?

The OutSystems UI component, like all components, can be found in [OutSystems forge](https://www.outsystems.com/forge/component-overview/1385/outsystems-ui).

### Where can you find documentation?

The documentation can be found in the [OutSystems UI website](https://outsystemsui.outsystems.com/outsystemsuiwebsite/) and in [OutSystems product documentation](https://success.outsystems.com/Documentation/11/Developing_an_Application/Design_UI/Patterns).

### Why use this component?

OutSystems UI allows you to create applications with great user experience and beautiful design at unbeatable speed. This is how all the pieces come together and how you can go from creating your first application to see it working in minutes!

## About this repository

This repository contains the code that is used to control/style the OutSystems UI patterns.
The code is written in TypeScript🖤 and in SCSS, and you branch it and PR your changes/proposals!

### What tools should you use?

We highly recommend the usage of the following tools:

-   [Visual Code](https://code.visualstudio.com/)
-   With these extensions:
    -   Document This
    -   ESLint
    -   Prettier - Code formatter

### How to change this code?

<ol>
  <li>Create a branch based in the branch <strong>master</strong> (lastest & greatest release)</li>
  <li>Open your Visual Code in your branch</li>
  <li>Run the following command in Visual Code terminal: <code>npm run setup</code> (this will install all the dependencies that you need and compile the code)</li>
  <li>Do your magic! :)</li>
  <li><strong>Document your code</strong> (with the extension "Document This", start typing <code>/**</code> and the extension will give you a good starting point</li>
  <li>Compile and fix errors and warnings (in Visual Code terminal: <code>npm run build</code>)</li>
  <li>
    Check if the code format is following our conventions (in Visual Code terminal: <code>npm run lint</code>)
    <ol>
      <li>Some of the conventions can be fixed automatically by lint (in Visual Code terminal: <code>npm run lintfix</code>)</li>
      <li>Although the script above execute the prettier conventions, you may want to run it over all project files (in Visual Code terminal: <code>npm run prettier</code>)</li>
    </ol>
  </li>
  <li>Fix all errors & warnings! :)</li>
  <li>Create a PR, describing what was the (mis)behavior, what you changed and please provide a sample </li>
</ol>

### How to add new feature/fix?

-   A new branch from **master** should be created.
-   If possible the branch should be kept updated with the master branch.
-   If possible unnecessary commit messages should be omitted.

### How to create a New Pattern structure?

  <ol>
    <li>Create a branch based in the branch <strong>master</strong> (lastest & greatest release)</li>
    <li>Run the following command in Visual Code terminal: <code>npm run create-pattern</code></li>
    <li>
      Answer to the following questions:
      <ol>
        <li><strong>Pattern Name?</strong> - <i>The name new pattern should have;</i></li>
        <li><strong>Provider Name?</strong> - <i>If/When pattern have an external provider/library. An abstract layer will be added to the Pattern.</i></li>
        <li><strong>Mode?</strong> - <i>If/When based on same provider, you will have multiple patterns like <strong>DatePicker</strong> that has <strong>Flatpickr</strong> as a provider and <strong>SingleDate</strong> and <strong>RangeDate</strong> as <strong>DatePicker</strong> modes; An abstract layer will be added to the Provider as well.</i></li>
        <li><strong>Custom destination Folder?</strong> - <i>If you do not provide a folder name here all the pattern files (if already exist) <strong>will be overwritten</strong>, this way you prevent that by creating a new folder where all the files will be automagically added.</i></li>
      </ol>
     </li>
     <li>Do your magic! :)<br><i>As mentioned above, all the nedded files (based in your answers) will be automagically created and added to right places.</i></li>
  </ol>

### How to generate Documentation?

We use the [TypeDoc](https://typedoc.org/) to automatically generate documentation. TypeDoc converts comments in TypeScript source code into rendered HTML documentation, alongside UML diagrams for each class and Interface.

For the UML diagrams to be generated, some extra installations are required in your system:

-   [JAVA](https://www.java.com/en/) (latest version)
-   [Graphviz](https://graphviz.org/download/) (latest version)

Finally, you just need to run the command (in Visual Code terminal): <code>npm run docs</code>!

### How to do a Pull Request?

After completing your changes, and testing, please proceed with submitting a Pull Request.

To be accepted, a Pull Request needs to:

1. **Fulfill the following requirements**

    - Needs to compile without errors
    - Needs to follow the code style rules (without warnings and errors)
    - Needs to be approved by 2 team members (owners of the repo)
    - The Pull Request template, should be filled up by the Pull Requestor:
        - Provide a short description
        - A link to a sample page showing the fixed behavior or the new feature
        - What was happening?
        - What was done?
        - Tests steps
        - Screenshots
        - Checklist

2. **Follow best practices**
    - The submitted code should be well documented (e.g. comments).
    - Avoid changes outside the scope of the issue in hands.
    - Avoid exposing sensible information of any kind (e.g. internal server link, process, etc).

## Useful Links

-   Download latest version in [OutSystems forge](https://www.outsystems.com/forge/component-versions/1385)
-   Check the [online documentation](https://outsystemsui.outsystems.com/outsystemsuiwebsite/)

## 📫&nbsp; Have a question? Want to chat? Ran into a problem?

Write us in [the component support page](https://www.outsystems.com/forge/component-discussions/1385/OutSystems+UI)!
