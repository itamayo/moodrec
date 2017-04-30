(function(scope){
 var exercises = [];
 var debug = true;
 var mapExercises = function(){
    var execs = document.querySelectorAll('[skill]');
    for (ex in execs){
      if (execs[ex].nodeName){
       var item = {"skill":execs[ex].getAttribute('skill'),"elem":execs[ex],"sv":execs[ex].getAttribute('sv')};
       exercises.push(item);
     }
    }
    document.querySelector('[action=save]').addEventListener('click',getResults)
 }
 var getResults = function (ev){
    exercises.forEach(function(ex){
        ex.correctAnswer = ex.elem.selectedOptions[0].getAttribute("correct");
    });
    if (debug) {
        var div = document.createElement('div');
        exercises.forEach(function(ex,i){
            div.innerHTML+="<h2 id='ans"+i+"'>Ariketa "+i +" skill: " +ex.skill +" Hit: " +ex.correctAnswer + " </h2>";
            (function(i){
              MoodRec.callBackend("/studentSkill/update/"+ex.skill+"/58d7e8755984581023fcb8e3/"+ex.correctAnswer,function(err,res){
              if (err) {console.warn(err);}
              else {

                document.querySelector("#ans"+i).innerHTML+=" Probability of know it:"+res.pknow;
                if (parseFloat(res.pknow)<0.55){
                  MoodRec.callBackend("/subject/getRecommendation/none/"+MoodRec.getExercices()[i].sv+"/none",function(err,res){
                      document.body.innerHTML+="<div>Recommended documentation:"+JSON.stringify(res.docs);
                  });
                }
              }
            });
          })(i);
        });
        document.body.appendChild(div);
    }
 }
 var getExercices = function (){
   return exercises;
 }
 var remove = function (id,type){
    if (type=="ariketa"){
      callBackend('/exerciseAttr/remove/'+id+'/none/none',function(err,result){
         if (err) console.error(err);
         MoodRec.renderArikerak(document.querySelector('#ariketak'));
      })
    }
    if (type=="gaia"){
      callBackend('/subject/remove/'+id+'/none/none',function(err,result){
         if (err) console.error(err);
         MoodRec.renderGaiak(document.querySelector('#gaiak'));
      })
    }
    if (type=="ikaslea"){
      callBackend('/studentSkills/remove/'+id+'/none/none',function(err,result){
         if (err) console.error(err);
         MoodRec.renderIkasleak(document.querySelector('#ikasleak'));
      })
    }
 }
 var renderArikerak = function (el){
    callBackend('/exerciseAttr/get/null/none/none',function(err,res){
      if (err) console.error("Error getting exercies");
      var html = "<span style='cursor:pointer' onclick=MoodRec.Panel.show('ariketak')><img width='30' height='30' src='/browse/icons/add.png'>Gehitu Ariketa</span>";
       html +="<table class='table'><tr><th>Id</th><th> Bektorea</th><th> Bektore kuant.</th><th></th></tr>";
       res.result.forEach(function(ex){
          html+="<tr><td>"+ex.id+"</td><td>"+ex.subjects+"</td><td>"+ex.spaceVector+"</td><td onclick=MoodRec.remove('"+ex._id.$oid+"','ariketa')><img width='30' height='30' src='/browse/icons/remove.png'></td></tr>";
       })
       html+="</table>";
       el.innerHTML = html;
       el.className="";
    });

 }
 var renderIkasleak = function (el){
    callBackend('/studentSkill/get/none/none/true',function(err,res){
      if (err) console.error("Error getting exercies");
      var html = "<span style='cursor:pointer' onclick=MoodRec.Panel.show('ikasleak')><img width='30' height='30' src='/browse/icons/add.png'>Gehitu Ikaslea</span>";
       html +="<table  class='table'><tr><th>Id</th><th> Izena</th><th> Ezagupenak</th></tr>";
       res.result.forEach(function(ik){
          html+="<tr><td>"+ik._id.$oid+"</td><td>"+ik.name+"</td><td>";
          ik.skills.forEach(function(sk){
            html+="<p>"+sk.name+" pknown:"+sk.pknown+"</p>";
          })
          html+="</td><td onclick=MoodRec.remove('"+ik._id.$oid+"','ikaslea')><img width='30' height='30' src='/browse/icons/remove.png'></td></tr></tr>";
       })
       html+="</table>";
       el.innerHTML = html;
       el.className="";
    });

 }
 var renderGaiak = function (el){
    callBackend('/subject/get/none/none/none',function(err,res){
      if (err) console.error("Error getting exercies");
      var html = "<span style='cursor:pointer' onclick=MoodRec.Panel.show('gaiak')><img width='30' height='30' src='/browse/icons/add.png'>Gehitu Gaia</span>";
       html +="<table  class='table'><tr><th>Izena</th><th> Doc</th><th> Bektorea</th></tr>";
       res.result.forEach(function(gaia){
          html+="<tr><td>"+gaia.name+"</td><td>"+gaia.docs+"</td><td>"+gaia.spaceVector+"</td><td onclick=MoodRec.remove('"+gaia._id.$oid+"','gaia')><img width='30' height='30' src='/browse/icons/remove.png'></td></tr>";
       })
       html+="</table>";
       el.innerHTML = html;
       el.className="";

    });

 }
 var callBackend = function (url,cb){
    document.querySelector('#ariketak').className="ikusezin";
    document.querySelector('#ikasleak').className="ikusezin";
    document.querySelector('#gaiak').className="ikusezin";

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
 }

 var Panel = function(){
   return {
     ikasleakTemplate:`<div class="panel" id="pIkasleak">
                      <span style='position:relative;top:10px;left:90%;' onclick='MoodRec.Panel.hide()'> X </span>
                      <h3>Ikaslea gehitu</h3>

                       <fieldset>
                       <legend> Izena</legend>
                        <input id="ikIzena" value="">
                       </fieldset>
                       <fieldset>
                       <legend> Ezagupenak</legend>
                        <input id="ikSkill" value="">
                       </fieldset>
                       <button> Gehitu</button>
                       </div>`,
     ariketakTemplate:`<div class="panel" id="pAriketak">
                      <span style='position:relative;top:10px;left:90%;' onclick='MoodRec.Panel.hide()'> X </span>
                      <h3>Ariketa gehitu</h3>
                       <fieldset>
                       <legend> Id (MoodleId)</legend>
                        <input id="arId" value="">
                       </fieldset>
                       <fieldset>
                       <legend> Ezagupenak</legend>
                        <input id="arSkill" value="" placeholder="biderkaketa,zatiketa,gehiketa">
                       </fieldset>
                        <fieldset>
                       <legend> Ezagupen Bektorea</legend>
                        <input id="arSpaceVector" value="" placeholder="0.1,0.5,0.4">
                       </fieldset>
                       <button onclick="MoodRec.Panel.save('ariketa')"> Gorde</button>
                       </div>`,
     gaiakTemplate:`<div class="panel" id="pGaiak">
                    <span style='position:relative;top:10px;left:90%;' onclick='MoodRec.Panel.hide()'> X </span>  
                      <h3>Gaia gehitu</h3>
                       <fieldset>
                       <legend> Izena</legend>
                        <input id="gIzena" value="" placeholder="Estadistika">
                       </fieldset>
                       <fieldset>
                       <legend> Doc</legend>
                        <input id="gDoc" placeholder="doc.pdf">
                       </fieldset>
                        <fieldset>
                       <legend> Doc Bektorea</legend>
                        <input id="gSpaceVector" placeholder="0.4,0.3,0.3">
                       </fieldset>
                       <button onclick="MoodRec.Panel.save('gaia')"> Gehitu</button>
                       </div>`,
      show:function(id){
          if (id=="ikasleak"){
             var x = document.querySelector('.panel');
             if (x) document.body.removeChild(x);
             document.body.innerHTML += this.ikasleakTemplate;
          }
          if (id=="gaiak"){
             var x = document.querySelector('.panel');
             if (x) document.body.removeChild(x);
             document.body.innerHTML += this.gaiakTemplate;
          }
          if (id=="ariketak"){
             var x = document.querySelector('.panel');
             if (x) document.body.removeChild(x);
             document.body.innerHTML += this.ariketakTemplate;
          }
      },
      hide:function(id){
        var x = document.querySelector('.panel');
        if (x) document.body.removeChild(x);
      },
      save:function(type){
        if(type=="ariketa"){
          var id = document.querySelector('#arId').value;
          var skill = document.querySelector('#arSkill').value;
          var sv = document.querySelector('#arSpaceVector').value;
          callBackend('/exerciseAttr/create/'+id+'/'+sv+'/'+skill,function(err,result){
            if(err) console.error("Error saving",err);
            MoodRec.Panel.hide();
            MoodRec.renderArikerak(document.querySelector('#ariketak'));
          });
        }
        else if(type=="gaia"){
          var izena = document.querySelector('#gIzena').value;
          var doc = document.querySelector('#gDoc').value;
          var sv = document.querySelector('#gSpaceVector').value;
          callBackend('/subject/create/'+izena+'/'+sv+'/'+doc,function(err,result){
            if(err) console.error("Error saving",err);
            MoodRec.Panel.hide();
            MoodRec.renderGaiak(document.querySelector('#gaiak'));
          });
        }
      },
      selectMenu:function(el){
          var menus = document.querySelector('ul').children;
          for(m in menus){
            if(menus[m].className)  menus[m].querySelector('span').className =  menus[m].querySelector('span').className.replace(/selected/,'');
          }
          el.className="selected";
      }

   }

 }
  var API = {
      "getExercices":getExercices,
      "callBackend":callBackend,
      "renderArikerak":renderArikerak,
      "renderIkasleak":renderIkasleak,
      "renderGaiak":renderGaiak,
      "Panel": new Panel(),
      "remove":remove,
      "backend":"http://localhost:8080"
  }
  //document.addEventListener('DOMContentLoaded',mapExercises.bind(this));
  scope.MoodRec = API;
})(window);
