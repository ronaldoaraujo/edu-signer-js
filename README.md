# edu-signer-js
[![Build Status](https://travis-ci.org/ronaldoaraujo/edu-signer-js.svg?branch=master)](https://travis-ci.org/ronaldoaraujo/edu-signer-js)
[![Coverage Status](https://coveralls.io/repos/github/ronaldoaraujo/edu-signer-js/badge.svg?branch=master)](https://coveralls.io/github/ronaldoaraujo/edu-signer-js?branch=master)

A javascript library for digital signature

## Browser Support

This library relies on [Fetch API](https://fetch.spec.whatwg.org/). And this API is supported in the following browsers.

![Chrome](https://cloud.githubusercontent.com/assets/398893/3528328/23bc7bc4-078e-11e4-8752-ba2809bf5cce.png) | ![Firefox](https://cloud.githubusercontent.com/assets/398893/3528329/26283ab0-078e-11e4-84d4-db2cf1009953.png) | ![Opera](https://cloud.githubusercontent.com/assets/398893/3528330/27ec9fa8-078e-11e4-95cb-709fd11dac16.png) | ![Safari](https://cloud.githubusercontent.com/assets/398893/3528331/29df8618-078e-11e4-8e3e-ed8ac738693f.png) | ![IE](https://cloud.githubusercontent.com/assets/398893/3528325/20373e76-078e-11e4-8e3a-1cb86cf506f0.png) |
--- | --- | --- | --- | --- |
39+ ✔ | 42+ ✔ | 29+ ✔ | 10.1+ ✔ | Nope ✘ |

## Dependencies

This library depends on [fetch](https://fetch.spec.whatwg.org/) to make requests to the EduSigner. For environments that don't support fetch, you'll need to provide a [polyfill](https://github.com/github/fetch) to browser or [polyfill](https://github.com/bitinn/node-fetch) to Node.

## Installation

Get ![EduSignerWS](https://certificaedu.com.br/install).

```sh
$ npm install edu-signer-js --save
```

## How to use

### ES6

```js
// to import a specific method
import EduSigner from 'edu-signer-js';

const signer = new EduSigner({
  licenseKey: 'YOUR_KEY_HERE'
});

// using  method
pki = signer.PKI;
pki.getVersion().then(data => {
  console.log('Version: ' + data.version);
});
```

### CommonJS

```js
const EduSigner = require('edu-signer-js').default;

const signer = new EduSigner({
  licenseKey: 'YOUR_KEY_HERE'
});
```

### UMD in Browser

```html
<!-- to import non-minified version -->
<script src="edu-signer-js.umd.js"></script>

<!-- to import minified version -->
<script src="edu-signer-js.umd.min.js"></script>
```

After that the library will be available to the Global as `EduSigner`. Follow an example:

```js

const signer = new EduSigner({
  licenseKey: 'YOUR_KEY_HERE'
});

pki = signer.PKI;
pki.getVersion().then(data => {
  console.log('Version: ' + data.version);
});
```

## Methods

> Follow the methods that the library provides.

### pki.getVersion()

**Example**

```js
  pki.getVersion().then(data => {
    console.log('Version: ' + data.version);
  }).catch(err => {
    window.location.href = 'https://certificaedu.com.br/install'; //Will take to the installation page.
  });
```

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
