describe('App launch', () => {
  let source = '';

  afterEach(() => {
    if (!source) {
      return;
    }

    console.log('----- PAGE SOURCE START -----');
    console.log(source);
    console.log('----- PAGE SOURCE END -----');
  });

  it('debug UI', async () => {
    source = await driver.getPageSource();
  });
});
