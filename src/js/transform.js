export async function javascript({code, transformer}) {
  if(transformer === 'javascript') return code;
}

export async function css({code, transformer}) {
  if(transformer === 'css') return code;
}

export async function html({code, transformer}) {
  if(transformer === 'html') return code;
}