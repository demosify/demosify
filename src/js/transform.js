export async function javascript({code, transform}) {
  return transform ? transform(code) : code;
}

export async function css({code, transform}) {
  return transform ? transform(code) : code;
}

export async function html({code, transform}) {
  return transform ? transform(code) : code;
}