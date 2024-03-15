# webpack.config.js 描述

## 一、mode
### **控制Webpack的编译模式**

可以设置为"**development**"、"**production**"或"**none**"。

不同的模式会影响Webpack默认的一些配置和优化策略。

具体来说，各个模式的功能如下：

- `none`：即不开启任何优化选项，该模式在基础配置环节中使用。
- `development`：会开启一些调试工具和插件，确保输出代码的可读性和易调试性。
  
  例如，会将`process.env.NODE_ENV`设为`development`，启用eval型source map，不进行代码压缩等。
- `production`：会对输出代码进行一系列性能优化，以提高网站性能并缩小包的体积。
  
  例如，会将`process.env.NODE_ENV`设为`production`，关闭debugger语句和console语句，压缩输出代码等。

> 需要注意的是，不同模式下的配置是可以自定义的。也就是说，如果需要的话，可以通过配置文件或CLI命令行参数覆盖Webpack默认的配置。比如，可以在"development"模式下关闭source map，或者在"production"模式下打开热更新。

总而言之，mode选项使得Webpack在不同的场景下有了更好的适应性和性能表现。
> 当前项目配置
```js
mode: "production"
```
## 二、entry
### **指定一个或多个入口文件**
选项可接受以下形式的值：
- 一个字符串，表示单一入口点，
  
  例如`entry: './src/index.js'`。这将告诉Webpack从index.js这个文件开始构建依赖图谱。
- 一个数组，表示多个入口点，
  
  例如`entry: ['./src/index1.js', './src/index2.js']`。这将告诉Webpack同时从index1.js和index2.js这两个文件开始构建依赖图谱，并将它们合并到一个最终输出文件中。
- 一个对象，适用于具有更复杂场景下的情况，可以使用键值对的方式命名各个入口，
  
  例如`entry: { main: './src/index.js', vendor: 'lodash' }`。这将告诉Webpack分别从index.js和lodash这两个资源开始构建依赖图谱。

> 需要注意的是，在使用多个入口点时，Webpack会为每个入口点创建一个独立的依赖图谱，并生成相应的输出文件。因此，在优化打包体积方面，建议尽可能地减少入口点数量，或者通过webpack插件和代码拆分来降低代码冗余。

如果省略entry选项，则默认为./src/index.js。
> 当前项目配置
```js
entry: {
    main: "./build/main.js",
    component: "./build/component.js",
    win: "./src/static/js/core/win.js",
    window: "./src/static/js/core/window.js",
}
```
## 三、output
### **指定打包后的输出文件的相关配置**
常用的output选项和其作用如下：
- `path`：指定生成文件的存放目录。通常是一个绝对路径。
- `filename`：指定生成文件的名称，可以包含文件路径。模板字符串可用，
  
  例如`[name].[hash].js`。其中`[name]`会被替换为入口名或 `Chunk` 的名字，`[hash]`会被替换为唯一hash值，可防止浏览器缓存旧代码。
- `chunkFilename`：除了入口`entry`之外的`chunk`（比如异步导入的模块）的文件名，当webpack运行过程中，有部分模块被分离出来成为单独的小块，这种小块就称作`Chunk`，而`chunkFilename`则用于指定`Chunk`文件的生成规则，默认是`[id].[name].[chunkhash].js`但也支持和`filename`相同的模板字符串。
- `publicPath`：指定静态资源的url前缀，影响引入这些资源时的路径。默认值是空字符串""，表示相对路径。如果不为''，最后会生成例如`src="/js/main.6d18efe5.js"`这样的引用地址。一般用于部署CDN等情况。
> 需要注意的是，output项和entry项常常是相互依赖的配置项。在使用多个入口点和代码拆分时，需要合理配置output选项以确保最终打包结果符合预期。

> 当前项目配置
```js
output: {
    publicPath: "/",
    path: path.resolve(__dirname, "../dist"),
    filename: "static/[name].[chunkhash:8].js",
    chunkFilename: "static/[name].[chunkhash:8].js",
}
```
## 三、module
### **用于配置模块解析规则和加载器**
常用的module选项和其作用如下：
- `rules`：一个数组，包含一组针对特定文件类型的规则`rule`，每个规则中都可以指定相应的`loader`、`condition`（匹配某些路径）、`exclude`或`include`等。
- `noParse`：一个正则表达式，用于告诉Webpack哪些文件可以忽略解析，提高打包速度。通常用于指定不需要经过转换的第三方库。
> 需要注意的是，在本地开发环境中使用大量的loader和规则可能会影响性能，因此建议只针对需要特殊处理的文件类型进行对应配置，并随时关注打包结果以确保符合预期。同时也可以使用Webpack插件和优化工具来实现更高效的模块解析和加载。

## module.rules
> 当前项目配置
```js
{
    test: /\.(sa|sc|c)ss$/,
    use: [
        process.env.NODE_ENV === "development" ? "style-loader" : MiniCssExtractPlugin.loader,
        { loader: "css-loader" },
        {
            loader: "postcss-loader",
            options: {
                sourceMap: true,
                plugins: [Autoprefixer({})],
            },
        },
    ],
    exclude: /node_modules/,
}
```
这是一个用于处理CSS和SCSS文件的webpack配置规则。

具体来说，当打包过程中遇到以`.css`、`.scss`或`.sass`结尾的文件时，将使用以下几个加载器(`loader`)依次对其进行处理：

- `style-loader`（仅在开发环境下生效）：将CSS样式表以`<style>`标签形式插入到HTML文件的`<head>`中，使得浏览器能够直接解析并渲染出样式效果。注意，由于这种方式的插入位置和方式比较特殊，可能会带来一些意料之外的问题，因此建议只在开发环境中使用该loader。

- `MiniCssExtractPlugin.loader`（在非开发环境下生效）：将CSS代码拆分出来单独生成一个CSS文件，可以让Webpack按需加载时更加高效。需要注意的是，在使用该方式时，还需要安装和启用`mini-css-extract-plugin`插件。

- `css-loader`：解析CSS文件，并将所依赖的其他文件(如`@import`语句引入的其他css文件等)也打包进来，最终生成处理后的CSS文件。需要注意的是，`css-loader`本身不会输出任何内容，仅将CSS代码传递给下一个loader。

- `postcss-loader`：通过`PostCSS`插件对CSS进行转换，具体可以使用该`loader`的`options`属性中的plugins选项配置相应的插件。在这里，该作用主要是为了自动添加浏览器前缀，以兼容不同浏览器之间的差异。

- `exclude`: 选项排除指定目录下的文件不被转换。

> 因此，上述配置规则的作用是: 针对.css、.scss或.sass文件，在开发环境下使用style-loader直接插入到HTML中显示样式效果，在非开发环境下生成单独的CSS文件，并且在解析过程中使用css-loader和postcss-loader进行相应的处理。

> 当前项目配置
```js
{
    test: /\.js$/,
    use: [
        {
            loader: "babel-loader",
            options: {
                presets: ["babel-preset-env"],
            },
        },
    ],
    exclude: /node_modules/,
}
```
这是一个用于处理JavaScript文件的webpack配置规则。

具体来说，当打包过程中遇到以`.js`结尾的文件时，将使用`babel-loader`加载器对其进行转换处理。 `babel-loader`是Webpack中与Babel集成的主要工具之一，主要目的是使得代码能够在更多的浏览器中运行，也可以通过该工具转换`ES6/7`等语法为支持的旧版语法。具体操作包括：

- 对`JavaScript`文件进行语法转换和降级操作。
- 允许制定不同种类的转换插件来执行特定的转换任务。

