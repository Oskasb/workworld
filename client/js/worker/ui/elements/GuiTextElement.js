"use strict";

define([
        'GuiAPI',
        'ConfigObject',
        'ui/elements/EffectList'
    ],
    function(
        GuiAPI,
        ConfigObject,
        EffectList
    ) {

        var i;
        var tempVec1 = new THREE.Vector3();

        var GuiTextElement = function() {

            this.textString = '';

            this.originX = 0;
            this.originY = 0;

            this.obj3d = new THREE.Object3D();

            this.effectList = new EffectList();

            this.effectSize = 0.1;
            this.textSpacingX = 0.05;

        };

        GuiTextElement.prototype.initTextElement = function(onReadyCB) {

            var configLoaded = function() {
                onReadyCB();
            }.bind(this);

            this.configObject = new ConfigObject('GUI_ELEMENTS', 'GUI_TEXT_ELEMENT', 'config');
            this.configObject.addCallback(configLoaded);
        };

        GuiTextElement.prototype.configRead = function(dataKey) {
            return this.configObject.getConfigByDataKey(dataKey)
        };

        GuiTextElement.prototype.visualizeText = function(textConfig, surfaceLayout, passive, active) {
            this.effectSize = textConfig.font_size / 1000;
            this.textSpacingX = this.effectSize * 1;

            surfaceLayout.getLayoutCenter(tempVec1);

            if (this.effectList.effectCount() !== this.textString.length) {

                this.obj3d.quaternion.x = 0;
                this.obj3d.quaternion.y = 0;
                this.obj3d.quaternion.z = 0;
                this.obj3d.quaternion.w = 1;

                if (textConfig.italic) {
                    this.obj3d.quaternion.x = -0.23;
                }

                this.originX = tempVec1.x;
                this.originY = tempVec1.y;

                this.elementWidth = this.textSpacingX * (this.textString.length+1);

                tempVec1.x -= this.elementWidth/2;

                for (i = 0; i < this.textString.length; i++) {
                    tempVec1.x += this.textSpacingX;
                    this.effectList.addEffectToList(this.configRead(textConfig.font_effect), tempVec1, this.obj3d.quaternion, this.effectSize);
                    this.effectList.setEffectIndexSpriteKey(i, this.textString[i]);
                }
            }

            if (this.originX !== tempVec1.x || this.originY !== tempVec1.y) {

                for (i = 0; i < this.textString.length; i++) {
                    tempVec1.x += this.textSpacingX;
                    this.effectList.setEffectIndexPosition(i, tempVec1);
                }
            }


        };

        GuiTextElement.prototype.clearFontEffecs = function() {
            this.effectList.disableEffectList();
        };

        GuiTextElement.prototype.setElementText = function(string) {
            if (this.textString !== string) {
                this.clearFontEffecs();
            }

            this.textString = string;
        };

        return GuiTextElement;

    });