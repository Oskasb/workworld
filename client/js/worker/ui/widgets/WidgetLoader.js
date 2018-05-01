"use strict";

define([
        'ui/widgets/GuiThumbstickWidget',
        'ui/widgets/GuiButtonWidget'
    ],
    function(
        GuiThumbstickWidget,
        GuiButtonWidget
    ) {



        var widgets = [];

        var thumbstick;
        var statusMonButton;

        var widgetReady = function(widget) {
            widget.enableWidget();
            widgets.push(widget);
        };

        var WidgetLoader = function() {
            thumbstick = new GuiThumbstickWidget();
            statusMonButton = new GuiButtonWidget('SYSTEM');
        };


        var buttonFunctions = {

            monitorSystem:function() {
                console.log("Click!")
            }

        };

        WidgetLoader.prototype.enableDefaultGuiWidgets = function() {

            thumbstick.initGuiWidget(widgetReady);
            statusMonButton.initGuiWidget(widgetReady);

            statusMonButton.addButtonClickCallback(buttonFunctions.monitorSystem);

        };

        return WidgetLoader;

    });

