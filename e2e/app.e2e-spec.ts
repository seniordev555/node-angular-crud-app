import { CalorieAppPage } from './app.po';

describe('calorie-app App', () => {
  let page: CalorieAppPage;

  beforeEach(() => {
    page = new CalorieAppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
