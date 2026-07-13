import * as config from '@lvce-editor/eslint-config'
import * as actions from '@lvce-editor/eslint-plugin-github-actions'

export default [
  ...config.default,
  ...actions.default,
  {
    rules: {
      'sonarjs/assertions-in-tests': 'off',
      'unicorn/no-break-in-nested-loop': 'off',
      'unicorn/no-global-object-property-assignment': 'off',
    },
  },
]
