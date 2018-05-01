"use strict";

define([
        'ConfigObject',
        'ui/elements/EffectList'
    ],
    function(
        ConfigObject,
        EffectList
    ) {

        var RenderableElement = function(obj3d) {

            this.obj3d = obj3d;
            this.renderableEffects = new EffectList();
            this.scale = 1;
            this.aspect = 1;
            this.stateOn = null;
            this.colorKey = null;

        };

        RenderableElement.prototype.configRead = function(dataKey) {
            return this.configObject.getConfigByDataKey(dataKey)
        };

        RenderableElement.prototype.enableRenderableEffects = function(effectConfig) {
            if (this.renderableEffects.effectCount() === 0) {
                this.renderableEffects.enableEffectList(effectConfig, this.obj3d.position, this.obj3d.quaternion, this.scale, this.aspect);
            }
        };

        RenderableElement.prototype.updateRenderablePosition = function() {
            this.renderableEffects.setEffectListPosition(this.obj3d.position)
        };

        RenderableElement.prototype.disableRenderableEffects = function() {
            this.renderableEffects.disableEffectList();
        };


        RenderableElement.prototype.applyRenderableDataState = function(effectConfig, pointerBool, stateOn, colorKey) {
            if (pointerBool || stateOn) {
                this.enableRenderableEffects(effectConfig);

                if (colorKey && colorKey !== this.colorKey) {
                    this.renderableEffects.setEffectListColorKey(colorKey)
                }

            } else {
                this.disableRenderableEffects()
            }

            this.stateOn = stateOn;
        };

        RenderableElement.prototype.setRenderableWidthAndHeight = function(width, height) {
            this.scale = width;
            this.aspect = height/width;
            this.renderableEffects.setEffectListAspect(this.aspect);
            this.renderableEffects.setEffectListAspect(this.aspect)
        };

        return RenderableElement;

    });