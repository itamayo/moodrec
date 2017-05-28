// ==UserScript==
// @name         MoodRecPlugin
// @namespace    http://moodrec.net
// @version      0.1
// @description  MoodRec for Moodle
// @author       iññigo tamayo <tamaxx@gmail.com>
// @match        http://localhost/moodle/mod/quiz/attempt.php?*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    MoodRec = {};
    MoodRec.backend = "http://localhost:8080";
    setTimeout(function(e){
     var questionId = document.querySelector('.questionflagvalue').id;
     var ids = questionId.match(/\d+/g);
     var atemps = ids[0];
     var id = ids[1];
     console.log(id,atemps);
     setMoodRecQuestion(id);
     },1500);
    function setMoodRecQuestion (id){
         var panel = document.createElement('div');
         panel.style.width ="300px";
         panel.style.height = "150px";
         panel.style.position= "absolute";
         panel.style.background="white";
         panel.style.zIndex = "9999";
         panel.style.top ="5%";
         panel.style.left="80%";
         panel.innerHTML = "<h2> Galdera ID:"+id+"</h2><input id='erantzunZuzena' placeholder='erantzuna zuzena idatzi'>";
         var bidaliB = document.createElement('button');
         bidaliB.innerHTML = "Bidali";
        /* egiteko deia ajax bidez */
        bidaliB.onclick= function (){ document.body.removeChild(this.parentNode);};
        panel.appendChild(bidaliB);
        document.body.appendChild(panel);
    };
    var callBackend = function (url,cb){
     var xmlhttp = new XMLHttpRequest();
     xmlhttp.onreadystatechange = function() {
         console.log(this.readyState,this.status);
         if (this.readyState == 4 && this.status == 200) {
           console.log(this.responseText);
             var myArr = JSON.parse(this.responseText);
             cb(null,myArr);
         }
         else if (this.status == 404 || this.status == 400) cb("Not good response",this.status);
     };
     xmlhttp.open("GET", MoodRec.backend+url, true);
     xmlhttp.send();
   };
})();