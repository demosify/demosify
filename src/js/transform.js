export async function javascript({code, transformer, transform}) {
  if(transformer === 'javascript') return transform ? transform(code) : code;
}

export async function css({code, transformer, transform}) {
  if(transformer === 'css') return transform ? transform(code) : code;
}

export async function html({code, transformer, transform}) {
  if(transformer === 'html') return transform ? transform(code) : code;
}