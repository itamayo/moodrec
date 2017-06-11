// ==UserScript==
// @name         MoodRecPlugin
// @namespace    http://moodrec.net
// @version      0.1
// @description  MoodRec for Moodle
// @author       iñigo tamayo <tamaxx@gmail.com>
// @match        http://localhost/moodle/mod/quiz/attempt.php?*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    window.MoodRec = {};
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
         var title = document.createElement('div');
         title.style.height="30px";
         title.style.background="#444";
         title.style.color="white";
         title.style.textAlign="center";
         title.style.padding="5px";
         title.innerHTML ="MoodRec: Admin";
         panel.appendChild(title);
         panel.style.width ="300px";
         panel.style.position= "absolute";
         panel.style.background="white";
         panel.style.zIndex = "9999";
         panel.style.top ="5%";
         panel.style.left="80%";
         panel.style.paddingBottom="5px";
         panel.style.paddingLeft="5px";
         panel.style.border="1px solid black";
         var html = "<p> Galdera ID:"+id+"</p><p><input id='erantzunZuzena' placeholder='erantzuna zuzena idatzi'></p>";
         html += "<p> Ezagupen bektorea idatzi</p><p><input id='bektoreEz' placeholder='oinarrizko prob, bayes, prob. kondizionala'></p>";
         html += "<p> Ezagupen bektorea normalizatua</p><p><input id='bektoreaNorm' placeholder='0.4, 0.2,0.4'></p>";
         panel.innerHTML += html;
         var bidaliB = document.createElement('button');
         bidaliB.innerHTML = "Bidali";
        /* egiteko deia ajax bidez */
        bidaliB.onclick= function (){
          var _id = id;
          var skill = document.querySelector('#bektoreEz').value;
          var sv = document.querySelector('#bektoreaNorm').value;
          var er = document.querySelector('#erantzunZuzena').value;
          callBackend('/exerciseAttr/create/'+_id+'/'+sv+'/'+skill+'/'+er,function(err,result){
            if(err) console.error("Error saving",err);
            alert("Ondo gorde da");
          });
            document.body.removeChild(this.parentNode);
        };
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
