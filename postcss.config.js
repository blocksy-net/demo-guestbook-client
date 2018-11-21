/**
 * Post CSS configuration
 *
 * @author BlockSY team - blocksy@symag.com
 */

module.exports = {
  plugins: {
    'postcss-import': {
      onImport: function (files) {
              files.forEach(this.addDependency); // ...and add dependencies from the main.css files to the other css files...
          }.bind(this)
    },
    'postcss-simple-vars': {},
    'postcss-focus': {},
    'postcss-reporter':{
      clearMessages: true
    },
    'postcss-cssnext': {
      browsers: ['last 2 versions', '> 5%'],
    },
  },
};
