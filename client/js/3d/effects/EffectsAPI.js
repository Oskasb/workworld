"use strict";

define([
        '3d/effects/filters/ScreenSpaceFX',
        '3d/effects/water/WaterFX',
        '3d/effects/vegetation/Vegetation',
        '3d/effects/particles/ParticleSpawner'
    ],
    function(
        ScreenSpaceFX,
        WaterFX,
        Vegetation,
        ParticleSpawner
    ) {

        var vegetation;
        var particleSpawner;

        var waterFx;
        var screenFx;

        var debugVegetation = false;

        var EffectsAPI = function() {

        };

        
        EffectsAPI.initEffects = function(onReady) {

            vegetation = new Vegetation(this);
            particleSpawner = new ParticleSpawner();


         //   console.log("Init particleSpawner", typeof(window.outerWidth), window);

            if (typeof(window.outerWidth) === 'number') {
                var waterReady = function() {

                    waterFx.initWaterEffect();
                    EffectsAPI.initBloomFilter();
                    onReady()
                };


                var particlesReady = function() {
                    waterFx = new WaterFX(waterReady);

                };


                particleSpawner.initParticleSpawner(particlesReady);
            } else {
        //        console.log("Init worker particleSpawner");
                EffectsAPI.enableTerrainVegetation();
                particleSpawner.initParticleSpawner(onReady);

            }



        };

        EffectsAPI.requestParticleEffect = function(id, pos, vel) {
            particleSpawner.spawnActiveParticleEffect(id, pos, vel);
        };

        EffectsAPI.updateEffectPosition = function(effect, pos, state, tpf) {
            particleSpawner.updateActiveParticleEffect(effect, pos, tpf);
        };

        EffectsAPI.updateEffectVelocity = function(effect, vel, state, tpf) {
            particleSpawner.updateActiveParticleVelocity(effect, vel, tpf);
        };

        EffectsAPI.updateEffectQuaternion = function(effect, quat, state, tpf) {
            particleSpawner.updateActiveEffectQuaternion(effect, quat, tpf);
        };

        EffectsAPI.updateEffectScale = function(effect, size, tpf) {
            particleSpawner.updateActiveEffectScale(effect, size, tpf);
        };

        EffectsAPI.updateEffectSpriteKey = function(effect, spriteKey) {
            particleSpawner.updateEffectParticleSprite(effect, spriteKey);
        };


        EffectsAPI.updateEffectColorKey = function(effect, colorKey) {
            particleSpawner.updateEffectParticleColor(effect, colorKey);
        };

        EffectsAPI.updateEffectAlphaKey = function(effect, alphaKey) {
            particleSpawner.updateEffectParticleAlpha(effect, alphaKey);
        };

        EffectsAPI.requestTemporaryPassiveEffect = function(id, pos, vel, size, quat, duration) {
            return particleSpawner.spawnTemporaryPassiveEffect(id, pos, vel, size, quat, duration);
        };

        EffectsAPI.requestPassiveEffect = function(id, pos, vel, size, quat, scale, aspect) {
            return particleSpawner.spawnPassiveEffect(id, pos, vel, size, quat, scale, aspect);
        };

        EffectsAPI.returnPassiveEffect = function(effect) {
            return particleSpawner.recoverPassiveEffect(effect);
        };
        
        EffectsAPI.tickEffectSimulation = function(systemTime) {
            if (vegetation) vegetation.updateVegetation(systemTime);
            if (particleSpawner) particleSpawner.updateSpawnedParticles(systemTime);
        };

        EffectsAPI.sampleTotalParticlePool = function() {
            return particleSpawner.getTotalParticlePool();
        };

        EffectsAPI.countTotalEffectPool = function() {
            return particleSpawner.getTotalEffectPool();
        };

        EffectsAPI.sampleActiveRenderersCount = function() {
            return particleSpawner.getActiveRendererCount();
        };

        EffectsAPI.sampleActiveEffectsCount = function() {
            return particleSpawner.getActiveEffectsCount();
        };

        EffectsAPI.sampleActiveParticleCount = function() {
            return particleSpawner.getActiveParticlesCount();
        };

        EffectsAPI.sampleEffectActivations = function() {
            return particleSpawner.getEffectActivationCount();
        };

        EffectsAPI.enableTerrainVegetation = function() {
            vegetation.createVegetationSystems();

        };

        EffectsAPI.initBloomFilter = function() {
            screenFx = new ScreenSpaceFX();
            screenFx.initFilterEffects();
        };

        EffectsAPI.disableTerrainVegetation = function() {
            vegetation.removeVegetationSystems();
        };

        EffectsAPI.setVegetationDebug = function(bool) {
            debugVegetation = bool;
            if (vegetation) vegetation.setDebug(bool);
        };

        EffectsAPI.vegDebug = function() {
            return debugVegetation;
        };
        
        return EffectsAPI;

    });