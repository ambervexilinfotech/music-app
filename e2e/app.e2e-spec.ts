import { MusicAppPage } from './app.po';

describe('music-app App', () => {
  let page: MusicAppPage;

  beforeEach(() => {
    page = new MusicAppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
