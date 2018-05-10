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

        var WidgetLoader = function() {

            widgetBuilder = new WidgetBuilder();

            this.guiUpdatable = new GuiUpdatable();

            widgetBuilder.buildControls(controls);
            widgetBuilder.buildStatusMonitors(statusMonitors);
            widgetBuilder.buildButtonWidget('STATUS', 'default', controls, buttonFunctions.monitorSystem, {margin_y:0.07});

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

            WorldAPI.getWorldCamera().setLookAtVec(WorldAPI.getWorldCursor().getCursorPosition());
            WorldAPI.getWorldCamera().updateCameraLookAt();

        };

        WidgetLoader.prototype.enableDefaultGuiWidgets = function() {
            this.guiUpdatable.enableUpdates(updateWidgets);

            widgetBuilder.addTopNavigationTab('DEV', topTabs, buttonFunctions.devSubtabs);
            widgetBuilder.addTopNavigationTab('WORLD', topTabs, buttonFunctions.worldSubtabs);
            initWidgetStore(topTabs);

            initWidgetStore(controls);
        };

        return WidgetLoader;

    });

