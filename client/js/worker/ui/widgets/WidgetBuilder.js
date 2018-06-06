"use strict";

define([
        'ui/functions/OnUpdateFunctions',
        'ui/functions/DragFunctions',
        'ui/functions/ButtonFunctions',
        'ui/widgets/WidgetProcessor',
        'ui/widgets/GuiThumbstickWidget',
        'ui/widgets/GuiDragAxisWidget',
        'ui/widgets/GuiGaugeWidget',
        'ui/widgets/GuiProgressWidget',
        'ui/widgets/GuiHoverDynamic',
        'ui/widgets/MessageBoxWidget',
        'ui/widgets/MonitorListWidget',
        'ui/widgets/GuiButtonWidget',
        'ui/widgets/indicators/GuiRollIndicator',
        'ui/widgets/indicators/GuiPitchIndicator',
        'ui/widgets/controls/GuiDragControlWidget',
        'ui/widgets/controls/GuiToggleControlWidget'
    ],
    function(
        OnUpdateFunctions,
        DragFunctions,
        ButtonFunctions,
        WidgetProcessor,
        GuiThumbstickWidget,
        GuiDragAxisWidget,
        GuiGaugeWidget,
        GuiProgressWidget,
        GuiHoverDynamic,
        MessageBoxWidget,
        MonitorListWidget,
        GuiButtonWidget,
        GuiRollIndicator,
        GuiPitchIndicator,
        GuiDragControlWidget,
        GuiToggleControlWidget
    ) {


        var widget;
        var button;

        var tabIndex;

        var cfg;
        var row;
        var col;

        var subtabMargX = 0.055;
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
            margin_x:0.05,
            step_x:0.140,
            margin_y:0.04,
            height:0.06,
            row_col:[1, 0]
        };

        var bufferFetcher;
        var enumHandle;

        var setupHandles = function() {
            bufferFetcher = function(key) {
                if (key === 'inputState') return WorldAPI.getInputBuffer();
                if (key === 'worldComBuffer') return WorldAPI.getWorldComBuffer();
                if (key === 'currentDynamic') return WorldAPI.getControlledRenderable().getDynamicSpatialBuffer()
            };

            enumHandle = {
                worldComBuffer:'BufferChannels',
                currentDynamic:'BufferSpatial',
                inputState:'InputState'
            };
        };

        var buildWidgetConfig = function(config) {

            var conf = {
                label:config.label,
                configId:config.configId,
                layout:config.layout
            };

            if (config.buffer) {
                conf.buffer = bufferFetcher(config.buffer);
                conf.channel = ENUMS[enumHandle[config.buffer]][config.channel]
            }

            if (config.onDrag) {
                conf.onDrag = DragFunctions[config.onDrag]
            }

            if (config.onUpdate) {
                conf.onUpdate = OnUpdateFunctions[config.onUpdate];
                conf.source = config.source
            }

            if (config.onClick) {
                conf.onClick = ButtonFunctions[config.onClick];
                conf.source = config.source
            }

            return conf;
        };

        var WidgetBuilder = function() {

        };

        WidgetBuilder.prototype.setupHandles = function() {

            setupHandles()
        };

        WidgetBuilder.prototype.buildThumbstick = function(config, store) {

            var conf = {
                label:config.label,
                configId:config.configId,
                onDrag:DragFunctions[config.onDrag]
            };

            widget = new GuiThumbstickWidget();
            widget.addDragCallback(conf.onDrag);
            store.push(widget);
        };


        WidgetBuilder.prototype.buildProgressWidget = function(store, label, configId, callback, customLayout, buffer, bufferChannel) {
            widget = new GuiProgressWidget(label, configId);
            if (callback) {
                widget.addUpdateCallback(callback);
            }
            if (buffer) {
                widget.setMasterBuffer(buffer, bufferChannel);
            }
            widget.applyDynamicLayout(customLayout);
            store.push(widget);
        };


        WidgetBuilder.prototype.buildProgressConfig = function(store, config) {
            this.buildProgressWidget(store, config.label, config.configId, config.onUpdate, config.layout, config.buffer, config.channel)
        };

        WidgetBuilder.prototype.buildHoverDynamic = function(config, store) {
            var conf = {
                label:config.label,
                configId:config.configId
            };
            store.push(new GuiHoverDynamic(conf.label, conf.configId))
        };



        WidgetBuilder.prototype.buildDragAxis = function(config, store) {
            var conf = buildWidgetConfig(config);

            widget = new GuiDragAxisWidget(conf.label, conf.configId);
            widget.addDragCallback(conf.onDrag);
            widget.setMasterBuffer(conf.buffer,  conf.channel);
            widget.applyDynamicLayout(conf.layout);

            store.push(widget);

        };

        WidgetBuilder.prototype.buildDragControl = function(config, store) {
            var conf = buildWidgetConfig(config);

            widget = new GuiDragControlWidget(conf.label, conf.configId);
            widget.addDragCallback(conf.onDrag);
            widget.setMasterBuffer(conf.buffer,  conf.channel);

            widget.addUpdateCallback(conf.onUpdate, conf.source);

            widget.applyDynamicLayout(conf.layout);

            store.push(widget);

        };

        WidgetBuilder.prototype.buildButtonControl = function(config, store) {
            var conf = buildWidgetConfig(config);

            widget = new GuiToggleControlWidget(conf.label, conf.configId);

            widget.addButtonClickCallback(conf.onClick, conf.source);
            widget.addUpdateCallback(conf.onUpdate, conf.source);

        //    widget.setMasterBuffer(conf.buffer,  conf.channel, 1);

            widget.applyDynamicLayout(conf.layout);
            store.push(widget);
        };

        WidgetBuilder.prototype.buildStateGauge = function(config, store) {
            var conf = buildWidgetConfig(config);
            widget = new GuiGaugeWidget(conf.label, conf.configId);
            widget.setMasterBuffer(conf.buffer,  conf.channel);
            widget.applyDynamicLayout(conf.layout);
            store.push(widget);
        };

        WidgetBuilder.prototype.buildRollIndicator = function(config, store) {
            var conf = buildWidgetConfig(config);
            widget = new GuiRollIndicator(conf.label, conf.configId);
            widget.setMasterBuffer(conf.buffer,  conf.channel);
            widget.applyDynamicLayout(conf.layout);
            store.push(widget);
        };

        WidgetBuilder.prototype.buildPitchIndicator = function(config, store) {
            var conf = buildWidgetConfig(config);
            widget = new GuiPitchIndicator(conf.label, conf.configId);
            widget.setMasterBuffer(conf.buffer,  conf.channel);
            widget.applyDynamicLayout(conf.layout);
            store.push(widget);
        };

        WidgetBuilder.prototype.buildYawIndicator = function(config, store) {
            var conf = buildWidgetConfig(config);
            widget = new GuiPitchIndicator(conf.label, conf.configId);
            widget.setMasterBuffer(conf.buffer,  conf.channel);
            widget.applyDynamicLayout(conf.layout);
            store.push(widget);
        };


        WidgetBuilder.prototype.buildProgressWidgets = function(store) {
            var buffer = WorldAPI.getWorldComBuffer();

            var conf = [
                {label:'SELECTING', configId:'select_progress',  onUpdate:OnUpdateFunctions.selectUpdate, layout:{}, buffer:buffer, channel:ENUMS.BufferChannels.SELECT_PROGRESS},
                {label:'EVENT',     configId:'top_progress',     onUpdate:OnUpdateFunctions.eventUpdate,  layout:{}, buffer:buffer, channel:ENUMS.BufferChannels.EVENT_PROGRESS}
            ];

            for (var i = 0; i < conf.length;i++) {
                this.buildProgressConfig(store, conf[i])
            }
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
                {label:'PHYSICS',       configId:'default',  layout:subTabLayout, onClick:buttonFunctions.physicsPanel,   buffer:buffer, channel:ENUMS.BufferChannels.DEV_ACTION_1},
                {label:'ENVIRONMENT',   configId:'default',  layout:subTabLayout, onClick:buttonFunctions.envPanel,       buffer:buffer, channel:ENUMS.BufferChannels.DEV_ACTION_2},
                {label:'MECHANICS',     configId:'default',  layout:subTabLayout, onClick:buttonFunctions.mechanicsPanel, buffer:buffer, channel:ENUMS.BufferChannels.DEV_ACTION_3}
            ];

            this.buildCompoundPanel(panelConf, devButtons, 0);

        };

        WidgetBuilder.prototype.buildWorldButtonTabs = function(buttonFunctions, worldButtons) {

            var buffer = WorldAPI.getWorldComBuffer();

            var panelConf = [
                {label:'ADD AREA',     configId:'default',  layout:subTabLayout, onClick:null, buffer:buffer, channel:ENUMS.BufferChannels.WORLD_ACTION_1},
                {label:'ADD_BOAT',     configId:'default',  layout:subTabLayout, onClick:null, buffer:buffer, channel:ENUMS.BufferChannels.WORLD_ACTION_2},
                {label:'ADD_PLANE',    configId:'default',  layout:subTabLayout, onClick:null, buffer:buffer, channel:ENUMS.BufferChannels.WORLD_ACTION_3}
            ];

            this.buildCompoundPanel(panelConf, worldButtons, 0);

        };

        WidgetBuilder.prototype.buildStatusMonitors = function(statusMonitors) {
            this.buildMonitorListWidget('RENDER',  'STATUS', 'RENDER_MONITOR',  statusMonitors,    {margin_y:0.10});
            this.buildMonitorListWidget('EFFECTS', 'STATUS', 'EFFECT_MONITOR',  statusMonitors,    {margin_y:0.30});
            this.buildMonitorListWidget('SYSTEM',  'STATUS', 'TIME_MONITOR',    statusMonitors,    {margin_y:0.48});
            this.buildMonitorListWidget('PHYSICS', 'STATUS', 'PHYSICS_MONITOR', statusMonitors,    {margin_y:0.66});
        };

        WidgetBuilder.prototype.buildMessageBox = function(store) {
            this.buildMessageBoxWidget('MESSAGES',  'GUI_MESSAGES', 'CHANNEL_ONE',  store,    {margin_y:0.0})
        };

        WidgetBuilder.prototype.buildPhysicsButtons = function(buttonStore) {

            var buffer = WorldAPI.getWorldComBuffer();

            var panelConf = [
                {label:'BOX RAIN',     configId:'default', layout:subTabListLayout, onClick:null, buffer:buffer, channel:ENUMS.BufferChannels.SPAWM_BOX_RAIN},
                {label:'POKE ALL',     configId:'default', layout:subTabListLayout, onClick:null, buffer:buffer, channel:ENUMS.BufferChannels.PUSH_ALL_DYNAMICS},
                {label:'ATTRACT',      configId:'default', layout:subTabListLayout, onClick:null, buffer:buffer, channel:ENUMS.BufferChannels.ATTRACT_DYNAMICS},
                {label:'REPEL',        configId:'default', layout:subTabListLayout, onClick:null, buffer:buffer, channel:ENUMS.BufferChannels.REPEL_DYNAMICS},
                {label:'DRAW SHAPES',  configId:'default', layout:subTabListLayout, onClick:null, buffer:buffer, channel:ENUMS.BufferChannels.DRAW_DYN_SHAPES},
                {label:'SHAPE FORCES', configId:'default', layout:subTabListLayout, onClick:null, buffer:buffer, channel:ENUMS.BufferChannels.DRAW_SHAPE_FORCES}
            ];

            this.buildCompoundPanel(panelConf, buttonStore, 0);
        };

        WidgetBuilder.prototype.buildMechanicsButtons = function(buttonStore) {

            var buffer = WorldAPI.getWorldComBuffer();

            var panelConf = [
                {label:'ATTACHMENTS', configId:'default', layout:subTabListLayout, onClick:null, buffer:buffer, channel:ENUMS.BufferChannels.DRAW_ATTACHMENTS},
                {label:'AERODYNAMICS', configId:'default', layout:subTabListLayout, onClick:null, buffer:buffer, channel:ENUMS.BufferChannels.DRAW_AERODYNAMICS}
            ];

            this.buildCompoundPanel(panelConf, buttonStore, 2);
        };

        WidgetBuilder.prototype.buildEnvPanel = function(buttonStore) {

            var buffer = WorldAPI.getWorldComBuffer();
            var panelConf = [];

            for (var key in ENUMS.Environments) {
                panelConf.push(
                    {label:key, configId:'default', layout:subTabListLayout, onClick:null, buffer:buffer, channel:ENUMS.BufferChannels.ENV_INDEX}
                );
            }

            this.buildCompoundPanel(panelConf, buttonStore, 1);
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

        WidgetBuilder.prototype.buildMessageBoxWidget = function(uiLabel, category, key, storeArray, dynamicLayout) {
            widget = new MessageBoxWidget(uiLabel, category, key);
            widget.applyDynamicLayout(dynamicLayout);
            storeArray.push(widget);
            return widget;
        };


        return WidgetBuilder;

    });