该规则的配置选项如下：

- `options`: 用于指定相应的loader参数，代表了具体的babel编译选项。其中，`presets: ["babel-preset-env"]`表示使用最新版本的`babel-preset-env`对JS进行编译处理，以兼容不同浏览器之间的差异。
> 需要注意，在项目开发中可能会有一些公共的库（例如react、lodash、jquery等）通过npm包管理工具安装，并被引入到项目中作为依赖使用。这类公共库通常在开发过程中只需要被加载一次，因此我们可以通过exclude选项在Webpack编译时忽略掉这些库所在的目录。在上述配置规则中，exclude: /node_modules/指定node_modules目录下的JS文件不需要经过编译处理。

> 当前项目配置
```js
{
    test: /\.(png|jpe?g|gif|webp|icon)$/i,
    use: [
        {
            loader: "url-loader",
            options: {
                limit: 8192,
                name: "[path][name].[ext]?[hash:8]",
                outputPath: (url, resourcePath, context) => {
                    return path.join(
                        "assets",
                        path
                            .relative(context, resourcePath)
                            .replace(new RegExp(`\\${path.sep}`, "g"), "/")
                            .replace(/^src\/static/, "")
                    );
                },
            },
        },
        // 图片压缩
        {
            loader: "image-webpack-loader", // 压缩图片
            options: {
                // 这里可以单独配置每种图片格式的压缩参数
                mozjpeg: {
                    progressive: true,
                    quality: 65,
                },
                // optipng.enabled: false will disable optipng
                optipng: {
                    enabled: false,
                },
                pngquant: {
                    quality: [0.65, 0.9],
                    speed: 4,
                },
                gifsicle: {
                    interlaced: false,
                },

                // the webp option will enable WEBP
                webp: {
                    quality: 75,
                },
            },
        },
    ],
}
```
这是一个用于处理图片文件的webpack配置规则。

具体来说，当打包过程中遇到以`.png`、`.jpg`、`.jpeg`、`.gif`、`.webp`或者`.icon`结尾的文件时，

将使用`url-loader`加载器对其进行转换处理。 `url-loader`是Webpack中一个比较流行的优化工具，能够将较小的图片资源(依据`limit`值)转为`base64`编码，从而减少HTTP请求次数以提高加载速度。而对于大型的图片资源，则会被直接复制到输出目录。

该规则包括以下内容：
- `test`: 一个正则表达式，表示哪些文件应该被该规则匹配。

    这里的正则表达式是匹配以(`.woff`、`.woff2`、`.eot`、`.ttf`、`.otf`)结尾的文件路径。
- `use`: 一个`loader`数组，用于描述如何处理匹配到的文件。

    这里只使用单个loader `url-loader`
- `loader`: 表示要使用的`loader`

    在这个例子中，我们使用`url-loader`来处理这些文件。
- `options`: 是传递给该 loader 的选项对象

    根据需要传递以下选项来调整文件的输出路径和名称：
  - `limit`：设置inline限制大小为8KB，当文件小于此值时，将转换成base64格式内嵌在js中，否则将生成实际的文件。
  - `name`: 指定输出的文件名，可以带有占位符(`placeholder`)从而根据信息动态生成文件名。其中一些常见的占位符包括:
  
    `[name]`：原始文件名（不含扩展名）

    `[ext]`：原始文件扩展名

    `[hash]`：基于文件内容计算出的hash值

    `[path]`：原始文件路径 在这个例子中，输出的文件名使用了类似的占位符模式，确保文件名与源文件一致。
    
    例如`[path][name].[ext]?[hash:8]`这将在输出目录中按原有目录结构自动创建相应的目录，并在文件名后面加入 8 位的 hash 值用于缓存更新。
  - `outputPath`: 表示输出文件的目录，默认情况下生成的文件会放在默认的 `output.path` 目录下，但通过该属性可以对输出路径进行自定义。这里使用了一个函数实现自定义输出路径的效果，将所有文件都移动到了`assets`目录下。等价于设置`output.path`为`'../dist/assets'`。

接下来是`image-webpack-loader`，用于对图片进行压缩，针对不同格式的图片还可以单独配置压缩参数。这里使用了以下压缩选项：
- `mozjpeg`：启用JPEG格式压缩，采用渐进式加载模式和65%的质量。
- `optipng`：禁用PNG格式压缩，此处没有设置该选项。
- `pngquant`：启用PNG格式压缩，质量范围为0.65~0.9之间，速度为4。
- `gifsicle`：启用GIF格式的压缩，关闭隔行扫描（interlaced）模式。
- `webp`：启用WebP格式，质量为75。

最后，这里也使用了与前面类似的写法，手动指定输出路径。不同之处是，此处包括了路径名与文件名，因此需要分别进行处理。
> 具体来说，这个工具使用多种压缩算法，例如mozjpeg、optipng、pngquant、gifsicle和webp等，通过对不同格式的图片逐一处理，将其优化后替换掉原有的文件，从而达到优化打包体积和提高加载速度的目的。

> 当前项目配置
```js
{
    test: /favicon\.ico$/,
    use: [
        {
            loader: "url-loader",
            options: {
                limit: 8192, // 8KB
                name: "[path][name].[ext]?[hash:8]",
                outputPath: (url, resourcePath, context) => {
                    return path.join(
                        "assets",
                        path
                            .relative(context, resourcePath)
                            .replace(new RegExp(`\\${path.sep}`, "g"), "/")
                            .replace(/^src\/static/, "")
                    );
                },
            },
        },
    ],
}
```
这是一个webpack配置规则，用于加载`favicon.ico`文件并将其打包。

具体来说，该规则是针对位于项目根目录下的`favicon.ico`文件进行匹配。当匹配到此类文件时，将使用`url-loader`作为加载器来处理它们，并且使用options对象来指定loader参数。

该规则包括以下内容：
- `test`: 一个正则表达式，表示哪些文件应该被该规则匹配。

    这里的正则表达式是匹配以`favicon.ico`结尾的文件路径。
- `use`: 一个loader数组，用于描述如何处理匹配到的文件。

    这里只使用单个loader `url-loader`
- `loader`: 表示要使用的loader

    在这个例子中，我们使用`url-loader`来处理这些文件。
- `options`: 是传递给该 loader 的选项对象

    根据需要传递以下选项来调整文件的输出路径和名称：
  - `limit`：设置inline限制大小为8KB，当文件小于此值时，将转换成base64格式内嵌在js中，否则将生成实际的文件。
  - `name`: 指定输出的文件名，可以带有占位符(placeholder)从而根据信息动态生成文件名。其中一些常见的占位符包括:
  
    `[name]`：原始文件名（不含扩展名）

    `[ext]`：原始文件扩展名

    `[hash]`：基于文件内容计算出的hash值

    `[path]`：原始文件路径 在这个例子中，输出的文件名使用了类似的占位符模式，确保文件名与源文件一致。
    
    例如`[path][name].[ext]?[hash:8]`这将在输出目录中按原有目录结构自动创建相应的目录，并在文件名后面加入 8 位的 hash 值用于缓存更新。
  - `outputPath`: 表示输出文件的目录，默认情况下生成的文件会放在默认的 `output.path` 目录下，但通过该属性可以对输出路径进行自定义。这里使用了一个函数实现自定义输出路径的效果，将所有文件都移动到了`assets`目录下。等价于设置`output.path`为`'../dist/assets'`。
> 总之，这个webpack规则通过使用url-loader和自定义输出路径的方式，处理并打包了位于项目根目录下的favicon.ico文件。

