"use strict";

define([
        'GuiAPI',
        'ConfigObject',
        'ui/elements/GuiPlateElement',
        'ui/elements/GuiCornerElement',
        'ui/functions/GuiSurfaceLayout'
    ],
    function(
        GuiAPI,
        ConfigObject,
        GuiPlateElement,
        GuiCornerElement,
        GuiSurfaceLayout
    ) {


        var surfaceAvtive = false;
        var surfacePassive = false;

        var tempVec1 = new THREE.Vector3();

        var GuiSurfaceElement = function() {

            this.obj3d = new THREE.Object3D();

            this.guiSurfaceLayout = new GuiSurfaceLayout();

            this.backplate = new GuiPlateElement();

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

            var bp = function() {
                this.topLeft.initCornerElement(tl)
            }.bind(this);

            this.backplate.initPlateElement(bp)

        };

        GuiSurfaceElement.prototype.configRead = function(dataKey) {
            return this.configObject.getConfigByDataKey(dataKey)
        };

        GuiSurfaceElement.prototype.applySurfaceData = function(surfaceData) {
            this.guiSurfaceLayout.parseLaoutConfig(surfaceData.layout);
            this.guiSurfaceLayout.applyLayoutToCorners(this.topLeft, this.topRight, this.bottomLeft, this.bottomRight);
            this.guiSurfaceLayout.getLayoutCenter(this.backplate.getPlatePosition());
            this.backplate.setPlateWidthAndHeight(this.guiSurfaceLayout.getLayoutWidth(), this.guiSurfaceLayout.getLayoutHeight())
        };

        GuiSurfaceElement.prototype.applyCornersPassive = function(bool, dataKey) {
            this.topLeft.setCornerPassive(bool, dataKey);
            this.topRight.setCornerPassive(bool, dataKey);
            this.bottomLeft.setCornerPassive(bool, dataKey);
            this.bottomRight.setCornerPassive(bool, dataKey);
        };

        GuiSurfaceElement.prototype.applyCornersActive = function(bool, dataKey) {
            this.topLeft.setCornerActive(bool, dataKey);
            this.topRight.setCornerActive(bool, dataKey);
            this.bottomLeft.setCornerActive(bool, dataKey);
            this.bottomRight.setCornerActive(bool, dataKey);
        };

        GuiSurfaceElement.prototype.applyBackplatePassive = function(bool, dataKey) {
            this.backplate.setPlatePassive(bool, dataKey);
        };

        GuiSurfaceElement.prototype.applyBackplateActive = function(bool, dataKey) {
            this.backplate.setPlateActive(bool, dataKey);
        };

        GuiSurfaceElement.prototype.updateSurfaceVisuals = function(surfaceData) {

            if (surfaceData.corners) {
                this.applyCornersPassive(surfacePassive, surfaceData.corners.corner_passive_fx);
                this.applyCornersActive(surfaceAvtive, surfaceData.corners.corner_active_fx);
            }

            if (surfaceData.backplate) {
                this.applyBackplatePassive(surfacePassive, surfaceData.backplate.plate_passive_fx);
                this.applyBackplateActive(surfaceAvtive, surfaceData.backplate.plate_active_fx);
            }


        };

        GuiSurfaceElement.prototype.testPointerHover = function(surfaceData) {

            surfacePassive = this.guiSurfaceLayout.isInsideXY(GuiAPI.getMouseX(), GuiAPI.getMouseY());

            surfaceAvtive = false;

            if (WorldAPI.sampleInputBuffer(ENUMS.InputState.ACTION_0)) {
                surfaceAvtive = this.guiSurfaceLayout.isInsideXY(GuiAPI.getStartDragX(), GuiAPI.getStartDragY());
            }

        };

        GuiSurfaceElement.prototype.updateSurfaceElement = function(surfaceData) {

            this.applySurfaceData(surfaceData);
            this.testPointerHover(surfaceData);
            this.updateSurfaceVisuals(surfaceData)

        };

        return GuiSurfaceElement;

    });