"use strict";


define([

], function(

) {



    var getMaterial = function(model) {
        if (model.material) {
            return model.material.userData.animMat;
        }
        return model.children[0].material.userData.animMat;
    };

    var ThreeFeedbackFunctions = function() {

    };

    var setupMaterial = function(model) {

            var map =  model.children[0].material.map.clone();
            map.version = model.children[0].material.map.version;
            var mat = model.children[0].material.clone();
            model.children[0].material = mat;
            model.children[0].material.map = map;
            model.children[0].material.userData.animMat = mat;
            return mat;

    };

    var applyToTextures = function(material, x, y, cumulative) {

    //    material.polygonOffsetFactor = Math.random();
    //    material.polygonOffsetUnits  = 1;

        material.map.offset.x = x + (material.map.offset.x * cumulative);
        material.map.offset.y = y + (material.map.offset.y * cumulative);
        material.needsUpdate = true;

    };


    ThreeFeedbackFunctions.applyModelTextureTranslation = function(model, x, y, cumulative) {

        x = x || 0;
        y = y || 0;

        if (!model) return;

    //    if (cumulative) console.log(cumulative)
        var mat = getMaterial(model);
        if (!mat) {
            mat = setupMaterial(model);
        //    console.log("create anim material", model);

        }

        applyToTextures(mat, x, y, cumulative);
    };

    return ThreeFeedbackFunctions;

});