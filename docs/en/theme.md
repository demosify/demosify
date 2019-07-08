# User theme

Demosify allows users to customize themes and specify CSS files for custom themes in `demosrc.js', which supports SASS.

For example, modify the color of the default selection of sidebar:

```scss
.sidebar-menuItem.router-link-active {
  color: $c-font;
}
```

## SCSS variables override

Demosify allows users to override default scss variables in custom theme file.

For example: 

```scss
  $c-highlight: #39cc59; // change highlight color to green
```

The variables which can be overridden are listed in the following table:

|Variables|Meaning|
|---|---|
|$font-family|font family|
|$logo-font-family|font family of logo|
|$link-font-family|font family of links|
|$c-gap|color of grid layout gap|
|$c-bg|background color|
|$c-font|text color|
|$c-highlight|hightlight color|
|$c-console-bg|background color of console|
|$c-console-bg-odd|background color of odd lines in console|
|$c-console-info|color of info type log in console|
|$c-console-warn|color of warning type log in console|
|$c-console-error|color of error type log in console|
|$c-flipbtn-bg|background color of filp button on mobile|
|$c-flipbtn-color|color of filp icon on mobile|