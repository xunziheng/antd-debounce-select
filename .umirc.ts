import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'antd-debounce-select',
  favicon:
    'https://avatars.githubusercontent.com/u/35691153?s=400&u=a0173e2ecd400de3e7ad38cde996f4cbaf777b2b&v=4',
  logo: 'https://avatars.githubusercontent.com/u/35691153?s=400&u=a0173e2ecd400de3e7ad38cde996f4cbaf777b2b&v=4',
  outputPath: 'docs-dist',
  mode: 'site',
  // more config: https://d.umijs.org/config
  extraBabelPlugins: [
    [
      'babel-plugin-import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
      },
    ],
  ],
  apiParser: {
    propFilter: {
      skipNodeModules: true,
    },
  },
});
