"use strict";



define([
], function(
) {

    var scene, camera, renderer;

    var addedObjects = 0;

    var initTime;

    var prerenderCallbacks = [];
    var postrenderCallbacks = [];
    var tpf, lastTime, idle, renderStart, renderEnd;
    var lookAt = new THREE.Vector3();

    var cameraForward = new THREE.Vector3();

    var WorldCamera = function() {
        camera = new THREE.PerspectiveCamera( 45, 1, 0.3, 50000 );
        camera.position.set(0, 10, -50)
    };

    var vector = new THREE.Vector3();
    var tempObj = new THREE.Object3D();

    WorldCamera.prototype.cameraFrustumContainsPoint = function(vec3) {
        return frustum.containsPoint(vec3)
    };



    WorldCamera.prototype.toScreenPosition = function(vec3, store) {

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


    WorldCamera.prototype.testBoxVisible = function(box) {
        return frustum.intersectsBox(box)
    };

    var isVisible;

    WorldCamera.prototype.testPosRadiusVisible = function(pos, radius) {


        var distance = pos.distanceTo(camera.position);

        if (distance < radius) {
            return true;
        }


        if (distance > 150 + Math.sqrt(radius + 150) + 40 * radius * radius) {
            return false;
        }

        vector.subVectors(camera.position, pos);
        vector.normalize();


        var dot = vector.dot(cameraForward);

        if (dot < 0.7-(radius*0.5/distance)) {
            return false;
        }

        return true;

        isVisible = this.cameraFrustumContainsPoint(pos);

        if (!isVisible) {
            isVisible = this.cameraTestXYZRadius(pos, radius);
        }

        return isVisible;
    };

    var sphere = new THREE.Sphere();

    WorldCamera.prototype.cameraTestXYZRadius = function(vec3, radius) {
        sphere.center.copy(vec3);
        sphere.radius = radius;
        return frustum.intersectsSphere(sphere);
    };

    WorldCamera.prototype.calcDistanceToCamera = function(vec3) {
        vector.copy(vec3);
        return vector.distanceTo(camera.position);
    };

    var frustum = new THREE.Frustum();
    var frustumMatrix = new THREE.Matrix4();

    WorldCamera.prototype.setCameraPosition = function(px, py, pz) {
        camera.position.x = px;
        camera.position.y = py;
        camera.position.z = pz;
    };

    WorldCamera.prototype.getCameraLookAt = function() {
        return lookAt;
    };

    WorldCamera.prototype.setLookAtVec = function(vec) {
        lookAt.copy(vec);
    };

    WorldCamera.prototype.updateCameraLookAt = function() {
        camera.lookAt(lookAt)
    };

    WorldCamera.prototype.setCameraLookAt = function(x, y, z) {
        lookAt.set(x, y, z);
        camera.up.set(0, 1, 0);
        camera.lookAt(lookAt)
    };

    WorldCamera.prototype.updateCameraMatrix = function() {

        camera.updateMatrixWorld(true);

        cameraForward.set(0, 0, 1);
        cameraForward.applyQuaternion(camera.quaternion);

        camera.updateProjectionMatrix();

        frustum.setFromMatrix(frustumMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));
    //    camera.needsUpdate = true;

        for (var i = 0; i < camera.children.length; i++) {
            camera.children[i].updateMatrixWorld(true);
        }

    };

    WorldCamera.prototype.getCamera = function() {
        return camera;
    };

    WorldCamera.prototype.relayCamera = function(comBuffer) {

        comBuffer[ENUMS.BufferChannels.CAM_POS_X]      = camera.position.x;
        comBuffer[ENUMS.BufferChannels.CAM_POS_Y]      = camera.position.y;
        comBuffer[ENUMS.BufferChannels.CAM_POS_Z]      = camera.position.z;
        comBuffer[ENUMS.BufferChannels.CAM_QUAT_X]     = camera.quaternion.x;
        comBuffer[ENUMS.BufferChannels.CAM_QUAT_Y]     = camera.quaternion.y;
        comBuffer[ENUMS.BufferChannels.CAM_QUAT_Z]     = camera.quaternion.z;
        comBuffer[ENUMS.BufferChannels.CAM_QUAT_W]     = camera.quaternion.w;
        comBuffer[ENUMS.BufferChannels.CAM_FOV]        = camera.fov;
        comBuffer[ENUMS.BufferChannels.CAM_NEAR]       = camera.near;
        comBuffer[ENUMS.BufferChannels.CAM_FAR]        = camera.far;
        comBuffer[ENUMS.BufferChannels.CAM_ASPECT]     = camera.aspect;

    };

    WorldCamera.prototype.applyCameraComBuffer = function(comBuffer) {
        camera.position.x   = comBuffer[ENUMS.BufferChannels.CAM_POS_X] ;
        camera.position.y   = comBuffer[ENUMS.BufferChannels.CAM_POS_Y] ;
        camera.position.z   = comBuffer[ENUMS.BufferChannels.CAM_POS_Z] ;
        camera.quaternion.x = comBuffer[ENUMS.BufferChannels.CAM_QUAT_X];
        camera.quaternion.y = comBuffer[ENUMS.BufferChannels.CAM_QUAT_Y];
        camera.quaternion.z = comBuffer[ENUMS.BufferChannels.CAM_QUAT_Z];
        camera.quaternion.w = comBuffer[ENUMS.BufferChannels.CAM_QUAT_W];
        camera.fov          = comBuffer[ENUMS.BufferChannels.CAM_FOV]   ;
        camera.near         = comBuffer[ENUMS.BufferChannels.CAM_NEAR]  ;
        camera.far          = comBuffer[ENUMS.BufferChannels.CAM_FAR]   ;
        camera.aspect       = comBuffer[ENUMS.BufferChannels.CAM_ASPECT];
        this.updateCameraMatrix();
    };

    return WorldCamera;

});