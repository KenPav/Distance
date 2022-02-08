var Testing = function(processingInstance) {
    with (processingInstance) {
        var canvasSize = 700;
        size(canvasSize,canvasSize); 
        frameRate(30);
        
        // ProgramCodeGoesHere

         var FirstColor = color(0, 0, 0);
         var SecondColor = color(135,10,10);
         var ThirdColor = color(70,50,168);
         var BoxColor = color(255,255,255);
         var SelectBoxColor = color(0,255,200);
         var BackColor = color(180,200,240);
         stroke(FirstColor);
         strokeWeight(2);

         var Lat = 0;
         var Long = 0;
         var Lat1 = 0;
         var Long1 = 0;        
         var Lat2 = 0;
         var Long2 = 0;
         var dist=0;
         var startTrack=0; 

        const areaLat = [];
        const areaLong = [];
        var R = Math.PI/180;

         var msg= "02.08.22 16:00";       

        var getLocation = function() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(savePosition1,displayError,{enableHighAccuracy: true});
            } else { 
                console.log("Geolocation is not supported by this browser.");
            }
        }
        var trackLocation = function() {
            if (navigator.geolocation) {
                startTrack++;
                navigator.geolocation.getCurrentPosition(savePosition2,displayError,{enableHighAccuracy: true});
//                console.log("Lat2, Long2:",Lat2.toFixed(3),Long2.toFixed(3));
                if(Activity===1) {
                    distance();
                }
            } else { 
                console.log("Geolocation is not supported by this browser.");
            }
        }
        function savePosition1(position) {
            console.log("Made it to savePosition1, Activity = ",Activity);
            if(Activity===1) {
                Lat1 = position.coords.latitude;
                Long1 = position.coords.longitude;           
            }
            if(Activity===2) {
                console.log("ready to add lat/long");
                areaLat.push(position.coords.latitude);
                areaLong.push(position.coords.longitude); 
                console.log("here",Count,areaLat[Count].toFixed(3),areaLong[Count].toFixed(3));                      
                Count++;  
            }
        }
        function savePosition2(position) {
            console.log("Made it to savePosition2");
            Lat2 = position.coords.latitude;
            Long2 = position.coords.longitude;           
        }
        function displayError(){
            text("at displayError",600,50);
            msg="at displayError";
        }


