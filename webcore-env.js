let wasm = null;
let onFrameCallback = null;
let onFrameUserData = null;
let onExitCallback = null;
let onExitUserData = null;
let frameLoopShouldStop = false;

function cstrlen(mem, ptr) {
    let len = 0;
    while (mem[ptr] != 0) {
        len++;
        ptr++;
    }
    return len;
}

const string_from_ptr = (buf, ptr) => {
    const mem = new Uint8Array(buf);
    const len = cstrlen(mem, ptr);
    const bytes = new Uint8Array(buf, ptr, len);
    return new TextDecoder().decode(bytes);
}

const webConsoleError = (pMessage) => {
    const buffer = wasm.instance.exports.memory.buffer;
    console.error(string_from_ptr(buffer, pMessage));
}

const webConsoleWrite = (pMessage) => {
    const buffer = wasm.instance.exports.memory.buffer;
    console.log(string_from_ptr(buffer, pMessage));
}

const webSetOnFrameCallback = (pCallback, pUserData) => {
    onFrameCallback = pCallback;
    onFrameUserData = pUserData;
}

const webSetOnExitCallback = (pCallback, pUserData) => {
    onExitCallback = pCallback;
    onExitUserData = pUserData;
}
const webStopFrameLoop = () => {
    frameLoopShouldStop = true;
};

(async () => {
    wasm = await WebAssembly.instantiateStreaming(fetch("index.wasm"), {
        env: {
            webConsoleWrite,
            webConsoleError,
            webSetOnFrameCallback,
            webStopFrameLoop,
        },
    });

    if(!wasm) {
        console.error("Failed to initialize wasm module");
    }

    console.log("Executing webcore main function");
    wasm.instance.exports.WebMain();

    if(onFrameCallback) {
        console.log("Frame callback is defined. Starting the frame mainloop");
        let prev = null;
        const _webAnimationFrameLoop = (timestamp) => {
            if(prev) {
                wasm.instance.exports.webRunOnFrameCallback(onFrameCallback, timestamp, onFrameUserData);
            }

            prev = timestamp;
            if(!frameLoopShouldStop) {
                window.requestAnimationFrame(_webAnimationFrameLoop);
            }
        }
        window.requestAnimationFrame(_webAnimationFrameLoop);
    }

    if(onExitCallback) {
        console.log("Exit callback is defined. Executing exit callback");
        wasm.instance.exports.webRunCommonCallback(onExitCallback, onExitUserData);
    }
})();
