"use strict";

define([
        'ConfigObject',
        'ui/elements/EffectList'
    ],
    function(
        ConfigObject,
        EffectList
    ) {

        var cursor_x;
        var cursor_y;

        var tempVec1 = new THREE.Vector3();

        var GuiSurfaceElement = function() {

            this.obj3d = new THREE.Object3D();



            this.topLeft = new EffectList();
            this.topRight = new EffectList();
            this.bottomLeft = new EffectList();
            this.bottomRight = new EffectList();

        };

        GuiSurfaceElement.prototype.initSurfaceElement = function(onReadyCB) {

            var configLoaded = function() {
                onReadyCB(this);
            }.bind(this);

            this.configObject = new ConfigObject('GUI_ELEMENTS', 'GUI_SURFACE_ELEMENT', 'config');
            this.configObject.addCallback(configLoaded);

        };


        GuiSurfaceElement.prototype.configRead = function(dataKey) {
            return this.configObject.getConfigByDataKey(dataKey)
        };

        GuiSurfaceElement.prototype.highlightCorner = function(effectList, posVec, dataKey) {
            if (effectList.effectCount() === 0) {
                effectList.enableEffectList(this.configRead(dataKey), posVec);
            }
            effectList.setEffectListPosition(posVec)
        };


        GuiSurfaceElement.prototype.testPointerHover = function(surfaceData) {

            cursor_x = WorldAPI.sampleInputBuffer(ENUMS.InputState.MOUSE_X);
            cursor_y = WorldAPI.sampleInputBuffer(ENUMS.InputState.MOUSE_Y);

            if (cursor_x < surfaceData.left) {
                tempVec1.set(surfaceData.left, surfaceData.top, -1);
                this.highlightCorner(this.topLeft, tempVec1, surfaceData.corner_fx)
            } else {
                this.topLeft.disableEffectList();
            }

            if (cursor_x > surfaceData.right) {
                tempVec1.set(surfaceData.right, surfaceData.top, -1);
                this.highlightCorner(this.topRight, tempVec1, surfaceData.corner_fx)
            } else {
                this.topRight.disableEffectList();
            }

            if (cursor_y < surfaceData.top) {
                tempVec1.set(surfaceData.left, surfaceData.bottom, -1);
                this.highlightCorner(this.bottomLeft, tempVec1, surfaceData.corner_fx)
            } else {
                this.bottomLeft.disableEffectList();
            }

            if (cursor_y > surfaceData.bottom) {
                tempVec1.set(surfaceData.right, surfaceData.bottom, -1);
                this.highlightCorner(this.bottomRight, tempVec1, surfaceData.corner_fx)
            } else {
                this.bottomRight.disableEffectList();
            }

        };

        GuiSurfaceElement.prototype.updateSurfaceElement = function(surfaceData) {

            this.testPointerHover(surfaceData)

        };

        return GuiSurfaceElement;

    });