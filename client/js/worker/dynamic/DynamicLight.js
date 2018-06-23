"use strict";

define([

    ],
    function(

    ) {

    var val;

        var DynamicLight = function(conf, idx, buffer) {

            this.id = conf.id;
            this.tx = conf.txcoords[0];
            this.ty = conf.txcoords[1];
            this.tw = conf.txcoords[2];
            this.th = conf.txcoords[3];
            this.index = idx;
            this.buffer = buffer;

            this.lastIntensity = 0;

            this.bsi = ENUMS.BufferSpatial.LIGHT_FIRST_INDEX + ENUMS.DynamicLight.STRIDE * this.index;

            if (this.bsi > ENUMS.BufferSpatial.BUFFER_SIZE + ENUMS.DynamicLight.STRIDE) {
                console.log("LIGHT BUFFER OVERFLOW..", this.bsi);
            }

        };

        DynamicLight.prototype.setDynamicLightSourceCanvas = function(sourceCanvas) {
            this.sourceCanvas = document.createElement('canvas');
            this.sourceCtx = this.sourceCanvas.getContext('2d');
            this.sourceCanvas.width = this.getCoordW();
            this.sourceCanvas.height = this.getCoordH();
            this.sourceCtx.drawImage(sourceCanvas, this.getCoordX(), this.getCoordY(), this.getCoordW(), this.getCoordH(), 0, 0, this.getCoordW(), this.getCoordH())
        };


        DynamicLight.prototype.setDynamicLightUpdate = function(bool) {
            this.buffer[this.bsi + ENUMS.DynamicLight.HAS_UPDATE] = bool;
            if (bool === 0) {
            }
        };

        DynamicLight.prototype.getDynamicLightUpdate = function() {
            return this.buffer[this.bsi + ENUMS.DynamicLight.HAS_UPDATE];
        };

        DynamicLight.prototype.getDynamicLightIntensity = function() {
            return this.buffer[this.bsi + ENUMS.DynamicLight.LIGHT_INTENSITY];
        };

        DynamicLight.prototype.dynamicLightUpdated = function() {
            return this.getDynamicLightUpdate();
        };

        DynamicLight.prototype.setDynamicLightIntensity = function(value) {

            val = Math.clamp(Math.round(value * 50) / 50, 0, 1);
            if (val !== this.lastIntensity) {
                this.lastIntensity = val;
                this.buffer[this.bsi + ENUMS.DynamicLight.LIGHT_INTENSITY] = this.lastIntensity;
                this.setDynamicLightUpdate(1);
            }

        };

        DynamicLight.prototype.getCoordX = function() {
            return this.tx;
        };

        DynamicLight.prototype.getCoordY = function() {
            return this.ty;
        };

        DynamicLight.prototype.getCoordW = function() {
            return this.tw;
        };

        DynamicLight.prototype.getCoordH = function() {
            return this.th;
        };

        DynamicLight.prototype.getSourceCanvas = function() {
            return this.sourceCanvas;
        };

        return DynamicLight;

    });

