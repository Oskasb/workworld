"use strict";

define([

    ],
    function(

    ) {

        var WidgetProcessor = function() {

        };

        WidgetProcessor.getLayoutRowCol = function(customLayout, axis, index, groupIndex) {

            if (customLayout.row_col) {
                return customLayout.row_col[axis]*index + customLayout.row_col[1-axis] * groupIndex;
            }

            return index;
        };

        WidgetProcessor.getLayoutColums = function(customLayout, index) {


        };

        WidgetProcessor.composeCustomLayout = function(customLayout, row_y, column_x) {
            var cl = {};

            if (customLayout.anchor) {
                cl.anchor = customLayout.anchor;
            }

            if (customLayout.margin_y) {
                cl.margin_y = customLayout.margin_y;
            }

            if (customLayout.margin_x) {
                cl.margin_x = customLayout.margin_x;
            }

            if (customLayout.margin_x) {
                cl.margin_x = customLayout.margin_x;
            }

            if (customLayout.step_x) {
                cl.margin_x = customLayout.margin_x + customLayout.step_x*column_x;
            }

            if (customLayout.step_y) {
                cl.margin_y = customLayout.margin_y + customLayout.step_y*row_y;
            }

            return cl;
        };

        WidgetProcessor.prototype.enableDefaultGuiWidgets = function() {

        };

        return WidgetProcessor;

    });

