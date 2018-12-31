const path = require("path");
const fs = require("fs-extra");
const loaderUtils = require("loader-utils");
const { getFileHash, getPublicPath, getOutputPath } = require("./utils");
const css = require('css');
const URLJoin = require("url-join");
const CSS_URL_REGEXP = /url\s*(\(\s*.*?\s*\))/g;
const URL_REGEXP = /^.+?\.\w+/;

module.exports = function (content, map) {
  const callback = this.async();
  if (!CSS_URL_REGEXP.test(content)) {
    return callback(null, content, map);
  }

  const options = loaderUtils.getOptions(this) || {};
  const ast = css.parse(content);
  const resourcePath = path.dirname(this.resourcePath);
  const publicPath = getPublicPath(this._compilation, options);
  const outputPath = getOutputPath(options);
  const resPromises = [];

  ast.stylesheet.rules.forEach(rule => {
    if (rule.type === "rule") {
      rule.declarations.forEach(declaration => {
        const urlValue = declaration.value && declaration.value.match(CSS_URL_REGEXP);
        if (urlValue) {
          const url = urlValue[0].replace(/^url\(["']?/, "").replace(/["']?\)$/, "").trim();
          const clearPath = URL_REGEXP.exec(url)[0]; //get real path without url query
          const sourceFilePath = path.join(resourcePath, clearPath);
          const file = options.hash === false ? path.parse(sourceFilePath).base : getFileHash(sourceFilePath).then(f => `${f}${path.extname(sourceFilePath)}`);

          resPromises.push((() => {
            const outputName = URLJoin(outputPath, file);
            declaration.value = declaration.value.replace(url, URLJoin(publicPath, outputName));
            return fs.readFile(sourceFilePath).then(data => {
              this.emitFile(outputName, data);
            });
          })());
        }
      })
    }
  });

  Promise.all(resPromises)
    .then(() => callback(null, css.stringify(ast), map));

};
