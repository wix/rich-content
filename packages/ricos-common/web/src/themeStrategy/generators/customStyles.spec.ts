import { CssVarsObject, RicosCustomTheme } from '../themeTypes';
import { mockCustoms, mockOutput } from '../../../tests/mockCustomStyles';
import createCustomStyles from './customStyles';

describe('CustomTheme', () => {
  const mocks: { input?: RicosCustomTheme; output: CssVarsObject }[] = [
    { input: undefined, output: {} },
    { input: {}, output: {} },
    {
      input: mockCustoms as RicosCustomTheme,
      output: mockOutput,
    },
  ];

  it('should return empty object if customStyles is empty / undefined', () => {
    const cssVars1 = createCustomStyles(mocks[0].input);
    const cssVars2 = createCustomStyles(mocks[1].input);
    expect(cssVars1).toEqual({});
    expect(cssVars2).toEqual({});
  });

  it('should apply customStyles', () => {
    const cssVars = createCustomStyles(mocks[2].input);
    expect(cssVars).toStrictEqual(mocks[2].output);
  });
});
