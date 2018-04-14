"use strict";

define([
    'ThreeAPI',
        'EffectsAPI',
        'PipelineObject',
        'Events'

    ],
    function(
        ThreeAPI,
        EffectsAPI,
        PipelineObject,
        evt
    ) {

        var posVec;
        var velVec;
        var effectList;
        var fxPipe;

        var EffectsListeners = function() {

        };

        var setupEffect = function(args) {
        //        console.log("Setup FX:", args);
            posVec.copy(args.pos)
            velVec.copy(args.vel);
        };


        EffectsListeners.setupListeners = function() {

            var effectData = function(src, data) {
                effectList = fxPipe.buildConfig();
            };

            fxPipe = new PipelineObject('PARTICLE_EFFECTS', 'THREE');
            fxPipe.subscribe(effectData());
            //    effectList = fxPipe.buildConfig('effects');


            posVec = new THREE.Vector3();
            velVec = new THREE.Vector3();

            var playGameEffect = function(e) {
                setupEffect(evt.args(e));

                if (!effectList[evt.args(e).effect]) {
                        console.log("No FX")
                } else {
                    EffectsAPI.requestParticleEffect(evt.args(e).effect, posVec, velVec);
                }
            };

            evt.on(evt.list().GAME_EFFECT, playGameEffect);
        };


        EffectsListeners.tickEffects = function(tpf) {
            EffectsAPI.tickEffectSimulation(tpf);
        };

        EffectsListeners.setEffectCallbacks = function(callbacks) {
            ThreeAPI.setEffectCallbacks(callbacks);
        };


        return EffectsListeners;

    });