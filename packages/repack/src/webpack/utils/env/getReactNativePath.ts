import path from 'path';
import { Fallback } from '../../../types';
import { getFallbackFromOptions } from './internal/getFallbackFromOptions';
import { parseCliOptions } from './internal/parseCliOptions';

export function getReactNativePath(
  options: Fallback<string> = {
    fallback: path.dirname(require.resolve('react-native')),
  }
): string {
  const cliOptions = parseCliOptions();
  if (!cliOptions) {
    return getFallbackFromOptions(options);
  }

  return cliOptions.config.reactNativePath;
}
