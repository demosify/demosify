export default async () => {
  const jsCode = await import('!raw-loader!./index.js');
  return {
    javascript: jsCode.default
  };
};
