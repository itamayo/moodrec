// ==UserScript==
// @name         MoodRecPlugin
// @namespace    http://moodrec.net
// @version      0.1
// @description  MoodRec for Moodle
// @author       iñigo tamayo <tamaxx@gmail.com>
// @match        http://192.168.1.111/moodle/mod/quiz/attempt.php?*
// @include      http://192.168.1.111/moodle/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    window.MoodRec = {};
    if (document.location.href.split('moodle')[1].length==1 || document.location.href.indexOf("login")!=-1) MoodRec.run=false;
    else MoodRec.run = true;
    if (MoodRec.run){
    MoodRec.backend = "http://donostian.eus:8888";
    setTimeout(function(e){
     var st = {};
     var student = {};
     var studentInfo = document.querySelector('[title="View profile"]');

     student.name = studentInfo.innerHTML;
     var tnp = student.name.split(" ");
     student.surname = tnp[0][0] + tnp[1].toLowerCase();
     student.id = studentInfo.href.split("=")[1];
     if ( document.location.href.indexOf("attempt")!=-1){
         var questionId = document.querySelector('.questionflagpostdata').value;
         var ids = questionId.split('&')[2];
         console.log(ids);
         var id = ids.split('=')[1];
         var ex = {};

         console.log(student,"quiz_id",id);
         MoodRec.callBackend("/exerciseAttr/get/"+id+"/none/none/none/none/none/none/none/none/",function(err,res){
             if (err) {console.warn(err);}
             ex = res;
             console.log("eXercises,",res);
         });
     }
     if (student.name.indexOf("Admin")!=-1) student.name = "admin";
     else
     MoodRec.callBackend("/admin/get/"+ student.surname+"/true/ripcpsrlro3mfdjsaieoppsaa",function(err,res){
       if (err) {console.warn(err);}
       console.log(res);
       MoodRec.user = res.id;
       MoodRec.token = res.token;
       MoodRec.showRecommendations();

     });
     document.querySelector('[type=submit],[value=next]').addEventListener('click',function(){
         var res = document.querySelector('[type=radio][checked]');
         var label = document.querySelector('[for=\"'+res.id+'\"]');
         var tmp = label.textContent.split(" ");
         var erantzuna ="-999";
         if (tmp.length>1){
            erantzuna = tmp[1];
         }
         else{
           erantzuna = tmp[0];
         }
         /*res = Array.prototype.slice.call(res);
         var erantzuna = res.filter(function(el){if(el.checked)return true; else return false;})[0] || -1;*/
         if (res.value){
           console.log('bidalitako erantzuna',erantzuna);
           console.log(ex);
           console.log(ex.skill);
           console.log(st.user,st.token);
           erantzuna = encodeURIComponent(erantzuna);
           MoodRec.callBackend("/studentSkill/update/"+ex.skill+"/"+MoodRec.user+"/"+erantzuna+"/"+id+"/"+ex.bktP+"/"+MoodRec.token,function(err,res){
           if (err) {console.warn("error",err);}
           else {
               console.warn("getting recomendation",res);

                  MoodRec.callBackend('/studentSkill/getUserRecommendation/none/'+MoodRec.user+'/none/none/none/'+MoodRec.token,function(err,res){
                  if (err) console.warn("getting recomendation");
                  localStorage.setItem("docs",JSON.stringify(res));
                  MoodRec.showRecommendations(res);
              });


            console.log(res);
           }
         });
     }
     });
        console.log(student.name);
     if (student.name=="admin"){
         setMoodRecQuestion(id);
     }
     else {
         console.log(st);

     }
     },1500);
    }
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
         html += "<p> Bkt Parametroak</p><p><input id='bktP' placeholder='0.4, 0.2,0.4,0.3'></p>";

         panel.innerHTML += html;
         var bidaliB = document.createElement('button');
         bidaliB.innerHTML = "Bidali";
        /* egiteko deia ajax bidez */
        bidaliB.onclick= function (){
          var _id = id;
          var skill = document.querySelector('#bektoreEz').value;
          var btkP = document.querySelector('#bktP').value;
          var sv = document.querySelector('#bektoreaNorm').value;
          var er = document.querySelector('#erantzunZuzena').value;
          var q = document.querySelector('.qtext p span').innerHTML;
          var group = document.querySelector('[title=Quiz]').innerHTML;
          q=q.replace(":","");
          q=q.replace("?","");
          var  ans = document.querySelector('.answer').children;
          var answers = [];
            ans = Array.prototype.slice.call(ans);
          for (var a in ans) {
              answers.push(ans[a].querySelector('label').innerHTML);
          }
          answers = answers.join(',');
          console.log(answers);
          er = encodeURIComponent(er);
          MoodRec.callBackend('/exerciseAttr/create/'+_id+'/'+sv+'/'+skill+'/'+q+'/'+answers+'/'+er+'/'+group+'/'+btkP+'/ripcpsrlro3mfdjsaieoppsaa',function(err,result){
            if(err) console.error("Error saving",err);
            alert("Ondo gorde da");
          });
            document.body.removeChild(this.parentNode);
        };
        panel.appendChild(bidaliB);
        document.body.appendChild(panel);
    };
    window.MoodRec.showRecommendations = function (data){
         if (!data)
             MoodRec.callBackend('/studentSkill/getUserRecommendation/none/'+MoodRec.user+'/none/none/none/'+MoodRec.token,function(err,res){
                  if (err) console.warn("getting recomendation");
                  localStorage.setItem("docs",JSON.stringify(res));
                  MoodRec.showRecommendations(res);
              });
         var panel = document.querySelector('#recPanel');
         if (panel){
              var html = "";
             panel.innerHTML ="";
             data.docs.forEach(function(doc){
                 html+="<p> <a href='"+MoodRec.backend+"/browse/tutos/"+doc.docs.join(',')+"'>" + doc.docs.join(',')+"</a></p>";
             });
             panel.innerHTML += html;
             document.body.appendChild(panel);
         }
        else{
         panel = document.createElement('div');
         panel.id ="recPanel";
         var title = document.createElement('div');
         title.style.height="30px";
         title.style.background="#444";
         title.style.color="white";
         title.style.textAlign="center";
         title.style.padding="5px";
         title.innerHTML ="Recomendations";
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

         var html = "";
         if (data) data.docs.forEach(function(doc){
             html+="<p> <a href='"+MoodRec.backend+"/browse/tutos/"+doc.docs.join(',')+"'>"  + doc.docs.join(',')+"</a></p>";
         });
         panel.innerHTML += html;
        document.body.appendChild(panel);
        }

    };
   window.MoodRec.callBackend = function (url,cb){
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
