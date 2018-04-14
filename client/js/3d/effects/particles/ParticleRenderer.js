"use strict";

define([
        'ThreeAPI',
        '3d/effects/particles/ParticleMaterial',
        '3d/effects/particles/ParticleMesh',
        '3d/effects/particles/ParticleBuffer',

        '3d/effects/particles/Particle',
        'PipelineObject'

    ],
    function(
        ThreeAPI,
        ParticleMaterial,
        ParticleMesh,
        ParticleBuffer,
        Particle,
        PipelineObject
    ) {

        var config;
        var dimensions;
        var particle;
        var req;
        var i;
        var color;
        var key;

        var ParticleRenderer = function(rendererConfig, rendererReady) {
            this.id = rendererConfig.id;
            this.setupRendererMaterial(rendererConfig, rendererReady);
        };

        ParticleRenderer.prototype.setupRendererMaterial = function(rendererConfig, rendererReady) {

            this.isRendering = false;

            this.config = rendererConfig;
            this.poolSize = rendererConfig.particle_pool;
            this.particleGeometry = rendererConfig.particle_geometry;

            this.isScreenspace = rendererConfig.is_screenspace || false;
            this.renderOrder = rendererConfig.render_order || null;

            this.biggestRequest = 5;

            this.needsUpdate = true;

            this.material = {uniforms:{}};
            this.particles = [];
            this.drawingParticles = [];
            this.attributes = {};
            this.attributeConfigs = {};

            this.systemTime = 0;

            this.renderHighestIndex = 0;

            var particleMaterialData = function(src, data) {
    //            console.log("particleMaterialData", src, data);
                this.applyRendererMaterialData(data, rendererReady)
            }.bind(this);

            this.materialPipe = new PipelineObject("PARTICLE_MATERIALS", "THREE", particleMaterialData)
        };

        ParticleRenderer.prototype.setMaterial = function(material, rendererReady) {
            this.material = material;
            this.setupRendererBuffers(rendererReady);
        };

        ParticleRenderer.prototype.applyRendererMaterialData = function(data, rendererReady) {

            var materialReady = function(material) {
    //            console.log("MaterialReady", material);
               this.setMaterial(material, rendererReady);
            }.bind(this);

            for (i = 0; i < data.length; i++) {
                if (data[i].id == this.config.material_id) {
    //                console.log("buildParticleMaterial", data[i].id );
                    this.setupBufferAttributes(data[i].attributes);
                    this.buildParticleMaterial(data[i], materialReady);
                }
            }
        };

        ParticleRenderer.prototype.setupRendererBuffers = function(rendererReady) {
            this.buildMeshBuffer();
            this.attachMaterial();
            this.createParticles(rendererReady);
        };

        ParticleRenderer.prototype.createParticles = function(rendererReady) {
            if (this.particles.length) {
                console.error("Replace added particles");
                this.particles = [];
            }

            for (i = 0; i < this.poolSize; i++) {
                var newParticle = new Particle(i);
                for (key in this.attributeConfigs) {
                    newParticle.bindAttribute(key, this.attributeConfigs[key].dimensions, this.attributes[key]);
                }
                this.particles.push(newParticle);
            }
            rendererReady(this);
        };

        ParticleRenderer.prototype.buildParticleMaterial = function(material_config, materialReady) {
            new ParticleMaterial(this.config.material_options, material_config, materialReady);
        };

        ParticleRenderer.prototype.buildMeshBuffer = function() {
            if (this.particleBuffer) {
                this.particleBuffer.dispose();
            }

            var geomCB = function(geom) {
                this.particleBuffer = new ParticleBuffer(geom.verts, geom.uvs, geom.indices, geom.normals);


                for (key in this.attributes) {
                    this.particleBuffer.geometry.addAttribute( key, this.attributes[key] );
                }

                for (key in this.particleBuffer.geometry.attributes) {
                    this.attributes[key] = this.particleBuffer.geometry.attributes[key];
                }


                this.particleBuffer.addToScene(this.isScreenspace);
                if (this.renderOrder) {
                    this.particleBuffer.mesh.renderOrder = this.renderOrder;
                }
            }.bind(this);


            if (typeof(this.particleGeometry) === 'string') {
                geomCB(ParticleMesh[this.particleGeometry]())
            } else  {
                ParticleMesh.modelGeometry(this.particleGeometry, geomCB)
            }


        //    this.particleBuffers.push(this.particleBuffer);
        };

        ParticleRenderer.prototype.attachMaterial = function() {
            this.particleBuffer.mesh.material = this.material;
        };

        ParticleRenderer.prototype.setupBufferAttributes = function(attributes_config) {
            for (var i = 0; i < attributes_config.length; i++) {
                config = attributes_config[i];
                this.attributeConfigs[config.name] = config;
                dimensions = config.dimensions;
                this.attributes[config.name] = new THREE.InstancedBufferAttribute(new Float32Array(this.poolSize * dimensions), dimensions, 1).setDynamic( config.dynamic );
            }
        };




        ParticleRenderer.prototype.calculateAllowance = function(requestSize) {

            if (this.biggestRequest < requestSize) {
                this.biggestRequest = requestSize;
            }

            if (this.particles.length - requestSize > this.biggestRequest) {
                return requestSize;
            } else {
                req = Math.round( (this.poolSize / this.particles.length) * requestSize) || 1;
                if (this.particles.length > req) {
                    return  req;
                } else if (this.particles.length) {

                    return 1;
                }
                console.log("zero particles.. ", requestSize);
                return null;
            }
        };

        var reqParticle;
        var retParticle;

        ParticleRenderer.prototype.requestParticle = function() {
            if (!this.particles.length) {
                console.log("Particles ran out...", this)
                return;
            }

            reqParticle = this.particles.shift();

            if (reqParticle.particleIndex > this.renderHighestIndex) {
                this.renderHighestIndex = reqParticle.particleIndex;
                this.particleBuffer.setInstancedCount( this.renderHighestIndex +1)
            }

            reqParticle.dead = false;
            this.drawingParticles.push(reqParticle);
            return reqParticle;
        };


        ParticleRenderer.prototype.computerHighestRenderingIndex = function() {
            this.renderHighestIndex = 0;

            if (!this.particles.length) {
                return this.poolSize;
            }

            for (i = 0; i < this.drawingParticles.length; i++) {
                if(this.drawingParticles[i].particleIndex > this.renderHighestIndex) {
                    this.renderHighestIndex = this.drawingParticles[i].particleIndex
                }
            }
            return this.renderHighestIndex;
        };

        ParticleRenderer.prototype.discountDrawingParticle = function(particle) {
            this.drawingParticles.splice(this.drawingParticles.indexOf(particle), 1);
        };

        ParticleRenderer.prototype.returnParticle = function(prtcl) {

            this.discountDrawingParticle(prtcl)
            this.needsUpdate = true;
            this.particles.unshift(prtcl);
        };


        ParticleRenderer.prototype.enableParticleRenderer = function() {
            this.isRendering = true;
            this.particleBuffer.addToScene(this.isScreenspace);
        };


        ParticleRenderer.prototype.disableParticleRenderer = function() {
            this.isRendering = false;
            this.particleBuffer.removeFromScene();
        };

        ParticleRenderer.prototype.applyUniformEnvironmentColor = function(uniform, worldProperty) {
            color = ThreeAPI.readEnvironmentUniform(worldProperty, 'color');
            uniform.value.r = color.r;
            uniform.value.g = color.g;
            uniform.value.b = color.b;
        };


        ParticleRenderer.prototype.updateParticleRenderer = function(systemTime) {

            this.systemTime = systemTime;

            if (this.needsUpdate) {
                this.renderHighestIndex = this.computerHighestRenderingIndex();
                this.particleBuffer.setInstancedCount( this.renderHighestIndex + 1);
                this.needsUpdate = false;
            };


            if (this.material.uniforms.systemTime) {
                this.material.uniforms.systemTime.value = this.systemTime;
            } else {
                console.log("no uniform yet...")
            }

            if (this.material.uniforms.fogColor) {
                this.applyUniformEnvironmentColor(this.material.uniforms.fogColor, 'fog')
            }

            if (this.material.uniforms.fogDensity) {
                this.material.uniforms.fogDensity.value = ThreeAPI.readEnvironmentUniform('fog', 'density');
            }

            if (this.material.uniforms.ambientLightColor) {
                this.applyUniformEnvironmentColor(this.material.uniforms.ambientLightColor, 'ambient');
            }

            if (this.material.uniforms.sunLightColor) {
                this.applyUniformEnvironmentColor(this.material.uniforms.sunLightColor, 'sun');
            }

        };

        ParticleRenderer.prototype.dispose = function() {
            this.particles = [];
            this.particleBuffer.dispose();
            this.materialPipe.removePipelineObject();
            delete this;
        };

        return ParticleRenderer;

    });