> 当前项目配置
```js
{
    test: /\.svg$/,
    use: [
        {
            loader: "svg-url-loader",
            options: {
                limit: 4096,
                name: "[path][name].[ext]?[hash:8]",
                outputPath: (url, resourcePath, context) => {
                    return path.join(
                        "assets",
                        path
                            .relative(context, resourcePath)
                            .replace(new RegExp(`\\${path.sep}`, "g"), "/")
                            .replace(/^src\/static/, "")
                    );
                },
            },
        },
    ],
}
```
这是另一个webpack配置规则，用于加载`.svg`文件并将其打包。

具体来说，该规则针对所有以`.svg`结尾的文件进行匹配。当匹配到此类文件时，将使用`svg-url-loader`作为加载器来处理它们，并且使用options对象来指定loader参数。

该规则包括以下内容：
- `test`: 一个正则表达式，表示哪些文件应该被该规则匹配。

    这里的正则表达式是匹配以`.svg`结尾的文件路径。
- `use`: 一个loader数组，用于描述如何处理匹配到的文件。

    这里只使用单个loader `svg-url-loader`
- `loader`: 表示要使用的loader

    在这个例子中，我们使用url-loader来处理这些文件。
- `options`: 是传递给该 loader 的选项对象

    根据需要传递以下选项来调整文件的输出路径和名称：
  - `limit`：设置inline限制大小为4KB，当文件小于此值时，将转换成base64格式内嵌在js中，否则将生成实际的文件。
  - `name`: 指定输出的文件名，可以带有占位符(placeholder)从而根据信息动态生成文件名。其中一些常见的占位符包括:
  
    `[name]`：原始文件名（不含扩展名）

    `[ext]`：原始文件扩展名

    `[hash]`：基于文件内容计算出的hash值

    `[path]`：原始文件路径 在这个例子中，输出的文件名使用了类似的占位符模式，确保文件名与源文件一致。
    
    例如`[path][name].[ext]?[hash:8]`这将在输出目录中按原有目录结构自动创建相应的目录，并在文件名后面加入 8 位的 hash 值用于缓存更新。
  - `outputPath`: 表示输出文件的目录，默认情况下生成的文件会放在默认的 `output.path` 目录下，但通过该属性可以对输出路径进行自定义。这里使用了一个函数实现自定义输出路径的效果，将所有文件都移动到了`assets`目录下。等价于设置`output.path`为`'../dist/assets'`。
> 总之，该webpack规则通过使用svg-url-loader和自定义输出路径的方式，处理并打包了所有以.svg结尾的文件。

> 当前项目配置
```js
{
    test: /\.(webm|ogg|wav|flac|aac)(\?.*)?$/,
    loader: "url-loader",
    options: {
        limit: 10000,
        name: "[path][name].[ext]?[hash:8]",
        outputPath: (url, resourcePath, context) => {
            return path.join(
                "assets",
                path
                    .relative(context, resourcePath)
                    .replace(new RegExp(`\\${path.sep}`, "g"), "/")
                    .replace(/^src\/static/, "")
            );
        },
    },
}
```
这是一个webpack配置规则，用于加载多种音频格式（包括`.webm`、`.ogg`、`.wav`、`.flac`、`.aac`）的文件并将其打包。

具体来说，该规则通过匹配多种音频格式的后缀名，使用`url-loader`作为加载器处理它们，并使用options对象设置loader的参数。

该规则包括以下内容：
- `test`: 一个正则表达式，表示哪些文件应该被该规则匹配。

    这里的正则表达式是匹配以(`.webm`、`.ogg`、`.wav`、`.flac`、`.aac`)结尾的文件路径。
- `use`: 一个loader数组，用于描述如何处理匹配到的文件。

    这里只使用单个loader `url-loader`
- `loader`: 表示要使用的loader

    在这个例子中，我们使用`url-loader`来处理这些文件。
- `options`: 是传递给该 loader 的选项对象

    根据需要传递以下选项来调整文件的输出路径和名称：
  - `limit`：设置inline限制大小为10KB，当文件小于此值时，将转换成base64格式内嵌在js中，否则将生成实际的文件。
  - `name`: 指定输出的文件名，可以带有占位符(placeholder)从而根据信息动态生成文件名。其中一些常见的占位符包括:
  
    `[name]`：原始文件名（不含扩展名）

    `[ext]`：原始文件扩展名

    `[hash]`：基于文件内容计算出的hash值

    `[path]`：原始文件路径 在这个例子中，输出的文件名使用了类似的占位符模式，确保文件名与源文件一致。
    
    例如`[path][name].[ext]?[hash:8]`这将在输出目录中按原有目录结构自动创建相应的目录，并在文件名后面加入 8 位的 hash 值用于缓存更新。
  - `outputPath`: 表示输出文件的目录，默认情况下生成的文件会放在默认的 `output.path` 目录下，但通过该属性可以对输出路径进行自定义。这里使用了一个函数实现自定义输出路径的效果，将所有文件都移动到了`assets`目录下。等价于设置`output.path`为`'../dist/assets'`。
> 总之，这个webpack规则通过使用url-loader和自定义输出路径的方式，处理并打包了多种音频格式的文件。

> 当前项目配置
```js
{
    test: /\.(woff2?|eot|ttf|otf|txt)(\?.*)?$/,
    loader: "url-loader",
    options: {
        limit: 10000,
        name: "[path][name].[ext]?[hash:8]",
        outputPath: (url, resourcePath, context) => {
            return path.join(
                "assets",
                path
                    .relative(context, resourcePath)
                    .replace(new RegExp(`\\${path.sep}`, "g"), "/")
                    .replace(/^src\/static/, "")
            );
        },
    },
}
```
这是一个webpack配置规则，用于加载多种字体格式（包括`.woff`、`.woff2`、`.eot`、`.ttf`、`.otf`）和文本文件（`.txt`）并将其打包。

具体来说，该规则使用了正则表达式匹配多种字体和文本文件的后缀名，使用`url-loader`作为加载器处理它们，并使用options对象设置loader的参数。

该规则包括以下内容：
- `test`: 一个正则表达式，表示哪些文件应该被该规则匹配。

    这里的正则表达式是匹配以(`.woff`、`.woff2`、`.eot`、`.ttf`、`.otf`、`.txt`)结尾的文件路径。
- `use`: 一个loader数组，用于描述如何处理匹配到的文件。

    这里只使用单个loader `url-loader`
- `loader`: 表示要使用的loader

    在这个例子中，我们使用`url-loader`来处理这些文件。
- `options`: 是传递给该 loader 的选项对象

    根据需要传递以下选项来调整文件的输出路径和名称：
  - `limit`：设置inline限制大小为10KB，当文件小于此值时，将转换成base64格式内嵌在js中，否则将生成实际的文件。
  - `name`: 指定输出的文件名，可以带有占位符(placeholder)从而根据信息动态生成文件名。其中一些常见的占位符包括:
  
    `[name]`：原始文件名（不含扩展名）

    `[ext]`：原始文件扩展名

    `[hash]`：基于文件内容计算出的hash值

    `[path]`：原始文件路径 在这个例子中，输出的文件名使用了类似的占位符模式，确保文件名与源文件一致。
    
    例如`[path][name].[ext]?[hash:8]`这将在输出目录中按原有目录结构自动创建相应的目录，并在文件名后面加入 8 位的 hash 值用于缓存更新。
  - `outputPath`: 表示输出文件的目录，默认情况下生成的文件会放在默认的 `output.path` 目录下，但通过该属性可以对输出路径进行自定义。这里使用了一个函数实现自定义输出路径的效果，将所有文件都移动到了`assets`目录下。等价于设置`output.path`为`'../dist/assets'`。
