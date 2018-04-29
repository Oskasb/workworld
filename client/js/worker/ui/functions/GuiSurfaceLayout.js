"use strict";

define([
        'GuiAPI'
    ],
    function(
        GuiAPI
    ) {


        var anchorMap = {
            top_left:        [0, 0],
            top_right:       [1, 0],
            bottom_left:     [0, 1],
            bottom_right:   [1, 1],
            center:      [0.5, 0.5]
        };

        var anchorX;
        var anchorY;

        var width;
        var height;

        var scax;
        var scay;

        var mx;
        var my;

        var x1;
        var x2;
        var y1;
        var y2;

        var GuiSurfaceLayout = function() {
            this.xMin = 0;
            this.xMax = 0;
            this.yMin = 0;
            this.yMax = 0;

            this.layout = {
                x_min:0,
                x_max:0,
                y_min:0,
                y_max:0
            };

            this.anchorX = 0;
            this.anchorY = 0;

        };

        GuiSurfaceLayout.prototype.setupAnchorPoint = function(layout) {

            anchorX = anchorMap[layout[ENUMS.Layout.anchor]][0];
            anchorY = anchorMap[layout[ENUMS.Layout.anchor]][1];

            mx = layout[ENUMS.Layout.margin_x];
            my = layout[ENUMS.Layout.margin_y];

            this.anchorX = (1-anchorX) * mx + anchorX * (1-mx);
            this.anchorY = (1-anchorY) * my + anchorY * (1-my);

        };

        GuiSurfaceLayout.prototype.setupLayout = function(layout) {



            scax = GuiAPI.layoutToViewX(this.anchorX);
            scay = GuiAPI.layoutToViewY(this.anchorY);

            if (layout[ENUMS.Layout.fixed_aspect] === true) {
                width = GuiAPI.scaleByClampedAspect(layout[ENUMS.Layout.width]);
                height = -GuiAPI.scaleByClampedAspect(layout[ENUMS.Layout.height]);
            } else {
                width = GuiAPI.scaleByWidth(layout[ENUMS.Layout.width]);
                height = -GuiAPI.scaleByHeight(layout[ENUMS.Layout.height]) // WorldAPI.sampleInputBuffer(ENUMS.InputState.ASPECT));
            }


        //    width =  layout[ENUMS.Layout.width];
        //    height = layout[ENUMS.Layout.height];

            this.xMin = scax - width  * anchorX;
            this.xMax = scax + width  * (1-anchorX);
            this.yMin = scay - height * anchorY;
            this.yMax = scay + height * (1-anchorY);

        //    this.layout.x_min = x1;
        //    this.layout.x_max = x2;
        //    this.layout.y_min = y1;
        //    this.layout.y_max = y2;

        };


        GuiSurfaceLayout.prototype.applyLayoutRules = function(layoutConfig) {

            this.setupAnchorPoint(layoutConfig);
            this.setupLayout(layoutConfig)

        };


        GuiSurfaceLayout.prototype.parseLaoutConfig = function(layoutConfig) {
            this.applyLayoutRules(layoutConfig);

         ////   this.xMin = this.layout.x_min;
         ////   this.xMax = this.layout.x_max;
         ////   this.yMin = this.layout.y_min;
         ////   this.yMax = this.layout.y_max;
        };

        GuiSurfaceLayout.prototype.applyLayoutToCorners = function(topLeft, topRight, bottomLeft, bottomRight) {
            topLeft.setCornerXY(    this.xMin,  this.yMin);
            topRight.setCornerXY(   this.xMax,  this.yMin);
            bottomLeft.setCornerXY( this.xMin,  this.yMax);
            bottomRight.setCornerXY(this.xMax,  this.yMax);
        };

        GuiSurfaceLayout.prototype.isInsideXY = function(x, y) {
            // y flips when moving from screen space to world space (where the geometry resides)

            //      return Math.random() < 0.9 //  x > this.xMin && x < this.xMax && y < this.yMin && y > this.yMax
            return x > this.xMin && x < this.xMax && y < this.yMin && y > this.yMax
        };

        return GuiSurfaceLayout;

    });