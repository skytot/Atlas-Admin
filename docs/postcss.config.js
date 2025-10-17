// docs/postcss.config.js
import postcssPresetEnv from 'postcss-preset-env'
import cssnano from 'cssnano'

const isProduction = process.env.NODE_ENV === 'production'

export default {
  plugins: [
    postcssPresetEnv({
      stage: 3,
      features: {
        'nesting-rules': true,
        'custom-properties': {
          preserve: isProduction ? false : true
        }
      },
      autoprefixer: {
        flexbox: 'no-2009'
      }
    }),

    isProduction &&
      cssnano({
        preset: [
          'default',
          {
            discardComments: {
              removeAll: true
            },
            mergeRules: true,
            calc: {
              precision: 6
            }
          }
        ]
      })
  ].filter(Boolean)
}
