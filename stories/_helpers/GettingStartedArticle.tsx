import React from 'react';
import { DocsNote } from './DocsNote';

const STEPS_SECTION = `
      <section class="sec" id="steps">
        <h2>Four steps in ODC Studio</h2>
        <p>Each one hands off to the next, and the first two need no configuration.</p>
        <div class="steps4">
          <a class="st" href="https://success.outsystems.com/Documentation/11/Developing_an_Application/Design_UI/Screen_Templates" target="_blank" rel="noopener">
            <span class="top"><span class="n">1</span></span>
            <svg class="pic" viewBox="0 0 124 74" fill="none" aria-hidden="true"><rect x="14" y="18" width="52" height="38" rx="3" fill="#fff" stroke="#cecece"/><rect x="14" y="18" width="52" height="8" rx="3" fill="#e4e8ff"/><rect x="76" y="12" width="26" height="50" rx="4" fill="#fff" stroke="#cecece"/><rect x="76" y="12" width="26" height="7" rx="4" fill="#e4e8ff"/></svg>
            <b>Create an app</b>
            <p>Start from an application template: navigation, layout and theme already wired. One for web, one for mobile.</p>
            <span class="go">Application templates →</span>
          </a>
          <a class="st" href="https://success.outsystems.com/Documentation/11/Developing_an_Application/Design_UI/Screen_Templates" target="_blank" rel="noopener">
            <span class="top"><span class="n">2</span></span>
            <svg class="pic" viewBox="0 0 124 74" fill="none" aria-hidden="true"><rect x="12" y="12" width="46" height="22" rx="3" fill="#fff" stroke="#cecece"/><rect x="16" y="16" width="38" height="6" rx="2" fill="#e4e8ff"/><rect x="66" y="12" width="46" height="22" rx="3" fill="#fff" stroke="#cecece"/><rect x="70" y="16" width="16" height="14" rx="2" fill="#e4e8ff"/><rect x="12" y="40" width="46" height="22" rx="3" fill="#fff" stroke="#cecece"/><rect x="16" y="44" width="38" height="4" rx="2" fill="#e8e8e8"/><rect x="16" y="51" width="24" height="4" rx="2" fill="#e8e8e8"/><rect x="66" y="40" width="46" height="22" rx="3" fill="#fff" stroke="#cecece"/><rect x="70" y="44" width="12" height="14" rx="2" fill="#e8e8e8"/><rect x="86" y="44" width="12" height="14" rx="2" fill="#e4e8ff"/></svg>
            <b>Add screens</b>
            <p>Screen templates bring layout, logic and sample data, so you can publish and open the screen before writing a query.</p>
            <span class="go">Screen templates →</span>
          </a>
          <a class="st" href="#patterns-detail">
            <span class="top"><span class="n">3</span></span>
            <svg class="pic" viewBox="0 0 124 74" fill="none" aria-hidden="true"><rect x="10" y="10" width="48" height="54" rx="3" fill="#fff" stroke="#cecece"/><rect x="14" y="16" width="40" height="10" rx="2" fill="#e4e8ff"/><rect x="18" y="20" width="24" height="3" rx="1.5" fill="#105cef"/><rect x="14" y="30" width="40" height="7" rx="2" fill="#f2f2f2"/><rect x="14" y="41" width="40" height="7" rx="2" fill="#f2f2f2"/><rect x="14" y="52" width="40" height="7" rx="2" fill="#f2f2f2"/><path d="M62 37h10m-3-3 3 3-3 3" stroke="#a2a2a2" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><rect x="78" y="10" width="36" height="54" rx="3" fill="#fff" stroke="#cecece"/><rect x="83" y="16" width="26" height="4" rx="2" fill="#e8e8e8"/><rect x="83" y="26" width="26" height="18" rx="3" fill="#f0f2ff" stroke="#105cef" stroke-dasharray="3 2"/><rect x="83" y="50" width="18" height="4" rx="2" fill="#e8e8e8"/></svg>
            <b>Use patterns</b>
            <p>Drag any of the 56 patterns from the toolbox, then configure it in the properties panel and bind your data.</p>
            <span class="go">Working with patterns →</span>
          </a>
          <a class="st" href="?path=/docs/theme-editor--docs">
            <span class="top"><span class="n">4</span></span>
            <svg class="pic" viewBox="0 0 124 74" fill="none" aria-hidden="true"><circle cx="22" cy="20" r="7" fill="#105cef"/><circle cx="42" cy="20" r="7" fill="#3b3b3b"/><circle cx="62" cy="20" r="7" fill="#1ba433"/><circle cx="82" cy="20" r="7" fill="#d82424"/><rect x="16" y="36" width="92" height="26" rx="4" fill="#fff" stroke="#cecece"/><rect x="22" y="42" width="40" height="4" rx="2" fill="#e8e8e8"/><rect x="22" y="50" width="26" height="7" rx="3.5" fill="#105cef"/><rect x="52" y="50" width="26" height="7" rx="3.5" fill="#fff" stroke="#cecece"/></svg>
            <b>Make it yours</b>
            <p>Change a token once and every pattern follows, including the ones you have not used yet. Dark mode is a re-mapping.</p>
            <span class="go">Theme editor →</span>
          </a>
        </div>
      </section>
`;