> 总之，这个webpack规则通过使用url-loader和自定义输出路径的方式，处理并打包了多种字体和文本格式的文件。

> 当前项目配置
```js
{
    test: /\.(txt)(\?.*)?$/,
    loader: "url-loader",
    options: {
        name: "[path][name].[ext]?[hash:8]",
        outputPath: (url, resourcePath, context) => {
            return path.join(
                "assets",
                path
                    .relative(context, resourcePath)
                    .replace(new RegExp(`\\${path.sep}`, "g"), "/")
                    .replace(/^src\/static/, "")
            );
        },
    },
}
```
这是一个webpack配置规则，用于加载纯文本格式（`.txt`）的文件并将其打包。

具体来说，该规则使用正则表达式匹配后缀名为`.txt`的文件，然后调用`url-loader`将它们打包为静态文件。

该规则包括以下内容：
- `test`: 一个正则表达式，表示哪些文件应该被该规则匹配。

    这里的正则表达式是匹配以`.txt`结尾的文件路径。
- `use`: 一个loader数组，用于描述如何处理匹配到的文件。

    这里只使用单个loader `url-loader`
- `loader`: 表示要使用的loader

    在这个例子中，我们使用`url-loader`来处理这些文件。
- `options`: 是传递给该 loader 的选项对象

    根据需要传递以下选项来调整文件的输出路径和名称：
  - `name`: 指定输出的文件名，可以带有占位符(placeholder)从而根据信息动态生成文件名。其中一些常见的占位符包括:
  
    `[name]`：原始文件名（不含扩展名）

    `[ext]`：原始文件扩展名

    `[hash]`：基于文件内容计算出的hash值

    `[path]`：原始文件路径 在这个例子中，输出的文件名使用了类似的占位符模式，确保文件名与源文件一致。
    
    例如`[path][name].[ext]?[hash:8]`这将在输出目录中按原有目录结构自动创建相应的目录，并在文件名后面加入 8 位的 hash 值用于缓存更新。
  - `outputPath`: 表示输出文件的目录，默认情况下生成的文件会放在默认的 `output.path` 目录下，但通过该属性可以对输出路径进行自定义。这里使用了一个函数实现自定义输出路径的效果，将所有文件都移动到了`assets`目录下。等价于设置`output.path`为`'../dist/assets'`。

需要注意的是，这里没有设置limit属性，意味着无论该文件大小如何，都会被转换成实际的文件而不是内嵌进bundle中。当然，你也可以根据需要设置适当大小的limit，将小文件转换为base64编码内联在代码中以减少文件数量。

> 总的来说，这个webpack规则能够帮助我们加载和打包纯文本格式的文件，并将它们输出到指定目录下，从而方便我们在应用程序中使用。

> 当前项目配置
```js
{
    test: /\.(mp3|mp4)$/,
    use: [
        {
            loader: "file-loader",
            options: {
                name: "[path][name].[ext]?[hash:8]",
                outputPath: (url, resourcePath, context) => {
                    return path.join(
                        "assets",
                        path
                            .relative(context, resourcePath)
                            .replace(new RegExp(`\\${path.sep}`, "g"), "/")
                            .replace(/^src\/static/, "")
                    );
                },
            },
        },
    ],
}
```
这是一个Webpack的配置规则，用于将`mp3`和`mp4`格式的文件打包。具体的方法是使用`file-loader`进行处理，将这些文件搬移到输出目录的指定位置。

该规则包括以下内容：
- `test`: 一个正则表达式，表示哪些文件应该被该规则匹配。

    这里的正则表达式是匹配以`.mp3`或`.mp4`结尾的文件路径。
- `use`: 一个loader数组，用于描述如何处理匹配到的文件。

    这里只使用单个loader `file-loader`
- `loader`: 表示要使用的loader

    在这个例子中，我们使用`file-loader`来处理这些文件。
- `options`: 是传递给该 loader 的选项对象

    根据需要传递以下选项来调整文件的输出路径和名称：
  - `name`: 指定输出的文件名，可以带有占位符(placeholder)从而根据信息动态生成文件名。其中一些常见的占位符包括:
  
    `[name]`：原始文件名（不含扩展名）

    `[ext]`：原始文件扩展名

    `[hash]`：基于文件内容计算出的hash值

    `[path]`：原始文件路径 在这个例子中，输出的文件名使用了类似的占位符模式，确保文件名与源文件一致。
    
    例如`[path][name].[ext]?[hash:8]`这将在输出目录中按原有目录结构自动创建相应的目录，并在文件名后面加入 8 位的 hash 值用于缓存更新。
  - `outputPath`: 表示输出文件的目录，默认情况下生成的文件会放在默认的 `output.path` 目录下，但通过该属性可以对输出路径进行自定义。这里使用了一个函数实现自定义输出路径的效果，将所有文件都移动到了`assets`目录下。等价于设置`output.path`为`'../dist/assets'`。

函数类型 
- outputPath(url: string, resourcePath: string, context: string): string
  - output.path 中返回的替代路径(output.publicPath)。

   所以如果需要获取来自`src/static/zhongjyuan.jpg`的请求取而代之 `assets/zhongjyuan.jps` ，该函数应该返回 `assets/zhongjyuan.jps`。

除此以外，大致内容解释如下：
- path.join(): 将多个参数连接成路径字符串，与使用 + 连接字符串效果类似。不过 path.join() 在拼接的时候会根据系统平台自动适配路径分隔符，避免出现兼容性问题。

- path.relative(): 返回两个路径之间的相对路径，即如果当前程序运行时工作目录为 /home/user/app，执行 path.relative('/home/user/app', '/home/user/Documents') 会返回 ../Documents。该方法的第二个参数常被用来指向文件系统的具体路径。

- new RegExp(): 创建一个新的正则表达式对象。详情请参考 `MDN:RegExp` 参考
> 当前项目配置
```js
{ test: /\.html$/, use: "raw-loader" }
```
这是一个用于加载HTML文件的webpack loader，它在raw-loader中被定义。

该loader旨在将HTML文件视为纯文本并以字符串形式导入到JavaScript模块中。这对于需要在JavaScript代码中动态生成HTML结构的项目非常有用。
> 当前项目配置
```js
{
    test: /\.vue$/,
    loader: "vue-loader",
    options: {
        compilerOptions: {
            preserveWhitespace: false,
        },
        loaders: {
            html: "vue-template-loader",
        },
    },
}
```
这是一个用于处理`.vue`文件的Webpack loader，它在`vue-loader`中被定义。

该loader负责将Vue单文件组件（SFC）解析为一个包含JavaScript、CSS和HTML模板的对象，并将其放入打包生成的JavaScript输出中。这使得开发人员可以用一种组织良好、具有可重用性和可维护性的方式来编写Vue组件。

这段代码中的options选项提供了两个配置属性。
- 首先，`compilerOptions.preserveWhitespace`配置属性指示Vue编译器是否应该保留标签间空格，默认情况下该配置选项为true，即保留所有空白符。如果设置为false，编译器会从模板中删除任何不显式指定的空格和换行符，以最小化生成的输出大小。

- 其次，`loaders.html`选项配置使用"`vue-template-loader`"来加载HTML模块，实现对HTML模板的编译和处理。当打包构建应用程序时，Vue编译器会自动将这些HTML模板转换成渲染函数，以便在Vue组件中进行渲染。

