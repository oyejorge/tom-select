# Tom Select

<!-- [![NPM version](http://img.shields.io/npm/v/selectize.svg?style=flat)](https://www.npmjs.org/package/selectize)
[![CDNJS version](http://img.shields.io/cdnjs/v/selectize.js.svg?style=flat)](https://cdnjs.com/libraries/selectize.js) -->
[![Build Status](https://travis-ci.org/orchidjs/tom-select.svg?branch=master)](https://travis-ci.org/orchidjs/tom-select)
[![Coverage Status](https://coveralls.io/repos/github/orchidjs/tom-select/badge.svg?branch=master)](https://coveralls.io/github/orchidjs/tom-select?branch=master)


Tom Select is an extensible and dynamic &lt;select&gt; UI control.
With autocomplete and native-feeling keyboard navigation, it's useful for tagging, contact lists, country selectors, and so on.
Tom Select was forked from [Selectize.js](https://tom-select.js.org/docs/selectize.js/) to provide the same powerful UI and API but with a framework agnostic approach.

### Features

- **Smart Option Searching / Ranking**<br>Options are efficiently scored and sorted on-the-fly (using [sifter](https://github.com/brianreavis/sifter.js)). Want to search an item's title *and* description? No problem.
- **Caret between items**<br>Order matters sometimes. Use the <kbd>&larr;</kbd> and <kbd>&rarr;</kbd> arrow keys to move between selected items.</li>
- **Select &amp; delete multiple items at once**<br>Hold down <kbd>option</kbd> on Mac or <kbd>ctrl</kbd> on Windows to select more than one item to delete.
- **Díåcritîçs supported**<br>Great for international environments.
- **Item creation**<br>Allow users to create items on the fly (async saving is supported; the control locks until the callback is fired).
- **Remote data loading**<br>For when you have thousands of options and want them provided by the server as the user types.
- **Clean API &amp; code**<br>Interface with it and make modifications easily. Pull requests welcome!
- **Extensible**<br> [Plugin API](https://tom-select.js.org/docs/plugins/) for developing custom features (uses [microplugin](https://github.com/brianreavis/microplugin.js)).
- **Touch Support**<br> Plays nice with iOS 5+ devices.

## Usage

```html
<input id="tom-select-it" />
<link rel="stylesheet" href="/css/tom-select.default.css">
<script src="/js/tom-select.complete.js"></script>
<script>
var options = {};
tomSelect('#tom-select-it',{});
</script>
```

The available options are [documented here](https://tom-select.js.org/docs).


## Installation and files

All pre-built files needed to use Tom Select can be found in the ["dist"](https://github.com/orchidjs/tom-select/tree/master/dist) folder

<!--and at [cdnjs](https://cdnjs.com/libraries/selectize.js). -->


- [**JavaScript**](https://github.com/orchidjs/tom-select/tree/master/dist/js)
	- [tom-select.complete.js](https://github.com/orchidjs/tom-select/tree/master/dist/js/tom-select.complete.js) — Includes dependencies and plugins
	- [tom-select.js](https://github.com/orchidjs/tom-select/tree/master/dist/js/tom-select.js) — Does not include sifter or microplugin
- **Themes**
	- [CSS](https://github.com/orchidjs/tom-select/tree/master/dist/css) — Compiled themes
	- [SCSS](https://github.com/orchidjs/tom-select/tree/master/dist/scss) — Uncompiled theme sources

## License

Copyright &copy; 2013–2020 [Contributors](https://github.com/orchidjs/tom-select/graphs/contributors)

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at: http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