const PATTERNS_SECTION = `
      <section class="sec" id="patterns-detail" style="padding-bottom:0">
        <h2>Working with patterns</h2>
        <ol class="howto">
          <li>Open your application in ODC Studio.</li>
          <li>Go to the screen you want to work on.</li>
          <li>In the toolbox, search for the pattern by name.</li>
          <li>Drag it onto the screen, at the position you want.</li>
          <li>Configure it in the properties panel, and bind data or actions where it asks for them.</li>
        </ol>
        <p>Properties are specific to each pattern, so the pattern page is the source of truth: it lists the inputs that pattern accepts, the events it raises and the CSS API it exposes. There is no shared set to learn, except for <code>ExtendedClass</code>, which every pattern accepts and which appends your own CSS classes to its root element.</p>
      </section>
`;

const TECHNICAL_PART1 = `
        <h2>Technical notes</h2>
        <p>This section is not required in order to build a screen. It describes how a pattern is assembled at runtime, which components carry behaviour, and which layers are available for customisation.</p>

        <h3>How a pattern runs</h3>
        <p>Patterns are not React or Vue components. They are TypeScript behaviour classes that attach to HTML the platform renders, which is why you customise them with CSS and properties rather than by passing props. At runtime the platform does three things:</p>
        <ol class="howto">
          <li>renders an HTML skeleton, with the classes and <code>name</code> attributes that pattern expects,</li>
          <li>calls <code>Create(id, configsJSON)</code> on the pattern's public API,</li>
          <li>calls <code>Initialize(id)</code>, which runs the pattern's <code>build()</code>.</li>
        </ol>
        <div class="code">
          <pre><span class="c">// what the platform calls for you, per pattern instance</span>
OutSystems.OSUI.Patterns.ProgressAPI.<span class="f">Create</span>(<span class="s">'progress-1'</span>, { progress: <span class="s">68</span> });
OutSystems.OSUI.Patterns.ProgressAPI.<span class="f">Initialize</span>(<span class="s">'progress-1'</span>);</pre>
          <button type="button" data-copy="OutSystems.OSUI.Patterns.ProgressAPI.Create('progress-1', { progress: 68 });
OutSystems.OSUI.Patterns.ProgressAPI.Initialize('progress-1');">Copy</button>
        </div>

        <h3>Which components have behaviour, and why it matters</h3>
        <p>The difference decides how you customise a component, and how much you can rely on its markup.</p>
        <ul>
          <li><b>With a behaviour class</b>: it raises events, holds state and can rewrite its own markup after it loads. Style it through the properties and the documented CSS API, because CSS aimed at its internal structure may stop matching after an update.</li>
          <li><b>Stylesheet only</b>: static markup, nothing to initialise and no events to handle. What you see in the inspector is what ships, so you can target it directly.</li>
        </ul>
        <table class="split">
          <thead><tr><th>Category</th><th>Behaviour class</th><th>Stylesheet only</th></tr></thead>
          <tbody>
            <tr><td>Content</td><td>Accordion, <span class="child">Accordion Item</span>, Carousel, Flip Content, Video</td>
                <td>Alert, BlankSlate, Card and its variants, Chat Message, Floating Content, List Item Content, Section, Tag, User Avatar</td></tr>
            <tr><td>Interaction</td><td>Animated Label, Bottom Sheet, Button Loading, Date Picker, Dropdown, <span class="child">Dropdown Server Side Item</span>, Month Picker, Notification, Range Slider, Search, Time Picker, Tooltip</td>
                <td>Action Sheet, Animate, Floating Actions, Input With Icon, Lightbox Image, Scrollable Area, Stacked Cards</td></tr>
            <tr><td>Navigation</td><td>Overflow Menu, Section Index, <span class="child">Section Index Item</span>, Sidebar, Submenu, Tabs, <span class="child">Tabs Header Item</span>, <span class="child">Tabs Content Item</span></td>
                <td>Bottom Bar Item, Breadcrumbs, Pagination, Timeline, Wizard</td></tr>
            <tr><td>Adaptive</td><td>Gallery</td><td>Columns, Master Detail</td></tr>
            <tr><td>Numbers</td><td>Progress, Rating</td><td>Badge, Counter, Icon Badge</td></tr>
            <tr><td>Utilities</td><td>Inline SVG, Swipe Events, Touch Events</td><td>Align Center, Center Content, Margin Container, Separator</td></tr>
          </tbody>
        </table>
        <p class="legend"><span class="child">Names in grey</span> are child patterns: they have a class of their own, but you configure them through the parent.</p>
`;