> 总之，使用Vue-loader可以使开发人员更方便地创建并管理Vue组件，并通过Webpack强大的打包能力，提高项目的效率和可维护性。
## resolve
### 用于配置模块解析器的选项。通过配置resolve属性，可以告诉Webpack如何寻找模块并解析模块请求的路径。

resolve属性是一个包含多个子属性的对象，下面列出一些常见的子属性：

- `extensions`: 解析模块时自动为请求添加的扩展名。
  
  例如，如果设置了extensions为`[".js", ".vue", ".json"]`，则在引入模块时，可以省略这些扩展名。Webpack 会自动尝试这些扩展名，并确定是否匹配文件。

- `alias`: 将模块别名映射到实际路径，以便更轻松地引用其内容。例如，可以使用alias将Vue模块路径从相对路径`"../../node_modules/vue/dist/vue.esm.js"`映射到简单的"vue"字符串。这使得引入外部模块变得非常方便。

- `modules`: 指定模块搜索的位置。默认情况下，Webpack会从当前目录开始查找上一级，直到根目录下的`node_modules`目录。如果modules属性被指定，则Webpack只会按照该属性中所列的路径搜索。可以使用绝对或相对路径，甚至可以与环境变量合并使用。

- `mainFields`: 当导入要解析为一个包时，指定Webpack使用哪个字段来导入包。默认情况下，Webpack倾向于main字段，但有些包可能使用其他字段或将其分成多个文件。该属性允许开发人员指定它想要的字段以确保正确解析包导入。

- `symlinks`: 确定是否应解析符号链接。默认情况下，Webpack会跟随符号链接并在其中寻找模块。设置symlinks为false时，Webpack将跳过符号链接并忽略它们中的任何模块。

> 通过对resolve属性进行配置，可以优化Webpack的打包过程，并使项目更灵活和可维护。

> 当前项目配置
```js
resolve: {
    extensions: [".js", ".vue", ".json"],
    alias: {
        vue$: "vue/dist/vue.esm.js",
    },
}
```
这段代码配置了Webpack的resolve属性。
- 其中，extensions属性告诉Webpack在导入模块时自动添加的文件扩展名是.js、.vue和.json。这可以省略在导入模块时指定扩展名，使编写代码更加方便。

- 另外，alias属性将Vue模块路径映射到"vue/dist/vue.esm.js"。也就是说，当通过import Vue from 'vue'方式导入Vue模块时，实际上会被解析为import Vue from 'vue/dist/vue.esm.js'，从而来自所需的位置。这种映射别名还可以用于将指向某个文件夹或项目根目录的绝对路径转换为短路径别名。
## plugins
> 当前项目配置
```js
const VueLoaderPlugin = require("vue-loader/lib/plugin");
new VueLoaderPlugin()
```
`VueLoaderPlugin`是用于支持使用单文件组件（SFC）的Webpack插件。

它的作用是将单文件组件中的`<template>`、`<script>`、`<style>`块以及其他自定义块（如`<docs>`）转换为Javascript模块，从而可以在Webpack打包过程中进行解析和处理。

具体来说，VueLoaderPlugin会帮助Webpack加载`.vue`文件并将其转成Javascript模块，其中包含经过编译的template/render函数、静态资源导入等相关信息。此外，该插件还可以将`.vue`文件中的样式（如`.css`、`.scss`、`.less`等）提取出来，并以独立的CSS文件或者内联方式注入到HTML中。

下面是 VueLoaderPlugin 所有可选的参数：

- `compiler`: 传入一个自定义的 Vue 编译器实例以支持非标准语法的 Vue 组件。
- `compilerOptions`: 此选项对象用于向 `vue-template-compiler or any HTML` 模板编译器注入额外的选项。其格式应该与 `@vue/compiler-sfc` API 中使用的相同。
- `hotReload`: 如果需要使用 Vue 组件热重载功能，则将此值设置为 true。默认为 true。
- `ssr`: 如果正在构建服务器端渲染应用程序，或者希望从组件定义中提取内容以构建单独的客户端和服务器包，则需要显式地启用这个选项。其默认值为 false。
- `cacheDirectory`: 此选项告诉 Vue Loader 在请求间保留转换过的模块时是否启用文件系统缓存。如果设置，则必须是纯字符串，指定将缓存数据写入的目录路径。
- `cacheIdentifier`: 用于验证 LoaderCache 是否过期或有效的唯一标识符，默认值是一个由 env（NODE_ENV），Vue 版本，Loader 版本和 options（如果存在）组合而成的字符串。
- `cacheCompression`: 是否在缓存插件的输出时使用 gzip 压缩。默认为 true。
- `exposeFilename`: 开启后可以访问模板编译错误中提供的源文件名和行号。默认为 false。
- `transformAssetUrls`: 指定转换静态资源链接的行为。默认情况下，Vue Loader会将诸如 `<img src="./image.svg"/>` 的链接转换为正确解析后附带的URL地址形式的字符串。当遇到需要被webpack处理的外部资源时，你可以将其设置为回调函数，以进行更加细粒度化的配置。

以上就是 VueLoaderPlugin 所有可选的参数，你可以根据自己的需求选择需要的配置选项。更多详细信息可以参考`官方文档`。

> 总之，VueLoaderPlugin是一个非常重要的插件，它可以将Vue单文件组件转化为Webpack所需要的Javascript模块，并提取样式。这使得我们可以使用更加灵活、高效的方式编写Vue应用程序。

> 当前项目配置
```js
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
new CleanWebpackPlugin({
    dry: false,
    verbose: true,
    cleanStaleWebpackAssets: true,
    protectWebpackAssets: false,
})
```
`CleanWebpackPlugin`是一个Webpack插件，它可以在每次打包时清除指定的目录或者文件，避免因为旧的文件缓存而导致新的代码无法生效。具体来说，它可以做到以下几点：

- 在每次构建前清空输出目录。
- 将不再使用的资源清除掉，以防止垃圾文件越积越多。
- 可以将参数设置为数组、字符串、Regexp、和函数，实现更为灵活的定制化清理操作。

以下是 CleanWebpackPlugin 支持的所有参数和默认值的说明：

- `cleanOnceBeforeBuildPatterns`：存放需要删除的文件或文件夹路径的数组，默认为 `['**/*']`。在非 watch 模式下，只会在项目启动时运行一次。
- `cleanAfterEveryBuildPatterns`：与上面的参数类似，只是本参数仅用于 watch 模式，并在每次改变完成后处理文件。默认为 []。
- `cleanStaleWebpackAssets`：是否自动删除未使用的 webpack 资产文件（即打包后输出到 dist 目录的文件）。如果您使用了旁置插件或 `html-webpack-plugin` 等生成资产文件，请将此项设置为 false。默认值为 true。
- `cleanOnceBeforeBuildPatternsExclude`：指定哪些不应该被删除的文件或文件夹，如 `['!file.txt']`。默认情况下，所有文件都将被删除。
- `cleanAfterEveryBuildPatternsExclude`：与上面的参数类似，只是这里适用于除首次外的所有 build 过程。
- `protectWebpackAssets`：是否防护 webpack 提供的资产文件，
  
  例如 `.htaccess` 文件。默认为 true。
- `verbose`：是否开启详细日志模式。默认为 false。
- `dry`：只打印删除哪些文件而不实际执行。默认为 false。

> 当前项目配置
```js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
new MiniCssExtractPlugin({
    filename: "static/[name].[chunkhash:8].css",
    chunkFilename: "static/[name].[chunkhash:8].css",
})
```
`MiniCssExtractPlugin` 是 webpack 插件，用来将 CSS 文件从 JavaScript 中分离，并输出为单独的 CSS 文件，主要用于生产环境下的构建。这种方式可以有效地减小 JS bundle 大小，同时也提高了样式文件的加载速度，是一个非常实用的插件。

