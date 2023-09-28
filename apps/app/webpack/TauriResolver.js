const path = require('path');
const fs = require('fs');

module.exports = class TauriResolvePlugin {
  apply(resolver) {
    // match any *.tauri.tsx and *.tauri file
    const tauriPattern = /\.tauri(\.tsx|)$/;
    const webPattern = /\.web(\.tsx|)$/;

    resolver.getHook('described-resolve').tapAsync('TauriResolvePlugin', (request, resolveContext, callback) => {
      /**
       * @type {string}
       */
      const innerRequest = request.request || request.path;
      const isTauriFile = tauriPattern.test(innerRequest);
      const isWebFile = webPattern.test(innerRequest);

      // For files that shouldn't be handled by this plugin
      if (!innerRequest || (!isTauriFile && !isWebFile)) {
        return callback();
      }

      // point to src/components/Empty/index.tsx at the root of the project
      const emptyPath = path.join(process.cwd(), 'src/components/Empty/index.tsx');

      const isTauri = !!process.env.NEXT_PUBLIC_TAURI;
      const chooseEmpty = (!isTauri && isTauriFile) || (isTauri && isWebFile);
      const newRequestPath = chooseEmpty ? path.resolve(emptyPath) : path.resolve(innerRequest);

      if (!fs.existsSync(newRequestPath)) {
        return callback();
      }

      const obj = Object.assign({}, request, {
        request: newRequestPath,
      });

      return resolver.doResolve(resolver.getHook('resolve'), obj, `TauriResolvePlugin ${newRequestPath}`, resolveContext, (err, result) => {
        if (err) return callback(err);

        // Don't allow other aliasing or raw request
        if (result === undefined) return callback(null, null);

        return callback(null, result);
      });
    });
  }
};
