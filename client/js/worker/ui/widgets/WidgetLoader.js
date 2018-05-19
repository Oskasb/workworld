"use strict";

define([
        'ui/functions/DragFunctions',
        'ui/widgets/WidgetBuilder',
        'ui/widgets/WidgetFunctions',
        'ui/functions/GuiUpdatable'
    ],
    function(
        DragFunctions,
        WidgetBuilder,
        WidgetFunctions,
        GuiUpdatable
    ) {

        var widgets = [];
        var widgetBuilder;

        var widgetProcessor;

        var topTabs = [];
        var devButtons = [];
        var statusMonitors = [];
        var physPanelButtons = [];
        var envPanelButtons = [];
        var controls = [];
        var widgetCalls = {};

        var widgetReady = function(widget) {
            widget.enableWidget();
            widgets.push(widget);
        };

        var removeWidget = function(widget) {
            widget.disableWidget();
            widgets.splice(widgets.indexOf(widget), 1);
        };

        var initWidget = function(widget) {
            widget.initGuiWidget(widgetReady);
        };

        var initWidgetStore = function(store) {
            for (var i = 0; i < store.length; i++) {
                initWidget(store[i])
            }
        };

        var disableWidgetStore = function(store) {
            for (var i = 0; i < store.length; i++) {
                removeWidget(store[i])
            }
        };

        var clearButtonStates = function(store) {
            for (var i = 0; i < store.length; i++) {
                if (store[i].getButtonIsActive()) {
                    store[i].callButtonClick(0);
                }
            }
        };

        var toggleMonitors = function(bool) {
            if (bool) {
                initWidgetStore(statusMonitors)
            } else {
                disableWidgetStore(statusMonitors)
            }
        };

        var removePanelWidgets = function(panelStore) {
            while (panelStore.length) {
                removeWidget(panelStore.pop())
            }
        };

        var enablePhysPanel = function(bool) {

            if (bool) {
                widgetBuilder.buildPhysicsButtons(physPanelButtons);
                initWidgetStore(physPanelButtons)
            } else {
                removePanelWidgets(physPanelButtons)
            }
        };

        var enableEnvPanel = function(bool) {

            if (bool) {
                widgetBuilder.buildEnvPanel(envPanelButtons);
                initWidgetStore(envPanelButtons)
            } else {
                removePanelWidgets(envPanelButtons)
            }
        };

        var enableDevSubtabs = function(bool) {

            if (bool) {
                widgetBuilder.buildDevButtonTabs(buttonFunctions, devButtons);
                initWidgetStore(devButtons)
            } else {
                clearButtonStates(devButtons);
                removePanelWidgets(devButtons)
            }
        };

        var worldButtons = []

        var enableWorldSubtabs = function(bool) {

            if (bool) {
                widgetBuilder.buildWorldButtonTabs(buttonFunctions, worldButtons);
                initWidgetStore(worldButtons)
            } else {
                clearButtonStates(worldButtons);
                removePanelWidgets(worldButtons)
            }
        };


        var buttonFunctions = {
            monitorSystem:toggleMonitors,
            physicsPanel:enablePhysPanel,
            envPanel:enableEnvPanel,
            devSubtabs:enableDevSubtabs,
            worldSubtabs:enableWorldSubtabs
        };

        var updateWidgets = function() {
            for (var i = 0; i < widgets.length; i++) {
                widgets[i].updateGuiWidget()
            }

            if (WorldAPI.getCom(ENUMS.BufferChannels.UI_PRESS_SOURCE) === 0) {
                DragFunctions.dragSourceCamera();
            }

            WorldAPI.getContoledPiecePosAndQuat(WorldAPI.getWorldCamera().getCameraLookAt());

        };

        var WidgetLoader = function() {
            widgetBuilder = new WidgetBuilder();
            this.guiUpdatable = new GuiUpdatable();
        };

        WidgetLoader.prototype.enableDefaultGuiWidgets = function() {
            widgetBuilder.setupHandles();
            this.setupFunctions();

            widgetBuilder.buildStatusMonitors(statusMonitors);
            widgetBuilder.buildButtonWidget('STATUS', 'default', controls, buttonFunctions.monitorSystem, {margin_y:0.05});
            widgetBuilder.buildMessageBox(controls);

            widgetBuilder.buildProgressWidgets(controls);
            widgetBuilder.addTopNavigationTab('DEV', topTabs, buttonFunctions.devSubtabs);
            widgetBuilder.addTopNavigationTab('WORLD', topTabs, buttonFunctions.worldSubtabs);

            initWidgetStore(topTabs);
            initWidgetStore(controls);

            this.guiUpdatable.enableUpdates(updateWidgets);
        };

        WidgetLoader.prototype.setupFunctions = function() {
            widgetCalls['DRAG_AXIS'] = widgetBuilder.buildDragAxis;
            widgetCalls['DRAG_CONTROL'] = widgetBuilder.buildDragControl;
            widgetCalls['HOVER_DYNAMIC'] = widgetBuilder.buildHoverDynamic;
            widgetCalls['THUMBSTICK'] = widgetBuilder.buildThumbstick;
            widgetCalls['STATE_GAUGE'] = widgetBuilder.buildStateGauge;
            widgetCalls['ROLL_INDICATOR'] = widgetBuilder.buildRollIndicator;
            widgetCalls['PITCH_INDICATOR'] = widgetBuilder.buildPitchIndicator;
            widgetCalls['YAW_INDICATOR'] = widgetBuilder.buildYawIndicator;
        };


        WidgetLoader.prototype.loadWidgetConfig = function(config, store) {
            widgetCalls[config['widget']](config, store, widgetBuilder);
        };



        WidgetLoader.prototype.disableWidgetList = function(store) {

            for (var i = 0; i < store.length; i++) {
                while (store.length) {
                    removeWidget(store.pop());
                }
            }
        };

        WidgetLoader.prototype.enableWidgetList = function(store) {

            for (var i = 0; i < store.length; i++) {
                initWidgetStore(store);
            }
        };


        return WidgetLoader;

    });

