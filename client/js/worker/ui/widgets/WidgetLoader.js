"use strict";

define([
        'ui/widgets/GuiThumbstickWidget',
        'ui/widgets/MonitorListWidget',
        'ui/widgets/GuiButtonWidget',
        'ui/functions/GuiUpdatable'
    ],
    function(
        GuiThumbstickWidget,
        MonitorListWidget,
        GuiButtonWidget,
        GuiUpdatable
    ) {



        var widgets = [];

        var buttons = {};

        var thumbstick;
        var statusMonButton;

        var button;
        var statusMon;
        var effectMon;
        var timeMon;
        var physicsMon;

        var widgetReady = function(widget) {
            widget.enableWidget();
            widgets.push(widget);
        };

        var removeWidget = function(widget) {
            widget.disableWidget();
            widgets.splice(widgets.indexOf(widget), 1);
        };



        var addButtonWidget = function(label, callback, dynamicLayout, masterBuffer, masterIndex, matchValue) {
            button = new GuiButtonWidget(label);
            button.initGuiWidget(widgetReady);

            if (callback) {
                button.addButtonClickCallback(callback);
            }

            if (masterBuffer) {
                button.setMasterBuffer(masterBuffer, masterIndex, matchValue);
            }

            button.applyDynamicLayout(dynamicLayout);
            return button;
        };

        var WidgetLoader = function() {
            this.guiUpdatable = new GuiUpdatable();
            thumbstick = new GuiThumbstickWidget();

            addButtonWidget('STATUS', buttonFunctions.monitorSystem);
            addButtonWidget('PHYSICS', buttonFunctions.physicsPanel, {anchor:'top_left'});
            addButtonWidget('ENVIRONMENT', buttonFunctions.envPanel, {anchor:'top_left', margin_x:0.180});

            statusMon = new MonitorListWidget('RENDER_MONITOR', 'STATUS', 'RENDER_MONITOR');
            effectMon = new MonitorListWidget('EFFECT_MONITOR', 'STATUS', 'EFFECT_MONITOR');
            timeMon = new MonitorListWidget('TIME_MONITOR', 'STATUS', 'TIME_MONITOR');
            physicsMon = new MonitorListWidget('PHYSICS_MONITOR', 'STATUS', 'PHYSICS_MONITOR');
        };


        var toggleMonitor = function(bool, monitor, marginY) {
            if (bool) {

                monitor.initGuiWidget(widgetReady);
                monitor.getWidgetSurfaceLayout().setDynamicLayout('margin_y', marginY)
            } else {
                removeWidget(monitor);
            }
        };


        var physPanelButtons = [];

        var addPanelWidget = function(button, panelStore) {
            panelStore.push(button);
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
                addPanelWidget(
                    addButtonWidget('BOX RAIN', null, {anchor:'top_left', margin_y:my,  margin_x:0.025}, WorldAPI.getWorldComBuffer(), ENUMS.BufferChannels.SPAWM_BOX_RAIN),
                    physPanelButtons
                );

                my += ySep;

                addPanelWidget(
                    addButtonWidget('POKE ALL', null, {anchor:'top_left', margin_y:my,  margin_x:0.025}, WorldAPI.getWorldComBuffer(), ENUMS.BufferChannels.PUSH_ALL_DYNAMICS),
                    physPanelButtons
                );
                my += ySep;

                addPanelWidget(
                    addButtonWidget('ATTRACT', null, {anchor:'top_left', margin_y:my,  margin_x:0.025}, WorldAPI.getWorldComBuffer(), ENUMS.BufferChannels.ATTRACT_DYNAMICS),
                    physPanelButtons
                );
                my += ySep;

                addPanelWidget(
                    addButtonWidget('REPEL',   null, {anchor:'top_left', margin_y:my,  margin_x:0.025}, WorldAPI.getWorldComBuffer(), ENUMS.BufferChannels.REPEL_DYNAMICS),
                    physPanelButtons
                );

            } else {
                removePanelWidgets(physPanelButtons)
            }
        };

        var envPanelButtons = [];

        var enableEnvPanel = function(bool) {

            if (bool) {

                var ySep = 0.07;
                var my = 0.12;
                var mx = 0.185;

                var i = 0;
                for (var key in ENUMS.Environments) {
                    i++;
                    addPanelWidget(
                        addButtonWidget(key, null, {anchor:'top_left', margin_y:my,  margin_x:mx}, WorldAPI.getWorldComBuffer(), ENUMS.BufferChannels.ENV_INDEX, i),
                        envPanelButtons
                    );
                    my += ySep;
                }

            } else {
                removePanelWidgets(envPanelButtons)
            }
        };


        var buttonFunctions = {

            monitorSystem:function(bool) {
                console.log("Click!", bool);
                toggleMonitor(bool, statusMon, 0);
                toggleMonitor(bool, effectMon, 0.28);
                toggleMonitor(bool, timeMon, 0.46);
                toggleMonitor(bool, physicsMon, 0.64);
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
            thumbstick.initGuiWidget(widgetReady);

        };

        return WidgetLoader;

    });

