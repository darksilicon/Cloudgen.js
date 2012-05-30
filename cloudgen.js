// TODO: Add license.

// Hide the cloudgen scope from the global scope in an anonymous function.
(function() {
    // Constants =============================================================
    // We require this later, so precompute it here.
    var TWO_PI = Math.PI * 2;
    
    // The ratio of circle radius to cloud radius. The circles used to draw
    // the clouds are thus this times the cloud radius.
    var CIRCLE_RADIUS_RATIO = 0.6;
    
    // The spacing as a percentage of cloud radius between clouds in the grid
    // of "drawCloudGroup".
    var CLOUD_GROUP_SPACING = 0.75;
    
    
    
    // Setup cloudgen ========================================================
    // Create our cloudgen object.
    var cloudgen = function() {
    };
    
    
    
    // Public cloudgen Methods ===============================================
    /*  Draws a single cloud to the given canvas context.
        
        context (required)
            The 2D "CanvasRenderingContext2D" instance to draw to.
            
        centreX (optional) Default 0.
            The approximate centre of the cloud in the x-dimension.
            
        centreY (optional) Default 0.
            The approximate centre of the cloud in the y-dimension.
            
        radius (optional) Default 100.
            The radius of the circular area inside which the cloud will be
            generated.
            
        colour (optional) Default {r:255, g:255, b:255}.
            An object of the form {r:0, g:0, b:0} representing the RGB values
            of the cloud colour.
            
        alpha (optional) Default 0.3.
            The transparency of the cloud. Range 0.0 to 1.0.
            
        circles (optional) Default 30.
            Clouds are created by drawing numerous gradient-filled circles;
            the more there are, the thicker the cloud. This is the number to
            draw. */
    cloudgen.drawCloud = function(context, centreX, centreY, radius, colour, alpha, circles) {
        // Set default arguments.
        switch (arguments.length) {
            case 0: return;
            case 1: centreX = 0;
            case 2: centreY = 0;
            case 3: radius = 100;
            case 4: colour = {r:255, g:255, b:255};
            case 5: alpha = 0.3;
            case 6: circles = 30;
        }
        
        // Calcualte the radius of the circles used to draw the cloud.
        var circleRadius = radius * CIRCLE_RADIUS_RATIO;
        
        // Create the circle's radial gradient.
        var gradient = context.createRadialGradient(circleRadius, circleRadius, 0, circleRadius, circleRadius, circleRadius);
        var gradientColour = "rgba(" + colour.r + ", " + colour.g + ", " + colour.b + ", ";
        
        gradient.addColorStop(0, gradientColour + String(alpha) + ")");
        gradient.addColorStop(1, gradientColour + "0)");
        
        // Draw the circle with gradient to a canvas.
        var circleCanvas = document.createElement("canvas");
        var circleCanvasContext = circleCanvas.getContext("2d");
        
        circleCanvas.width = circleRadius * 2;
        circleCanvas.height = circleCanvas.width;
        
        circleCanvasContext.fillStyle = gradient;
        
        circleCanvasContext.beginPath();
        circleCanvasContext.arc(circleRadius, circleRadius, circleRadius, 0, TWO_PI, true);
        circleCanvasContext.fill();
        
        // Draw the specified number of circles.
        for (var i = 0; i < circles; i++) {
            // Compute a randomised circle position within the cloud.
            var angle = Math.random() * TWO_PI;
            var x = centreX - circleRadius + Math.random() * radius * Math.cos(angle);
            var y = centreY - circleRadius + Math.random() * radius * Math.sin(angle);
            
            // Draw the circle.
            context.drawImage(circleCanvas, x, y);
        }
    };
    
    
    /*  Draws a grid of clouds to the given canvas context.
        
        context (required)
            The 2D "CanvasRenderingContext2D" instance to draw to.
        
        grid (required)
            A two-dimensional binary array specifying the location of clouds
            with ones. Note that rows can be different lengths. For example, a
            grid specifying a single diagonal cloud is below.
                [[1],
                 [0, 1],
                 [0, 0, 1]]
        
        topLeftX (optional) Default 0.
            The approximate centre of the top-left cloud centre in the grid in
            the x-dimension.
        
        topLeftY (optional) Default 0.
            The approximate centre of the top-left cloud centre in the grid in
            the y-dimension.
        
        radius: see "drawCloud".
        colour: see "drawCloud".
        alpha: see "drawCloud".
        circles: see "drawCloud". */
    cloudgen.drawCloudGroup = function(context, grid, topLeftX, topLeftY, radius, colour, alpha, circles) {
        // Set default arguments.
        switch (arguments.length) {
            case 0: return;
            case 1: return;
            case 2: topLeftX = 0;
            case 3: topLeftY = 0;
            case 4: radius = 100;
        }
        
        // Get an array of the parameters we need to send on to "drawCloud".
        var parameters = Array.prototype.splice.call(arguments, 4);
        
        // Loop through the cloud grid, row by row.
        for (var i = 0; i < grid.length; i++) {
            for (var j = 0; j < grid[i].length; j++) {
                // If this cell is a 1, we draw a cloud.
                if (grid[i][j] === 1) {
                    // Calculate the cloud centre position.
                    var centreX = topLeftX + j * radius * CLOUD_GROUP_SPACING;
                    var centreY = topLeftY + i * radius * CLOUD_GROUP_SPACING;
                    
                    // Call "drawCloud" with the correct parameters as passed
                    // to this method. Parameters that were not passed will
                    // not be sent.
                    var args = [context, centreX, centreY].concat(parameters);
                    
                    this.drawCloud.apply(this, args);
                }
            }
        }
    };
    
    
    
    // Finalisation ==========================================================
    // Expose cloudgen to the global scope.
    window.cloudgen = cloudgen;
})();
