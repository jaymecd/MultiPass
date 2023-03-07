MultiPass for basic authentication
==================================

This extension allows you to register credential associated to a regular expression.

When you browse a website that requires HTTP basic authentication, if the URL match against
one of the regular expression, the credentials will be automatically sent.

No more cumbersome login popin, everything is done in the background.

Chrome web store
----------------

The extension is available on the Chrome web store: [MultiPass for HTTP basic authentication](https://chrome.google.com/webstore/detail/multipass-for-http-basic/enhldmjbphoeibbpdhmjkchohnidgnah).

Opera add-ons
-------------

The extension is available as an Opera add-on : [MultiPass](https://addons.opera.com/en/extensions/details/multipass/).

Firefox Add-ons
---------------

The extension is available as a Firefox add-on : [MultiPass](https://addons.mozilla.org/en-US/firefox/addon/multipass/).

Report an issue
---------------

If you want to report an issue, use the Github issue tracker: [MultiPass issues](https://github.com/krtek4/MultiPass/issues).

Please make sure the issue is not already opened.

Build the extension
-------------------

1. Clone the github repository : `git clone git@github.com:krtek4/MultiPass.git`.
2. Enter the directory : `cd MultiPass`.
3. Install dependencies : `npm ci`.
4. Build the extension : `npm run dist`.
5. The package for all supported browser is now available in the `dist` folder.

The installation process will depend on your browser.

`NOTE` on how to build the extension in `docker`:

1. start docker container:

    ```
    $ docker run --rm -ti -v "${PWD}:/code" -w /code node:12-alpine sh
    ```

1. install dependencies and theirs prerequisites:

    ```
    $ apk add --no-cache make g++ python3
    $ npm ci
    ```

3. build the extension:

    ```
    $ npm run dist
    ```

Use the development version
---------------------------

If you want to use the development version, follow those steps :

1. Clone the github repository : `git clone git@github.com:krtek4/MultiPass.git`.
2. Enter the directory : `cd MultiPass`.
3. Install dependencies : `npm install`.
4. Build the extension : `npm run build`.
5. Open the Extension panel in Chrome : Tools / Extensions.
6. Make sure the "Developer mode" checkbox is checked.
7. Click on "Load unpacked extension...", first browse to the directory where you cloned the extension and then select the `build/chrome` folder.

Using the development version on Opera and Firefox is left as an exercise for the reader ;)

Credits
-------

* [Gilles Crettenand](http://gilles.crettenand.info): original idea and development
* [Jeroen Thora](https://github.com/acrobat): Dutch translation
* [Pascal Thormeier](https://github.com/thormeier): German translation
* [AceGentile](https://github.com/AceGentile): Italian translation
* [Piotr](https://github.com/xadereq): Polish translation
