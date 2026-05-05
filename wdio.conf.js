const fs = require('fs');
const path = require('path');

require('dotenv').config();

const browserstackFilesDir = path.join(__dirname, '.browserstack');

if (!fs.existsSync(browserstackFilesDir)) {
  fs.mkdirSync(browserstackFilesDir, { recursive: true });
}

process.env.BROWSERSTACK_FILES_DIR = browserstackFilesDir;

const defaultSpecs = ['./test/**/*.js'];
const deviceProfiles = {
  samsung_s22: {
    platformName: 'Android',
    automationName: 'UiAutomator2',
    deviceName: 'Samsung Galaxy S22',
    platformVersion: '12.0',
    sessionName: 'android samsung s22'
  },
  pixel_8: {
    platformName: 'Android',
    automationName: 'UiAutomator2',
    deviceName: 'Google Pixel 8',
    platformVersion: '14.0',
    sessionName: 'android pixel 8'
  },
  iphone_15: {
    platformName: 'iOS',
    automationName: 'XCUITest',
    deviceName: 'iPhone 15',
    platformVersion: '17',
    sessionName: 'ios iphone 15'
  }
};
const selectedProfileName = process.env.BROWSERSTACK_DEVICE_PROFILE || 'samsung_s22';
const selectedProfile = deviceProfiles[selectedProfileName];

function resolveBrowserstackApp(profile) {
  const platformApps = {
    Android: process.env.BROWSERSTACK_APP_ANDROID,
    iOS: process.env.BROWSERSTACK_APP_IOS
  };
  const selectedApp = platformApps[profile.platformName];

  if (selectedApp) {
    return selectedApp;
  }

  throw new Error(
    `Selected ${profile.platformName} profile requires ${profile.platformName === 'iOS' ? 'BROWSERSTACK_APP_IOS' : 'BROWSERSTACK_APP_ANDROID'} ` +
    'to point to a BrowserStack app reference such as bs://..., a custom_id, or a shareable_id.'
  );
}

if (!selectedProfile) {
  throw new Error(
    `Unknown BROWSERSTACK_DEVICE_PROFILE "${selectedProfileName}". ` +
    `Use one of: ${Object.keys(deviceProfiles).join(', ')}`
  );
}

const browserstackApp = resolveBrowserstackApp(selectedProfile);

exports.config = {
  runner: 'local',

  user: process.env.BROWSERSTACK_USERNAME,
  key: process.env.BROWSERSTACK_ACCESS_KEY,

  specs: process.env.WDIO_SPEC ? [process.env.WDIO_SPEC] : defaultSpecs,

  maxInstances: 1,
  logLevel: 'info',
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,

  framework: 'mocha',
  reporters: ['spec'],

  services: [
    ['browserstack', {
      app: browserstackApp,
      percy: false
    }]
  ],

  capabilities: [{
    platformName: selectedProfile.platformName,
    'appium:automationName': selectedProfile.automationName,
    'bstack:options': {
      deviceName: selectedProfile.deviceName,
      platformVersion: selectedProfile.platformVersion,
      projectName: 'TheApp demo',
      buildName: process.env.BROWSERSTACK_BUILD_NAME || 'TheApp mobile tests',
      sessionName: selectedProfile.sessionName,
      interactiveDebugging: true,
      video: true
    }
  }],

  mochaOpts: {
    ui: 'bdd',
    timeout: 60000
  }
};
