import * as config from '@lvce-editor/eslint-config'
import * as actions from '@lvce-editor/eslint-plugin-github-actions'

export default [
  ...config.default,
  ...config.recommendedVirtualDom,
  ...actions.default,
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
    },
  },
]
