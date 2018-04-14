"use strict";

define([
        '3d/three/ThreeSetup',
        '3d/three/ThreeShaderBuilder',
        '3d/three/ThreeModelLoader',
        '3d/three/ThreeTextureMaker',
        '3d/three/ThreeMaterialMaker',
        '3d/three/ThreeFeedbackFunctions',
        '3d/three/ThreeEnvironment',
        '3d/three/ThreeRenderFilter',
        '3d/three/ThreeSpatialFunctions'

],
    function(
        ThreeSetup,
        ThreeShaderBuilder,
        ThreeModelLoader,
        ThreeTextureMaker,
        ThreeMaterialMaker,
        ThreeFeedbackFunctions,
        ThreeEnvironment,
        ThreeRenderFilter,
        ThreeSpatialFunctions
        
    ) {

        var shaderBuilder;
        var glContext;
        var renderer;
        var camera;
        var scene;

        var spatialFunctions;

        var effectCallbacks;

        var renderFilter;

        var ThreeAPI = function() {

        };

        ThreeAPI.initThreeLoaders = function(TAPI) {
            shaderBuilder = new ThreeShaderBuilder();
            spatialFunctions = new ThreeSpatialFunctions();
            renderFilter = new ThreeRenderFilter();
            ThreeModelLoader.loadData();
            ThreeModelLoader.loadTerrainData(TAPI);
            ThreeTextureMaker.loadTextures();
            ThreeMaterialMaker.loadMaterialist();
            ThreeEnvironment.loadEnvironmentData();
        };

        ThreeAPI.initThreeScene = function(containerElement, pxRatio, antialias) {
            var store = {}; 
            store = ThreeSetup.initThreeRenderer(pxRatio, antialias, containerElement, store);
            ThreeEnvironment.initEnvironment(store);
            glContext = store.renderer.context;
            scene = store.scene;
            camera = store.camera;
            renderer = store.renderer;
            shaderBuilder.loadShaderData(glContext);
            ThreeSetup.addPrerenderCallback(ThreeModelLoader.updateActiveMixers);
        };

        ThreeAPI.getTimeElapsed = function() {
            return ThreeSetup.getTotalRenderTime();
        };

        ThreeAPI.getSetup = function() {
            return ThreeSetup;
        };

        ThreeAPI.getContext = function() {
            return glContext;
        };

        ThreeAPI.setEffectCallbacks = function(callbacks) {
            effectCallbacks = callbacks;
        };

        ThreeAPI.getEffectCallbacks = function() {
            return effectCallbacks;
        };

        ThreeAPI.getSpatialFunctions = function() {
            return spatialFunctions;
        };

        ThreeAPI.readEnvironmentUniform = function(worldProperty, key) {
            return ThreeEnvironment.readDynamicValue(worldProperty, key);
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
            ThreeSetup.toScreenPosition(vec3, store);
        };

        ThreeAPI.checkVolumeObjectVisible = function(vec3, radius) {
            return ThreeSetup.cameraTestXYZRadius(vec3, radius);
        };


        ThreeAPI.distanceToCamera = function(vec3) {
            return ThreeSetup.calcDistanceToCamera(vec3);
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
            ThreeSetup.addToScene(threeObject);
        };

        ThreeAPI.createRootObject = function() {
            return ThreeModelLoader.createObject3D();
        };

        ThreeAPI.removeChildrenFrom = function(object) {
            while (object.children.length) {
                ThreeAPI.removeModel(object.children.pop());
            }
        };

        ThreeAPI.loadMeshModel = function(modelId, rootObject, partsReady) {
            return ThreeModelLoader.loadThreeMeshModel(modelId, rootObject, ThreeSetup, partsReady);
        };

        ThreeAPI.attachInstancedModel = function(modelId, rootObject) {
            return ThreeModelLoader.attachInstancedModelTo3DObject(modelId, rootObject, ThreeSetup);
        };



        ThreeAPI.loadModel = function(sx, sy, sz, partsReady) {
            return ThreeModelLoader.loadThreeModel(sx, sy, sz, partsReady);
        };

        ThreeAPI.loadDebugBox = function(sx, sy, sz, colorName) {
            return ThreeModelLoader.loadThreeDebugBox(sx, sy, sz, colorName);
        };
        
        ThreeAPI.loadQuad = function(sx, sy) {
            var model = ThreeModelLoader.loadThreeQuad(sx, sy);
            return ThreeSetup.addToScene(model);
        };

        ThreeAPI.loadGround = function(applies, array1d, rootObject, partsReady) {
            return ThreeModelLoader.loadGroundMesh(applies, array1d, rootObject, ThreeSetup, partsReady);
        };

        ThreeAPI.removeTerrainByPosition = function(pos) {
            return ThreeModelLoader.removeGroundMesh(pos);
        };


        ThreeAPI.addChildToObject3D = function(child, parent) {
            ThreeSetup.addChildToParent(child, parent);
        };

        ThreeAPI.animateModelTexture = function(model, z, y, cumulative) {
            ThreeFeedbackFunctions.applyModelTextureTranslation(model, z, y, cumulative)
        };
        
        ThreeAPI.setObjectVisibility = function(object3d, bool) {
            object3d.visible = bool;
        };

        ThreeAPI.showModel = function(obj3d) {
            ThreeSetup.addToScene(obj3d);
        };

        ThreeAPI.hideModel = function(obj3d) {
            ThreeSetup.removeModelFromScene(obj3d);
        };
        
        ThreeAPI.removeModel = function(model) {

//            ThreeSetup.removeModelFromScene(model);
            ThreeModelLoader.returnModelToPool(model);
        };

        ThreeAPI.disposeModel = function(model) {

            ThreeSetup.removeModelFromScene(model);
            ThreeModelLoader.disposeHierarchy(model);
        };
        
        ThreeAPI.countAddedSceneModels = function() {
            return ThreeSetup.getSceneChildrenCount();
        };

        ThreeAPI.sampleRenderInfo = function(source, key) {
            return ThreeSetup.getInfoFromRenderer(source, key);
        };

        ThreeAPI.countPooledModels = function() {
            return ThreeModelLoader.getPooledModelCount();
        };

        return ThreeAPI;
    });

