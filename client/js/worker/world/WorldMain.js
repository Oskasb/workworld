"use strict";



var wait = function(cb) {

  //
    var match = Atomics.wait(worldComBuffer, ENUMS.Protocol.WAKE_INDEX, 1, 100);
    Atomics.store(worldComBuffer, ENUMS.Protocol.WAKE_INDEX, 0);
    console.log("Wait match:",match);

    if (match === 'ok') {
        cb();
    } else {
        wait(cb);
    }

};

define([
        'Events',
        'EffectsAPI',
        'PipelineObject',
        '3d/effects/EffectListeners'
    ],
    function(
        evt,
        EffectsAPI,
        PipelineObject,
        EffectsListeners
    ) {

        var WorldAPI;
        var worldFrame = 0;
        var gameTime = 0;
        var avgTfp = 0.1;

        var worldComBuffer;

        var initTime;
        var tpf, time, lastTime, idle, renderStart, renderEnd;

        var updateWorld = function() {

            if (worldComBuffer[ENUMS.BufferChannels.WAKE_INDEX] !== worldFrame ) {
                worldFrame = worldComBuffer[ENUMS.BufferChannels.WAKE_INDEX];
                worldFrame++;
                return;
            }

            time = worldComBuffer[ENUMS.BufferChannels.FRAME_RENDER_TIME] - initTime;
            tpf = time - lastTime;
            lastTime = time;
            gameTime += tpf;
            avgTfp = tpf*0.3 + avgTfp*0.7;
            worldFrame++;
            //    console.log("Update World Sim", tpf);
            //    this.simulationState.updateState(tpf);


            var distance = 1250;

            fxArg.effect = "firey_explosion_core";

            EffectsAPI.tickEffectSimulation(worldComBuffer[ENUMS.BufferChannels.FRAME_RENDER_TIME]);

            for (var i = 0; i < Math.floor(Math.random()*10); i++) {
                tmpVec.x = distance * Math.random() * (Math.random() - 0.5);
                tmpVec.y = distance * Math.random() * 0.1 * Math.random();
                tmpVec.z = distance * Math.random() * (Math.random() - 0.5);


                tmpVec2.x = 0 // Math.sin(gameTime);
                tmpVec2.y = 0.2 // Math.random()*0.2;
                tmpVec2.z = 0 // Math.cos(gameTime);

            //    evt.fire(evt.list().GAME_EFFECT, fxArg);
            }


            WorldAPI.updateWorldWorkerFrame(avgTfp, worldFrame);

        };


        var WorldMain = function(wApi) {
            WorldAPI = wApi;
        };


        WorldMain.prototype.initWorldSystems = function(onWorkerReady) {
            EffectsListeners.setupListeners();

            var fxReady = function() {
            //    buildSillyWorld();

                initTime = worldComBuffer[ENUMS.BufferChannels.FRAME_RENDER_TIME];
                lastTime = 0;

                onWorkerReady(updateWorld)
            };

            var worldComReady = function(src, data) {
                worldComBuffer = data;
                EffectsAPI.initEffects(fxReady);
            };

            new PipelineObject("SHARED_BUFFERS", ENUMS.Key.WORLD_COM_BUFFER, worldComReady)

        };

        var tmpVec = new THREE.Vector3();
        var tmpVec2 = new THREE.Vector3();
        var tmpVec3 = new THREE.Vector3();
        var fxArg = {effect:"firey_explosion_core", pos:tmpVec, vel:tmpVec2};


        WorldMain.prototype.worldComBuffer = function() {

            return worldComBuffer;

        };


        var sillyWorld = function(count, fxId) {

            var distance = 1450;

            fxArg.effect = "firey_explosion_core";

            for (var i = 0; i < count; i++) {
                tmpVec.x = distance * Math.random() * (Math.random() - 0.5);
                tmpVec.y = distance * Math.random() * 0.3 * Math.random();
                tmpVec.z = distance * Math.random() * (Math.random() - 0.5);


                tmpVec2.x = 0;
                tmpVec2.y = 0;
                tmpVec2.z = 0;

                tmpVec3.x = 0;
                tmpVec3.y = 0;
                tmpVec3.z = 0;

                // evt.fire(evt.list().GAME_EFFECT, fxArg);

                EffectsAPI.requestPassiveEffect(fxId, tmpVec, tmpVec2, tmpVec3)
            }
        };

        var buildSillyWorld = function() {
            sillyWorld(40, "model_geometry_tree_2_trunk_effect");
            sillyWorld(40, "model_geometry_tree_3_combined_effect");
            sillyWorld(40, "creative_crate_geometry_effect");
        };

        WorldMain.prototype.setLoopTpf = function(tpf) {
            updateWorld()
        };

        return WorldMain;

    });

