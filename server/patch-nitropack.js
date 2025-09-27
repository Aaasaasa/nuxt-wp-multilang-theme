import { writeFile } from 'fs/promises';
import { join } from 'path';

const nitropackPkgPath = join(process.cwd(), 'node_modules', 'nitropack', 'package.json');
let nitropackPkg: any;

try {
  nitropackPkg = require(nitropackPkgPath);
} catch (error) {
  console.error(`Error reading ${nitropackPkgPath}: ${error}`);
  process.exit(1);
}

nitropackPkg.exports = {
  '.': {
    import: './dist/index.mjs',
    require: './dist/index.cjs',
  },
  './config': {
    import: './dist/config.mjs',
    require: './dist/config.cjs',
  },
};

try {
  await writeFile(nitropackPkgPath, JSON.stringify(nitropackPkg, null, 2));
} catch (error) {
  console.error(`Error writing ${nitropackPkgPath}: ${error}`);
  process.exit(1);
}
