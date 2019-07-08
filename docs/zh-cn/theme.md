# 自定义主题

Demosify 允许用户自定义主题，在 `.demosrc.js` 中通过 themeFile 属性指定自定义主题的 CSS 文件，支持 SASS。

比如修改 sidebar 默认选中项的颜色：

```scss
.sidebar-menuItem.router-link-active {
  color: $c-font;
}
```
