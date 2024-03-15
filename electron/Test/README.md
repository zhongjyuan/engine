# workbench

#### 介绍
工作台`WEB`项目，支持`web`部署与`桌面`部署。

#### 软件架构
基于`Electron`、`Node`、`Vue`全家桶

#### 依赖说明
- `dexie`: 用于浏览器中的 IndexedDB 的 JavaScript 库，用于处理客户端本地数据库。
- `pdfjs-dist`: 用于在浏览器中显示和操作 PDF 文件的 JavaScript 库。
- `expr-eval`: 用于解析和计算数学表达式的 JavaScript 库，可以对字符串形式的数学表达式进行求值操作。
- `quick-score`: 用于执行模糊匹配和分数计算的 JavaScript 库，可以用于字符串之间的相似度比较和评分。
- `mousetrap`: 用于处理键盘快捷键的 JavaScript 库，可以方便地监听和处理特定按键组合的事件。
- `stemmer`: 用于进行自然语言处理中的词干提取的 JavaScript 库，可以将单词转换为它们的基本形式。
- `regedit`: 用于读取和写入 Windows 注册表的 JavaScript 库，可以在 Electron 应用程序中操作注册表键值。
- `node-abi`: 用于获取 Node.js 版本和 ABI（应用二进制接口）的 JavaScript 库，可以在构建过程中用于选择正确的预编译二进制文件。
- `electron-squirrel-startup`: 用于 Windows 平台的自动安装和更新的工具，它可以将 Electron 应用程序注册到系统的启动项。
  
---

- `archiver`: 用于创建和提取压缩文件的 JavaScript 库，可以在构建过程中用于打包文件和目录。
- `browserify`: JavaScript 模块打包工具，用于在浏览器端使用类似于 Node.js 的 require() 语法。
- `chokidar`: 用于监视文件系统变化的 JavaScript 库，可以在开发过程中监听文件的变化并执行相应的操作。
- `concurrently`: 命令行工具，用于同时运行多个命令，通常用于在开发过程中启动多个进程。
- `decomment`: 用于移除 JavaScript 和 CSS 代码中注释的工具，可以在构建过程中用于减小文件大小。
- `electron`: 用于构建跨平台桌面应用程序的框架，可以使用 HTML、CSS 和 JavaScript 构建应用程序界面。
- `electron-builder`: 用于构建和打包 Electron 应用程序的工具，支持多种目标平台和格式。
- `electron-installer-windows`: 用于在 Windows 平台上安装 Electron 应用程序的工具。
- `electron-packager`: 用于将 Electron 应用程序打包成可执行文件的工具，支持多种目标平台。
- `electron-rebuild`: 用于重新编译 Node 模块以适应 Electron 版本的工具。
- `electron-renderify`: 用于将 Node.js 模块转换为在 Electron 渲染进程中可用的模块的工具。
- `prebuild-install`: 用于预编译二进制文件并安装 Node 模块的工具。
- `prettier`: JavaScript 代码格式化工具，用于统一代码风格和格式。
- `snazzy`: 用于将 ESLint 输出转换为漂亮、彩色的输出的工具。
- `standard`:  JavaScript 代码风格检查工具，用于确保代码符合特定的风格规范。
  
---

#### 安装教程

1、安装相关依赖
```cmd
 npm install
```
2、项目编译
```cmd
 npm run build
```
3、本地运行
```cmd
 npm run start
```
4、项目打包
```cmd
 npm run package
```

#### 使用说明

