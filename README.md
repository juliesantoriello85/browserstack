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
BROWSERSTACK_APP_ANDROID=bs://your_android_app_id
BROWSERSTACK_APP_IOS=bs://your_ios_app_id
BROWSERSTACK_DEVICE_PROFILE=samsung_s22
```

Preferred setup for a project that runs on both Android and iOS:

- `BROWSERSTACK_APP_ANDROID` for Android builds
- `BROWSERSTACK_APP_IOS` for iOS builds

Each app value can be:

- a BrowserStack `app_url` such as `bs://...`
- a BrowserStack `custom_id`
- a BrowserStack `shareable_id`

Backward compatibility:

- `BROWSERSTACK_APP` still works as a generic fallback and is mainly useful for Android-only setups
- `BROWSERSTACK_APP_ID` is still accepted as a legacy fallback

## Use TheApp On BrowserStack

Recommended first setup: use the Android build of `appium-pro/TheApp`.

Reference:

- GitHub repository: `appium-pro/TheApp`
- Repository access: public
- Releases: use the GitHub Releases section of that repository to download test app builds before uploading them to BrowserStack. `.apk` for Android and `.app.zip` for iOS

1. Download the latest Android `.apk` release for TheApp from the GitHub releases page.
2. Upload it to BrowserStack.
3. Copy the returned BrowserStack app reference.
4. Put that value in `.env` as `BROWSERSTACK_APP_ANDROID=...`.
5. Run the smoke test with an Android profile such as `samsung_s22` or `pixel_8`.

Example `.env`:

```env
BROWSERSTACK_USERNAME=your_username
BROWSERSTACK_ACCESS_KEY=your_access_key
BROWSERSTACK_APP_ANDROID=bs://your_uploaded_theapp_android_id
BROWSERSTACK_APP_IOS=bs://your_uploaded_theapp_ios_id
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
BROWSERSTACK_APP_ANDROID=theapp-android
```

Using stable platform-specific `custom_id` values makes it easy to replace uploaded builds later without changing the test config.

### Why Start With Android

TheApp publishes Android `.apk` releases and iOS `.app.zip` releases. BrowserStack App Automate accepts Android app uploads as `.apk` / `.aab` / `.xapk`, but for iOS it expects `.ipa`, so Android is the cleanest way to get started quickly with this demo app.

## Platform-Aware App Selection

The selected device profile controls both the device and which app reference is used:

- Android profiles such as `samsung_s22` and `pixel_8` use `BROWSERSTACK_APP_ANDROID`
- iOS profiles such as `iphone_15` use `BROWSERSTACK_APP_IOS`

For backward compatibility, Android profiles can still fall back to `BROWSERSTACK_APP`. iOS profiles do not use the generic fallback, because an Android app id on an iPhone profile would fail anyway.

This means `@ios` and `@android` are still just test tags. The actual platform run is determined by:

1. `BROWSERSTACK_DEVICE_PROFILE`
2. the matching uploaded app reference for that platform

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

Run Android smoke tests on Samsung S22 in PowerShell:

```powershell
$env:BROWSERSTACK_DEVICE_PROFILE='samsung_s22'
npx wdio run wdio.conf.js --mochaOpts.grep "@android"
```

Run iOS tests on iPhone 15 in PowerShell:

```powershell
$env:BROWSERSTACK_DEVICE_PROFILE='iphone_15'
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

## GitHub Actions

A ready-to-use workflow is available at [.github/workflows/browserstack-mobile.yml](/c:/Users/julie.santoriello/workspace/browserstack/.github/workflows/browserstack-mobile.yml:1).

It does two things:

- on pull requests, it runs separate jobs for `@smoke`, `@boundary`, `@regression`, and `@navigation`
- on the nightly schedule at `02:00` UTC, and on manual dispatch, it runs the full suite with `npx wdio run wdio.conf.js`

Before it can run in GitHub, create these repository secrets:

- `BROWSERSTACK_USERNAME` -> your BrowserStack username
- `BROWSERSTACK_ACCESS_KEY` -> your BrowserStack access key
- `BROWSERSTACK_APP_ANDROID` -> your Android BrowserStack app reference such as `bs://...` or a stable `custom_id`
- `BROWSERSTACK_APP_IOS` -> your iOS BrowserStack app reference such as `bs://...` or a stable `custom_id`

Optional compatibility secret:

- `BROWSERSTACK_APP` -> generic fallback, mainly useful if you only run Android

Where to add them in GitHub:

1. Open the repository on GitHub.
2. Click `Settings`.
3. In the left sidebar, click `Secrets and variables`, then `Actions`.
4. Stay on the `Secrets` tab.
5. In the `Repository secrets` section, click `New repository secret`.
6. Create these secrets there:
   `BROWSERSTACK_USERNAME`, `BROWSERSTACK_ACCESS_KEY`, `BROWSERSTACK_APP_ANDROID`, `BROWSERSTACK_APP_IOS`

Use `Repository secrets`, not `Environment secrets`, because this workflow reads `${{ secrets.BROWSERSTACK_USERNAME }}`, `${{ secrets.BROWSERSTACK_ACCESS_KEY }}`, `${{ secrets.BROWSERSTACK_APP_ANDROID }}`, and `${{ secrets.BROWSERSTACK_APP_IOS }}` directly and none of the jobs declare a GitHub Actions `environment`. Use `secrets`, not `variables`, because these values are sensitive credentials and app identifiers. Repository or environment variables are better for non-sensitive values such as a default device profile. If you later introduce a GitHub Actions environment like `staging` or `production`, then environment secrets would make sense for jobs that explicitly reference that environment.

Recommended setup:

1. Push this workflow file to your repository.
2. In GitHub, open `Settings` -> `Secrets and variables` -> `Actions` -> `Secrets`.
3. In `Repository secrets`, add `BROWSERSTACK_USERNAME`, `BROWSERSTACK_ACCESS_KEY`, `BROWSERSTACK_APP_ANDROID`, and `BROWSERSTACK_APP_IOS`.
4. Optional: if you want the CI device to be configurable in GitHub rather than fixed in the workflow, add `BROWSERSTACK_DEVICE_PROFILE` as a repository variable under `Settings` -> `Secrets and variables` -> `Actions` -> `Variables`.
5. Open the `Actions` tab and confirm that GitHub Actions is enabled for the repository.
6. Merge or open a pull request to trigger the smoke job.
7. Use `Run workflow` in the `Actions` tab if you want to trigger the full suite manually before the nightly schedule.

Notes:

- the workflow uses `npm ci`, so `package-lock.json` must stay committed
- the default device profile in CI is `samsung_s22`
- each pull request tag lane is a separate job, so you can keep, remove, or rename them as your tag strategy evolves
- pull requests coming from forks usually do not receive repository secrets, so BrowserStack runs are most reliable for branches inside the same repository or trusted contributors

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

When you switch to `iphone_15`, make sure `BROWSERSTACK_APP_IOS` points to an iOS build uploaded to BrowserStack.

## Notes

- `npx wdio run wdio.conf.js --spec ./test/myNewTest.js` runs one specific test file.
- `npx wdio run wdio.conf.js` runs all specs under `test/`.
- `npx wdio run wdio.conf.js --mochaOpts.grep "@smoke"` runs only tests whose title contains `@smoke`.
- `test/@regression/echoBox.test.js` opens TheApp Echo Box screen using an accessibility id selector.
- BrowserStack credentials and the platform-specific BrowserStack app reference must be valid for the run to start.
- The selected device profile affects both single-test and all-tests runs.
