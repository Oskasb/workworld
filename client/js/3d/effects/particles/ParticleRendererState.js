"use strict";

define(['PipelineAPI',
    'PipelineObject'],
    function(
        PipelineAPI,
        PipelineObject
    ) {

        var RENDERER_STATES = {
            HIGHEST_ACTIVE_INDEX:0,
            NEEDS_UPDATE:1,
            RENDERER_INDEX:2,
            REQUEST_RENDERER:3
        };

        var sharedBufferSize = 4;

        var ParticleRendererState = function(id, index) {
            this.id = id;
            this.index = index;
            this.rendererKey = this.id+'_'+this.index;
            this.highestActiveIndex = 0;
        };

        ParticleRendererState.prototype.getRendererKey = function() {
            return this.rendererKey;
        };

        ParticleRendererState.prototype.setupRenderStateData = function(renderStateReady) {
            this.setupBuffer(renderStateReady);
        };

        ParticleRendererState.prototype.setupBuffer = function(attribLoaded) {

            var gotSharedBuffer = function(src, buffer) {
                this.setArrayBuffer(buffer);
                attribLoaded();
            }.bind(this);

            if (!window.outerWidth) {
                new PipelineObject("SHARED_BUFFERS", this.getRendererKey(), gotSharedBuffer)
            } else {
                var buffer = this.buildArrayBuffer(sharedBufferSize);
                this.setArrayBuffer(buffer);
                attribLoaded();
            }

        };

        ParticleRendererState.prototype.buildArrayBuffer = function(size) {

            if (SharedArrayBuffer) {

                var sab = new SharedArrayBuffer(Float32Array.BYTES_PER_ELEMENT * size);
                var buffer = new Float32Array(sab);
                PipelineAPI.setCategoryKeyValue("SHARED_BUFFERS", this.getRendererKey(), buffer);

            } else {
                var buffer = new Float32Array(size);
            }

            return buffer;
        };

        ParticleRendererState.prototype.setArrayBuffer = function(buffer) {
            this.stateBuffer = buffer;
            this.setRendererIndex(this.index);
        };

        ParticleRendererState.prototype.setHighestActiveIndex = function(index) {
            this.stateBuffer[RENDERER_STATES.HIGHEST_ACTIVE_INDEX] = index;
        };

        ParticleRendererState.prototype.getHighestActiveIndex = function() {
            return this.stateBuffer[RENDERER_STATES.HIGHEST_ACTIVE_INDEX] ;
        };

        ParticleRendererState.prototype.setNeedsUpdate = function(bool) {
            this.stateBuffer[RENDERER_STATES.NEEDS_UPDATE] = bool;
        };

        ParticleRendererState.prototype.getNeedsUpdate = function() {
            return this.stateBuffer[RENDERER_STATES.NEEDS_UPDATE]
        };

        ParticleRendererState.prototype.setRendererIndex = function(index) {
            this.stateBuffer[RENDERER_STATES.RENDERER_INDEX] = index;
        };

        ParticleRendererState.prototype.getRendererIndex = function() {
            return this.stateBuffer[RENDERER_STATES.RENDERER_INDEX] ;
        };

        ParticleRendererState.prototype.setRequestRendererAtIndex = function(index) {
            this.stateBuffer[RENDERER_STATES.REQUEST_RENDERER] = index;
        };

        ParticleRendererState.prototype.getRequestRendererAtIndex = function() {
            return this.stateBuffer[RENDERER_STATES.REQUEST_RENDERER] ;
        };

        return ParticleRendererState;

    });