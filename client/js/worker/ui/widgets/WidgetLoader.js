"use strict";

define([
        'ui/widgets/WidgetBuilder',
        'ui/widgets/WidgetFunctions',
        'ui/functions/GuiUpdatable'
    ],
    function(
        WidgetBuilder,
        WidgetFunctions,
        GuiUpdatable
    ) {

        var widgets = [];
        var widgetBuilder;

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

        var WidgetLoader = function() {

            widgetBuilder = new WidgetBuilder();
            this.guiUpdatable = new GuiUpdatable();

            widgetBuilder.buildControls(controls);

            widgetBuilder.buildDevButtonTabs(buttonFunctions, devButtons);
            widgetBuilder.buildStatusMonitors(statusMonitors);
            initWidgetStore(devButtons);

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
                var ySep = 0.07;
                var my = 0.12;
                widgetBuilder.buildButtonWidget('BOX RAIN', physPanelButtons,null, {anchor:'top_left', margin_y:my,  margin_x:0.025}, WorldAPI.getWorldComBuffer(), ENUMS.BufferChannels.SPAWM_BOX_RAIN);
                my += ySep;
                widgetBuilder.buildButtonWidget('POKE ALL', physPanelButtons,null, {anchor:'top_left', margin_y:my,  margin_x:0.025}, WorldAPI.getWorldComBuffer(), ENUMS.BufferChannels.PUSH_ALL_DYNAMICS);
                my += ySep;
                widgetBuilder.buildButtonWidget('ATTRACT', physPanelButtons,null, {anchor:'top_left', margin_y:my,  margin_x:0.025}, WorldAPI.getWorldComBuffer(), ENUMS.BufferChannels.ATTRACT_DYNAMICS);
                my += ySep;
                widgetBuilder.buildButtonWidget('REPEL',  physPanelButtons,  null, {anchor:'top_left', margin_y:my,  margin_x:0.025}, WorldAPI.getWorldComBuffer(), ENUMS.BufferChannels.REPEL_DYNAMICS);
                initWidgetStore(physPanelButtons)
            } else {
                removePanelWidgets(physPanelButtons)
            }
        };

        var enableEnvPanel = function(bool) {

            if (bool) {

                var ySep = 0.07;
                var my = 0.12;
                var mx = 0.185;

                var i = 0;
                for (var key in ENUMS.Environments) {
                    i++;
                    widgetBuilder.buildButtonWidget(key, envPanelButtons, null, {anchor:'top_left', margin_y:my,  margin_x:mx}, WorldAPI.getWorldComBuffer(), ENUMS.BufferChannels.ENV_INDEX, i);
                    my += ySep;
                }
                initWidgetStore(envPanelButtons)
            } else {
                removePanelWidgets(envPanelButtons)
            }
        };


        var buttonFunctions = {
            monitorSystem:function(bool) {
                console.log("Click!", bool);
                toggleMonitors(bool);
            },

            physicsPanel:function(bool) {
                enablePhysPanel(bool)
            },

            envPanel:function(bool) {
                enableEnvPanel(bool);
            }
        };

        var updateWidgets = function() {
            for (var i = 0; i < widgets.length; i++) {
                widgets[i].updateGuiWidget()
            }
        };

        WidgetLoader.prototype.enableDefaultGuiWidgets = function() {
            this.guiUpdatable.enableUpdates(updateWidgets);
            initWidgetStore(controls);
        };

        return WidgetLoader;

    });

