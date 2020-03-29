export default {
    entry: 'src/index.ts',
    doc: {
        title: 'xdbjs',
        themeConfig: { mode: 'light' },
    },
    autoprefixer: {
        browsers: [
          'ie>10'
        ],
    },
    runtimeHelpers: true,
    esm: {
        type: 'rollup',
        file: 'xdb.esm'
    },
    cjs: {
        type: 'rollup',
        file: 'xdb.cjs'
    },
    umd: {
        file: 'xdb.umd',
        minFile: true
    },
    target: "browser"
  }