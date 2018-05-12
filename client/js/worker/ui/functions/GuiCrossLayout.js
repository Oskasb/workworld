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
            mid_left:      [0, 0.5],
            bottom_right:    [1, 1],
            mid_right:     [1, 0.5],
            bottom_mid:    [0.5, 1],
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

        var GuiCrossLayout = function() {

            this.position = new THREE.Vector3();

            this.xMin = 0;
            this.xMax = 0;
            this.yMin = 0;
            this.yMax = 0;

            this.anchorX = 0;
            this.anchorY = 0;
            this.centerX = 0;
            this.centerY = 0;

            this.dynamicLayout = {};
            this.layout = {}

        };

        GuiCrossLayout.prototype.setupAnchorPoint = function(layout) {

            anchorX = anchorMap[layout[ENUMS.Layout.anchor]][0];
            anchorY = anchorMap[layout[ENUMS.Layout.anchor]][1];

            mx = layout[ENUMS.Layout.margin_x];
            my = layout[ENUMS.Layout.margin_y];

            this.anchorX = (1-anchorX) * mx + anchorX * (1-mx);
            this.anchorY = (1-anchorY) * my + anchorY * (1-my);
        };

        GuiCrossLayout.prototype.setupLayout = function(layout) {

            scax = GuiAPI.layoutToViewX(this.anchorX) + this.position.x;
            scay = GuiAPI.layoutToViewY(this.anchorY) + this.position.y;

            if (layout[ENUMS.Layout.fixed_aspect] === true) {
                width = GuiAPI.scaleByClampedAspect(layout[ENUMS.Layout.width]);
                height = -GuiAPI.scaleByClampedAspect(layout[ENUMS.Layout.height]);
            } else {
                width = GuiAPI.scaleByWidth(layout[ENUMS.Layout.width]);
                height = -GuiAPI.scaleByHeight(layout[ENUMS.Layout.height]) // WorldAPI.sampleInputBuffer(ENUMS.InputState.ASPECT));
            }

            this.xMin = scax - width  * anchorX;
            this.xMax = scax + width  * (1-anchorX);
            this.yMin = scay - height * anchorY;
            this.yMax = scay + height * (1-anchorY);
        };

        GuiCrossLayout.prototype.applyLayoutRules = function(layoutConfig) {

            this.setupAnchorPoint(layoutConfig);
            this.setupLayout(layoutConfig)

        };

        GuiCrossLayout.prototype.parseLaoutConfig = function(layoutConfig) {
            for (var key in layoutConfig) {
                this.layout[key] = this.dynamicLayout[key] || layoutConfig[key];
            }

            this.applyLayoutRules(this.layout);
        };


        GuiCrossLayout.prototype.applyLayoutToEdges = function(top, left, right, bottom, thickness) {


            top.setEdgeXY(   this.xMin-0.4,  this.getCenterY());
            left.setEdgeXY(  this.getCenterX(),  this.yMin);
            right.setEdgeXY( this.getCenterX(),  -0.7) //this.yMax-0.3);
            bottom.setEdgeXY(this.xMax+0.4,  this.getCenterY());


            top.setEdgeWidthAndHeight(this.getLayoutWidth(), thickness);
            left.setEdgeWidthAndHeight(thickness, this.getLayoutHeight());
            right.setEdgeWidthAndHeight(thickness, this.getLayoutHeight());
            bottom.setEdgeWidthAndHeight(this.getLayoutWidth(), thickness)

        };

        GuiCrossLayout.prototype.getLayoutCenter = function(storeVec) {
            storeVec.x = this.getCenterX();
            storeVec.y = this.getCenterY();
            storeVec.z = -1;
        };

        GuiCrossLayout.prototype.setRootPosition = function(posVec) {
            this.position.copy(posVec);
        };

        GuiCrossLayout.prototype.getRootPosition = function() {
            return this.position;
        };

        GuiCrossLayout.prototype.setDynamicLayout = function(key, value) {
            this.dynamicLayout[key] = value;
            this.layout[key] = value;
            //if (this.layout[key]) {
            //    this.parseLaoutConfig(this.layout)
            // }
        };

        GuiCrossLayout.prototype.getCenterX = function() {
            return (this.xMin + this.xMax) / 2;
        };

        GuiCrossLayout.prototype.getCenterY = function() {
            return (this.yMin + this.yMax) / 2;
        };

        GuiCrossLayout.prototype.getLayoutWidth = function() {
            return this.xMax - this.xMin
        };

        GuiCrossLayout.prototype.getLayoutHeight = function() {
            return this.yMax - this.yMin
        };

        GuiCrossLayout.prototype.getLayoutTop = function() {
            return this.yMin
        };

        GuiCrossLayout.prototype.getLayoutLeft = function() {
            return this.xMin
        };

        GuiCrossLayout.prototype.getLayoutRight = function() {
            return this.xMax
        };

        GuiCrossLayout.prototype.getLayoutBottom = function() {
            return this.yMax
        };


        GuiCrossLayout.prototype.isInsideXY = function(x, y) {
            // y flips when moving from screen space to world space (where the geometry resides)

            //      return Math.random() < 0.9 //  x > this.xMin && x < this.xMax && y < this.yMin && y > this.yMax
            return x > this.xMin && x < this.xMax && y < this.yMin && y > this.yMax
        };

        return GuiCrossLayout;

    });