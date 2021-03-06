This loader is based on [arshtepe's](https://github.com/arshtepe) [css-file-loader](https://github.com/arshtepe/css-file-loader)

[![npm][npm]][npm-url]
[![deps][deps]][deps-url]

<div align="center">
  <img width="180" height="180" vspace="20"
    src="https://cdn.worldvectorlogo.com/logos/css-3.svg">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200"
      src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
  <h1>CSS File Loader</h1>
</div>

## Installation
```
  npm i --save-dev css-files-loader
```

### How it works
This loader **clones** files (images, fonts ...) which referenced from css file like `url (./image.png)`.

```css
.selector {
    background: url(./img.png) no-repeat -122px -293px;
    width: 16px;
}
```
it will be replaced by
```css
.selector {
    background: url([options.publicPath]/[file hash].png) no-repeat -122px -293px; 
    /*For example url(http://localhost/ad31..2a.png)  */
    width: 16px;
}
```
and `[file hash].png` will copy to [output.path](https://webpack.js.org/configuration/output/#output-path) folder and filename replaced by file hash `[file hash].png`

### webpack.config.js
```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ 'css-loader', 'css-files-loader' ]
      }
    ]
  }
}
```

Combine with other loaders like sass
## Important: css-files-loader must be before sass-loader
```js
...
    rules: [
      {
        test: /\.scss$/,
        use: [ 'css-loader', 'css-files-loader', 'sass-loader' ]
      }
    ]
...
```

## Options

Name | Type | Default | Description
------------ | ------------- | -------------  | ------------- 
`publicPath` | `{String}` | [output.publicPath](https://webpack.js.org/configuration/output/#output-publicpath) or `/` if `options.publicPath` and `output.publicPath` are empty | This option specifies the public URL of the output directory when referenced in a browser.**Must have slash at the end** `/hello/` 
`outputPath` | `{String}` | empty | This option is appended to publicPath. Ex. `publicPath/outputPath/filename.ext` 
`hash` | `{Boolean}` | true | Set to `false` to disable file name hashing 


## Usage with options

```js
{
    test: /\.scss$/,
    use: [
        {loader: "css-loader"},
        {
            loader: "css-files-loader", options: {
                publicPath: "/basePath/" ,
                outputPath: "/assets/" , // appended to publicPath (/basePath/assets/)
                hash: false
            }
        },
        {loader: "sass-loader"}
    ]
}
```