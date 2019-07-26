export function javascript({ code, transform }) {
  return transform ? transform(code) : code;
}

export function css({ code, transform }) {
  return transform ? transform(code) : code;
}

export function html({ code, transform }) {
  return transform ? transform(code) : code;
}

export function rawdata({ code, transform }) {
  return transform ? transform(code) : code;
}
