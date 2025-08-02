// whisper.js - Loader for whisper.wasm using Emscripten
var Whisper = (function () {
    var _module = {};
    return function () {
      return new Promise((resolve, reject) => {
        if (_module && _module.calledRun) {
          resolve(_module);
          return;
        }
  
        _module = {
          locateFile: function (path) {
            // Load wasm from same folder
            return "/whisper/" + path;
          },
          onRuntimeInitialized: function () {
            console.log("✅ Whisper WASM runtime initialized");
            resolve(_module);
          },
        };
  
        importScripts("/whisper/whisper.wasm.js");
  
        // If using whisper.wasm directly without .js wrapper, reject
        if (typeof Module === "undefined") {
          reject("❌ whisper.wasm.js not found or invalid");
        }
      });
    };
  })();
  