const TECHNICAL_PART2 = `
        <h3>Patterns that wrap third-party libraries</h3>
        <p>Six patterns delegate part of their DOM and behaviour to an external library, which is worth knowing when a rendered element does not look like anything in this stylesheet:</p>
        <ul>
          <li><b><a href="https://flatpickr.js.org/" target="_blank" rel="noopener">Flatpickr</a></b>: Date Picker, Month Picker, Time Picker</li>
          <li><b><a href="https://splidejs.com/" target="_blank" rel="noopener">Splide</a></b>: Carousel</li>
          <li><b><a href="https://refreshless.com/nouislider/" target="_blank" rel="noopener">noUiSlider</a></b>, with <a href="https://refreshless.com/wnumb/" target="_blank" rel="noopener">wNumb</a> for number formatting: Range Slider</li>
          <li><b><a href="https://sa-si-dev.github.io/virtual-select/" target="_blank" rel="noopener">VirtualSelect</a></b>: Dropdown</li>
        </ul>

        <h3>Where to intervene</h3>
        <div class="tech">
          <div>
            <b>Theme wide</b>
            <p>Values that every component reads live in <code>--token-*</code>. Change one and the whole application follows, including patterns you have not used yet.</p>
          </div>
          <div>
            <b>One component only</b>
            <p>Each component also exposes its own <code>--osui-*</code> variables. Set them on the class you typed in <code>ExtendedClass</code> to change that component alone.</p>
          </div>
        </div>
        <div class="code">
          <pre><span class="c">/* theme wide: every pattern that reads the token follows */</span>
:root { --token-semantics-primary-700: #7c20f2; }

<span class="c">/* one component only, on the class you typed in ExtendedClass */</span>
.my-alert { --osui-alert-accent-color: var(--color-info); }</pre>
          <button type="button" data-copy=":root { --token-semantics-primary-700: #7c20f2; }

.my-alert { --osui-alert-accent-color: var(--color-info); }">Copy</button>
        </div>
`;

export function GettingStartedArticle() {
	return (
		<article>
			<section className="sec" id="prerequisites">
				<h2>Prerequisites</h2>
				<ul>
					<li>
						<b>An ODC environment</b>, where you can create and publish applications.
					</li>
					<li>
						<b>ODC Studio</b>, on the latest version.
					</li>
					<li>
						<b>A new or existing application</b>, created from one of the application templates below.
					</li>
				</ul>
				<DocsNote title="Nothing to install">
					<p>
						OutSystems UI is included in every new application. Patterns show up in the toolbox as soon as
						the app is created, so there is no dependency to add and no reference to manage.
					</p>
				</DocsNote>
				<DocsNote title="On OutSystems 11, use Service Studio" variant="alt">
					<p>
						This guide is written for ODC. If your environment is OutSystems 11, follow the same four steps
						in Service Studio instead: the patterns, templates and theme are the same, only the IDE differs.
					</p>
				</DocsNote>
			</section>
			<div dangerouslySetInnerHTML={{ __html: STEPS_SECTION }} />
			<div dangerouslySetInnerHTML={{ __html: PATTERNS_SECTION }} />
			<section className="sec" id="technical">
				<div className="prose" dangerouslySetInnerHTML={{ __html: TECHNICAL_PART1 }} />
				<DocsNote title="Class names are not always what you expect">
					<p>
						A few ship under a different name from the one on the label: Master Detail is{' '}
						<code>.split-screen-wrapper</code>, Chat Message is <code>.chat</code>, and Breadcrumbs items are{' '}
						<code>.breadcrumbs-item</code>. The CSS API Reference lists the real selector for every
						component.
					</p>
				</DocsNote>
				<DocsNote title="Form controls are a different stack">
					<p>
						Button, Button Group, Checkbox, Radio Button, Switch, Input, Text Area, Dropdown, Upload, List,
						List Item, Popover, Popup, Table, Bulk Actions, Form and Feedback Message are{' '}
						<b>widgets, not patterns</b>. They come from the platform runtime, and this library only styles
						them, through selectors such as <code>.btn</code>, <code>[data-input]</code>,{' '}
						<code>[data-switch]</code> and <code>.table</code>.
					</p>
					<p>
						There is no <code>Create()</code> to call and no pattern API to configure, so anything you read
						above about initialisation does not apply to them.
					</p>
				</DocsNote>
				<div dangerouslySetInnerHTML={{ __html: TECHNICAL_PART2 }} />
			</section>
		</article>
	);
}
