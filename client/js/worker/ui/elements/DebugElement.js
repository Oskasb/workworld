"use strict";

define([
        'ui/elements/EffectList'
    ],
    function(
        EffectList
    ) {

        var colorKey;

        var effectIds = ["gui_corner_selection_effect"];

        var DebugElement = function(posVec) {
            this.screenPos = new THREE.Vector3();
            this.effectList = new EffectList();
            WorldAPI.positionToScreenCoords(posVec, this.screenPos);
            this.effectList.enableEffectList(effectIds, this.screenPos);
        };


        DebugElement.prototype.setElementPosition = function(posVec) {
            WorldAPI.positionToScreenCoords(posVec, this.screenPos);
            this.effectList.setEffectListPosition(this.screenPos);
        };

        DebugElement.prototype.debugRenderableModule = function(renderable, module) {
            module.calculateWorldPosition(renderable.pos, renderable.quat, this.screenPos);
            this.setElementPosition(this.screenPos);

        };

        DebugElement.prototype.disableDebugElement = function() {
            this.effectList.disableEffectList();
        };


        return DebugElement;

    });