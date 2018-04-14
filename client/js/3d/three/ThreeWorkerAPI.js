"use strict";

define([


],
    function(

    ) {

        var effectCallbacks = {};

        var scene;

        var ThreeAPI = function() {

        };

        ThreeAPI.initThreeLoaders = function(TAPI) {

        };

        ThreeAPI.initThreeScene = function() {
            scene = new THREE.Scene();
        };

        ThreeAPI.getContext = function() {
            return glContext;
        };

        ThreeAPI.readEnvironmentUniform = function(worldProperty, key) {
            return ThreeEnvironment.readDynamicValue(worldProperty, key);
        };

        ThreeAPI.setEffectCallbacks = function(callbacks) {
            effectCallbacks = callbacks;
        };

        ThreeAPI.getEffectCallbacks = function() {
            return effectCallbacks;
        };

        ThreeAPI.getEnvironment = function() {
            return ThreeEnvironment;
        };

        ThreeAPI.getModelLoader = function() {
            return ThreeModelLoader;
        };

        ThreeAPI.getCamera = function() {
            return camera;
        };

        ThreeAPI.getScene = function() {
            return scene;
        };

        ThreeAPI.getRenderer = function() {
            return renderer;
        };

        

        ThreeAPI.plantVegetationAt = function(pos, normalStore) {
            return ThreeModelLoader.terrainVegetationAt(pos, normalStore);
        };
        
        ThreeAPI.setYbyTerrainHeightAt = function(pos, normalStore) {
            return ThreeModelLoader.getHeightFromTerrainAt(pos, normalStore);
        };
        
        ThreeAPI.updateWindowParameters = function(width, height, aspect, pxRatio) {
            ThreeSetup.setRenderParams(width, height, aspect, pxRatio);
        };

        ThreeAPI.registerUpdateCallback = function(callback) {
            ThreeSetup.attachPrerenderCallback(callback);
        };

        ThreeAPI.sampleFrustum = function(store) {
            ThreeSetup.sampleCameraFrustum(store);
        };

        ThreeAPI.addAmbientLight = function() {
           
        };
        
        ThreeAPI.setCameraPos = function(x, y, z) {
            ThreeSetup.setCameraPosition(x, y, z);
        };

        ThreeAPI.cameraLookAt = function(x, y, z) {
            ThreeSetup.setCameraLookAt(x, y, z);
            ThreeSetup.updateCameraMatrix();
        };

        ThreeAPI.updateCamera = function() {
            ThreeSetup.updateCameraMatrix();
        };

        ThreeAPI.toScreenPosition = function(vec3, store) {
        //    ThreeSetup.toScreenPosition(vec3, store);
        };

        ThreeAPI.checkVolumeObjectVisible = function(vec3, radius) {
        //    return ThreeSetup.cameraTestXYZRadius(vec3, radius);
        };


        ThreeAPI.distanceToCamera = function(vec3) {
        //    return ThreeSetup.calcDistanceToCamera(vec3);
        };        
        
        ThreeAPI.newCanvasTexture = function(canvas) {
            return ThreeTextureMaker.createCanvasTexture(canvas);
        };

        ThreeAPI.buildCanvasHudMaterial = function(canvasTexture) {
            return ThreeMaterialMaker.createCanvasHudMaterial(canvasTexture);
        };

        ThreeAPI.buildCanvasMaterial = function(canvasTexture) {
            return ThreeMaterialMaker.createCanvasMaterial(canvasTexture);
        };
        
        ThreeAPI.buildCanvasObject = function(model, canvas, store) {
            var tx = ThreeAPI.newCanvasTexture(canvas);
            var mat = ThreeMaterialMaker.createCanvasHudMaterial(tx);
            ThreeModelLoader.applyMaterialToMesh(mat, model);
            store.texture = tx;
            store.materia = mat;
            return store;
        };

        ThreeAPI.attachObjectToCamera = function(object) {
            ThreeSetup.addToScene(ThreeSetup.getCamera());
            ThreeSetup.addChildToParent(object, ThreeSetup.getCamera());
        };

        ThreeAPI.applySpatialToModel = function(spatial, model) {
            if (!model) return;
            ThreeAPI.transformModel(model, spatial.posX(), spatial.posY(), spatial.posZ(), spatial.pitch(), spatial.yaw(), spatial.roll())
        };



        ThreeAPI.transformModel = function(model, px, py, pz, rx, ry, rz) {
            model.position.set(px, py, pz);
            model.rotation.set(rx, ry, rz, 'ZYX');
        };

        ThreeAPI.addToScene = function(threeObject) {
            scene.add(threeObject);
        };

        ThreeAPI.removeFromScene = function(threeObject) {
            scene.remove(threeObject);
        };

        ThreeAPI.createRootObject = function() {
            return new THREE.Object3D();
        };

        ThreeAPI.loadMeshModel = function(modelId, rootObject, partsReady) {
            rootObject.add(ThreeAPI.createRootObject());
            return rootObject;
        };

        ThreeAPI.attachInstancedModel = function(modelId, rootObject) {

        };


        ThreeAPI.loadModel = function(sx, sy, sz, partsReady) {

        };

        ThreeAPI.loadDebugBox = function(sx, sy, sz, colorName) {

        };
        
        ThreeAPI.loadQuad = function(sx, sy) {

        };

        ThreeAPI.loadGround = function(applies, array1d, rootObject, partsReady) {

        };
        

        ThreeAPI.addChildToObject3D = function(child, parent) {
            if (child.parent) {
                child.parent.remove(child);
            }
            parent.add(child);
        };

        ThreeAPI.animateModelTexture = function(model, z, y) {

        };
        
        ThreeAPI.setObjectVisibility = function(object3d, bool) {
            object3d.visible = bool;
        };

        ThreeAPI.showModel = function(obj3d) {

        };

        ThreeAPI.hideModel = function(obj3d) {

        };
        
        ThreeAPI.removeModel = function(model) {

        };

        ThreeAPI.disposeModel = function(model) {

        };
        
        ThreeAPI.countAddedSceneModels = function() {

        };

        ThreeAPI.sampleRenderInfo = function(source, key) {

        };

        ThreeAPI.countPooledModels = function() {

        };

        return ThreeAPI;
    });

