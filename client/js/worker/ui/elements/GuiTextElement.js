"use strict";

define([
        'GuiAPI',
        'ConfigObject',
        'ui/elements/GuiCornerElement',
        'ui/functions/GuiSurfaceLayout'
    ],
    function(
        GuiAPI,
        ConfigObject,
        GuiCornerElement,
        GuiSurfaceLayout
    ) {


        var surfaceAvtive = false;
        var surfacePassive = false;

        var tempVec1 = new THREE.Vector3();

        var GuiTextElement = function() {

            this.obj3d = new THREE.Object3D();
            this.guiSurfaceLayout = new GuiSurfaceLayout();

            this.topLeft = new GuiCornerElement();
            this.topRight = new GuiCornerElement();
            this.bottomLeft = new GuiCornerElement();
            this.bottomRight = new GuiCornerElement();

        };

        GuiTextElement.prototype.initTextElement = function(onReadyCB) {

            var cornersReady = function() {
                onReadyCB(this);
            }.bind(this);


            var configLoaded = function() {
                this.initSurfaceCorners(cornersReady);
            }.bind(this);

            this.configObject = new ConfigObject('GUI_ELEMENTS', 'GUI_SURFACE_ELEMENT', 'config');
            this.configObject.addCallback(configLoaded);

        };

        GuiTextElement.prototype.configRead = function(dataKey) {
            return this.configObject.getConfigByDataKey(dataKey)
        };


        return GuiTextElement;

    });