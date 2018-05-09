"use strict";

define([
        'ui/widgets/GuiThumbstickWidget',
        'ui/widgets/MonitorListWidget',
        'ui/widgets/GuiButtonWidget'
    ],
    function(
        GuiThumbstickWidget,
        MonitorListWidget,
        GuiButtonWidget
    ) {

        var widget;
        var button;

        var WidgetBuilder = function() {

        };

        WidgetBuilder.prototype.buildControls = function(store) {
            store.push(new GuiThumbstickWidget());
        };

        WidgetBuilder.prototype.buildDevButtonTabs = function(buttonFunctions, devButtons) {
            this.buildButtonWidget('STATUS', devButtons, buttonFunctions.monitorSystem);
            this.buildButtonWidget('PHYSICS', devButtons, buttonFunctions.physicsPanel, {anchor:'top_left'});
            this.buildButtonWidget('ENVIRONMENT', devButtons, buttonFunctions.envPanel, {anchor:'top_left', margin_x:0.180});
        };

        WidgetBuilder.prototype.buildStatusMonitors = function(statusMonitors) {
            this.buildMonitorListWidget('RENDER',  'STATUS', 'RENDER_MONITOR',  statusMonitors);
            this.buildMonitorListWidget('EFFECTS', 'STATUS', 'EFFECT_MONITOR',  statusMonitors,    {margin_y:0.28});
            this.buildMonitorListWidget('SYSTEM',  'STATUS', 'TIME_MONITOR',    statusMonitors,    {margin_y:0.46});
            this.buildMonitorListWidget('PHYSICS', 'STATUS', 'PHYSICS_MONITOR', statusMonitors,    {margin_y:0.64});
        };

        WidgetBuilder.prototype.buildButtonWidget = function(label, storeArray, callback, dynamicLayout, masterBuffer, masterIndex, matchValue) {
            button = new GuiButtonWidget(label);

            if (callback) {
                button.addButtonClickCallback(callback);
            }

            if (masterBuffer) {
                button.setMasterBuffer(masterBuffer, masterIndex, matchValue);
            }

            button.applyDynamicLayout(dynamicLayout);
            storeArray.push(button);
            return button;
        };

        WidgetBuilder.prototype.buildMonitorListWidget = function(uiLabel, category, key, storeArray, dynamicLayout) {
            widget = new MonitorListWidget(uiLabel, category, key);
            widget.applyDynamicLayout(dynamicLayout);
            storeArray.push(widget);
            return widget;
        };




        return WidgetBuilder;

    });