下面是 MiniCssExtractPlugin 的全面详细讲解和所有参数的说明：

- `filename`: 指定输出的 CSS 文件名，可以包含 `filename` 中 `{name}`，`{id}`，`{hash}`和`[chunkhash]`等占位符作为路径和文件名的变量。默认值是main.css`。
- `chunkFilename`: 配置仅包含 CSS 的块文件的名称。对于异步块，它也应该是可计算的，所以可以包含与 `output.filename` 一样的占位符，默认值是 id。
- `ignoreOrder`: 如果指定为 true，则指示忽略有关冲突顺序的警告。默认情况下，webpack 会在遇到命名冲突时发出警告，因为 CSS loader 在内部使用正则表达式来获取导入并行的 CSS 位置列表。但是，这并不能保证处理的顺序始终正确，即使 loader 链已明确说明了有正确的顺序。这个选项默认情况下为 false，即会发出警告。
- `linkType`: 表示 CSS 样式表如何关联到 HTML 中，默认值是 false，即生成的 CSS 文件将采用 `<link>` 标签。当设置为 "lazy" 时，使用异步导入主块文件口加载样式表。设置为 "preload" 时，同步预先加载样式表。
- `esModule`: 如果为 true，则 generated json-like CSS modules 文件将采用 ES module 引入，默认是 true。

以上就是 MiniCssExtractPlugin 的详细讲解和所有参数的说明，你可以根据自己的需要进行设置。
> 总之，这个插件提供了一种快速、高效地将样式从 JavaScript 中分离出来的方式，非常有利于优化项目的性能，并且还提供了一些选项和占位符等自定义配置，是必不可少的 webpack 插件之一。

> 当前项目配置
```js
const UglifyJsWebpackPlugin = require("uglifyjs-webpack-plugin");
new UglifyJsWebpackPlugin({
    uglifyOptions: {
        warnings: false,
        compress: {
            drop_console: dropConsole, // 删除所有的console语句
            reduce_vars: true, // 把使用多次的静态值自动定义为变量
        },
        output: {
            comments: false, // 不保留注释
        },
    },
    parallel: true,
})
```
`UglifyJsWebpackPlugin`是Webpack中一个插件，用于将JavaScript代码进行压缩和混淆，以减小代码体积和提高页面加载速度。

下面是UglifyJsWebpackPlugin的基本介绍和所有参数的详细说明：

1.基本介绍：

UglifyJsWebpackPlugin是由`uglify-js`包提供的插件，可以用来压缩和混淆JavaScript文件。

2.所有参数说明：

（1）test：`{RegExp|Array<RegExp>}`

匹配需要压缩的文件，默认为 /.(js|vue)(?.*)?$/i。

（2）include：`{RegExp|Array<RegExp>}`

只对满足特定条件的文件进行处理。

（3）exclude：`{RegExp|Array<RegExp>}`

排除不满足特定条件的文件。

（4）cache：`{Boolean|String}`

启用或禁用缓存文件。默认情况下，缓存被禁用。如果指定为true，则使用默认的缓存目录，如果指定为一个字符串，则使用该字符串作为缓存目录。

（5）parallel：`{Boolean|Number}`

是否使用多个进程同时压缩文件。默认值为false。如果您将其设置为true，则根据您机器的核心数可以启动多个进程；如果将其设置为数字，则将同时启动指定数量的进程。

（6）sourceMap：`{Boolean}`

是否在输出文件中生成sourceMap。默认为false。

（7）extractComments：`{Boolean|RegExp|Function}`

是否提取注释。默认为false。如果设置为true，则所有注释都将被提取到`LICENSE.txt`文件中；如果设置为字符串，则它将作为提取注释的文件名；如果传递一个函数，则可以自定义提取注释的方式。

（8）uglifyOptions：`{Object}`

用于配置UglifyJS的其他选项。

- compress: `{Boolean|Object}` 是否压缩，默认为true。
- sequences：`{Boolean}` 将具有两个或更多元素的序列转换为逗号表达式。默认为true。
- properties：`{Boolean}` 将属性访问转换为点符号样式，
  
  例如`foo ['bar']→foo.bar`，优化了.操作符的访问。默认为true。
- drop_debugger：`{Boolean}` 如果为true，则删除与“debugger”语句匹配的“debugger”。默认为true。
- unsafe：`{Boolean}` 这个标志指示UglifyJS忽略代码安全性，可能生成代码，该代码触发JavaScript运行时错误。默认为false。
- conditionals：`{Boolean}` 优化if-s和条件表达式。增加了子块。默认为true。
- comparisons：`{Boolean}` 对二进制表达式进行比较优化。例如，2_ <3运算符会删除1条字节的操作数。默认为true。
- evaluate：`{Boolean}` 在不考虑尝试执行许多即时计算的安全性的情况下减小常量表达式。 默认为true。
- booleans：`{Boolean}` 优化布尔上下文，以简化代码。例如，!!a? B:C→a? B:将删除1个字节的“”。默认为true。
- loops： `{Boolean}` 自动平面循环来提高程序性能。默认为true。
- unused：`{Boolean}` 清除未引用的局部变量和函数。默认为true。
- toplevel：`{Boolean }` 尝试将代码推到顶层来减少作用域查找数量并使大多数变量成为全局变量。默认为false。
- top_retain：`{Array<string>}` 如果toplevel是true，则只有这些名称的顶级函数、类或变量可以保留。（TODO更好的例子）。默认值为空数组。
- hoist_funs: `{Boolean}` 把函数声明提升到他们被调用的地方。 默认为false。
- keep_classnames：`{Boolean}` 可选的； 加密后类名是否可见。默认false， ie class name like 'a'

> 当前项目配置
```js
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
new OptimizeCssAssetsWebpackPlugin({
    assetNameRegExp: /\.css$/g,
    cssProcessor: Cssnano,
    cssProcessorPluginOptions: {
        preset: [
            "default",
            {
                discardComments: {
                    removeAll: true,
                },
                normalizeUnicode: false,
            },
        ],
    },
    canPrint: true,
})
```
`OptimizeCssAssetsWebpackPlugin`是Webpack中一个插件，用于优化和压缩CSS文件。

下面是OptimizeCssAssetsWebpackPlugin的基本介绍和所有参数的详细说明：

1.基本介绍：

OptimizeCssAssetsWebpackPlugin可以用来优化、压缩和混淆CSS文件，以减少页面加载时间和带宽消耗。它使用了cssnano包提供的优化功能。

2.所有参数说明：

（1）assetNameRegExp：`{RegExp}`

匹配需要优化的文件，默认为 /.css$/g。

（2）cssProcessor：`{Function|Object}`

指定使用哪个CSS处理器。默认为cssnano包提供的压缩器实例。

（3）cssProcessorPluginOptions：`{Object}`

用于配置CSS处理器的其他选项。

- preset: `{string|array}` 选择所需的预设cssnano插件。

- map: `{object | }` 支持 SourceMap，请参阅PostCSS文档以获取更多信息

- from: `{string|undefined}` 输入源类型。（例如：“file”，“stdin”等）

- to: `{string|undefined}` 输出源类型。（例如：“file”，“stdin”等）

- parser: `{string|object|Function|undefined}`
设置要使用的解析器。 默认情况下，我们会尝试从代码中猜测出正确的解析器，但这种行为可能会在trailling comments和 raw-string literals被误认为是脱落时损害某些代码。在这种情况下，显式地设置解析器将有助于使cssnano工作正常。

- stringifier: `{string|object|Function|undefined}`
设置要使用的字符串化器。 默认情况下，我们将使用css.stringify() ，但使用其它实现可能更易于某些代码库。

（4）canPrint：`{Boolean}`

是否在控制台中打印优化后的信息。默认为true。
> 需要注意的是，OptimizeCssAssetsWebpackPlugin插件需要与MiniCssExtractPlugin一起使用，以确保从打包后的JavaScript文件中分离CSS文件，并且能够正确加载和优化CSS文件。

> 当前项目配置
```js
const HtmlWebpackPlugin = require("html-webpack-plugin");
new HtmlWebpackPlugin({
    template: "./src/index.html",
    excludeChunks: ["win"],
    minify: {
        collapseWhitespace: true,
        removeComments: true,
        useShortDoctype: true,
        minifyCSS: true,
        minifyJS: true,
    },
})
```
`HtmlWebpackPlugin`是Webpack中一个插件，用于自动生成HTML文件，并将打包后的js和css引入到相应的HTML文件中，同时还支持各种定制化配置。

下面是HtmlWebpackPlugin的基本介绍和所有参数的详细说明：

1.基本介绍：

HtmlWebpackPlugin可以让我们更简单地生成HTML文件，并且自动引入打包后的资源文件。默认情况下，该插件将在output.path目录下生成一个index.html文件，此文件将包含打包后的JavaScript文件，并且自动注入link和script标签。

2.所有参数说明：

（1）title：`{string}`

HTML文档的标题。默认值为“Webpack App”。

（2）filename：`{string}`

输出的HTML文件名。默认值为“index.html”

（3）template：`{string|function}`

使用模板函数或指定的HTML文件路径来生成HTML文件。如果指定了此选项并且文件不存在，则会抛出错误。默认情况下，该插件将使用默认的HTML模板（即“./src/index.html”）。

（4）inject：`{boolean|string|function}`

允许您控制JS脚本和CSS样式表的注入位置。

- true或'body'：所有JavaScript资源将放置在body元素的底部。

- 'head'：所有JavaScript资源将放置在head元素中。

- false：不会自动注入每个文件的脚本变体。

- function：可以通过自定义函数实现类似位置注入。

（5）favicon：`{string}`

将指定favicon路径添加到生成的HTML文件中。

（6）minify：`{boolean|object}`

压缩生成的HTML文件，默认情况下为false。如果传递一个对象，则可以使用html-minifier-terser选项来自定义压缩配置。

removeAttributeQuotes: 是否删除属性周围的引号。

collapseWhitespace: 是否将标记之间的空格折叠为单个空格，最小化它们。

removeComments：是否删除注释

（7）hash：`{boolean}`

将生成的HTML文件名后添加唯一的哈希值。此参数可用于防止缓存。

（8）chunks：`{Array<string>}`

指定要包含在HTML文件中的JavaScript块。该数组中每个条目对应于entry对象中的名称。默认值是所有已经输出的块。可以通过设置excludeChunks将特定块排除在外。

（9）meta：`{Object}`

在生成的HTML文件中添加meta标签。

（10）base：`{Object}`

在head标签内添加一个base标签。

（11）xhtml：`{Boolean}`

如果设置为true，则自动关闭标签。例如，`<br>` 标签会转换为 `<br />`。默认值为false。
> 需要注意的是，如果代码中有多个入口点，则每个入口点都会生成一个HTML文件，导致HTMLWebpackPlugin会将这些文件彼此覆盖，并使所有文件具有相同的内容。如果您想为每个入口点生成单独的HTML文件，请使用多次实例化来避免此问题。

> 当前项目配置
```js
const ImageminPlugin = require("imagemin-webpack-plugin").default;
const imageminMozjpeg = require("imagemin-mozjpeg");
const imageminPngquant = require("imagemin-pngquant");
new ImageminPlugin({
    test: /\.(jpe?g|png)$/i,
    plugins: [imageminMozjpeg({ quality: 75, progressive: true }), imageminPngquant({ quality: [0.65, 0.9], speed: 4 })],
})
```
`ImageminPlugin`是一个Webpack插件，用于压缩和优化图片。它使用Imagemin库（基于Node.js）来进行优化，可以实现多种类型的图像优化，包括PNG、JPEG、GIF和SVG。

下面是ImageminPlugin的详细介绍和常用参数说明：

基本介绍

ImageminPlugin会在Webpack构建过程中自动将指定的图片文件压缩和优化，并输出优化后的图片文件。因为该插件直接作用于Webpack，所以无需额外地安装任何软件或工具。

所有参数说明

（1） test： `{RegExp}`

一个正则表达式，用于匹配需要被ImageminPlugin处理的文件。

（2） exclude: `{RegExp}`

一个正则表达式，用于排除不需要被处理的文件。

（3） minFileSize: `{number}`

图片大小必须超过该设置的值才能被ImageminPlugin优化，默认是0。

（4） deleteOriginalAssets: `{boolean}`

是否删除原图，只保留压缩后的图片；默认是false。

（5） cache: `{boolean|string}`

是否启用缓存，用于加速webpack的构建过程，提高压缩效率。

true 或 null：使用默认缓存路径 node_modules/.cache/imagemin-webpack-plugin。

string：使用指定目录作为缓存目录。

（6） cacheKeys: `{(Object)}`

用于自定义缓存键。如果您需要自己控制缓存，可以使用该选项。

（7） imageminOptions: `{(Object|Function)}`

传递给imagemin的配置信息，可以是一个对象或者一个函数。图像优化设置是在这里完成的。

- plugins：`{Array}`：imagemin插件的数组

- bailOut：`{Function}`：允许您提供一个函数，在文件太小或无法压缩时从压缩过程中摘除文件。

- svgoPlugins：`{Array}`：SVGO插件的数组。

- hookOnce：`{Boolean}`：是否只激发一次Webpack Hook。

- ignoreLargerThan：`{Number}`：最大不应忽略N个字节的文件。

> 注意：使用imageminOptions之前，需确保已经安装相应的优化插件，并通过npm与ImageminPlugin一起安装。

> 当前项目配置
```js
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CleanCSS = require("clean-css");
const UglifyJs = require("uglify-js");
new CopyWebpackPlugin({
    patterns: [
        // 压缩 JS
        {
            from: "./src/components",
            to: "components",
            transform(content, path) {
                if (path.endsWith(".js")) {
                    let res = UglifyJs.minify(content.toString());
                    return res.error ? content : res.code;
                }
                if (path.endsWith(".css")) {
                    return new CleanCSS({ level: 1 }).minify(content).styles;
                }
                // TODO: 图片类型与字体类型压缩
                return content;
            },
            transformPath(targetPath, absolutePath) {
                return targetPath.replace("src", "");
            },
            globOptions: {
                ignore: ["**/custom/**"],
            },
        },
        { from: "./src/static/favicon.ico", to: "" },
        { from: "./src/static/js/use", to: "static/use" },
        { from: "./src/static/icon", to: "assets/icon" },
        { from: "./src/static/image", to: "assets/image" },
        { from: "./src/static/media", to: "assets/media" },
        { from: "./src/configuration/langs", to: "config/langs" },
    ],
})
```
`CopyWebpackPlugin`是一个Webpack插件，用于将文件或文件夹从源目录复制到输出目录。它可以用于复制第三方依赖库中的静态资源，如图片、字体和文档等。

下面是CopyWebpackPlugin全面详细讲解和所有参数说明：

默认选项
```javascript
new CopyWebpackPlugin([{
    from: 'src/assets',
    to: 'assets'
}])
```
如果只传递from和to选项，则会将from指定的文件/目录复制到to选项指定的目录中。

from和to选项

- from: `{String | Object | Array}`

如果是字符串，则是Source文件的路径，也可以使用glob模式匹配多个文件/目录；

如果是对象，则该对象必须包含from属性和可选的to属性。如果省略to属性，则默认从输出所在的根路径开始创建相对路径。

如果是数组，则每个单独项目应提供像上面那样构造成字符串或对象的形式。

- to: `{String | Function}`

接收相对于outputPath的相对路径，并且必须以“/”结尾。

可以使用函数为每个文件定义to选项。函数接收来源的文件名作为输入，并返回to选项的特定值。

- ignore选项

入口支持在同一目录中匹配不想复制的文件。

```javascript
new CopyWebpackPlugin([{
    from: 'src/assets',
    to: 'assets',
    ignore: ['*.txt']
}])
```

- 其他选项
  - `context` 每个来源的文件都是从context开始评估的。默认值为webpack.config.js所在目录的处理结果。

  - `flatten` 将所有源文件复制到单个目标目录中。

  - `transform` 转换复制的内容。该选项接受一个同步或异步函数。函数将包含一些元数据以及从source读入并可用于组成destination的content。

例子：

```javascript
new CopyWebpackPlugin([{
    from: 'static/libs', 
    to: 'static' ,
    ignore:["**/*.js@(.map)"],
    transform:(content, path) => {
      // 对content进行处理
    }
}]),
```
上面的代码指定了将static/libs下除*.js.map以外的所有文件移动到static文件夹下，并可以对文件内容进行转换。
> 当前项目配置
```js
const MergeJsonFilesPlugin = require("./plugins/merge-json-files-plugin");
new MergeJsonFilesPlugin({
    pattern: "src/configuration/basic/*.json",
    filename: "basic.json",
    outputPath: "dist/config",
}),
new MergeJsonFilesPlugin({
    pattern: "src/configuration/store/*.json",
    filename: "store.json",
    outputPath: "dist/config",
})
```
自定义插件`merge-json-files-plugin`
```js
const glob = require("glob");
const fs = require("fs");
const path = require("path");

