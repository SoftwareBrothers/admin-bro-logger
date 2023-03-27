import { withLogger } from '../../src/index.js';

import { ComponentLoader } from 'adminjs';



describe('withLogger', () => {
  const componentLoader = new ComponentLoader()
  it('merges arrays of befores and afters', () => {
    const stubFunction = Promise.resolve;
    const initialAction = {
      after: [stubFunction],
      before: [stubFunction],
    };
    const mergedAction = withLogger(initialAction, { options: { componentLoader } });

    expect(mergedAction.after).toContain(stubFunction);
    expect(mergedAction.after?.length).toEqual(2);
    expect(mergedAction.before).toContain(stubFunction);
    expect(mergedAction.before?.length).toEqual(2);
  });

  it('merges single function of befores and afters', () => {
    const stubFunction = Promise.resolve;
    const initialAction = {
      after: stubFunction,
      before: stubFunction,
    };
    const mergedAction = withLogger(initialAction, { options: { componentLoader } });

    expect(mergedAction.after).toContain(stubFunction);
    expect(mergedAction.after?.length).toEqual(2);
    expect(mergedAction.before).toContain(stubFunction);
    expect(mergedAction.before?.length).toEqual(2);
  });
});
