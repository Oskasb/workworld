"use strict";

define([
        '3d/effects/particles/ParticleAttribute',
        'PipelineObject'

    ],
    function(
        ParticleAttribute,
        PipelineObject

    ) {

        var RendererAttributes = function(id, idx) {
            this.id = id;
            this.index = idx;
            this.particleAttributes = {};
            this.attributes = {};
            this.attributeConfigs = {};
            this.setDataKey(this.id+'_'+this.index);
        };

        RendererAttributes.prototype.setDataKey = function(dataKey) {
            this.dataKey = dataKey;
        };

        RendererAttributes.prototype.getDataKey = function() {
            return this.dataKey;
        };

        RendererAttributes.prototype.setupBuffer = function(particleAttribute, config, poolSize, attribLoaded) {

            var dimensions = config.dimensions;

            var gotSharedBuffer = function(src, buffer) {
                particleAttribute.setArrayBuffer(buffer);
                particleAttribute.setInstancedBufferAttribute(new THREE.InstancedBufferAttribute(particleAttribute.getArrayBuffer(), dimensions, 1).setDynamic( config.dynamic ));
                this.setRendererAttribute(config.name, particleAttribute.getInstancedBufferAttribute());
                this.particleAttributes[particleAttribute.name] = particleAttribute;
                attribLoaded();

            }.bind(this);

            if (!window.outerWidth) {

                new PipelineObject("SHARED_BUFFERS", particleAttribute.getBufferKey(), gotSharedBuffer)

            } else {

                particleAttribute.buildArrayBuffer(poolSize * dimensions);
                particleAttribute.setInstancedBufferAttribute(new THREE.InstancedBufferAttribute(particleAttribute.getArrayBuffer(), dimensions, 1).setDynamic( config.dynamic ));
                this.setRendererAttribute(config.name, particleAttribute.getInstancedBufferAttribute());
                this.particleAttributes[particleAttribute.name] = particleAttribute;
                attribLoaded();
            }

        };

        RendererAttributes.prototype.attachParticleAttribute = function(config, poolSize, attribLoaded) {

            this.attributeConfigs[config.name] = config;
            var particleAttribute = new ParticleAttribute(config.name);
            particleAttribute.setBufferKey(this.dataKey+'_'+particleAttribute.name);
            this.setupBuffer(particleAttribute, config, poolSize, attribLoaded);

        };

        RendererAttributes.prototype.applyAttributesConfig = function(configData, poolSize, onReady) {


            var configs = configData.attributes;
            var requested = configs.length;

            var attributesReady = function() {
                onReady(configData);
            };

            var attribLoaded = function() {
                requested--;

                if (!requested) {
                    attributesReady();
                }
            };

            for (var i = 0; i < configs.length; i++) {
                this.attachParticleAttribute(configs[i], poolSize, attribLoaded)
            }

        };

        RendererAttributes.prototype.setRendererAttribute = function(name, bufferAttribute) {
            this.attributes[name] = bufferAttribute;
        };

        RendererAttributes.prototype.updateBufferNeedsUpdate = function(attribBuffer) {

            if (attribBuffer.array[attribBuffer.array.length -1] === 1) {
                attribBuffer.needsUpdate = true;
                attribBuffer.array[attribBuffer.array.length -1] = 0;
            }

        };

        RendererAttributes.prototype.updateNeedsUpdate = function() {

            for (var key in this.particleAttributes) {
                this.updateBufferNeedsUpdate(this.particleAttributes[key].getInstancedBufferAttribute())
            }

        };

        RendererAttributes.prototype.getRendererAttribute = function(name) {
            return this.attributes[name];
        };

        RendererAttributes.prototype.bindParticleAttributes = function(particle) {
            for (var key in this.attributeConfigs) {
                particle.bindAttribute(key, this.attributeConfigs[key].dimensions, this.getRendererAttribute(key));
            }
        };

        RendererAttributes.prototype.attachParticleBuffer = function(particleBuffer) {
            for (var key in this.attributes) {
                particleBuffer.geometry.addAttribute( key, this.attributes[key] );
            }

        };

        return RendererAttributes;

    });