"use strict";

define([
        'ConfigObject',
        'ui/elements/EffectList'
    ],
    function(
        ConfigObject,
        EffectList
    ) {

        var tempVec1 = new THREE.Vector3();
        var tempQuat = new THREE.Quaternion();

        var DynamicFeedback = function() {
            this.pos = null;
            this.quat = null;
            this.wasVisible = false;
            this.forceFeedback = new EffectList();
            this.torqueFeedback = new EffectList();
            this.velocityFeedback = new EffectList();
            this.angularVelocityFeedback = new EffectList();
        };


        DynamicFeedback.prototype.configRead = function(dataKey) {
            return this.configObject.getConfigByDataKey(dataKey)
        };

        DynamicFeedback.prototype.initDynamicFeedback = function(feedbackId, onReady) {

            var configLoaded = function() {
                onReady(this);
            }.bind(this);

            this.configObject = new ConfigObject('GEOMETRY', 'DYNAMIC_FEEDBACK', feedbackId);
            this.configObject.addCallback(configLoaded);

        };

        DynamicFeedback.prototype.inheritPosVector = function(vec3) {
            this.pos = vec3;
        };

        DynamicFeedback.prototype.inheritQuaternion = function(quat) {
            this.quat = quat;
        };

        DynamicFeedback.prototype.visualiseDynamicVector = function(dynaicSpatial, vidx, effectList, effectIds) {

            if (dynaicSpatial.testVectorByFirstIndex(vidx) > 0.01) {

                dynaicSpatial.getVectorByFirstIndex(vidx, tempVec1);
            //    tempVec1.multiplyScalar(1/dynaicSpatial.getSpatialBodyMass());
                if (effectList.effectCount()) {
                    effectList.setEffectListPosition(this.pos);
                //    effectList.setEffectListQuaternion(this.quat);
                } else {
                    effectList.enableEffectList(effectIds, this.pos, null, dynaicSpatial.testVectorByFirstIndex(ENUMS.BufferSpatial.SCALE_X)/3)
                }
                effectList.setEffectListVelocity(tempVec1);
            } else {
                effectList.disableEffectList();
            }
        };

        DynamicFeedback.prototype.tickDynamicFeedback = function(dynaicSpatial, isVisible) {

            if (isVisible) {
                this.visualiseDynamicVector(dynaicSpatial, ENUMS.BufferSpatial.ACCELERATION_X,      this.forceFeedback,             this.configRead('force_feedback'));
                this.visualiseDynamicVector(dynaicSpatial, ENUMS.BufferSpatial.ANGULAR_ACCEL_X,     this.torqueFeedback,            this.configRead('torque_feedback'));
                this.visualiseDynamicVector(dynaicSpatial, ENUMS.BufferSpatial.VELOCITY_X,          this.velocityFeedback,          this.configRead('velocity_feedback'));
                this.visualiseDynamicVector(dynaicSpatial, ENUMS.BufferSpatial.ANGULAR_VEL_X,       this.angularVelocityFeedback,   this.configRead('angular_velocity_feedback'))
            } else if (this.wasVisible !== isVisible) {
                this.forceFeedback.disableEffectList();
                this.torqueFeedback.disableEffectList();
                this.velocityFeedback.disableEffectList();
                this.angularVelocityFeedback.disableEffectList()
            }

            this.wasVisible = isVisible;
        };

        return DynamicFeedback;

    });

