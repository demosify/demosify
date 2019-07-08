# 自定义主题

Demosify 允许用户自定义主题，在 `.demosrc.js` 中通过 themeFile 属性指定自定义主题的 CSS 文件，支持 SASS。

比如修改 sidebar 默认选中项的颜色：

```scss
.sidebar-menuItem.router-link-active {
  color: $c-font;
}
```

## SCSS 变量覆盖

用户可以在自定义的scss里面对默认变量进行覆盖：

```scss
  $c-highlight: #39cc59; // 将高亮颜色改为绿色
```

可覆盖的值有： 
|变量名|释义|
|---|---|
|$font-family|字体|
|$logo-font-family|当logo为文字时的字体|
|$link-font-family|链接字体|
|$c-gap|grid布局中缝隙颜色|
|$c-bg|背景色|
|$c-font|文字颜色|
|$c-highlight|高亮色|
|$c-console-bg|console控制台的背景色|
|$c-console-bg-odd|console控制台斑马线颜色|
|$c-console-info|console info类型日志颜色|
|$c-console-warn|console warning类型日志颜色|
|$c-console-error|console error类型日志颜色|
|$c-flipbtn-bg|移动端翻转按钮背景色|
|$c-flipbtn-color|移动端翻转图标颜色|