"use strict";

define([
        'ConfigObject',
        'ui/elements/EffectList'
    ],
    function(
        ConfigObject,
        EffectList
    ) {


        var GuiArrowElement = function(onReadyCB, dataKey) {

            this.obj3d = new THREE.Object3D();
            this.arrowEffects = new EffectList();

            this.dataKey = dataKey;

            var configLoaded = function() {
                this.configObject.removeCallback(configLoaded);
                onReadyCB(this);
            }.bind(this);

            this.configObject = new ConfigObject('GUI_ELEMENTS', 'GUI_ARROW_ELEMENT', 'config');
            this.configObject.addCallback(configLoaded);
        };

        GuiArrowElement.prototype.configRead = function(dataKey) {
            return this.configObject.getConfigByDataKey(dataKey)
        };

        GuiArrowElement.prototype.drawArrowElement = function(fromVec, toVec) {

            this.obj3d.position.set(0, 0, 0);

            this.obj3d.quaternion.x = 0;
            this.obj3d.quaternion.y = 0;
            this.obj3d.quaternion.z = 0;
            this.obj3d.quaternion.w = 1;

            this.obj3d.rotateZ(-MATH.vectorXYToAngleAxisZ(toVec) -Math.PI*0.25);

            if (this.arrowEffects.effectCount() === 0) {
                this.arrowEffects.enableEffectList(this.configRead(this.dataKey), fromVec, this.obj3d.quaternion);
            }

            this.arrowEffects.setEffectListPosition(fromVec);
            this.arrowEffects.setEffectListQuaternion(this.obj3d.quaternion)

        };

        GuiArrowElement.prototype.disableElement = function() {
            this.arrowEffects.disableEffectList()
        };

        return GuiArrowElement;

    });