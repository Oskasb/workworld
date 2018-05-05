
"use strict";

define(['worker/physics/AmmoFunctions'],

    function(AmmoFunctions) {

        var AMMO = Ammo;

        var ammoFunctions;

        var bodies = [];

        var world;

        var STATE = {
            ACTIVE : 1,
            ISLAND_SLEEPING : 2,
            WANTS_DEACTIVATION : 3,
            DISABLE_DEACTIVATION : 4,
            DISABLE_SIMULATION : 5
        }

        var status = {
            bodyCount:0
        };

        var AmmoAPI = function(ammoReady) {

            AMMO().then(function(ammo) {
                console.log("Ammo Ready", ammo);
                ammoFunctions = new AmmoFunctions(ammo);
                ammoReady()
            });

        };

        AmmoAPI.prototype.initPhysics = function() {
            world = ammoFunctions.createPhysicalWorld();
        };

        AmmoAPI.prototype.getYGravity = function() {
            return ammoFunctions.getYGravity();
        };

        AmmoAPI.prototype.cleanupPhysics = function(cb) {

            while (bodies.length) {
                this.excludeBody(bodies[0], true)
            }

            world = null;
            ammoFunctions.cleanupPhysicalWorld(cb);
        };

        AmmoAPI.prototype.buildPhysicalTerrain = function(data, size, posx, posz, min_height, max_height) {
            var body = ammoFunctions.createPhysicalTerrain(world, data, size, posx, posz, min_height, max_height);
            bodies.push(body);
            return body;
        };


        AmmoAPI.prototype.setupPhysicalActor = function(actor) {

            if (!world) {

                console.log("No physical world yet..");
                return;
            }

            if (actor.getPhysicsBody()) {
                console.log("Actor already has a body...");
                return actor;
            }

            ammoFunctions.addPhysicalActor(world, actor);
            bodies.push(actor.getPhysicsBody());
            world.addRigidBody(actor.getPhysicsBody());
            return actor;
        };

        AmmoAPI.prototype.includeBody = function(body) {

            if (!world) return;

            if (!body) {
                console.log("Cant add !body", body);
                return;
            }
            if (bodies.indexOf(body) === -1) {
                bodies.push(body);
            }

            ammoFunctions.enableBodySimulation(body);
        };

        AmmoAPI.prototype.disableActorPhysics = function(actor) {
        //    console.log("disableActorPhysics body", actor);
            var body = actor.getPhysicsBody();

            if (!body) {
                console.log("No body", actor, body);
                return;
            }

            var dataKey = actor.physicalPiece.dataKey;
            this.excludeBody(body, dataKey);
        };


        AmmoAPI.prototype.excludeBody = function(body, dataKey) {
            var bi = bodies.indexOf(body);
            bodies.splice(bi, 1);

            if (!body) {
                console.log("No body", bi, body);
                return;
            }

            ammoFunctions.disableBodySimulation(body);
        };


        AmmoAPI.prototype.updatePhysicsSimulation = function(currentTime) {
            ammoFunctions.updatePhysicalWorld(world, currentTime)
        };

        AmmoAPI.prototype.applyForceAndTorqueToBody = function(forceVec3, body, torqueVec) {
            ammoFunctions.forceAndTorqueToBody(forceVec3, body, torqueVec)
        };


        AmmoAPI.prototype.applyForceToActor = function(forceVec3, actor, randomize) {
            ammoFunctions.applyForceToBodyWithMass(forceVec3, actor.getPhysicsBody(), actor.physicalPiece.getPhysicsPieceMass(), randomize)
        };

        AmmoAPI.prototype.triggerPhysicallyRelaxed = function(actor) {
            if (actor.framesAtState > 3) {
                ammoFunctions.relaxBodySimulation(actor.getPhysicsBody());
            }

            //  actor.getPhysicsBody().activate();
        };


        AmmoAPI.prototype.triggerPhysicallyActive = function(actor) {
               return ammoFunctions.enableBodySimulation(actor.getPhysicsBody());
            //  actor.getPhysicsBody().activate();
        };

        AmmoAPI.prototype.isPhysicallyActive = function(actor) {
            return ammoFunctions.getBodyActiveState(actor.getPhysicsBody());
        };

        AmmoAPI.prototype.raycastPhysicsWorld = function(position, direction, hitPositionStore, hitNormalStore) {
            var hit = ammoFunctions.physicsRayRange(world, position, direction, hitPositionStore, hitNormalStore);
            if (hit) {
                return hit.ptr;
            }
        };

        AmmoAPI.prototype.fetchPhysicsStatus = function() {

           status.bodyCount = bodies.length;
            //    this.status.contactCount = this.world.contacts.length;

            return status;
        };

        return AmmoAPI;

    });