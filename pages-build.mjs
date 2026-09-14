import { copyFile, mkdir, writeFile } from 'node:fs/promises';

// Supply real entry pages for the known BrowserRouter routes on static hosting.
for (const route of ['admin', 'admin/login', 'admin/products', 'admin/products/new', 'admin/categories', 'admin/categories/new', 'admin/settings']) {
  await mkdir(`dist/${route}`, { recursive: true });
  await copyFile('dist/index.html', `dist/${route}/index.html`);
}
await copyFile('dist/index.html', 'dist/404.html');
await writeFile('dist/.nojekyll', '');
