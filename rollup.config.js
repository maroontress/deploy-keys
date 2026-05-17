import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { builtinModules } from "module";

const config = {
  input: "index.js",
  // keep Node builtins external so Rollup emits imports like `import { ... } from 'node:crypto'`
  external: [
    ...builtinModules,
    ...builtinModules.map((m) => `node:${m}`),
  ],
  output: {
    esModule: true,
    file: "dist/index.js",
    format: "es",
    sourcemap: false,
  },
  plugins: [
    // preferBuiltins true lets Rollup resolve to Node builtin names when possible
    nodeResolve({ preferBuiltins: true, extensions: ['.js', '.mjs', '.cjs', '.json'] }),
    // transformCommonJS modules into ES modules (handles mixed ESM/CJS packages)
    commonjs({ include: /node_modules/, transformMixedEsModules: true }),
    // Replace runtime `require('node:...')` occurrences with top-level ESM imports
    {
      name: 'fix-node-requires',
      renderChunk(code) {
        const builtinSet = new Set([...(builtinModules || [])]);
        const regex = /require\(['"](?:node:)?([a-z0-9_+-]+)['"]\)/gi;
        const mods = new Map();
        let m;
        while ((m = regex.exec(code))) {
          const name = m[1];
          if (!builtinSet.has(name)) continue;
          if (!mods.has(name)) {
            const ident = `__node_${name.replace(/[^a-z0-9]/gi, '_')}`;
            mods.set(name, ident);
          }
        }
        if (mods.size === 0) return null;
        // prepend import statements
        const imports = Array.from(mods.entries()).map(([name, ident]) => `import * as ${ident} from 'node:${name}';`).join('\n') + '\n';
        // replace require(...) with the imported identifier
        const fixedCode = code.replace(regex, (_s, name) => {
          if (mods.has(name)) return mods.get(name);
          return _s;
        });
        return imports + fixedCode;
      }
    }
  ],
  // avoid automatic namespace interop that can leave `require` calls at top-level
  preserveEntrySignatures: false,
};

export default config;
