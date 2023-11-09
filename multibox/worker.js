(function(moduleFactory) {
    let modules = {};

    function require(moduleId) {
        if (modules[moduleId]) {
            return modules[moduleId].exports;
        }

        let module = modules[moduleId] = {
            id: moduleId,
            loaded: false,
            exports: {}
        };

        moduleFactory[moduleId].call(module.exports, module, module.exports, require);
        module.loaded = true;

        return module.exports;
    }

    require.modules = moduleFactory;
    require.cache = modules;

    require.define = function(targetModule, propertyKey, getter) {
        if (!require.propertyExists(targetModule, propertyKey)) {
            Object.defineProperty(targetModule, propertyKey, {
                enumerable: true,
                get: getter
            });
        }
    };

    require.markAsModule = function(targetModule) {
        if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
            Object.defineProperty(targetModule, Symbol.toStringTag, {
                value: 'Module'
            });
        }
        Object.defineProperty(targetModule, '__esModule', {
            value: true
        });
    };

    require.ensureType = function(value, flags) {
        if (flags & 1 && value) {
            value = require(value);
        }
        if (flags & 8) {
            return value;
        }
        if (flags & 4 && typeof value === 'object' && value && value.__esModule) {
            return value;
        }
        let namespace = Object.create(null);
        require.markAsModule(namespace);
        if (flags & 2 && typeof value !== 'string') {
            for (let key in value) {
                require.define(namespace, key, (function(property) {
                    return value[property];
                }).bind(null, key));
            }
        }
        if (flags & 4) {
            Object.defineProperty(namespace, 'default', {
                enumerable: true,
                value: value
            });
        }
        return namespace;
    };

    require.n = function(targetModule) {
        let getter = targetModule && targetModule.__esModule ?
            function getDefault() { return targetModule.default; } :
            function getModuleExports() { return targetModule; };
        require.define(getter, 'a', getter);
        return getter;
    };

    require.propertyExists = function(object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
    };

    require.publicPath = '';

    require(require.start = 0);
})([
    function() {
        onmessage = function(event) {
            let url = event.data;
            fetch(url, { mode: 'cors' })
                .then(response => response.blob())
                .then(blob => createImageBitmap(blob))
                .then(bitmap => self.postMessage({ skinUrl: url, bitmap: bitmap }))
                .catch(() => self.postMessage({ skinUrl: url, error: true }));
        }
    }
]);
