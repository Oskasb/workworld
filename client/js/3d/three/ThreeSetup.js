"use strict";



define(['../../ui/GameScreen',
    'PipelineAPI',
    'Events'
], function(
    GameScreen,
    PipelineAPI,
    evt
) {
    
    var scene, camera, renderer;

    var addedObjects = 0;

    var initTime;

    var prerenderCallbacks = [];
    var postrenderCallbacks = [];
    var tpf, lastTime, idle, renderStart, renderEnd;
    var lookAt = new THREE.Vector3();

    var ThreeSetup = function() {

    };

    var postrenderEvt = {};

    function animate(time) {

    }

    var avgTfp = 0;

    ThreeSetup.callPrerender = function(time) {
        requestAnimationFrame( ThreeSetup.callPrerender );

        time = performance.now()  - initTime;
        tpf = (time - lastTime)*0.001;

    //    if (tpf < 0.03) return;


        idle = (performance.now() / 1000) - renderEnd;

        PipelineAPI.setCategoryKeyValue('STATUS', 'TIME_ANIM_IDLE', idle);



        lastTime = time;

        avgTfp = tpf*0.3 + avgTfp*0.7;

        for (var i = 0; i < prerenderCallbacks.length; i++) {
            prerenderCallbacks[i](avgTfp);
        }

        ThreeSetup.callRender(scene, camera);

    };

    ThreeSetup.callRender = function(scn, cam) {
        renderStart = performance.now()/1000;
        renderer.render(scn, cam);
        renderEnd = performance.now()/1000;
        ThreeSetup.callPostrender();
    };

    ThreeSetup.callPostrender = function() {

        PipelineAPI.setCategoryKeyValue('STATUS', 'TIME_ANIM_RENDER', renderEnd - renderStart);
        for (var i = 0; i < postrenderCallbacks.length; i++) {
            postrenderCallbacks[i](avgTfp);
        }
        evt.fire(evt.list().POSTRENDER_TICK, postrenderEvt);
    };


    ThreeSetup.getTotalRenderTime = function() {
        return renderEnd;
    };

    ThreeSetup.initThreeRenderer = function(pxRatio, antialias, containerElement, store) {
        initTime = performance.now();

        lastTime = 0;
        init();
        ThreeSetup.callPrerender(0.1);

        function init() {

            scene = new THREE.Scene();

            camera = new THREE.PerspectiveCamera( 45, containerElement.innerWidth / containerElement.innerHeight, 0.3, 5000 );
            camera.position.z = 10;

         //   console.log("Three Camera:", camera);
            

            // renderer = new THREE.WebGLRenderer( { antialias:antialias, devicePixelRatio: pxRatio });

            renderer = new THREE.WebGLRenderer( { antialias:antialias, devicePixelRatio: pxRatio });

            renderer.setPixelRatio( pxRatio );
                        
            containerElement.appendChild(renderer.domElement);
        }

        store.scene = scene;
        store.camera = camera;
        store.renderer = renderer;
        
        return store;
    };

    ThreeSetup.addPrerenderCallback = function(callback) {
        prerenderCallbacks.push(callback);
    };

    ThreeSetup.addPostrenderCallback = function(callback) {
        postrenderCallbacks.push(callback);
    };

    var vector = new THREE.Vector3();
    var tempObj = new THREE.Object3D();

    ThreeSetup.toScreenPosition = function(vec3, store) {

        tempObj.position.copy(vec3);

        if (!frustum.containsPoint(tempObj.position)) {

            store.x = -1;
            store.y = -1;
            store.z = -100000;

            return store;// Do something with the position...
        }
        
    //    tempObj.updateMatrixWorld();
        tempObj.getWorldPosition(vector)
        vector.project(camera);

        store.x = vector.x * 0.5;
        store.y = vector.y * 0.5;
        store.z = vector.z * -1;

        return store;
    };

    
    var sphere = new THREE.Sphere();
    
    ThreeSetup.cameraTestXYZRadius = function(vec3, radius) {
        sphere.center.copy(vec3);
        sphere.radius = radius;
        return frustum.intersectsSphere(sphere);
    };
    
    ThreeSetup.calcDistanceToCamera = function(vec3) {
        vector.copy(vec3);
        return vector.distanceTo(camera.position);
    };

    var frustum = new THREE.Frustum();
    var frustumMatrix = new THREE.Matrix4();


    ThreeSetup.sampleCameraFrustum = function(store) {

    };

    ThreeSetup.setCameraPosition = function(px, py, pz) {
        camera.position.x = px;
        camera.position.y = py;
        camera.position.z = pz;
    };

    ThreeSetup.setCameraLookAt = function(x, y, z) {
        lookAt.set(x, y, z);
        camera.up.set(0, 1, 0);
        camera.lookAt(lookAt)
    };

    ThreeSetup.updateCameraMatrix = function() {

    //    camera.updateProjectionMatrix();

        camera.updateMatrixWorld(true);

        frustum.setFromMatrix(frustumMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));
        camera.needsUpdate = true;

        for (var i = 0; i < camera.children.length; i++) {
            camera.children[i].updateMatrixWorld(true);
        }

    };


    ThreeSetup.addChildToParent = function(child, parent) {
        if (child.parent) {
            child.parent.remove(child);
        }
        parent.add(child);
    };

    ThreeSetup.addToScene = function(object3d) {
        scene.add(object3d);
        return object3d;
    };

    ThreeSetup.getCamera = function() {
        return camera;
    };

    ThreeSetup.removeModelFromScene = function(model) {
        if (model.parent) {
            model.parent.remove(model);
        }

        scene.remove(model);
    };




    ThreeSetup.setRenderParams = function(width, height, aspect, pxRatio) {
        renderer.setSize( width, height);
        renderer.setPixelRatio( pxRatio );
        camera.aspect = aspect;
        camera.updateProjectionMatrix();
    };

    ThreeSetup.attachPrerenderCallback = function(callback) {
        if (prerenderCallbacks.indexOf(callback) != -1) {
            console.log("Callback already installed");
            return;
        }
        prerenderCallbacks.push(callback);
    };


    ThreeSetup.getSceneChildrenCount = function() {
        return scene.children.length;
    };



    ThreeSetup.getInfoFromRenderer = function(source, key) {
        if (!key) return renderer.info[source];
        return renderer.info[source][key];
    };

    return ThreeSetup;

});