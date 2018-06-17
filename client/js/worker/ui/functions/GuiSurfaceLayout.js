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

        var GuiSurfaceLayout = function() {

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

            this.top;
            this.left;
            this.right;
            this.bottom;
            this.thickness;
            this.dirty = true;

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

        GuiSurfaceLayout.prototype.applyLayoutRules = function(layoutConfig) {
            this.setupAnchorPoint(layoutConfig);
            this.setupLayout(layoutConfig)
        };

        var val;
        var update;

        GuiSurfaceLayout.prototype.parseLaoutConfig = function(layoutConfig) {
            update = false;
            for (var key in layoutConfig) {
                val = this.dynamicLayout[key] || layoutConfig[key]
                if (this.layout[key] !== val) {
                    update = true;
                    this.layout[key] = val;
                }
            }

                this.applyLayoutRules(this.layout);
        };

        GuiSurfaceLayout.prototype.applyLayoutToCorners = function(topLeft, topRight, bottomLeft, bottomRight) {
            topLeft.setCornerXY(    this.xMin,  this.yMin);
            topRight.setCornerXY(   this.xMax,  this.yMin);
            bottomLeft.setCornerXY( this.xMin,  this.yMax);
            bottomRight.setCornerXY(this.xMax,  this.yMax);
        };

        GuiSurfaceLayout.prototype.applyLayoutToEdges = function(top, left, right, bottom, thickness) {

            if (this.dirty === false && this.top === top && this.left === left && this.right === right && this.bottom === bottom && this.thickness === thickness) {
                return;
            }

            this.top = top;
            this.left = left;
            this.right = right;
            this.bottom = bottom;
            this.thickness = thickness;
            this.dirty = false;

            top.setEdgeXY(    this.getCenterX(),  this.yMin);
            left.setEdgeXY(   this.xMin,  this.getCenterY());
            right.setEdgeXY(  this.xMax,  this.getCenterY());
            bottom.setEdgeXY( this.getCenterX(),  this.yMax);

            top.setEdgeWidthAndHeight(this.getLayoutWidth(), thickness);
            left.setEdgeWidthAndHeight(this.getLayoutHeight() , thickness);
            right.setEdgeWidthAndHeight(this.getLayoutHeight() , thickness);
            bottom.setEdgeWidthAndHeight(this.getLayoutWidth(), thickness);

            left.setRotation(0, 0, -Math.PI*0.5);
            right.setRotation(0, 0, Math.PI*0.5);
            bottom.setRotation(0, 0, Math.PI);

        };

        GuiSurfaceLayout.prototype.getLayoutCenter = function(storeVec) {
            storeVec.x = this.getCenterX();
            storeVec.y = this.getCenterY();
            storeVec.z = -1;
        };

        GuiSurfaceLayout.prototype.setRootPosition = function(posVec) {

            if (this.position.equals(posVec)) return;

            this.dirty = true;
            this.position.copy(posVec);
        };

        GuiSurfaceLayout.prototype.getRootPosition = function() {
            return this.position;
        };

        GuiSurfaceLayout.prototype.setDynamicLayout = function(key, value) {
            this.dynamicLayout[key] = value;
            this.layout[key] = value;
        };

        GuiSurfaceLayout.prototype.getCenterX = function() {
            return (this.xMin + this.xMax) / 2;
        };

        GuiSurfaceLayout.prototype.getCenterY = function() {
            return (this.yMin + this.yMax) / 2;
        };

        GuiSurfaceLayout.prototype.getLayoutWidth = function() {
            return this.xMax - this.xMin
        };

        GuiSurfaceLayout.prototype.getLayoutHeight = function() {
            return this.yMax - this.yMin
        };

        GuiSurfaceLayout.prototype.getLayoutTop = function() {
            return this.yMin
        };

        GuiSurfaceLayout.prototype.getLayoutLeft = function() {
            return this.xMin
        };

        GuiSurfaceLayout.prototype.getLayoutRight = function() {
            return this.xMax
        };

        GuiSurfaceLayout.prototype.getLayoutBottom = function() {
            return this.yMax
        };

        GuiSurfaceLayout.prototype.isInsideXY = function(x, y) {
            // y flips when moving from screen space to world space (where the geometry resides)
            //      return Math.random() < 0.9 //  x > this.xMin && x < this.xMax && y < this.yMin && y > this.yMax
            return x > this.xMin && x < this.xMax && y < this.yMin && y > this.yMax
        };

        return GuiSurfaceLayout;

    });