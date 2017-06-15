"use strict";

let rafId,
    prevTime,
    currTime,
    frames = 0;

function run() {
    let now = Date.now(),
        delta;

    frames++;
    prevTime = currTime || now - 16;
    currTime = Date.now(),

    delta = currTime - prevTime;

    update(delta);
    queue();

    m.redraw();
}

function update(delta) {
    updateBodies(delta);
}

function queue() {
    rafId = requestAnimationFrame(run);
}

function start() {
    if(rafId) {
        return;
    }

    currTime = Date.now();
    run();
}

function stop() {
    if(!rafId) {
        return;
    }

    cancelAnimationFrame(rafId);
    rafId = undefined;
}

m.mount(document.getElementById("mount"), {
    view : () => [
        m("button", { onclick : start }, "Start"),
        m("button", { onclick : stop }, "Stop"),
        m("label", "Frames", m("input", { readonly : true, value : frames })),
        m("div", {
            oncreate : (canvasVnode) => {
                createWorld(canvasVnode.dom);
            }
        })
    ]
});
