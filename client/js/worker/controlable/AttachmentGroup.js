"use strict";

define([
        'ConfigObject',
        'worker/controlable/ControlableModule'
    ],
    function(
        ConfigObject,
        ControlableModule
    ) {
        var i;
        var j;
        var AttachmentGroup = function(configKey, configId) {
            this.configKey = configKey;
            this.configId = configId;
            this.moduleConfigs = {};
            this.modules = [];
        };

        AttachmentGroup.prototype.configRead = function(dataKey) {
            return this.configObject.getConfigByDataKey(dataKey)
        };

        AttachmentGroup.prototype.initAttachmentGroup = function(onReady, moduleStore) {

            var configLoaded = function() {
                this.clearDebugDrawAttachments();
                this.initModules(moduleStore);
                onReady(this);
            }.bind(this);

            this.configObject = new ConfigObject('ATTACHMENT_GROUPS', this.configKey, this.configId);
            this.configObject.addCallback(configLoaded);
        };

        AttachmentGroup.prototype.initModules = function(moduleStore) {

            this.modules = [];
            this.moduleConfigs = this.configRead('modules');

            var onready = function(mod) {
                if (this.modules.indexOf(mod) === -1) {
                    this.modules.push(mod);
                    moduleStore[mod.id] = mod;
                }
            }.bind(this);

            for (i = 0; i < this.moduleConfigs.length; i++) {
                this.addModule(this.moduleConfigs[i], onready)
            }
        };

        AttachmentGroup.prototype.addModule = function(config, onready) {

            for (j = 0; j < config.group.length; j++) {
                var group = config.group[j];
                var module = new ControlableModule(config.config_key, config.config_id);
                module.initModule(onready);
                module.setOffset(group.offset[0],group.offset[1],group.offset[2]);
                module.setDirection(group.direction[0],group.direction[1],group.direction[2]);
                module.setSize(group.size[0],group.size[1],group.size[2])
            }
        };

        AttachmentGroup.prototype.renderAttachments = function(renderable) {
            for (i = 0; i < this.modules.length; i++) {
                this.modules[i].renderControlableModule(renderable);
            }
        };

        AttachmentGroup.prototype.updateAttachmentGroup = function(tpf) {
            for (i = 0; i < this.modules.length; i++) {
                this.modules[i].updateControlableModule(tpf);
            }

        };

        AttachmentGroup.prototype.debugDrawAttachments = function(renderable) {
            for (i = 0; i < this.modules.length; i++) {
                this.modules[i].debugDrawModule(renderable);
            }
        };

        AttachmentGroup.prototype.clearDebugDrawAttachments = function() {
            for (i = 0; i < this.modules.length; i++) {
                this.modules[i].clearDebugModule();
            }
        };

        return AttachmentGroup;

    });

