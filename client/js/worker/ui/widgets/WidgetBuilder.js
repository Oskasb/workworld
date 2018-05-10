"use strict";

define([
        'ui/functions/DragFunctions',
        'ui/widgets/WidgetProcessor',
        'ui/widgets/GuiThumbstickWidget',
        'ui/widgets/MonitorListWidget',
        'ui/widgets/GuiButtonWidget'
    ],
    function(
        DragFunctions,
        WidgetProcessor,
        GuiThumbstickWidget,
        MonitorListWidget,
        GuiButtonWidget
    ) {


        var widget;
        var button;

        var tabIndex;

        var cfg;
        var row;
        var col;


        var subtabMargX = 0.025;
        var subtabMargY = 0.11;

        var subtabStepX = 0.14;
        var subtabStepY = 0.06;

        var tabListMargY = 0.18;
        var tabListStepY = 0.06;


        var subTabListLayout = {
            anchor:'top_left',
            margin_y:tabListMargY,
            margin_x:subtabMargX,
            step_y:tabListStepY,
            step_x:subtabStepX,
            row_col:[0, 1]
        };

        var subTabLayout = {
            anchor:'top_left',
            margin_y:subtabMargY,
            margin_x:subtabMargX,
            step_y:subtabStepY,
            step_x:subtabStepX,
            row_col:[1, 0]
        };


        var topTabsLayout = {
            anchor:'top_left',
            margin_x:0.01,
            step_x:0.140,
            margin_y:0.04,
            height:0.06,
            row_col:[1, 0]
        };

        var WidgetBuilder = function() {

        };

        WidgetBuilder.prototype.buildControls = function(store) {
            widget = new GuiThumbstickWidget();
            widget.addDragCallback(DragFunctions.thumbstickDrag);
            store.push(widget);
        };


        WidgetBuilder.prototype.addTopNavigationTab = function(label, topTabs, buttonCallback) {

            tabIndex = topTabs.length;
            var customLayout = WidgetProcessor.composeCustomLayout(topTabsLayout, 0, tabIndex);

            this.buildButtonWidget(label, 'top_bar', topTabs, buttonCallback, customLayout, WorldAPI.getWorldComBuffer(), ENUMS.BufferChannels.UI_NAVIGATION_TOP, tabIndex+1);

        };


        WidgetBuilder.prototype.buildCompoundPanel = function(panelConf, store, groupIndex) {

            for (var i = 0; i < panelConf.length; i++) {
                cfg = panelConf[i];

                row = WidgetProcessor.getLayoutRowCol(cfg.layout, 1, i, groupIndex);
                col = WidgetProcessor.getLayoutRowCol(cfg.layout, 0, i, groupIndex);

                var customLayout = WidgetProcessor.composeCustomLayout(cfg.layout, row, col);
                this.buildButtonWidget(cfg.label, cfg.configId, store, cfg.onClick, customLayout, cfg.buffer, cfg.channel, i+1);
            }
        };

        WidgetBuilder.prototype.buildDevButtonTabs = function(buttonFunctions, devButtons) {
            var buffer = WorldAPI.getWorldComBuffer();

            var panelConf = [
                {label:'PHYSICS',       configId:'default',  layout:subTabLayout, onClick:buttonFunctions.physicsPanel, buffer:buffer, channel:ENUMS.BufferChannels.DEV_ACTION_1},
                {label:'ENVIRONMENT',   configId:'default',  layout:subTabLayout, onClick:buttonFunctions.envPanel,     buffer:buffer, channel:ENUMS.BufferChannels.DEV_ACTION_2}
            ];

            this.buildCompoundPanel(panelConf, devButtons, 0);

        };

        WidgetBuilder.prototype.buildWorldButtonTabs = function(buttonFunctions, worldButtons) {

            var buffer = WorldAPI.getWorldComBuffer();

            var panelConf = [
                {label:'AUTO_WORLD',    configId:'default', layout:subTabLayout, onClick:null, buffer:buffer, channel:ENUMS.BufferChannels.WORLD_ACTION_1},
                {label:'ADD_STUFF',     configId:'default',  layout:subTabLayout, onClick:null, buffer:buffer, channel:ENUMS.BufferChannels.WORLD_ACTION_2},
                {label:'REMOVE_STUFF',  configId:'default',  layout:subTabLayout, onClick:null, buffer:buffer, channel:ENUMS.BufferChannels.WORLD_ACTION_3}
            ];

            this.buildCompoundPanel(panelConf, worldButtons, 0);

        };

        WidgetBuilder.prototype.buildStatusMonitors = function(statusMonitors) {
            this.buildMonitorListWidget('RENDER',  'STATUS', 'RENDER_MONITOR',  statusMonitors,    {margin_y:0.14});
            this.buildMonitorListWidget('EFFECTS', 'STATUS', 'EFFECT_MONITOR',  statusMonitors,    {margin_y:0.34});
            this.buildMonitorListWidget('SYSTEM',  'STATUS', 'TIME_MONITOR',    statusMonitors,    {margin_y:0.52});
            this.buildMonitorListWidget('PHYSICS', 'STATUS', 'PHYSICS_MONITOR', statusMonitors,    {margin_y:0.70});
        };

        WidgetBuilder.prototype.buildPhysicsButtons = function(physPanelButtons) {

            var buffer = WorldAPI.getWorldComBuffer();

            var panelConf = [
                {label:'BOX RAIN', configId:'default', layout:subTabListLayout, onClick:null, buffer:buffer, channel:ENUMS.BufferChannels.SPAWM_BOX_RAIN},
                {label:'POKE ALL', configId:'default', layout:subTabListLayout, onClick:null, buffer:buffer, channel:ENUMS.BufferChannels.PUSH_ALL_DYNAMICS},
                {label:'ATTRACT',  configId:'default', layout:subTabListLayout, onClick:null, buffer:buffer, channel:ENUMS.BufferChannels.ATTRACT_DYNAMICS},
                {label:'REPEL',    configId:'default', layout:subTabListLayout, onClick:null, buffer:buffer, channel:ENUMS.BufferChannels.REPEL_DYNAMICS}
            ];

            this.buildCompoundPanel(panelConf, physPanelButtons, 0);
        };

        WidgetBuilder.prototype.buildEnvPanel = function(envPanelButtons) {

            var buffer = WorldAPI.getWorldComBuffer();
            var panelConf = [];

            for (var key in ENUMS.Environments) {
                panelConf.push(
                    {label:key, configId:'default', layout:subTabListLayout, onClick:null, buffer:buffer, channel:ENUMS.BufferChannels.ENV_INDEX},
                );
            }

            this.buildCompoundPanel(panelConf, envPanelButtons, 1);
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

