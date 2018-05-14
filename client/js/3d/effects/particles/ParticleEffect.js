

"use strict";

define(['3d/effects/particles/EffectSimulators',
        '3d/effects/particles/ParticleParamParser'],
    function(EffectSimulators,
             ParticleParamParser
    ) {

        var calcVec = new THREE.Vector3();

        var i;
        var simulation;
        var c;
        var idealCount;
        var allowedCount;
        var maxDuration;


        var ParticleEffect = function() {
            this.id = null;
            this.lastTpf = 0.016;

            this.effectDuration = 0;
            this.shortestParticleLifetime = 0;
            this.effectData = {};
            this.renderer = null;
            this.aliveParticles = [];
            this.size = new THREE.Vector3();
            this.pos = new THREE.Vector3();
            this.vel = new THREE.Vector3();
            this.quat = new THREE.Quaternion();
            this.scale = 1;
            this.deadParticles = [];

            this.dynamicVelocity = null;
            this.dynamicSprite = null;
            this.dynamicScale = null;
            this.dynamicAlpha = null;

            this.temporary = {
                startTime:0,
                endTime:0
            };
        };

        ParticleEffect.prototype.setEffectTemporary = function(start, end) {
            this.temporary.startTime = start;
            this.temporary.endTime = end;
        };

        ParticleEffect.prototype.setEffectId = function(id) {
            this.id = id;
        };

        ParticleEffect.prototype.getEffectId = function() {
            return this.id;
        };

        ParticleEffect.prototype.resetParticleEffect = function() {
            this.scale = 1;
            this.dynamicVelocity = null;
            this.dynamicSprite = null;
            this.dynamicScale = null;
            this.dynamicScale3d = null;
            this.dynamicAlpha = null;
        };

        ParticleEffect.prototype.setEffectData = function(effectData) {
            this.effectData = effectData;
        };

        ParticleEffect.prototype.setEffectDuration = function(duration) {
            this.effectDuration = duration;
            this.shortestParticleLifetime = duration;
        };

        ParticleEffect.prototype.setEffectPosition = function(pos) {
            this.pos.x = pos.x;
            this.pos.y = pos.y;
            this.pos.z = pos.z;
        };

        ParticleEffect.prototype.setEffectQuaternion = function(quat) {
            this.quat.x = quat.x;
            this.quat.y = quat.y;
            this.quat.z = quat.z;
            this.quat.w = quat.w;
        };

        ParticleEffect.prototype.setEffectSize = function(size) {
            this.size.x = size.x;
            this.size.y = size.y;
            this.size.z = size.z;
        };

        ParticleEffect.prototype.setEffectVelocity = function(vel) {
            this.vel.x = vel.x;
            this.vel.y = vel.y;
            this.vel.z = vel.z;
        };

        ParticleEffect.prototype.attachSimulators = function() {
            simulation = this.effectData.simulation;

            this.simulators = [];
            for (i = 0; i < simulation.simulators.length; i++) {
                this.simulators.push(simulation.simulators[i])
            }
        };



        ParticleEffect.prototype.applyRenderer = function(renderer, systemTime) {
            this.renderer = renderer;
            this.age = 0;

            idealCount = this.effectData.effect.count;
            allowedCount = renderer.calculateAllowance(idealCount);

            maxDuration = 0;

            for (c = 0; c < allowedCount; c++) {
                var particle = renderer.requestParticle();
                this.includeParticle(particle, systemTime, c, allowedCount);
                this.aliveParticles.push(particle);
                if (particle.params.lifeTime.value > maxDuration) {
                    maxDuration = particle.params.lifeTime.value;
                    //    console.log(maxDuration)
                }
            }

            this.effectDuration = maxDuration + this.lastTpf;
            this.shortestParticleLifetime = maxDuration;

            for (c = 0; c < this.aliveParticles.length; c++) {

                if (this.aliveParticles[c].getLifeTime() < this.shortestParticleLifetime) {
                    this.shortestParticleLifetime = particle.params.lifeTime.value;
                }
            }



        };

        var spreadVector = function(vec, spreadV4) {
            vec.x += spreadV4.x * (Math.random()-0.5);
            vec.y += spreadV4.y * (Math.random()-0.5);
            vec.z += spreadV4.z * (Math.random()-0.5);
        };

        ParticleEffect.prototype.includeParticle = function(particle, systemTime, index, allowedCount) {

            var frameTpfFraction = this.lastTpf*(index/allowedCount);

            ParticleParamParser.applyEffectParams(particle, this.effectData.gpuEffect.init_params);
            particle.posOffset.set(0, 0, 0);

            spreadVector(particle.posOffset, this.size);
            spreadVector(particle.posOffset, this.effectData.gpuEffect.positionSpread.vec4);

            particle.setQuaternion(this.quat);
            particle.setPosition(this.pos);
            particle.addPosition(particle.posOffset);


            ParticleParamParser.applyEffectSprite(particle, this.dynamicSprite || this.effectData.sprite);

            particle.initToSimulation(systemTime+frameTpfFraction, this.vel);
            particle.setSize(this.scale*particle.params.position.w);


            if (this.dynamicScale) {
                particle.params.texelRowSelect.z = this.dynamicScale;
            }

            if (this.dynamicColor) {
                particle.params.texelRowSelect.x = this.dynamicColor;
            }

            if (this.dynamicAlpha) {
                particle.params.texelRowSelect.w = this.dynamicAlpha;
            }

            if (this.dynamicScale3d) {
                particle.params.scale3d.copy(this.dynamicScale3d);
            }

            this.updateParticle(particle, frameTpfFraction);


        };

        ParticleEffect.prototype.applyParticleSimulator = function(simulator, particle, tpf) {
            EffectSimulators[simulator.process](
                particle,
                tpf,
                simulator.source,
                simulator.target
            );
        };

        ParticleEffect.prototype.updateEffectColorTexelRow = function(value, colorKey) {
            this.dynamicColor = value;
            this.dynamicColorKey = colorKey;

            for (i = 0; i < this.aliveParticles.length; i++) {
                this.aliveParticles[i].params.texelRowSelect.x = value;
                this.applyParticleSimulator(EffectSimulators.simulators.texelRowSelect, this.aliveParticles[i], 0)
            }

        };

        ParticleEffect.prototype.updateEffectAlphaTexelRow = function(value) {
            this.dynamicAlpha = value;

            for (i = 0; i < this.aliveParticles.length; i++) {
                this.aliveParticles[i].params.texelRowSelect.w = value;
                this.applyParticleSimulator(EffectSimulators.simulators.texelRowSelect, this.aliveParticles[i], 0)
            }

        };

        ParticleEffect.prototype.updateEffectScale3d = function(vec3) {

            this.dynamicScale3d = vec3;

            for (i = 0; i < this.aliveParticles.length; i++) {
                this.aliveParticles[i].params.scale3d.x = vec3.x;
                this.aliveParticles[i].params.scale3d.y = vec3.y;
                this.aliveParticles[i].params.scale3d.z = vec3.z;
                this.applyParticleSimulator(EffectSimulators.simulators.scale3d, this.aliveParticles[i], 0)
            }
        };

        ParticleEffect.prototype.updateEffectScaleTexelRow = function(value) {

            this.dynamicScale = value;

            for (i = 0; i < this.aliveParticles.length; i++) {
                this.aliveParticles[i].params.texelRowSelect.z = value;
                this.applyParticleSimulator(EffectSimulators.simulators.texelRowSelect, this.aliveParticles[i], 0)
            }
        };

        ParticleEffect.prototype.updateEffectSpriteSimulator = function(sprite) {
            this.dynamicSprite = sprite;
            for (i = 0; i < this.aliveParticles.length; i++) {
                ParticleParamParser.applyEffectSprite(this.aliveParticles[i], sprite);
                this.applyParticleSimulator(EffectSimulators.simulators.tiles, this.aliveParticles[i], 0)
            }
        };

        ParticleEffect.prototype.updateEffectPositionSimulator = function(pos, tpf) {

            for (i = 0; i < this.aliveParticles.length; i++) {

                this.aliveParticles[i].setPosition(pos);
                this.aliveParticles[i].addPosition(this.aliveParticles[i].posOffset);

                this.applyParticleSimulator(EffectSimulators.simulators.position, this.aliveParticles[i], tpf)
            }
        };

        ParticleEffect.prototype.updateEffectScaleSimulator = function(scale, tpf) {

            this.scale = scale;

            for (i = 0; i < this.aliveParticles.length; i++) {
                this.aliveParticles[i].setSize(scale*this.aliveParticles[i].params.position.w);
                this.applyParticleSimulator(EffectSimulators.simulators.position, this.aliveParticles[i], tpf)
            }
        };

        ParticleEffect.prototype.setAliveParticlesSize = function(size, tpf) {

            for (i = 0; i < this.aliveParticles.length; i++) {
                this.aliveParticles[i].setSize(size);
            }

        };

        ParticleEffect.prototype.updateEffectVelocitySimulator = function(vel, tpf) {
            this.vel.copy(vel);
            for (i = 0; i < this.aliveParticles.length; i++) {

                this.aliveParticles[i].setVelocity(vel);

                this.applyParticleSimulator(EffectSimulators.simulators.velocity, this.aliveParticles[i], tpf)
            }
        };

        ParticleEffect.prototype.updateEffectQuaternionSimulator = function(quat, tpf) {

            for (i = 0; i < this.aliveParticles.length; i++) {

                this.aliveParticles[i].setQuaternion(quat);

                this.applyParticleSimulator(EffectSimulators.simulators.orientation, this.aliveParticles[i], tpf)
            }
        };

        ParticleEffect.prototype.updateParticle = function(particle, tpf) {
            for (i = 0; i < this.simulators.length; i++) {
                this.applyParticleSimulator(EffectSimulators.simulators[this.simulators[i]], particle, tpf)
            }
        };

        ParticleEffect.prototype.updateEffectAge = function(tpf) {
            this.age += tpf;
            this.lastTpf = tpf;
        };

        ParticleEffect.prototype.getDeadParticle = function() {
            return this.aliveParticles.splice(this.deadParticles.pop(), 1)[0]
        };

        ParticleEffect.prototype.returnDeadParticles = function() {
            while (this.deadParticles.length) {
                this.renderer.returnParticle(this.getDeadParticle());
            }
        };

        ParticleEffect.prototype.updateEffect = function(tpf, systemTime) {

            this.updateEffectAge(tpf);

            if (this.age > this.effectDuration) {
                for (i = 0; i < this.aliveParticles.length; i++) {
                    EffectSimulators.dead(this.aliveParticles[i], tpf);
                    this.deadParticles.push(i);
                }
            } else {

                if (this.age > this.shortestParticleLifetime) {

                    for (i = 0; i < this.aliveParticles.length; i++) {

                        //    this.updateGpuParticle(this.aliveParticles[i], tpf)
                        if (this.age > this.aliveParticles[i].getLifeTime()) {
                            //     console.log("Vegetation uses this...")
                            EffectSimulators.dead(this.aliveParticles[i], tpf);

                            this.applyParticleSimulator(EffectSimulators.simulators.position, this.aliveParticles[i], tpf);
                        //    this.applyParticleSimulator(EffectSimulators.simulators.duration, this.aliveParticles[i], tpf);
                        //    this.updateParticle(this.aliveParticles[i], this.aliveParticles[i].getLifeTime());
                            this.deadParticles.push(i)

                        }
                    }
                }
            }

            this.returnDeadParticles()
        };

        return ParticleEffect;
    });