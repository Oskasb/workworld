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

        var thumbstick;
        var statusMonButton;

        var statusMon;
        var effectMon;
        var timeMon;

        var widgetReady = function(widget) {
            widget.enableWidget();
            widgets.push(widget);
        };

        var removeWidget = function(widget) {
            widget.disableWidget();
            widgets.splice(widgets.indexOf(widget), 1);
        };

        var WidgetLoader = function() {
            this.guiUpdatable = new GuiUpdatable();
            thumbstick = new GuiThumbstickWidget();
            statusMonButton = new GuiButtonWidget('STATUS');
            statusMon = new MonitorListWidget('RENDER_MONITOR', 'STATUS', 'RENDER_MONITOR');
            effectMon = new MonitorListWidget('EFFECT_MONITOR', 'STATUS', 'EFFECT_MONITOR');
            timeMon = new MonitorListWidget('TIME_MONITOR', 'STATUS', 'TIME_MONITOR');
        };

        var enableStatusMon = function(bool) {
            if (bool) {
                statusMon.initGuiWidget(widgetReady);
            } else {
                removeWidget(statusMon);
            }
        };

        var enableEffectMon = function(bool) {
            if (bool) {
                effectMon.initGuiWidget(widgetReady);
                effectMon.getWidgetSurfaceLayout().setDynamicLayout('margin_y', 0.3)
            } else {
                removeWidget(effectMon);
            }
        };

        var enableTimeMon = function(bool) {
            if (bool) {
                timeMon.initGuiWidget(widgetReady);
                timeMon.getWidgetSurfaceLayout().setDynamicLayout('margin_y', 0.5)
            } else {
                removeWidget(timeMon);
            }
        };

        var buttonFunctions = {

            monitorSystem:function(bool) {

                console.log("Click!", bool);

                enableStatusMon(bool);
                enableEffectMon(bool);
                enableTimeMon(bool);
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
            statusMonButton.initGuiWidget(widgetReady);
            statusMonButton.addButtonClickCallback(buttonFunctions.monitorSystem);

        };

        return WidgetLoader;

    });

