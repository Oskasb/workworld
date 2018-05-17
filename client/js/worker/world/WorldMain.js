"use strict";


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
                WorldAPI.setCom(ENUMS.BufferChannels.ENV_INDEX, 4);
                WorldAPI.callSharedWorker(ENUMS.Worker.PHYSICS_WORLD, ENUMS.Protocol.SET_WORLD_COM_BUFFER, worldComBuffer);
            };

            new PipelineObject("SHARED_BUFFERS", ENUMS.Key.WORLD_COM_BUFFER, worldComReady)

        };

        WorldMain.prototype.worldComBuffer = function() {
            return worldComBuffer;
        };

        WorldMain.prototype.updateWorld = function() {
            updateWorld()
        };

        WorldMain.prototype.updateWorldEffects = function() {
            EffectsAPI.tickEffectSimulation(worldComBuffer[ENUMS.BufferChannels.FRAME_RENDER_TIME]);
        };

        return WorldMain;

    });

