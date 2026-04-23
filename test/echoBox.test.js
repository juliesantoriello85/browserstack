describe('Echo Box', () => {
  let source = '';

  afterEach(() => {
    if (!source) {
      return;
    }

    console.log('----- PAGE SOURCE START -----');
    console.log(source);
    console.log('----- PAGE SOURCE END -----');
  });

  it('should open Echo Box screen using accessibility id', async () => {
    const echoBox = await $('~Echo Box');
    await echoBox.click();

    const title = await $('//*[@text="Echo Box"]');
    await expect(title).toBeDisplayed();

    source = await driver.getPageSource();
  });
});
