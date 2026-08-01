import { defineConfig } from 'eslint/config'
import * as config from '@lvce-editor/eslint-config'

export default defineConfig([
  ...config.default,
  ...config.recommendedVirtualDom,
  ...config.recommendedActions,
  {
    rules: {
      'jest/expect-expect': 'off',
      'jest/no-disabled-tests': 'off',
      'sonarjs/assertions-in-tests': 'off',
      'unicorn/no-break-in-nested-loop': 'off',
      'unicorn/no-global-object-property-assignment': 'off',
    },
  },
  {
    files: ['packages/markdown-worker/test/**/*.ts'],
    rules: {
      'virtual-dom/prefer-constants': 'off',
      'virtual-dom/secure-links': 'off',
    },
  },
])