1、检查`JS`代码风格
```cmd
 npm run standard
```
2、检查、修复、格式化代码
```cmd
 npm run lint
```
3、启动资源变化监听
```cmd
 npm run watch
```
4、更新域名排名([Tranco-List.eu](https://tranco-list.eu))
```cmd
 npm run update:siteList
```
5、更新广告拦截规则([Easy-List.to](https://easylist.to))
```cmd
 npm run update:volleyList
```
6、更新域名公共后缀([Public-Suffix.org](https://publicsuffix.org/list/public_suffix_list.dat))
```cmd
 npm run update:suffixList
```
7、打包`Windows`版本应用程序
```cmd
 npm run package:windows
```
8、打包`Mac` `x86` 架构版本应用程序
```cmd
 npm run package:macx86
```
9、打包`Mac` `arm64` 架构版本应用程序
```cmd
 npm run package:macArm64
```
10、打包`Linux` `amd64` 架构版本应用程序(`AppImage`)包
```cmd
 npm run package:linuxAmd64AppImage
```
11、打包`Linux` `amd64` 架构版本应用程序(`rpm `)包
```cmd
 npm run package:linuxAmd64Redhat
```
12、打包`Linux` `amd64` 架构版本应用程序(`deb`)包
```cmd
 npm run package:linuxAmd64Debian
```
13、打包`Linux` `arm64` 架构版本应用程序(`deb`)包
```cmd
 npm run package:linuxArm64Debian
```
14、打包`Linux` `armhf` 架构版本应用程序(`deb`)包
```cmd
 npm run package:linuxArmhfDebian
```

#### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request


#### 特技

1.  ZHONGJYUAN 开源门户 [ZHONGJYUAN.COM](https://gitee.com/zhongjyuan)

#### 项目结构
```cmd
 tree Z:\zhongjyuan\workbench /F
```

```
ZHONGJYUAN
│  favicon.ico
│  index.html
│  LICENSE
│  main.js
│
├─exts
│  ├─abp
│  │      filter-parser.js
│  │      LICENSE
│  │      README.md
│  │
│  ├─dragula
│  │      dragula.css
│  │      dragula.js
│  │      dragula.min.css
│  │      dragula.min.js
│  │
│  ├─iconfont
│  │      iconfont.css
│  │      iconfont.woff2
│  │
│  ├─site
│  │      index.js
│  │      sites.json
│  │
│  ├─suffix
│  │      index.js
│  │      suffixes.json
│  │
│  ├─textColor
│  │      textColor.js
│  │
│  ├─volley
│  │      default.txt
│  │      index.js
│  │      volley.txt
│  │
│  └─xregexp
│          nonLetterRegex.js
│
├─icons
│  │  favicon.icns
│  │  favicon.ico
│  │  favicon.png
│  │  favicon1.ico
│  │  favicon1.png
│  │  windows-installer.gif
│  │  windows-installer1.gif
│  │
│  └─source
│          min_logo.pxm
│          min_logo_mac.pxm
│          min_logo_windows.pxm
│          min_logo_windows_small.pxm
│          windows-installer.pxm
│
├─localization
│  │  localizationHelpers.js
│  │
│  └─languages
│          ar.json
│          be.json
│          bg.json
│          bn.json
│          ca.json
│          cs.json
│          da.json
│          de.json
│          el.json
│          en-US.json
│          es.json
│          fa.json
│          fi.json
│          fr.json
│          hr.json
│          hu.json
│          id.json
│          it.json
│          ja.json
│          ko.json
│          lt.json
│          nl.json
│          pl.json
│          pt-BR.json
│          pt-PT.json
│          ru.json
│          sr.json
│          th.json
│          tr.json
│          uk.json
│          uz.json
│          vi.json
│          zh-CN.json
│          zh-TW.json
│
├─scripts
│      buildBrowser.js
│      buildBrowserStyles.js
│      buildLocalization.js
│      buildMain.js
│      buildPreload.js
│      package.js
│      packageLinuxAppImage.js
│      packageLinuxDebian.js
│      packageLinuxRedhat.js
│      packageMac.js
│      packageWindows.js
│      watch.js
│
└─src
    │  test.ts
    │
    ├─render
    │  │  autofillSetup.js
    │  │  bookmarkConverter.js
    │  │  browserUI.js
    │  │  contextMenu.js
    │  │  downloadManager.js
    │  │  findinpage.js
    │  │  focusMode.js
    │  │  index.js
    │  │  keybindings-default.js
    │  │  keybindings.js
    │  │  macHandoff.js
    │  │  menuRenderer.js
    │  │  modalMode.js
    │  │  newTabPage.js
    │  │  pageTranslations.js
    │  │  pdfViewer.js
    │  │  readerDecision.js
    │  │  readerView.js
    │  │  remoteMenuRenderer.js
    │  │  sessionRestore.js
    │  │  statistics.js
    │  │  tabAudio.js
    │  │  tabState.js
    │  │  userscripts.js
    │  │  webviewGestures.js
    │  │  webviewMenu.js
    │  │  webviews.js
    │  │  windowControls.js
    │  │
    │  ├─css
    │  │      base.css
    │  │      bookmarkManager.css
    │  │      downloadManager.css
    │  │      findinpage.css
    │  │      listItem.css
    │  │      modal.css
    │  │      newTabPage.css
    │  │      passwordCapture.css
    │  │      passwordManager.css
    │  │      passwordViewer.css
    │  │      searchbar.css
    │  │      tabBar.css
    │  │      tabEditor.css
    │  │      taskOverlay.css
    │  │      webviews.css
    │  │      windowControls.css
    │  │
    │  ├─navbar
    │  │      addTabButton.js
    │  │      bookmarkStar.js
    │  │      contentBlockingToggle.js
    │  │      menuButton.js
    │  │      navigationButtons.js
    │  │      permissionRequests.js
    │  │      progressBar.js
    │  │      tabActivity.js
    │  │      tabBar.js
    │  │      tabColor.js
    │  │      tabEditor.js
    │  │
    │  ├─password
    │  │      bitwarden.js
    │  │      keychain.js
    │  │      managerSetup.js
    │  │      onepassword.js
    │  │      passwordCapture.js
    │  │      passwordManager.js
    │  │      passwordViewer.js
    │  │
    │  ├─places
    │  │      fullTextSearch.js
    │  │      places.js
    │  │      placesSearch.js
    │  │      placesService.html
    │  │      placesService.js
    │  │      tagIndex.js
    │  │
    │  ├─searchbar
    │  │  │  bookmarkEditor.js
    │  │  │  bookmarkManager.js
    │  │  │  customBangs.js
    │  │  │  historyViewer.js
    │  │  │  searchbar.js
    │  │  │  searchbarPlugins.js
    │  │  │  searchbarUtils.js
    │  │  │
    │  │  └─plugins
    │  │          bangs.js
    │  │          calculator.js
    │  │          developmentNotification.js
    │  │          instantAnswer.js
    │  │          openTabs.js
    │  │          places.js
    │  │          placeSuggestions.js
    │  │          restoreTask.js
    │  │          searchSuggestions.js
    │  │          shortcutButtons.js
    │  │          updateNotifications.js
    │  │
    │  ├─tab
    │  │      stack.js
    │  │      tab.js
    │  │      task.js
    │  │      windowSync.js
    │  │
    │  ├─taskOverlay
    │  │      taskOverlay.js
    │  │      taskOverlayBuilder.js
    │  │
    │  └─utils
    │          searchEngine.js
    │
    ├─main
    │      download.js
    │      filtering.js
    │      index.js
    │      keychainService.js
    │      menu.js
    │      permissionManager.js
    │      prompt.js
    │      registryConfig.js
    │      remoteActions.js
    │      remoteMenu.js
    │      settingManage.js
    │      themeMain.js
    │      touchbar.js
    │      UASwitcher.js
    │      viewManager.js
    │      windowManagement.js
    │
    ├─pages
    │  │  pagebase.css
    │  │  settingsDropdown.css
    │  │
    │  ├─error
    │  │      error.js
    │  │      index.html
    │  │
    │  ├─newtab
    │  │      index.html
    │  │
    │  ├─pdfViewer
    │  │      index.html
    │  │      pdfThemeSelector.js
    │  │      viewer.css
    │  │      viewer.js
    │  │
    │  ├─phishing
    │  │      index.html
    │  │      phishingError.css
    │  │      phishingError.js
    │  │      redFavicon.png
    │  │
    │  ├─prompt
    │  │      index.html
    │  │      prompt.css
    │  │      prompt.js
    │  │
    │  ├─reader
    │  │      index.html
    │  │      reader.js
    │  │      readerContent.css
    │  │      readerThemeSelector.js
    │  │      readerUI.css
    │  │
    │  ├─sessionRestoreError
    │  │      index.html
    │  │
    │  └─settings
    │          index.html
    │          settings.css
    │          settings.js
    │
    ├─preload
    │      index.js
    │      passwordFill.js
    │      readerDetector.js
    │      siteUnbreak.js
    │      textExtractor.js
    │      translate.js
    │
    ├─setting
    │      setting.js
    │      settingPreload.js
    │      settingTemplate.js
    │
    └─utils
            autocomplete.js
            database.js
            hosts.js
            keyboardMap.js
            keyboardNavigation.js
            passwordManage.js
            process.js
            processWorker.js
            proxy.js
            relativeDate.js
            theme.js
            urlParser.js
            versions.js
```