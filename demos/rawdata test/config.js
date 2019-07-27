export default async () => {
  const javascript = await import('!raw-loader!./index.js');
  let rawdata = await import('!!raw-loader!./data.json');

  return {
    javascript: {
      code: javascript,
      transformer: 'javascript',
      visible: true,
      transform(code) {
        // eslint-disable-next-line quotes
        const prefix = `const CONFIG = new Function('return ' + document.querySelector('script[type="text/x-rawdata"]').textContent)();`;
        return prefix + code;
      }
    },
    rawdata: {
      tabName: 'CONFIGURE',
      code: rawdata,
      transformer: 'json',
      visible: true
    }
  };
};
