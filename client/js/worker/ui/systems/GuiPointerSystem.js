"use strict";

define([
        'ConfigObject',
        'EffectsAPI'
    ],
    function(
        ConfigObject,
        EffectsAPI
    ) {

        var i;

        var GuiPointerSystem = function() {
            this.configObject = new ConfigObject('GUI_SYSTEMS', 'GUI_POINTER_SYSTEM', 'config');
            this.cursorPosition = new THREE.Vector3();
            this.pressInitPosition = new THREE.Vector3();
            this.hoverPointEffects = [];
            this.curorEffects = [];
            this.dragStartEffects = [];
        };

        GuiPointerSystem.prototype.configRead = function(dataKey) {
            return this.configObject.getConfigByDataKey(dataKey)
        };

        GuiPointerSystem.prototype.initGuiSystem = function(systemReady) {

            var configLoaded = function(config) {

                console.log("Config: GUI_POINTER_SYSTEM", config);

                systemReady(this);

            }.bind(this);

            this.configObject.addCallback(configLoaded);

        };

        GuiPointerSystem.prototype.setEffectListPosition = function(effectArray, posVec) {
            for (i = 0; i < effectArray.length; i++) {
                effectArray[i].updateEffectPositionSimulator(posVec);
            }
        };

        GuiPointerSystem.prototype.enableEffectList = function(effectIds, effectArray, posVec) {
            for (i = 0; i < effectIds.length; i++) {
                effectArray.push(EffectsAPI.requestPassiveEffect(effectIds[i], posVec))
            }
        };

        GuiPointerSystem.prototype.disableEffectList = function(effectArray) {
            while (effectArray.length) {
                EffectsAPI.returnPassiveEffect(effectArray.pop())
            }
        };

        GuiPointerSystem.prototype.trackInputPosition = function(effectArray, dataKey, posVec) {

            if (effectArray.length === 0) {
                this.enableEffectList(this.configRead(dataKey), effectArray, posVec);
            }

            this.setEffectListPosition(effectArray, posVec)
        };

        GuiPointerSystem.prototype.updatePointerState = function() {

            this.cursorPosition.x = WorldAPI.sampleInputBuffer(ENUMS.InputState.MOUSE_X);
            this.cursorPosition.y = WorldAPI.sampleInputBuffer(ENUMS.InputState.MOUSE_Y);
            this.cursorPosition.z = -1;
            this.pressInitPosition.x = WorldAPI.sampleInputBuffer(ENUMS.InputState.START_DRAG_X);
            this.pressInitPosition.y = WorldAPI.sampleInputBuffer(ENUMS.InputState.START_DRAG_Y);
            this.pressInitPosition.z = -1;


            if (WorldAPI.sampleInputBuffer(ENUMS.InputState.ACTION_0)) {
            //    this.disableEffectList(this.hoverPointEffects);
                this.trackInputPosition(this.curorEffects, 'cursor_effects', this.cursorPosition);
                this.trackInputPosition(this.dragStartEffects, 'drag_start_effects', this.pressInitPosition);

            } else {
                this.disableEffectList(this.curorEffects);
                this.disableEffectList(this.dragStartEffects);
            }

            this.trackInputPosition(this.hoverPointEffects, 'hover_point_effects', this.cursorPosition);

        };


        GuiPointerSystem.prototype.updateGuiSystem = function() {
            this.updatePointerState();
        };

        return GuiPointerSystem;

    });