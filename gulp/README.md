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
    |   └── tasks
    |       ├── ScssTranspile.js                    # SCSS transpile task definition
    |       └── TsTranspile.js                      # TypeScript transpile task definition
    |    
    ├── ...
