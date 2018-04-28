"use strict";

define([
        'ConfigObject',
        'ui/elements/GuiCornerElement',
        'ui/elements/EffectList'
    ],
    function(
        ConfigObject,
        GuiCornerElement,
        EffectList
    ) {

        var cursor_x;
        var cursor_y;

        var tempVec1 = new THREE.Vector3();

        var GuiSurfaceElement = function() {

            this.obj3d = new THREE.Object3D();

            this.topLeft = new GuiCornerElement();
            this.topRight = new GuiCornerElement();
            this.bottomLeft = new GuiCornerElement();
            this.bottomRight = new GuiCornerElement();

        };

        GuiSurfaceElement.prototype.initSurfaceElement = function(onReadyCB) {

            var cornersReady = function() {
                onReadyCB(this);
            }.bind(this);


            var configLoaded = function() {
                this.initSurfaceCorners(cornersReady);
            }.bind(this);

            this.configObject = new ConfigObject('GUI_ELEMENTS', 'GUI_SURFACE_ELEMENT', 'config');
            this.configObject.addCallback(configLoaded);

        };

        GuiSurfaceElement.prototype.initSurfaceCorners = function(cornersReady) {
            

            var br = function(crnr) {
                crnr.getCornerQuaternion().set(0, 0, -1, 0);
                cornersReady();
            }.bind(this);

            var bl = function(crnr) {
                crnr.getCornerQuaternion().set(1, 0, 0, 0);
                this.bottomRight.initCornerElement(br)
            }.bind(this);

            var tr = function(crnr) {
                crnr.getCornerQuaternion().set(0, 1, 0, 0);
                this.bottomLeft.initCornerElement(bl)
            }.bind(this);

            var tl = function(crnr) {
                crnr.getCornerQuaternion().set(0, 0, 0, 1);
                this.topRight.initCornerElement(tr)
            }.bind(this);

            this.topLeft.initCornerElement(tl)

        };

        GuiSurfaceElement.prototype.configRead = function(dataKey) {
            return this.configObject.getConfigByDataKey(dataKey)
        };

        GuiSurfaceElement.prototype.applySurfaceData = function(surfaceData) {
            this.topLeft.setCornerXY(surfaceData.left, surfaceData.top);
            this.topRight.setCornerXY(surfaceData.right, surfaceData.top);
            this.bottomLeft.setCornerXY(surfaceData.left, surfaceData.bottom);
            this.bottomRight.setCornerXY(surfaceData.right, surfaceData.bottom);
        };

        GuiSurfaceElement.prototype.applySurfacePassive = function(bool, dataKey) {
            this.topLeft.setCornerPassive(bool, dataKey);
            this.topRight.setCornerPassive(bool, dataKey);
            this.bottomLeft.setCornerPassive(bool, dataKey);
            this.bottomRight.setCornerPassive(bool, dataKey);
        };

        GuiSurfaceElement.prototype.applySurfaceActive = function(bool, dataKey) {
            this.topLeft.setCornerActive(bool, dataKey);
            this.topRight.setCornerActive(bool, dataKey);
            this.bottomLeft.setCornerActive(bool, dataKey);
            this.bottomRight.setCornerActive(bool, dataKey);
        };

        GuiSurfaceElement.prototype.testPointerHover = function(surfaceData) {

            cursor_x = WorldAPI.sampleInputBuffer(ENUMS.InputState.MOUSE_X);
            cursor_y = WorldAPI.sampleInputBuffer(ENUMS.InputState.MOUSE_Y);

            var surfaceAvtive = false;
            var surfacePassive = false;

            if (cursor_x > surfaceData.left && cursor_x < surfaceData.right && cursor_y > surfaceData.bottom && cursor_y < surfaceData.top) {
                surfacePassive = true;
            }

            if (WorldAPI.sampleInputBuffer(ENUMS.InputState.ACTION_0)) {

                cursor_x = WorldAPI.sampleInputBuffer(ENUMS.InputState.START_DRAG_X);
                cursor_y = WorldAPI.sampleInputBuffer(ENUMS.InputState.START_DRAG_Y);

                if (cursor_x > surfaceData.left && cursor_x < surfaceData.right && cursor_y > surfaceData.bottom && cursor_y < surfaceData.top) {
                    surfaceAvtive = true;
                }

            }

            this.applySurfacePassive(surfacePassive, surfaceData.corner_passive_fx);
            this.applySurfaceActive(surfaceAvtive, surfaceData.corner_active_fx);

        };

        GuiSurfaceElement.prototype.updateSurfaceElement = function(surfaceData) {

            this.applySurfaceData(surfaceData);

            this.testPointerHover(surfaceData)

        };

        return GuiSurfaceElement;

    });