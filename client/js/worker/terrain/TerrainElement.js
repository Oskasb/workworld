"use strict";

define([
        'EffectsAPI',
        'worker/geometry/GeometryInstance'
    ],
    function(
        EffectsAPI,
        GeometryInstance
    ) {

        var tmpVec = new THREE.Vector3();
        var tmpVec2 = new THREE.Vector3();
        var tmpObj3D = new THREE.Object3D();
        var fxArg = {effect:"firey_explosion_core", pos:tmpVec, vel:tmpVec2};

        var TerrainElement = function(pos, normal) {

            this.isVisible = false;
            this.object3d = new THREE.Object3D();
            this.object3d.position.copy(pos);
            this.normal = new THREE.Vector3().copy(normal);

            this.object3d.lookAt(this.normal);

            this.effects = [];

        };

        TerrainElement.prototype.visualizeTerrainElement = function(fxId) {
            this.fxId = fxId;
            this.geometryInstance = new GeometryInstance(fxId);
            this.geometryInstance.setInstancePosition(this.object3d.position);
            this.geometryInstance.setInstanceQuaternion(this.object3d.quaternion);
            this.geometryInstance.setInstanceSize(2*(Math.random()+0.5) * Math.random());
        };

        TerrainElement.prototype.triggerTerrainFeatureEffect = function(fxId, tpf) {
            this.fxId = fxId;

            if (this.effects.length) {
            //    if (Math.random() < tpf*this.effects.length * 2) {
                    EffectsAPI.returnPassiveEffect(this.effects.pop())
            //    }
            }

            if (true) {

                fxArg.effect = "water_foam_particle_effect";

            //    this.normal.x = (Math.random()-0.5) * 5;
            //    this.normal.z = (Math.random()-0.5) * 5;
            //    this.normal.y = 0;

            //    this.effects.unshift(EffectsAPI.requestPassiveEffect(this.fxId, this.object3d.position, this.normal, null, this.object3d.quaternion))
            //    EffectsAPI.requestTemporaryPassiveEffect(this.fxId, this.object3d.position, this.normal, null, this.object3d.quaternion, 10)

            //    fxArg.effect = this.fxId;
                fxArg.pos.copy(this.object3d.position);
            //    fxArg.vel.copy(this.normal);

            //    fxArg.vel.normalize();

                fxArg.vel.x = 0;
                fxArg.vel.y = 0;
                fxArg.vel.z = 1;

            //    fxArg.vel.applyQuaternion(this.object3d.quaternion);

                fxArg.vel.x = 0;
                fxArg.vel.y = 1;
                fxArg.vel.z = 0;

                tmpObj3D.lookAt(fxArg.vel);
                tmpObj3D.rotateZ(Math.random()*Math.PI);

                fxArg.vel.copy(this.normal);

                    fxArg.vel.y = 0;
                    fxArg.vel.normalize();

                this.effects.unshift(EffectsAPI.requestPassiveEffect(this.fxId, this.object3d.position, fxArg.vel, null, tmpObj3D.quaternion))

                // EffectsAPI.requestTemporaryPassiveEffect(fxArg.effect, fxArg.pos, fxArg.vel, 10, this.object3d.quaternion, 3);

                //      evt.fire(evt.list().GAME_EFFECT, fxArg);
            }

        };


        TerrainElement.prototype.updateTerrainElement = function(tpf) {

            this.isVisible = this.geometryInstance.testIsVisible();

            if (this.isVisible) {
                this.geometryInstance.renderGeometryInstance();
            } else {
                this.geometryInstance.hideGeometryInstance();
            }

        };

        return TerrainElement;

    });

