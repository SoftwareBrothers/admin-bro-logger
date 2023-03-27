import path from 'path';

import type { ComponentLoader } from 'adminjs';

export const bundleComponent = (
  loader: ComponentLoader,
  componentName: string
) => {
  const componentPath = path.join(__dirname, `../components/${componentName}`);
  return loader.add(componentName, componentPath);
};
