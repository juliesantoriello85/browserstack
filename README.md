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
    |-- appLaunch.js
    `-- login.test.js
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
BROWSERSTACK_APP_ID=bs://your_app_id
BROWSERSTACK_DEVICE_PROFILE=samsung_s22
```

## Run A Single Test

To run a specific test file, use:

```bash
npx wdio run wdio.conf.js --spec ./test/myNewTest.js
```

Example:

```bash
npx wdio run wdio.conf.js --spec ./test/appLaunch.js
```

## Run All Tests

To run every file inside `test/`, use:

```bash
npm run test:all
```

At the moment, this includes:

- `test/appLaunch.js`
- `test/login.test.js`

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
- `npm run test:all` runs all specs under `test/`.
- `test/login.test.js` is currently a placeholder and its only test is marked `skip`, so it will not execute real login steps until that file is implemented.
- BrowserStack credentials and app id must be valid for the run to start.
- The selected device profile affects both single-test and all-tests runs.
