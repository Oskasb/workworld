"use strict";

define(['PipelineAPI'],
    function(
        PipelineAPI
    ) {


        var ParticleAttribute = function(name) {
            this.name = name;
            this.buffer;
            this.instancedBufferAttribute;
            this.bufferKey;
        };


        ParticleAttribute.prototype.setBufferKey = function(bufferKey) {
            this.bufferKey = bufferKey;

        };

        ParticleAttribute.prototype.getBufferKey = function() {
            return this.bufferKey;

        };

        ParticleAttribute.prototype.buildArrayBuffer = function(size) {

            if (SharedArrayBuffer) {

                var sab = new SharedArrayBuffer(Float32Array.BYTES_PER_ELEMENT * (size+1));
                var buffer = new Float32Array(sab);
             //   console.log("Setup Shared Attribute Buffer", this.name);
                PipelineAPI.setCategoryKeyValue("SHARED_BUFFERS", this.bufferKey, buffer);

            } else {
                var buffer = new Float32Array(size+1);
            }

            this.setArrayBuffer(buffer);

        };

        ParticleAttribute.prototype.setArrayBuffer = function(buffer) {
            this.buffer = buffer;
        };

        ParticleAttribute.prototype.getArrayBuffer = function() {
            return this.buffer;
        };

        ParticleAttribute.prototype.setInstancedBufferAttribute = function(instancedBufferAttribute) {
            this.instancedBufferAttribute = instancedBufferAttribute;
        };

        ParticleAttribute.prototype.getInstancedBufferAttribute = function() {
            return this.instancedBufferAttribute;
        };

        return ParticleAttribute;

    });