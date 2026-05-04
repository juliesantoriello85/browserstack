describe('App launch @smoke @android @ios', () => {
  let source = '';

  afterEach(() => {
    if (!source) {
      return;
    }

    console.log('----- PAGE SOURCE START -----');
    console.log(source);
    console.log('----- PAGE SOURCE END -----');
  });

  it('should load the app shell', async () => {
    source = await driver.getPageSource();
  });
});
