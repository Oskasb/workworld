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

        var tabIndex;

        var topTabsLayout = {
            anchor:'top_left',
            margin_x:0.01,
            step_x:0.140,
            margin_y:0.04,
            height:0.06
        };

        var WidgetBuilder = function() {

        };

        WidgetBuilder.prototype.buildControls = function(store) {

            store.push(new GuiThumbstickWidget());
        };



        WidgetBuilder.prototype.addTopNavigationTab = function(label, topTabs, buttonCallback) {

            tabIndex = topTabs.length;
            var customLayout = {
                anchor:topTabsLayout.anchor,
                margin_y:topTabsLayout.margin_y,
                margin_x:topTabsLayout.margin_x + topTabsLayout.step_x*tabIndex
            };

            this.buildButtonWidget(label, 'top_bar', topTabs, buttonCallback, customLayout, WorldAPI.getWorldComBuffer(), ENUMS.BufferChannels.UI_NAVIGATION_TOP, tabIndex+1);

        };

        WidgetBuilder.prototype.buildDevButtonTabs = function(buttonFunctions, devButtons) {
            var buffer = WorldAPI.getWorldComBuffer();
            this.buildButtonWidget('PHYSICS', 'default',devButtons, buttonFunctions.physicsPanel, {anchor:'top_left', margin_y:0.1}, buffer, ENUMS.BufferChannels.DEV_ACTION_1, 1);
            this.buildButtonWidget('ENVIRONMENT', 'default',devButtons, buttonFunctions.envPanel, {anchor:'top_left', margin_x:0.180, margin_y:0.1}, buffer, ENUMS.BufferChannels.DEV_ACTION_2, 1);
        };

        WidgetBuilder.prototype.buildWorldButtonTabs = function(buttonFunctions, worldButtons) {
            this.buildButtonWidget('AUTO_WORLD',   'default', worldButtons, null, {anchor:'top_left', margin_y:0.1},                      WorldAPI.getWorldComBuffer(), ENUMS.BufferChannels.WORLD_ACTION_1, 1);
            this.buildButtonWidget('ADD_STUFF',    'default', worldButtons, null, {anchor:'top_left', margin_x:0.150, margin_y:0.1},      WorldAPI.getWorldComBuffer(), ENUMS.BufferChannels.WORLD_ACTION_2, 1);
            this.buildButtonWidget('REMOVE_STUFF', 'default', worldButtons, null, {anchor:'top_left', margin_x:0.280, margin_y:0.1},      WorldAPI.getWorldComBuffer(), ENUMS.BufferChannels.WORLD_ACTION_3, 1);
        };

        WidgetBuilder.prototype.buildStatusMonitors = function(statusMonitors) {
            this.buildMonitorListWidget('RENDER',  'STATUS', 'RENDER_MONITOR',  statusMonitors,    {margin_y:0.14});
            this.buildMonitorListWidget('EFFECTS', 'STATUS', 'EFFECT_MONITOR',  statusMonitors,    {margin_y:0.34});
            this.buildMonitorListWidget('SYSTEM',  'STATUS', 'TIME_MONITOR',    statusMonitors,    {margin_y:0.52});
            this.buildMonitorListWidget('PHYSICS', 'STATUS', 'PHYSICS_MONITOR', statusMonitors,    {margin_y:0.70});
        };

        WidgetBuilder.prototype.buildPhysicsButtons = function(physPanelButtons) {
            var ySep = 0.06;
            var my = 0.18;
            var buffer = WorldAPI.getWorldComBuffer();
            this.buildButtonWidget('BOX RAIN', 'default', physPanelButtons,null, {anchor:'top_left', margin_y:my,  margin_x:0.025}, buffer, ENUMS.BufferChannels.SPAWM_BOX_RAIN);
            my += ySep;
            this.buildButtonWidget('POKE ALL', 'default', physPanelButtons,null, {anchor:'top_left', margin_y:my,  margin_x:0.025}, buffer, ENUMS.BufferChannels.PUSH_ALL_DYNAMICS);
            my += ySep;
            this.buildButtonWidget('ATTRACT', 'default',physPanelButtons,null, {anchor:'top_left', margin_y:my,  margin_x:0.025}, buffer, ENUMS.BufferChannels.ATTRACT_DYNAMICS);
            my += ySep;
            this.buildButtonWidget('REPEL', 'default', physPanelButtons,  null, {anchor:'top_left', margin_y:my,  margin_x:0.025}, buffer, ENUMS.BufferChannels.REPEL_DYNAMICS);
        };

        WidgetBuilder.prototype.buildEnvPanel = function(envPanelButtons) {
            var ySep = 0.06;
            var my = 0.18;
            var mx = 0.185;

            var i = 0;
            for (var key in ENUMS.Environments) {
                i++;
                this.buildButtonWidget(key, 'default',envPanelButtons, null, {anchor:'top_left', margin_y:my,  margin_x:mx}, WorldAPI.getWorldComBuffer(), ENUMS.BufferChannels.ENV_INDEX, i);
                my += ySep;
            }
        };


        WidgetBuilder.prototype.buildButtonWidget = function(label, configId, storeArray, callback, dynamicLayout, masterBuffer, masterIndex, matchValue) {
            button = new GuiButtonWidget(label, configId);

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

