"use strict";

define([
    'ConfigObject'
    ],
    function(ConfigObject) {

        var ControlsList = function(configKey, configId) {
            this.configKey = configKey;
            this.configId = configId;
            this.guiWidgetStore = [];
        };

        ControlsList.prototype.configRead = function(dataKey) {
            return this.configObject.getConfigByDataKey(dataKey)
        };

        ControlsList.prototype.initControlsList = function(onReady) {

            var configLoaded = function() {
                this.clearControlsList();
                onReady(this);
            }.bind(this);

            this.configObject = new ConfigObject('CONTROLS', this.configKey, this.configId);
            this.configObject.addCallback(configLoaded);
        };

        ControlsList.prototype.disableControlsList = function() {
            this.configObject.callbacks = [];
            this.clearControlsList();
        };

        ControlsList.prototype.clearControlsList = function() {
            WorldAPI.removeGuiWidgets(this.guiWidgetStore);
        };

        ControlsList.prototype.enableCursorGuiWidgets = function() {

            var widgets = this.configRead('widgets');

            for (var i = 0; i < widgets.length; i++) {
                WorldAPI.loadGuiWidgetConfig(widgets[i], this.guiWidgetStore);
            }

            WorldAPI.enableGuiWidgetStore(this.guiWidgetStore)

        };

        ControlsList.prototype.updateControlsList = function() {

        };

        return ControlsList;

    });
