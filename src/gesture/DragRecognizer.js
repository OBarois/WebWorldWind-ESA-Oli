/*
 * Copyright 2003-2006, 2009, 2017, United States Government, as represented by the Administrator of the
 * National Aeronautics and Space Administration. All rights reserved.
 *
 * The NASAWorldWind/WebWorldWind platform is licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @exports DragRecognizer
 */
define(['../gesture/GestureRecognizer'],
    function (GestureRecognizer) {
        "use strict";

        /**
         * Constructs a mouse drag gesture recognizer.
         * @alias DragRecognizer
         * @constructor
         * @augments GestureRecognizer
         * @classdesc A concrete gesture recognizer subclass that looks for mouse drag gestures.
         * @param {EventTarget} target The document element this gesture recognizer observes for mouse and touch events.
         * @param {Function} callback An optional function to call when this gesture is recognized. If non-null, the
         * function is called when this gesture is recognized, and is passed a single argument: this gesture recognizer,
         * e.g., <code>gestureCallback(recognizer)</code>.
         * @throws {ArgumentError} If the specified target is null or undefined.
         */
        var DragRecognizer = function (target, callback) {
            GestureRecognizer.call(this, target, callback);

            /**
             *
             * @type {Number}
             */
            this.button = 0;

            /**
             *
             * @type {Number}
             */
             this.numberOfClicks = 1;

            // Intentionally not documented.
            this.clickOrTapCounter = 0;

            // Intentionally not documented.
            this.maxClickDuration = 500;

            // Intentionally not documented.
            this.maxClickInterval = 400;

            // Intentionally not documented.
            this.interpretDistance = 5;

            // Intentionally not documented.
            this.timeout = null;

            this.name = "";

        };

        DragRecognizer.prototype = Object.create(GestureRecognizer.prototype);

        // Documented in superclass.
        DragRecognizer.prototype.reset = function () {
            GestureRecognizer.prototype.reset.call(this);
            this.clickOrTapCounter = 0;
            this.cancelFailAfterDelay();
        };


        // Documented in superclass.
        DragRecognizer.prototype.mouseMove = function (event) {
            if (this.state == WorldWind.POSSIBLE) {
                if (this.shouldInterpret()) {
                    if (this.shouldRecognize()) {
                        this.translationX = 0; // set translation to zero when the drag begins
                        this.translationY = 0;
                        this.state = WorldWind.BEGAN;
                        this.cancelFailAfterDelay();
                    } else {
                        this.state = WorldWind.FAILED;
                    }
                }
            } else if (this.state == WorldWind.BEGAN || this.state == WorldWind.CHANGED) {
                this.state = WorldWind.CHANGED;
            }
        };

        // Documented in superclass.
        DragRecognizer.prototype.mouseUp = function (event) {
            if(this.clickOrTapCounter == this.numberOfClicks) {
                if (this.mouseButtonMask == 0) { // last button up
                    if (this.state == WorldWind.POSSIBLE) {
                        this.state = WorldWind.FAILED;
    
                    } else if (this.state == WorldWind.BEGAN || this.state == WorldWind.CHANGED) {
                        this.state = WorldWind.ENDED;
                    }
                }
    
            } else {
                this.failAfterDelay(this.maxClickInterval); // fail if the interval between clicks is too long
            }
        };

        DragRecognizer.prototype.mouseDown = function (event) {
            if (this.state == WorldWind.POSSIBLE) {
                this.clickOrTapCounter += 1;
                if(this.clickOrTapCounter != this.numberOfClicks) {
                    this.failAfterDelay(this.maxClickInterval); // fail if the interval between clicks is too long
                }
                else {
                    this.cancelFailAfterDelay()
                }
            }
        };

        // Documented in superclass.
        DragRecognizer.prototype.touchStart = function (touch) {
            if (this.state == WorldWind.POSSIBLE) {
                this.state = WorldWind.FAILED; // touch gestures fail upon receiving a mouse event
            }
        };

        /**
         *
         * @returns {Boolean}
         * @protected
         */
        DragRecognizer.prototype.shouldInterpret = function () {
            var dx = this.translationX,
                dy = this.translationY,
                distance = Math.sqrt(dx * dx + dy * dy);
                // console.log(this.name+":"+this.clickOrTapCounter+"/"+this.numberOfClicks+"  "+(this.clickOrTapCounter === this.numberOfClicks)+" Dist: "+distance+"/"+this.interpretDistance )
                return (distance > this.interpretDistance && this.clickOrTapCounter === this.numberOfClicks) ; // interpret mouse movement when the cursor moves far enough
        };

        /**
         *
         * @returns {Boolean}
         * @protected
         */
        DragRecognizer.prototype.shouldRecognize = function () {
            var buttonBit = (1 << this.button);
            return buttonBit == this.mouseButtonMask; // true when the specified button is the only button down
        };

        // Intentionally not documented.
        DragRecognizer.prototype.failAfterDelay = function (delay) {
            var self = this;
            if (self.timeout) {
                window.clearTimeout(self.timeout);
            }

            self.timeout = window.setTimeout(function () {
                self.timeout = null;
                console.log(self.name+" ending (state: "+self.state)
                self.state = WorldWind.FAILED; // fail if we haven't already reached a terminal state
                
                if (self.state == WorldWind.POSSIBLE) {
                    self.state = WorldWind.FAILED; // fail if we haven't already reached a terminal state
                }
            }, delay);
        };

        // Intentionally not documented.
        DragRecognizer.prototype.cancelFailAfterDelay = function () {
            var self = this;
            if (self.timeout) {
                window.clearTimeout(self.timeout);
                self.timeout = null;
            }
        };

        return DragRecognizer;
    });
