"use strict";

define([
        '3d/effects/water/WaterFX',    
        '3d/effects/vegetation/Vegetation',
        '3d/effects/particles/ParticleSpawner'
    ],
    function(
        WaterFX,
        Vegetation,
        ParticleSpawner
    ) {

        var vegetation;
        var particleSpawner;

        var waterFx;

        var debugVegetation = false;

        var EffectsAPI = function() {

        };

        
        EffectsAPI.initEffects = function(onReady) {
            

            vegetation = new Vegetation(this);
            particleSpawner = new ParticleSpawner();

            var waterReady = function() {
                waterFx.initWaterEffect();
                onReady()
            };


            var particlesReady = function() {
                waterFx = new WaterFX(waterReady);
            };


            particleSpawner.initParticleSpawner(particlesReady);

        };

        EffectsAPI.requestParticleEffect = function(id, pos, vel) {
            particleSpawner.spawnActiveParticleEffect(id, pos, vel);
        };

        EffectsAPI.updateEffectPosition = function(effect, pos, state, tpf) {
            particleSpawner.updateActiveParticleEffect(effect, pos, state, tpf);
        };

        EffectsAPI.updateEffectVelocity = function(effect, vel, state, tpf) {
            particleSpawner.updateActiveParticleVelocity(effect, vel, state, tpf);
        };

        EffectsAPI.updateEffectQuaternion = function(effect, quat, state, tpf) {
            particleSpawner.updateActiveEffectQuaternion(effect, quat, state, tpf);
        };

        EffectsAPI.updateEffectSpriteKey = function(effect, spriteKey) {
            particleSpawner.updateEffectParticleSprite(effect, spriteKey);
        };



        EffectsAPI.updateEffectColorKey = function(effect, colorKey) {
            particleSpawner.updateEffectParticleColor(effect, colorKey);
        };

        EffectsAPI.requestTemporaryPassiveEffect = function(id, pos, vel, size, quat, duration) {
            return particleSpawner.spawnTemporaryPassiveEffect(id, pos, vel, size, quat, duration);
        };

        EffectsAPI.requestPassiveEffect = function(id, pos, vel, size, quat) {
            return particleSpawner.spawnPassiveEffect(id, pos, vel, size, quat);
        };

        EffectsAPI.returnPassiveEffect = function(effect) {
            return particleSpawner.recoverPassiveEffect(effect);
        };
        
        EffectsAPI.tickEffectSimulation = function(tpf) {
            if (vegetation) vegetation.updateVegetation(tpf);
            if (particleSpawner) particleSpawner.updateSpawnedParticles(tpf);
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