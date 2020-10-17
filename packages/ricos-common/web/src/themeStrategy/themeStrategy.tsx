import React from 'react';
import createPalette from './generatePalette';
import createTypography from './generateTypography';
import { defaultTheme } from './defaults';
import { buildCssVars } from './themeUtils';
import { ThemeStrategyArgs, ThemeStrategyResult } from './themeTypes';
import { isDefined } from 'ts-is-present';

export default function themeStrategy(args: ThemeStrategyArgs): ThemeStrategyResult {
  const { ricosTheme = {}, plugins = [], cssOverride = {} } = args;
  const themeGeneratorFunctions = plugins.map(plugin => plugin.theme).filter(isDefined);
  const { parentClass = '', palette, typography } = ricosTheme;

  const paletteVarsObject = createPalette(palette, themeGeneratorFunctions);
  const typographyVarsObject = createTypography(typography);

  const html = (
    <style type="text/css" key={'styleElement'}>
      {buildCssVars(parentClass, paletteVarsObject, typographyVarsObject)}
    </style>
  );

  return {
    theme: { ...defaultTheme, ...cssOverride },
    html,
  };
}
