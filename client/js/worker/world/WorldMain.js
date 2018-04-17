"use strict";

define([
    'Events',
        'EffectsAPI',
        '3d/effects/EffectListeners'
    ],
    function(
        evt,
        EffectsAPI,
        EffectsListeners
    ) {

        var WorldAPI;
        var worldFrame = 0;
        var gameTime = 0;

        var WorldMain = function(wApi) {
            WorldAPI = wApi;
        };


        WorldMain.prototype.initWorldSystems = function(onWorkerReady) {
            EffectsListeners.setupListeners();
            EffectsAPI.initEffects(onWorkerReady);
        };

        var tmpVec = new THREE.Vector3();
        var tmpVec2 = new THREE.Vector3();
        var fxArg = {effect:"firey_explosion_core", pos:tmpVec, vel:tmpVec2};



        WorldMain.prototype.updateSimulation = function(tpf) {
            gameTime += tpf;
            worldFrame++;
        //    console.log("Update World Sim", tpf);
        //    this.simulationState.updateState(tpf);
            EffectsAPI.tickEffectSimulation(tpf);

            var distance = 450;

            for (var i = 0; i < 2; i++) {
                tmpVec.x = distance * Math.random() * (Math.random() - 0.5);
                tmpVec.y = distance * Math.random() * 0.1 * Math.random();
                tmpVec.z = distance * Math.random() * (Math.random() - 0.5);


                tmpVec2.x = Math.sin(gameTime);
                tmpVec2.y = Math.random()*20;
                tmpVec2.z = Math.cos(gameTime);

                evt.fire(evt.list().GAME_EFFECT, fxArg);
            }


            WorldAPI.updateWorldWorkerFrame(tpf, worldFrame);

        };


        var gameLoop;


        WorldMain.prototype.setLoopTpf = function(tpf) {

            console.log("Run Worker Game Loop", tpf);
            var activationGrid;

            var initLoop = function() {

                var frameTime = tpf;

                var update = function() {
                    this.updateSimulation(frameTime)
                }.bind(this);

                gameLoop = setInterval(update, tpf*1000);
            }.bind(this);

        //    activationGrid = new ActivationGrid(gridReady);

            clearInterval(gameLoop);

            if (tpf) {
                initLoop();
            }

        };

        return WorldMain;

    });

