/**
 * @source http://codepen.io/rachsmith/pen/YweZbG
 * @author Phu V. Phan
 * @email phudev95@gmail.com
 * @github https://github.com/phudev95/hpbd-to-me
 */

"use strict";

angular.module('HPBD-TO-ME', [])

    .controller('AppController', function ($scope) {
        $scope.stage = new PIXI.Container();
        $scope.renderer = PIXI.autoDetectRenderer(window.innerWidth - 4, window.innerHeight - 4, {transparent: true});
        $scope._stars = [];
        $scope._glows = [];
        $scope._nextStar = 0;
        $scope._nextGlow = 0;
        $scope.width = 0;
        $scope.height = 0;
        $scope.fontSize = 0;
        $scope.textPixels = 0;
        $scope.yOffset = 0;
        $scope.textures = [
            PIXI.Texture.fromImage("static/images/neon-star.png"),
            PIXI.Texture.fromImage("static/images/neon-star1.png"),
            PIXI.Texture.fromImage("static/images/neon-star2.png"),
            PIXI.Texture.fromImage("static/images/neon-star3.png"),
            PIXI.Texture.fromImage("static/images/neon-star4.png")
        ];
        document.body.appendChild($scope.renderer.view);

        $scope.textCanvas = document.getElementById('canvas-main');
        $scope.textCtx  = $scope.textCanvas.getContext('2d');
        $scope.htmlText = document.getElementById("html-text");
        $scope.text = "I'M FINALLY 21";

        $scope.isReady = false;
        $scope.isPaused = false;
        $scope.audio = document.getElementById('audio');
        $scope.audio.volumn = 0.35;
        $scope.audio.currentTime = 0.35;
        $scope.audio.play();

        $scope.toggleAudio = function () {
            if ($scope.audio.paused) {
                $scope.isPaused = false;
                $scope.audio.play();
            }
            else {
                $scope.isPaused = true;
                $scope.audio.pause();
            }
        };

        /**
         * Helper create Start
         * @param texture
         */
        $scope.createStar = function createStar (texture) {
            var star = new PIXI.Sprite(texture);
            star.width = 5 + Math.random() * 20;
            star.height = 5 + Math.random() * 20;
            star.anchor.x = 0.5;
            star.anchor.y = 0.5;

            $scope.stage.addChild(star);
            star.alpha = 0;
            star.launched = false;
            $scope._stars.push(star);
        };

        /**
         * Helper create Glow
         */
        $scope.createGlow = function () {
            var texture = PIXI.Texture.fromImage('static/images/glow-star.png');
            var glow = new PIXI.Sprite(texture);
            var size = 2 + Math.random() * 14;
            glow.width = size;
            glow.height = size;
            glow.anchor.x = 0.5;
            glow.anchor.y = 0.5;

            $scope.stage.addChild(glow);
            glow.alpha = 0;
            glow.launched = false;
            $scope._glows.push(glow);
        };

        /**
         * Helper launch Star
         */
        $scope.launchStar = function () {
            var star = $scope._stars[$scope._nextStar];

            if ($scope._nextStar == $scope._stars.length - 1)
                $scope._nextStar = 0;
            else
                $scope._nextStar += 1;

            star.launched = true;
            star.alpha = 1;

            var pos = $scope.textPixels[Math.floor(Math.random() * $scope.textPixels.length)];
            star.position.x = pos.x;
            star.position.y = $scope.yOffset + pos.y;

            star.vx = 1 + Math.random() * 1;
            star.vy = -1 + Math.random() * -1;
            star.vr = -0.2 + Math.random() * 0.4;
            star.p = 0;
        };

        /**
         * Helper launch Glow
         */
        $scope.launchGlow = function () {
            var glow = $scope._glows[$scope._nextGlow];

            if ($scope._nextGlow == $scope._glows.length - 1)
                $scope._nextGlow = 0;
            else
                $scope._nextGlow += 1;

            glow.launched = true;
            glow.alpha = 0.1 + Math.random() * 0.2;
            glow.position.x = Math.random() * $scope.width;
            glow.position.y = Math.random() * $scope.height;

            glow.vx = 0.5 + Math.random() * 0.5;
            glow.vy = -0.5 + Math.random() * -0.5;
        };

        /**
         * Helper launch star batch
         */
        $scope.launchStarBatch = function () {
            for (var i = 0; i < 6; i++) {
                $scope.launchStar();
            }
        };

        /**
         * Run app after font loaded
         */
        $scope.exec = function () {
            $scope.$apply(function(){
                for (var q = 0; q < 600; q++) {
                    $scope.createStar($scope.textures[q % 5]);
                }

                for (var w = 0; w < 100; w++) {
                    $scope.createGlow();
                }

                for (var e = 0; e < 100; e++) {
                    setTimeout($scope.launchGlow, 10);
                }

                $scope.isReady = true;
                $scope.resize();
                window.addEventListener('resize', $scope.resize);
                requestAnimationFrame($scope.animate);
            });
        };

        /**
         * Animate
         */
        $scope.animate = function () {
            $scope.launchStarBatch();
            requestAnimationFrame($scope.animate);

            // Moving stars
            for (var i = 0; i < $scope._stars.length; i++) {
                if ($scope._stars[i].launched) {
                    var angle = Math.PI * (1 - $scope._stars[i].p);

                    $scope._stars[i].rotation   += $scope._stars[i].vr;
                    $scope._stars[i].position.x += $scope._stars[i].vx + 0.5 * Math.cos(angle) + $scope._stars[i].vx;
                    $scope._stars[i].position.y += $scope._stars[i].vy + 0.5 * Math.sin(angle) + $scope._stars[i].vy;
                    $scope._stars[i].p          += $scope._stars[i].vr;
                    $scope._stars[i].alpha      -= 0.01;
                }
            }

            // Moving glows
            for (var j = 0; j < $scope._glows.length; j++) {
                if ($scope._glows[j].launched) {
                    $scope._glows[j].position.x += $scope._glows[j].vx;
                    $scope._glows[j].position.y += $scope._glows[j].vy;

                    if ($scope._glows[j].position.y < 0) {
                        $scope._glows[j].position.x = Math.random() * $scope.width;
                        $scope._glows[j].position.y = $scope.height + Math.random() * 50;
                    }

                    if ($scope._glows[j].position.x > $scope.width) {
                        $scope._glows[j].position.x = -Math.random() * 100;
                        $scope._glows[j].position.y = $scope.height * Math.random();
                    }

                }
            }

            // Render the stage
            $scope.renderer.render($scope.stage);
        };

        /**
         * Get matrices
         */
        $scope.sampleCanvas = function  () {
            $scope.textCanvas.style.width = $scope.width + 'px';
            $scope.textCanvas.style.height = $scope.fontSize + 'px';
            $scope.textCanvas.style.marginTop = -($scope.fontSize / 2) + 'px';
            $scope.textCanvas.width = $scope.width;
            $scope.textCanvas.height = $scope.fontSize;
            $scope.textCtx.textAlign = 'center';
            $scope.textCtx.textBaseline = "top";
            $scope.textCtx.font = $scope.fontSize + 'px "Luckiest Guy"';
            $scope.textCtx.fillStyle = '#eee';
            $scope.textCtx.clearRect(0, 0, $scope.width, $scope.fontSize);

            $scope.textCtx.fillText($scope.text, $scope.width / 2, 0);

            var pix = $scope.textCtx.getImageData(0, 0, $scope.width, $scope.fontSize).data;
            $scope.textPixels = [];

            // Get matrix [Red, Green, Blue, Alpha] => x:6 | y:6 => 6:6
            for (var i = pix.length; i >= 0; i -= 4) {
                if (pix[i] != 0) {
                    var x = (i / 4) % $scope.width;
                    var y = Math.floor(Math.floor(i / $scope.width) / 4);

                    if ((x && x % 6 == 0) && (y && y % 6 == 0)) {
                        $scope.textPixels.push({x: x, y: y});
                    }
                }
            }
        };

        /**
         * Change style text when window resize
         */
        $scope.resizeText = function  () {
            $scope.htmlText.style.fontSize  = $scope.fontSize + 'px';
            $scope.htmlText.style.height    = $scope.fontSize + 'px';
            $scope.htmlText.style.marginTop = -($scope.fontSize / 2) + 'px';
        };

        /**
         * Helper resize
         */
        $scope.resize = function () {
            $scope.width = window.innerWidth;
            $scope.height = window.innerHeight;
            $scope.fontSize = $scope.width * 0.14;

            if ($scope.fontSize > 100) {
                $scope.fontSize = 100;
            }

            $scope.yOffset = $scope.height * 0.6 - ($scope.fontSize / 2);
            $scope.renderer.resize($scope.width, $scope.height);
            $scope.resizeText();
            $scope.sampleCanvas();
        };


        // Step 2: Font loaded and begin animate effect
        WebFont.load({
            google: {
                families: ['Luckiest Guy']
            },
            active: $scope.exec
        });
    });