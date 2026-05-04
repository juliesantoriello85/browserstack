# BrowserStack Mobile Tests

This project runs Appium + WebdriverIO mobile tests on BrowserStack.

## Project Structure

```text
browserstack/
|-- .env
|-- package.json
|-- package-lock.json
|-- wdio.conf.js
`-- test/
    |-- @boundary/
    |-- @navigation/
    |-- @regression/
    |   `-- echoBox.test.js
    `-- @smoke/
        `-- appLaunch.test.js
```

## Install Dependencies

Run this once from the project root:

```bash
npm install
```

## Environment Variables

Set the required values in `.env`:

```env
BROWSERSTACK_USERNAME=your_username
BROWSERSTACK_ACCESS_KEY=your_access_key
BROWSERSTACK_APP=bs://your_app_id
BROWSERSTACK_DEVICE_PROFILE=samsung_s22
```

`BROWSERSTACK_APP` can be:

- a BrowserStack `app_url` such as `bs://...`
- a BrowserStack `custom_id`
- a BrowserStack `shareable_id`

`BROWSERSTACK_APP_ID` is still accepted as a legacy fallback, but `BROWSERSTACK_APP` is the preferred variable name.

## Use TheApp On BrowserStack

Recommended first setup: use the Android build of `appium-pro/TheApp`.

1. Download the latest Android `.apk` release for TheApp from the GitHub releases page.
2. Upload it to BrowserStack.
3. Copy the returned BrowserStack app reference.
4. Put that value in `.env` as `BROWSERSTACK_APP=...`.
5. Run the smoke test with an Android profile such as `samsung_s22` or `pixel_8`.

Example `.env`:

```env
BROWSERSTACK_USERNAME=your_username
BROWSERSTACK_ACCESS_KEY=your_access_key
BROWSERSTACK_APP=bs://your_uploaded_theapp_id
BROWSERSTACK_DEVICE_PROFILE=samsung_s22
```

### Upload Using BrowserStack UI

In the BrowserStack App Automate dashboard:

1. Open `App Management`.
2. Click `Upload App`.
3. Upload the TheApp `.apk`.
4. Copy the generated app id / app URL.

### Upload Using BrowserStack API

If the TheApp `.apk` is already on your machine, upload it with:

```bash
curl -u "YOUR_USERNAME:YOUR_ACCESS_KEY" ^
  -X POST "https://api-cloud.browserstack.com/app-automate/upload" ^
  -F "file=@C:\path\to\TheApp.apk" ^
  -F "custom_id=theapp-android"
```

Then set:

```env
BROWSERSTACK_APP=theapp-android
```

Using a stable `custom_id` makes it easy to replace the uploaded build later without changing the test config.

### Why Start With Android

TheApp publishes Android `.apk` releases and iOS `.app.zip` releases. BrowserStack App Automate accepts Android app uploads as `.apk` / `.aab` / `.xapk`, but for iOS it expects `.ipa`, so Android is the cleanest way to get started quickly with this demo app.

## Run A Single Test

To run a specific test file, use:

```bash
npx wdio run wdio.conf.js --spec ./test/myNewTest.js
```

Example:

```bash
npx wdio run wdio.conf.js --spec ./test/@smoke/appLaunch.test.js
```

## Run All Tests

To run every file inside `test/`, use:

```bash
npx wdio run wdio.conf.js
```

At the moment, this includes:

- `test/@smoke/appLaunch.test.js`
- `test/@regression/echoBox.test.js`

`npm run test:all` still works and now resolves to the same full-suite behavior.

## Organize Tests With Tags

Tests are grouped under tagged sub-folders in `test/`, and each spec title also contains one or more tags so you can filter with Mocha `grep`.

Current primary folders:

- `@regression`
- `@boundary`
- `@smoke`
- `@navigation`

The folder is for organization. The tag in the `describe(...)` title is what drives CI selection, because a test can belong to several tags at once, including platform tags such as `@android` and `@ios`.

Current examples:

- `test/@smoke/appLaunch.test.js` -> `@smoke @android @ios`
- `test/@regression/echoBox.test.js` -> `@regression @smoke @android @navigation`

## Run Tests By Tag

Run smoke tests:

```bash
npx wdio run wdio.conf.js --mochaOpts.grep "@smoke"
```

Run regression tests:

```bash
npx wdio run wdio.conf.js --mochaOpts.grep "@regression"
```

Run Android-only tests:

```bash
npx wdio run wdio.conf.js --mochaOpts.grep "@android"
```

Run iOS-tagged tests:

```bash
npx wdio run wdio.conf.js --mochaOpts.grep "@ios"
```

Run the full nightly suite:

```bash
npx wdio run wdio.conf.js
```

You can combine tags in a single regular expression when needed. For example, to run PR smoke coverage on Android:

```bash
npx wdio run wdio.conf.js --mochaOpts.grep "(?=.*@smoke)(?=.*@android)"
```

## CI Usage

Typical split:

- Pull request run: `npx wdio run wdio.conf.js --mochaOpts.grep "@smoke"`
- Nightly run: `npx wdio run wdio.conf.js`

You can swap `@smoke` for any other tag set that matches your CI strategy.

## Switch Devices

The active device is controlled by `BROWSERSTACK_DEVICE_PROFILE` in `.env`.

Only one device profile can be used at a time. Do not separate multiple devices with commas.

Available values are:

- `samsung_s22`
- `pixel_8`
- `iphone_15`

Example:

```env
BROWSERSTACK_DEVICE_PROFILE=iphone_15
```

Then run:

```bash
npm test
```

## Current Device Mapping

The device profiles are defined in `wdio.conf.js`:

- `samsung_s22` -> Samsung Galaxy S22 / Android 12 / `UiAutomator2`
- `pixel_8` -> Google Pixel 8 / Android 14 / `UiAutomator2`
- `iphone_15` -> iPhone 15 / iOS 17 / `XCUITest`

## Notes

- `npx wdio run wdio.conf.js --spec ./test/myNewTest.js` runs one specific test file.
- `npx wdio run wdio.conf.js` runs all specs under `test/`.
- `npx wdio run wdio.conf.js --mochaOpts.grep "@smoke"` runs only tests whose title contains `@smoke`.
- `test/@regression/echoBox.test.js` opens TheApp Echo Box screen using an accessibility id selector.
- BrowserStack credentials and `BROWSERSTACK_APP` must be valid for the run to start.
- The selected device profile affects both single-test and all-tests runs.