/**
 * 合并JSON文件插件
 * @author zhongjyuan
 * @date   2023年5月17日14:09:49
 * @email  zhongjyuan@outlook.com
 */
class MergeJsonFilesPlugin {
	constructor(options) {
		this.options = options;
	}

	apply(compiler) {
		compiler.hooks.emit.tapAsync(
			"MergeJsonFilesPlugin",
			(compilation, callback) => {
				const { outputPath } = compilation.options;
				const mergedJson = {};

				// 读取所有 JSON 文件并合并它们到一个新的对象中
				const files = glob.sync(this.options.pattern);
				files.forEach((file) => {
					const data = fs.readFileSync(file);
					const obj = JSON.parse(data);

					Object.entries(obj).forEach(([key, value]) => {
						if (!mergedJson[key]) {
							mergedJson[key] = value;
						} else if (Array.isArray(mergedJson[key]) && Array.isArray(value)) {
							mergedJson[key].push(...value);
						} else if (
							typeof mergedJson[key] === "object" &&
							typeof value === "object"
						) {
							Object.assign(mergedJson[key], value);
						} // 如果属性值不是数组或对象，则覆盖之前的值
						else {
							mergedJson[key] = value;
						}
					});
				});

				// 将合并后的 JSON 对象转换为字符串，然后写入文件系统中
				const output = JSON.stringify(mergedJson, null, 2);
				const filename = this.options.filename;
				const outputDir = this.options.outputPath;

				if (!fs.existsSync(outputDir))
					fs.mkdirSync(outputDir, { recursive: true });
				fs.writeFileSync(`${outputDir}/${filename}`, output);

				callback();
			}
		);
	}
}

