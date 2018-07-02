"use strict";


define([
    'Events',
    '3d/SimpleSpatial',
    'PipelineAPI',
    'ThreeAPI',
    '3d/CanvasMain'

], function(
    evt,
    SimpleSpatial,
    PipelineAPI,
    ThreeAPI,
    CanvasMain
) {

    var i;
    var spatials = [];
    var msg;

    var camPos;
    var camQuat;
    var inverseQuat = new THREE.Quaternion();

    var calcPos = new THREE.Vector3();
    var calcQuat = new THREE.Quaternion();
    var calcObj = new THREE.Object3D();

    var addSimpleSpatial = function(ss) {
        spatials.push(ss);
    };

    var DynamicMain = function() {

        this.canvasMain = new CanvasMain();

        var standardGeo = function(e) {
            msg = evt.args(e).msg;
            console.log("Handle DYNAMIC_MODEL, STANDARD_GEOMETRY", msg);
            var simpSpat = new SimpleSpatial(msg[0], msg[1], msg[3], msg[4]);


            var modelReady = function(sSpat, boneConf) {
                console.log("SimpleSpatial ready: ", boneConf, sSpat);
                PipelineAPI.setCategoryKeyValue('DYNAMIC_BONES', sSpat.modelId, boneConf);
                ThreeAPI.addToScene(sSpat.obj3d);
                //       ThreeAPI.attachObjectToCamera(sSpat.obj3d);
                sSpat.dynamicSpatial.setupMechanicalShape(msg[2]);
                WorkerAPI.registerMainDynamicSpatial(sSpat.getDynamicSpatial());
            };

            ThreeAPI.loadMeshModel(simpSpat.modelId, simpSpat.obj3d);
            simpSpat.setReady(modelReady);
            addSimpleSpatial(simpSpat)

        };

        evt.on(evt.list().DYNAMIC_MODEL, standardGeo);
    };


    var pos;
    var quat;
    var obj3d;

    DynamicMain.prototype.tickDynamicMain = function() {

/*
        camPos = ThreeAPI.getCamera().position;
        camQuat = ThreeAPI.getCamera().quaternion;
        calcObj.quaternion.copy(camQuat);

        calcQuat.x = camQuat.x;
        calcQuat.y = camQuat.y;
        calcQuat.z = camQuat.z;
        calcQuat.w = camQuat.w;

        calcQuat.conjugate();

        calcPos.x = camPos.x;
        calcPos.y = camPos.y;
        calcPos.z = camPos.z;

        calcPos.applyQuaternion(calcQuat);
*/
    //  inverseQuat.conjugate();

        for (i = 0; i < spatials.length; i++) {

            spatials[i].updateSimpleSpatial();

            obj3d = spatials[i].obj3d;
            pos = spatials[i].pos;
            quat = spatials[i].quat;

            obj3d.position.copy(pos);
            obj3d.quaternion.copy(quat)

            /*
        //    calcPos.copy(pos);
        //    calcPos.sub(camPos);

            pos.applyQuaternion(calcQuat);

            obj3d.position.x = pos.x;
            obj3d.position.y = pos.y;
            obj3d.position.z = pos.z;
        //    obj3d.quaternion.copy(camQuat);
            obj3d.position.x -= calcPos.x;
            obj3d.position.y -= calcPos.y;
            obj3d.position.z -= calcPos.z;
        //    inverseQuat.copy(spatials[i].quat);
        //    inverseQuat.conjugate();
        //    spatials[i].obj3d.quaternion.multiply(inverseQuat);

            obj3d.quaternion.copy(calcQuat);
            //    inverseQuat.copy(spatials[i].quat);
            //    inverseQuat.conjugate();
            //    quat.conjugate();
            obj3d.quaternion.multiply(quat);
            */
        }

        this.canvasMain.updateCanvasMain(spatials)

    };


    return DynamicMain;

});