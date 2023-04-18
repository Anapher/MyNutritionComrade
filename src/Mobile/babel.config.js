module.exports = function (api) {
   api.cache(true);
   return {
      presets: ['babel-preset-expo', 'module:metro-react-native-babel-preset'],
      env: {
         production: {
            plugins: ['react-native-paper/babel'],
         },
      },
      plugins: [
         '@babel/plugin-proposal-unicode-property-regex',
         [
            'babel-plugin-root-import',
            {
               rootPathPrefix: 'src/',
               rootPathSuffix: './src',
            },
         ],
      ],
   };
};