//        function distance(Lat1, Long1, Lat2, Long2) {
        function distance() {
            console.log("Made it to distance",Lat1,Long1,Lat2,Long2);
            if ((Lat1 == Lat2) && (Long1 == Long2)) {
                dist=0
                return dist;
            }
            else {
                var radlat1 = Math.PI * Lat1/180;
                var radlat2 = Math.PI * Lat2/180;
                var theta = Long1-Long2;
                var radtheta = Math.PI * theta/180;
                dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
                if (dist > 1) {
                    dist = 1;
                }
                dist = Math.acos(dist);
                dist = dist * 180/Math.PI;
                dist = dist * 60 * 1.1515 * 5280 / 3;
                return dist;
                console.log("Lat1,Long1,Lat2,Long2,dist=",Lat1.toFixed(3),Long1.toFixed(3),Lat2.toFixed(3),Long2.toFixed(3),dist);
            }
        }

        selectActivity = function() {
            background(BackColor);
            fill(BoxColor);
            rect(200,200,300,100);
            rect(200,400,300,100);
            textSize(40);
            textAlign(CENTER);
            fill(FirstColor);
            text("Distance",350,270);
            text("Area",350,470);
        }

        distanceActivity = function() {
//      Distance Calculation            
            background(BackColor);
            fill(BoxColor);
            rect(100,100,200,100);
            rect(200,450,300,100);
            fill(BackColor);
            rect(400,100,200,100);
            textSize(40);
            textAlign(CENTER);
            fill(FirstColor);
            text("Interval: "+startTrack,600,50);
            text("Set Point",200,170);
            text("Current",500,170);
            text("Main Menu",350,520);
            text("Lat  ="+Lat1.toFixed(3),200,250);
            text("Long ="+Long1.toFixed(3),200,300);
            text("Lat  ="+Lat2.toFixed(3),500,250);
            text("Long ="+Long2.toFixed(3),500,300);
            text(dist.toFixed(0)+" Yards",350,350);
            text((dist*3).toFixed(0)+" Feet",350,400);
        }

        areaActivity = function() {
//      Area Calculation
            background(BackColor);
            fill(BoxColor);
            rect(200,100,300,100);
            rect(200,300,300,100);
            rect(200,500,300,100);
            textSize(40);
            textAlign(CENTER);
            fill(FirstColor);
            if (Area===0) {
                text("Set Point #"+(Count+1),350,170);
                text(Lat2.toFixed(3)+", "+Long2.toFixed(3),350,240)
            }
            else {
                text("Start New Area",350,170);    
            }
            text("Calculate Area",350,370);
            if (Area != 0) {
                text("Area: "+sfArea.toFixed(0)+" sq ft, "+acresArea.toFixed(3)+" acres",350,430);
            }
            text("Main Menu",350,570);
        }

        calcArea = function() {

            if (Count > 2) {
                console.log("Here at calcArea",Count,areaLat[Count-1],areaLong[Count-1]);
                areaLat.push(areaLat[0]);
                areaLong.push(areaLong[0]); 
                for (var i = 0; i < Count; i++) {
                    Area = Area + ( R*(areaLong[i+1] - areaLong[i]) * (2 + Math.sin(areaLat[i]*R) + Math.sin(areaLat[i+1]*R)) );
                }
//          Calculate area in square meters
                Area = Area * 6378137 * 6378137/ 2;
//          Calculate area in square feet
                sfArea = Area * 10.763915;
//          Calculate area in acres
                acresArea = sfArea / 43560 ;
                console.log(Area,sfArea,acresArea);

            }


        }


        mouseClicked = function() {

            if(Activity===0 && mouseX>=200 && mouseX<=500 && mouseY>=200 && mouseY<=300) {
                Activity = 1;
            }            

            if(Activity===0 && mouseX>=200 && mouseX<=500 && mouseY>=400 && mouseY<=500) {
                Activity = 2;
                setInterval(trackLocation,1000);
                Count = 0;

            }            

            if(Activity===1 && mouseX>=100 && mouseX<=300 && mouseY>=100 && mouseY<=200) {
                getLocation();
                setInterval(trackLocation,1000);
                startTrack=0;
            }            

            if(Activity===1 && mouseX>=200 && mouseX<=500 && mouseY>=450 && mouseY<=550) {
                Activity = 0;
                clearInterval(trackLocation);
            }            

            if(Activity===2 && Area===0 && mouseX>=200 && mouseX<=500 && mouseY>=100 && mouseY<=200) {
                console.log("Area Test",Area,Count);
                if (Area != 0) {
                    Area=0;
                    areaLat = [];
                    areaLong = [];
                    Count = 0;
                }
                getLocation();
            }            

            if(Activity===2 && mouseX>=200 && mouseX<=500 && mouseY>=300 && mouseY<=400) {
                calcArea();
            }            
            if(Activity===2 && mouseX>=200 && mouseX<=500 && mouseY>=500 && mouseY<=600) {
                Activity = 0;
                clearInterval(trackLocation);
            }            


        }

        var Area=0
        var sfArea = 0;
        var acresArea = 0;
        var Activity = 0;
        var Count=0;
        draw = function() {
            if(Activity === 0) {
                selectActivity();
            }

            if(Activity === 1) {
                distanceActivity();
            }

            if(Activity === 2) {
                areaActivity();
            }




            textSize(25);
            text("Version: "+msg,350,650);


        }




}
};

    // Get the canvas that Processing-js will use
    var canvas = document.getElementById("mycanvas"); 
    // Pass the function sketchProc (defined in myCode.js) to Processing's constructor.
    var processingInstance = new Processing(canvas, Testing); 