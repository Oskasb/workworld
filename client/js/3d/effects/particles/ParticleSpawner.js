"use strict";

define([
        'ThreeAPI',
        '3d/effects/particles/ParticleEffectData',
        '3d/effects/particles/ParticleEffect',
        '3d/effects/particles/EffectDataTranslator',
        '3d/effects/particles/ParticleRenderer',
        'PipelineObject'
    ],
    function(
        ThreeAPI,
        ParticleEffectData,
        ParticleEffect,
        EffectDataTranslator,
        ParticleRenderer,
        PipelineObject
    ) {

        var renderers = {};
        var requestedEffects = [];
        var activeEffects = [];
        var idleEffects = [];
        var endedEffects = [];

        var temporaryEffects = [];

        var fxAdds = 0;
        var systemTime = 0;

        var started = 0;
        var finished = 0;

        var sysKey = 'THREE';

        var poolTotal = 0;
        var activeRenderes = 0;
        var totalRenderers = 0;
        var activeParticles;
        var i;
        var key;
        var count;
        var adds;
        var effect;

        var activateRenderer;
        var activateEffect;

        var fxConf;
        var particleConf;
        var sprite;
        var texelRow;

        var dead;
        var spliced;
    //    var addRen;

        var ready = function() {};
        
        var rendererReady = function(renderer) {
            if (!renderers[renderer.id]) {
                renderers[renderer.id] = [];
            }
            renderers[renderer.id].push(renderer);
            finished ++;

    //        console.log("ParticleSpawner load: r/s", started, finished);
            if (started === finished) {
                ready();
            }
        };
        
        
        var ParticleSpawner = function() {
            this.particleEffectData = new ParticleEffectData();
            this.particleEffectData.loadEffectData();

        };
3
        ParticleSpawner.prototype.initParticleSpawner = function(onReady) {

            this.setupParticleRenderers();

            ready = onReady;
        };

        ParticleSpawner.prototype.setupParticleRenderers = function() {


    //        console.log("SETUP PARTICLE RENDERERS");

            var addRen = function(data) {
                this.addRenderer(data, rendererReady);
            }.bind(this);

            
            
            var renderersData = function(src, data) {
                for (i = 0; i < data.length; i++) {

                    started++;

    //                console.log("SETUP PARTICLE RENDERER:", src, data[i]);
                /*
                    if (renderers[data[i].id]) {
                        console.log("DELETE EXISTING PARTICLE RENDERER", data[i].id);
                        renderers[data[i].id].dispose();
                        delete renderers[data[i].id];
                    }
                 */
                    addRen(data[i]);

                }
            };
            
            new PipelineObject("PARTICLE_SYSTEMS", "RENDERERS", renderersData);
            new PipelineObject("PARTICLE_MODEL_SYSTEMS", "RENDERERS", renderersData);
        };

        ParticleSpawner.prototype.addRenderer = function(rendererData, onReady) {
            new ParticleRenderer(rendererData, onReady);
        };

        ParticleSpawner.prototype.getRenderersById = function(id) {

            return renderers[id];

        };


        ParticleSpawner.prototype.getEffect = function() {

            if (idleEffects.length != 0) {
                return idleEffects.shift();
            } else {
                return new ParticleEffect();
            }
        };


        ParticleSpawner.prototype.renderEffect = function(renderer, effect) {
            EffectDataTranslator.interpretCustomEffectData(effect.effectData, effect.effectData.particle.config);

            effect.attachSimulators();
            effect.applyRenderer(renderer, systemTime);

            if (effect.temporary.startTime) {

                if (effect.temporary.startTime === effect.temporary.endTime) {
                    effect.temporary.endTime += effect.effectDuration;
                }
            }


            if (!effect.aliveParticles.length) {
                return
            }

            return effect;
        };


        ParticleSpawner.prototype.duplicateRenderer = function(renderer, effect) {

            if (renderer.adding) return this.renderEffect(renderer, effect);

            var onReady = function(rndr) {
                rendererReady(rndr);
                console.log("add renderer for particle group", rndr);
                renderer.adding = false;
            }

            renderer.adding = true;
            //   if (!renderer.particles.length) {
            console.log("request new renderer...", renderer);
            this.addRenderer(renderer.config, onReady);
            return this.renderEffect(renderer, effect);

        };

        ParticleSpawner.prototype.buildEffect = function(id, pos, vel, size, quat, duration) {

            effect = this.getEffect();

            effect.setEffectId(id);

            effect.setEffectPosition(pos);

            if (vel) {
                effect.setEffectVelocity(vel);
            } else {
                effect.vel.x = 0;
                effect.vel.y = 0;
                effect.vel.z = 0;
            }

            if (size) {
                effect.setEffectSize(size);
            } else {
                effect.size.x = 0;
                effect.size.y = 0;
                effect.size.z = 0;
            }

            if (quat) {
                effect.setEffectQuaternion(quat);
            } else {
                effect.quat.x = 0;
                effect.quat.y = 0;
                effect.quat.z = 0;
                effect.quat.w = 1;
            }

            if (duration) {
                effect.setEffectDuration(duration);
            }

            requestedEffects.push(effect);

            //    this.activateEffect(effect);

            return effect;
        //    return this.activateEffect(effect);

        };




        ParticleSpawner.prototype.activateEffect = function(effect) {
            effect.setEffectData(this.particleEffectData.buildEffect(effect.effectData, sysKey, effect.getEffectId()));

            activateRenderer = this.getRenderersById(effect.effectData.effect.renderer_id);

            if (!activateRenderer) {
                console.log("Renderer not yet ready...", effect.effectData.effect.renderer_id);
                return;
            }

            for (i = 0; i < activateRenderer.length; i++) {
                if (activateRenderer[i].particles.length > activateRenderer[i].biggestRequest * 2) {
                    return this.renderEffect(activateRenderer[i], effect);
                }
            }

            return this.duplicateRenderer(activateRenderer[0], effect);
        };


        ParticleSpawner.prototype.spawnActiveParticleEffect = function(id, pos, vel) {


            activateEffect = this.buildEffect(id, pos, vel);

            if (typeof(activateEffect) === 'undefined') {
                console.log("Undefined effect created...", id, pos, vel);
                return;
            }
            fxAdds++;
            activeEffects.push(activateEffect);
        };

        ParticleSpawner.prototype.updateActiveParticleEffect = function(effect, pos, state, tpf) {
            effect.updateEffectPositionSimulator(pos, tpf);
        };

        ParticleSpawner.prototype.updateActiveParticleVelocity = function(effect, vel, state, tpf) {
            effect.updateEffectVelocitySimulator(vel, tpf);
        };

        ParticleSpawner.prototype.updateActiveEffectQuaternion = function(effect, quat, state, tpf) {
            effect.updateEffectQuaternionSimulator(quat, tpf);
        };


        ParticleSpawner.prototype.updateEffectParticleSprite = function(effect, spriteKey) {
            fxConf       = this.particleEffectData.fetchEffect(sysKey,  effect.id);
            particleConf = this.particleEffectData.fetchParticle(fxConf.system_key, fxConf.particle_id);
            sprite       = this.particleEffectData.fetchSprite(particleConf.sprite_key, spriteKey);

            if (!sprite) {
                console.log("No sprite for spriteKey", spriteKey);
                return;

            }

            effect.updateEffectSpriteSimulator(sprite, spriteKey);
        };

        ParticleSpawner.prototype.updateEffectParticleColor = function(effect, colorKey) {
            texelRow = EffectDataTranslator.getTexelRowByName(colorKey);

            if (isNaN(texelRow)) {
                console.log("No such curve: ", colorKey);
                return;
            }

            effect.updateEffectColorTexelRow(texelRow, colorKey);

        };

        ParticleSpawner.prototype.spawnTemporaryPassiveEffect = function(id, pos, vel, size, quat, duration) {

            activateEffect = this.buildEffect(id, pos, vel, size, quat, duration);

            if (!duration) {
                duration = 0;
            }

            activateEffect.setEffectTemporary(systemTime, systemTime+duration);

            temporaryEffects.push(activateEffect);

            return activateEffect;
        };

        ParticleSpawner.prototype.spawnPassiveEffect = function(id, pos, vel, size, quat) {
            return this.buildEffect(id, pos, vel, size, quat);
        };

        ParticleSpawner.prototype.recoverPassiveEffect = function(effect) {

            if (typeof(effect) === 'undefined') {
                console.log("Undefined effect returned...");
                return;
            }

            if (!effect.aliveParticles.length) {
            //    console.log("Bad Effect returned!", effect);
            //    return;
            }

            effect.age = effect.effectDuration + effect.lastTpf;

            effect.setEffectDuration(0);

            activeEffects.push(effect);
        };



        ParticleSpawner.prototype.updateSpawnedParticles = function(tpf) {

            systemTime += tpf;


                while (requestedEffects.length) {
                    this.activateEffect(requestedEffects.pop());
                }


            for (key in renderers) {
                for (i = 0; i < renderers[key].length; i++) {
                    renderers[key][i].updateParticleRenderer(systemTime);
                }
            }

            while (endedEffects.length) {
                dead = endedEffects.pop();
                spliced = activeEffects.splice(activeEffects.indexOf(dead), 1)[0];
                spliced.resetParticleEffect();
                idleEffects.push(spliced);
            }

            for (i = 0; i < activeEffects.length; i++) {

                if (typeof(activeEffects[i]) === 'undefined') {
                    console.log("Bad Effect pool handling,", activeEffects);
                    activeEffects.splice(activeEffects.indexOf(dead), 1)[0];
                    return;
                }

            }

            for (i = 0; i < temporaryEffects.length; i++) {
                if (temporaryEffects[i].temporary.endTime < systemTime) {
                    this.recoverPassiveEffect(temporaryEffects.splice(i, 1)[0]);
                    i--
                }
            }

            for (i = 0; i < activeEffects.length; i++) {


                if (activeEffects[i].aliveParticles.length !== 0) {
                    activeEffects[i].updateEffect(tpf, systemTime);
                } else {
                    // list for removal here...
                    endedEffects.push(activeEffects[i]);
                }
            }

        };

        
        
        ParticleSpawner.prototype.getTotalParticlePool = function() {
            poolTotal = 0;
            
            for (key in renderers) {
                for (i = 0; i < renderers[key].length; i++) {
                    poolTotal += renderers[key][i].particles.length;
                }


            }

            return poolTotal;
        };

        ParticleSpawner.prototype.getTotalEffectPool = function() {
            return idleEffects.length;
        };



        ParticleSpawner.prototype.getActiveRendererCount = function() {
            return activeRenderes+'/'+totalRenderers ;
        };
        
        ParticleSpawner.prototype.getActiveEffectsCount = function() {
            return activeEffects.length;
        };



        ParticleSpawner.prototype.getActiveParticlesCount = function() {

            count = 0;
            activeRenderes = 0;
            totalRenderers = 0;


            for (i = 0; i < activeEffects.length; i++) {
                count += activeEffects[i].aliveParticles.length;
            }
            
            
            for (key in renderers) {
                for (i = 0; i < renderers[key].length; i++) {
                    activeParticles = renderers[key][i].poolSize - renderers[key][i].particles.length;
                    if (activeParticles) {
                        if (!renderers[key][i].isRendering) {
                            renderers[key][i].enableParticleRenderer();
                        }
                        count += renderers[key][i].renderHighestIndex;
                        activeRenderes++;
                    } else {
                        if (renderers[key][i].isRendering) {
                            renderers[key][i].disableParticleRenderer();
                        }
                    }

                    totalRenderers++
                }
            }
            return count;
        };

        ParticleSpawner.prototype.getEffectActivationCount = function() {
            adds = fxAdds;
            fxAdds = 0;
            return adds;
        };
        
        return ParticleSpawner;

    });