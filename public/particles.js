"use strict";

const M = Matter,

    particles = [],
    particleIdx = 0,

    MAX_POOL = 300,

    particleRate = 1; // pps

let emitDelta = 0,
    idx = 0,
    engine;

window.createWorld = function(element) {
    engine = M.Engine.create();

    engine.world.gravity.y = -1;

    window.render = M.Render.create({
        element,
        engine
    });

    M.Engine.run(engine);
    M.Render.run(render);
};

function getRand(min, max) {
    return (max - min) * Math.random() + min;
}

window.updateBodies = function(delta) {
    let  particlesToAdd;

    emitDelta = emitDelta + delta;

    particlesToAdd = Math.round(particleRate/1000 * emitDelta);

    console.log(`${emitDelta} : ${particlesToAdd}`);

    if(!particlesToAdd) {
        return;
    }

    emitDelta = 0;

    for(let i = 0; i <= particlesToAdd; i++) {
        let x  = getRand(130, 700),
            y  = getRand(500, 550),
            r  = getRand(0.2, 2),
            xd = getRand(-2, 2),
            yd = getRand(-1, 1);

        if(particles[idx]) {
            M.World.remove(engine.world, particles[idx]);
        }

        particles[idx] = M.Bodies.circle(x, y, r, {
            collisionFilter : { group : -1 },
            density : -10
        });

        M.Body.setVelocity(particles[idx], { x :xd, y : yd });

        M.World.add(engine.world, [ particles[idx] ]);

        idx = idx === MAX_POOL ? 0 : idx + 1;
    }
};
