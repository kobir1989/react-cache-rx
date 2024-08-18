import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import babel from '@rollup/plugin-babel'
import terser from '@rollup/plugin-terser'
import json from '@rollup/plugin-json'

const devMode = process.env.NODE_ENV === 'development'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'es',
      sourcemap: devMode ? 'inline' : false
    }
  ],
  plugins: [
    json(),
    resolve({
      browser: true,
      preferBuiltins: false
    }),
    commonjs(),
    typescript(),
    babel({
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      exclude: 'node_modules/**',
      babelHelpers: 'runtime',
      presets: ['@babel/preset-env', '@babel/preset-react'],
      plugins: ['@babel/plugin-transform-runtime']
    }),
    terser({
      ecma: 2020,
      module: true,
      compress: {
        toplevel: true,
        unsafe_arrows: true,
        drop_console: !devMode,
        drop_debugger: !devMode
      },
      output: { quote_style: 1 }
    })
  ],
  external: ['react']
}
