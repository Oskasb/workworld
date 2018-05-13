"use strict";

define([

    ],
    function(

    ) {

        var ModuleRenderer = function() {

        };

        ModuleRenderer.prototype.renderGamePieceModules = function(dynamicGamePiece, renderable) {

            if (renderable.isVisible) {
                dynamicGamePiece.applyModuleRenderable(renderable);
            }

        };

        return ModuleRenderer;

    });

