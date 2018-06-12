"use strict";

define([
        'ConfigObject',
        'worker/controlable/ModuleFunctions',
        'worker/controlable/ModuleState',
        'worker/controlable/ModuleEffectFunctions',
        'worker/ui/elements/DebugElement'
    ],
    function(
        ConfigObject,
        ModuleFunctions,
        ModuleState,
        ModuleEffectFunctions,
        DebugElement
    ) {

        var ControlableModule = function(configKey, configId) {
            this.configKey = configKey;
            this.configId = configId;

            this.id = configId;

            this.moduleState = new ModuleState();
            this.offset = new THREE.Vector3();
            this.direction = new THREE.Vector3();
            this.size = new THREE.Vector3();

            this.debugElements = [];

        };

        ControlableModule.prototype.configRead = function(dataKey) {
            return this.configObject.getConfigByDataKey(dataKey)
        };

        ControlableModule.prototype.initModule = function(onReady) {

            var configLoaded = function() {
                this.clearDebugModule();
                this.moduleState.applyConfig(this.configRead('state'));
                onReady(this);

                WorldAPI.addTextMessage('Load Module '+this.configKey+' '+this.configId)

            }.bind(this);

            this.configObject = new ConfigObject('MODULES', this.configKey, this.configId);
            this.configObject.addCallback(configLoaded);
        };

        ControlableModule.prototype.setOffset = function(x, y, z) {
            this.offset.set(x, y, z)
        };

        ControlableModule.prototype.setDirection = function(x, y, z) {
            this.direction.set(x, y, z)
        };

        ControlableModule.prototype.setSize = function(x, y, z) {
            this.size.set(x, y, z)
        };

        ControlableModule.prototype.renderControlableModule = function(renderable) {

            if (typeof(ModuleFunctions[this.configRead('sampleSource')]) !== 'function') {
                console.log("Bad function request: ", this.configRead('sampleSource'), renderable, this);
                return;
            }

            ModuleFunctions[this.configRead('sampleSource')](renderable, this.moduleState, this.configRead('source'));
            ModuleFunctions[this.configRead('applyState')](renderable, this.moduleState, this.configRead('target'));
            ModuleEffectFunctions[this.configRead('effectFunction')](renderable, this.moduleState, this.configRead('feedback'));
        };

        ControlableModule.prototype.updateControlableModule = function(tpf) {
            this.moduleState.updateModuleState(tpf);
        };

        ControlableModule.prototype.debugDrawModule = function(renderable) {

            if (!this.debugElements.length) {
                this.debugElements.push(new DebugElement(renderable.pos))
            }

            for (var i = 0; i < this.debugElements.length; i++) {
                this.debugElements[i].debugRenderableModule(renderable, this);
            }
        };

        ControlableModule.prototype.clearDebugModule = function() {

            while (this.debugElements.length) {
                this.debugElements.pop().disableDebugElement();
            }

        };

        return ControlableModule;

    });

