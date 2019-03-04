import { IsRouteActivePipe } from './is-route-active.pipe';

describe('IsRouteActivePipe', () => {
  it('create an instance', () => {
    const pipe = new IsRouteActivePipe();
    expect(pipe).toBeTruthy();
  });
});
