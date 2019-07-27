export async function javascript({ code, transform }) {
  if (transform) code = await transform(code);
  return code;
}

export async function css({ code, transform }) {
  if (transform) code = await transform(code);
  return code;
}

export async function html({ code, transform }) {
  if (transform) code = await transform(code);
  return code;
}

export async function rawdata({ code, transform }) {
  if (transform) code = await transform(code);
  return code;
}
