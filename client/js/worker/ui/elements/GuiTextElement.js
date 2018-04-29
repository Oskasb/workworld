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

            this.fontEffect = null;

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


        GuiTextElement.prototype.addLetterAtIndex = function(letter, index) {

            tempVec1.x = this.originX + this.textSpacingX*index;
            this.effectList.addEffectToList(this.fontEffect, tempVec1, this.obj3d.quaternion, this.effectSize);
            this.setLetterAtIndex(letter, index);

        };

        GuiTextElement.prototype.setLetterAtIndex = function(letter, index) {

            this.effectList.setEffectIndexSpriteKey(index, letter);

        };

        GuiTextElement.prototype.updateTextOrigin = function() {



        };

        GuiTextElement.prototype.visualizeText = function(textConfig, surfaceLayout, passive, active) {

            this.fontEffect = this.configRead(textConfig.font_effect);
            this.effectSize = textConfig.font_size / 1000;
            this.textSpacingX = this.effectSize * 1;

            surfaceLayout.getLayoutCenter(this.obj3d.position);


            this.elementWidth = this.textSpacingX * (this.textString.length+1);
            this.obj3d.position.x -= this.elementWidth/2;

            if (this.effectList.effectCount() !== this.textString.length) {

                this.obj3d.quaternion.x = 0;
                this.obj3d.quaternion.y = 0;
                this.obj3d.quaternion.z = 0;
                this.obj3d.quaternion.w = 1;

                if (textConfig.italic) {
                    this.obj3d.quaternion.x = -0.23;
                }

                this.originX = this.obj3d.position.x;
                this.originY = this.obj3d.position.y;

                tempVec1.copy(this.obj3d.position);

                for (i = 0; i < this.textString.length; i++) {
                    this.addLetterAtIndex(this.textString[i], i);
                }
            }


            if (this.originX !== this.obj3d.position.x || this.originY !== this.obj3d.position.y) {
                tempVec1.copy(this.obj3d.position);
                for (i = 0; i < this.textString.length; i++) {
                    tempVec1.x += this.textSpacingX;
                    this.effectList.setEffectIndexPosition(i, tempVec1);
                }
            }
        };


        GuiTextElement.prototype.updateFontEffecs = function(string) {
            if (string.length && this.effectList.effectCount()) {

                if ( this.effectList.effectCount() > string.length) {
                    this.effectList.removeEffectListElementCount(this.effectList.effectCount() - string.length)
                };

                for (var i = 0; i < string.length; i++) {
                    if (string[i] !== this.textString[i]) {
                        if (this.textString[i]) {
                            this.setLetterAtIndex(string[i] ,i)
                        } else {
                            this.addLetterAtIndex(string[i], i)
                        }
                    }
                }

            } else {
                this.effectList.disableEffectList();
            }

        };

        GuiTextElement.prototype.setElementText = function(string) {
            if (this.textString !== string) {

                //    this.effectList.disableEffectList();

              this.updateFontEffecs(string);
            }

            this.textString = string;
        };

        return GuiTextElement;

    });