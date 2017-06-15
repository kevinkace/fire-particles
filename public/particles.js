"use strict";

const M = Matter,

    particles = [],
    particleIdx = 0,

    MAX_POOL = 300,

    particleRate = 10, // pps
    scaleRate = 0.9;   // amount each particle is reduced /sec

let emitDelta = 0,
    idx = 0,
    engine;

window.createWorld = function(canvas) {
    engine = M.Engine.create();

    engine.world.gravity.y = -1;

    window.render = M.Render.create({
        canvas,
        engine,
        options : {
            wireframes : false,
            background : "transparent"
        }
    });

    M.Engine.run(engine);
    M.Render.run(render);
};

function getRand(min, max, round) {
    let rand = (max - min) * Math.random() + min;

    return round ? Math.round(rand) : rand;
}

window.updateBodies = function(delta) {
    let particlesToAdd,
        scaleAmount;

    emitDelta = emitDelta + delta;

    particlesToAdd = Math.round(particleRate/1000 * emitDelta);

    scaleAmount = 1 - (scaleRate / 1000 * delta);

    particles.forEach((particle) => {
        if(!particle) {
            return;
        }

        M.Body.scale(particle, scaleAmount, scaleAmount);
    });

    if(!particlesToAdd) {
        return;
    }

    emitDelta = 0;

    for(let i = 0; i < particlesToAdd; i++) {
        let x  = getRand(130, 700),
            y  = getRand(500, 550),
            r  = getRand(1, 3),
            xd = getRand(-2, 2),
            yd = getRand(-1, 1),

            color = `rgba(${getRand(100, 255, true)}, 0, ${getRand(20, 80, true)}, ${getRand(0.3, 0.8)})`;

        if(particles[idx]) {
            M.World.remove(engine.world, particles[idx]);
        }

        particles[idx] = M.Bodies.circle(x, y, r, {
            collisionFilter : { group : -1 },
            render : {
                fillStyle : color
            }
        });

        M.Body.setVelocity(particles[idx], { x :xd, y : yd });

        M.World.add(engine.world, [ particles[idx] ]);

        idx = idx === MAX_POOL ? 0 : idx + 1;
    }
};
