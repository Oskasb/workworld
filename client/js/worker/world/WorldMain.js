"use strict";

define([

    ],
    function(

    ) {

        var WorldAPI;
        var worldFrame = 0;

        var WorldMain = function(wApi) {
            WorldAPI = wApi;
        };


        WorldMain.prototype.updateSimulation = function(tpf) {
            worldFrame++;
        //    console.log("Update World Sim", tpf);
        //    this.simulationState.updateState(tpf);
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