module.exports = MergeJsonFilesPlugin;

```
## 四、optimization
### **用于优化打包后的代码，减少文件大小、提高加载速度**

它包含了许多参数，下面是对Webpack optimization全面详细讲解和所有参数说明：

通用选项

（1） minimize: `{boolean}`

是否启用代码压缩，默认是true。

（2） minimizer: `{(Object | Function)}`

压缩器的配置信息，可以是一个对象或函数。默认使用uglifyjs-webpack-plugin压缩JS文件和optimize-css-assets-webpack-plugin插件压缩CSS文件。如果需要自定义压缩器，可以将对象传递给minimizer选项，

例如：
```javascript
module.exports = {
    // ...
    optimization: {
        minimizer: [
            new MyCustomMinifierPlugin(...)
        ]
    }
};
```
（3） nodeEnv: `{string}`

指定环境变量NODE_ENV的值，以便其他插件在打包时进行特定的操作。（在开发模式下不会触发optimization）

`SplitChunks`插件

SplitChunks插件可将公共的参照模块抽取出来，形成新的公共块。它拥有很多可配置的参数，例如:

- chunks: 可选all, async和initial以告诉webpack考虑哪些异步和非异步导入

- minSize: 指定要分离的最小块的大小

- maxSize: 指定要分离的最大块的大小

- minChunks: 指定要共享模块的最小块数

- maxAsyncRequests: 基于并发请求限制生成的额外代码块数目

- maxInitialRequests: 入口点处的最大代码块数量

- automaticNameDelimiter: 指定由webpack为所提取的块生成的名称中插入的字符串

- name: 可以通过named配置在分离块之间共享名称字符串

- cacheGroups: 缓存优化可维护共享模块组合，并将它们归到单个缓存组。可以设置多个组，例如:

```javascript
module.exports = {
    // ...
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        }
    }
};
```
修改splitChunks选项时应该小心，因为不正确的配置可能会导致问题，例如重复或丢失某些模块。

`RuntimeChunk`插件

RuntimeChunk插件可将Webpack runtime代码即manifest提取到一个单独的块中，以便对其进行缓存和更新。它也拥有各种可配置的选项，例如：

- name：指定运行时chunk的名称

- minSize: 至少要创建多大的块才能创建运行时chunk

- chunks: 运行时chunk的创建位置(all、async、initial)

- filename: 允许为生成的文件选择名称

```javascript
module.exports = {
    // ...
    optimization: {
        runtimeChunk: {
            name: 'runtime'
        }
    }
};
```
> RuntimeChunk插件在大多数情况下默认开启，但是可以使用它的选项进一步调整日志和性能。

> 当前项目配置
```js
optimization: {
    minimizer: [new TerserWebpackPlugin()],
    runtimeChunk: "single",
    splitChunks: {
        chunks: "async", // 共有三个值可选：initial(初始模块)、async(按需加载模块)和all(全部模块)
        minSize: 30 * 1000, // 模块超过30k自动被抽离成公共模块
        maxAsyncRequests: 5, // 异步加载chunk的并发请求数量<=5
        maxInitialRequests: 3, // 一个入口并发加载的chunk数量<=3
        name: true, // 默认由模块名+hash命名，名称相同时多个模块将合并为1个，可以设置为function

        cacheGroups: {
            //公用模块抽离
            scripts: {
                name: "common",
                chunks: "initial",
                minSize: 0, //大于0个字节
                minChunks: 2, //在分割之前，这个代码块最小应该被引用的次数
            },
            commons: {
                test: /[\\/]node_modules[\\/]/,
                name: "vendors",
                chunks: "all",
            },
        },
    },
}
```