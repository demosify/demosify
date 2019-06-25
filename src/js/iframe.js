class Iframe {
  constructor({el, sandboxAttrs = []}) {
    if(!el) throw new Error('Expect "el" to mount iframe to!');
    this.$el = el;
    this.sandboxAttrs = sandboxAttrs;
  }

  createIframe() {
    const iframe = document.createElement('iframe');
    iframe.setAttribute('sandbox', this.sandboxAttrs.join(' '));
    iframe.setAttribute('scrolling', 'yes');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 0;
    return iframe;
  }

  setContent({head = "", body = ""}) {
    const content = `<!DOCTYPE html><html><head>${head}</head><body>${body}</body></html>`
    const iframe = this.createIframe();
    this.$el.parentNode.replaceChild(iframe, this.$el)
    iframe.contentWindow.document.open();
    iframe.contentWindow.document.write(content);
    iframe.contentWindow.document.close();
    this.$el = iframe;
  }
}

export default (...args) => new Iframe(...args);