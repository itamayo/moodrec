(function(scope){
 var exercises = [];
 var debug = true;
 var checkLogin = function (){
  var user =localStorage.getItem("user");
  var token = localStorage.getItem("token");
  var admin = localStorage.getItem("admin");
  if (user && token && (user!='' && token!='')){
        if(admin){
          var els = document.querySelectorAll('[role=two]');
          for(el in els){
            els[el].className="w3-hover-blue ikusezin";
          }
          var els = document.querySelectorAll('[role=one]');
          for(el in els){
            els[el].className="w3-hover-blue";
          }
          var els = document.querySelectorAll('[role=session]');
          for(el in els){
            els[el].className="w3-hover-blue";
          }
        }
        else {
          var els = document.querySelectorAll('[role=two]');
          for(el in els){
            els[el].className="w3-hover-blue";
          }
          var els = document.querySelectorAll('[role=one]');
          for(el in els){
            els[el].className="w3-hover-blue ikusezin";
          }
          var els = document.querySelectorAll('[role=session]');
          for(el in els){
            els[el].className="w3-hover-blue";
          }
        }
  }
  else {
    var els = document.querySelectorAll('[role=one]');
    for(el in els){
      els[el].className="w3-hover-blue ikusezin";
    }
    var els = document.querySelectorAll('[role=two]');
    for(el in els){
      els[el].className="w3-hover-blue ikusezin";
    }
    var els = document.querySelectorAll('[role=session]');
    for(el in els){
      els[el].className="w3-hover-blue ikusezin";
    }
      MoodRec.renderLogin(document.querySelector('#login1'));
  }
 }

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
              MoodRec.callBackend("/studentSkill/update/"+ex.skill+"/58d7e8755984581023fcb8e3/"+ex.correctAnswer+"/none",function(err,res){
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
      callBackend('/exerciseAttr/remove/'+id+'/none/none/none/none/none/none/none/'+localStorage.getItem('token'),function(err,result){
         if (err) console.error(err);
         MoodRec.renderArikerak(document.querySelector('#ariketak'));
      })
    }
    if (type=="gaia"){
      callBackend('/subject/remove/'+id+'/none/none/none/'+localStorage.getItem('token'),function(err,result){
         if (err) console.error(err);
         MoodRec.renderGaiak(document.querySelector('#gaiak'));
      })
    }
    if (type=="ikaslea"){
      callBackend('/student/remove/'+id+'/none/'+localStorage.getItem('token'),function(err,result){
         if (err) console.error(err);
         MoodRec.renderIkasleak(document.querySelector('#ikasleak'));
      })
    }
 }
 var renderArikerak = function (el){
    callBackend('/exerciseAttr/get/none/none/none/none/none/none/none/none/'+localStorage.getItem('token'),function(err,res){
      if (err) console.error("Error getting exercies");
      var html = "<span style='cursor:pointer' onclick=MoodRec.Panel.show('ariketak')><img width='30' height='30' src='/browse/icons/add.png'>Gehitu Ariketa</span>";
       html +="<table class='table'><tr><th>Id</th><th> Taldea</th><th> Bektorea</th><th> Bektore kuant.</th><th>Galderak</th><th>Erantzunak</th><th>ER.Zuzena</th><th></th></tr>";
       res.result.forEach(function(ex){
          var taldea = ex.group || "none";
          var question = ex.question || "none";
          var answers = ex.answers || "none";
          var ans = ex.response || "none";
          html+="<tr><td>"+ex.id+"</td><td>"+taldea+"</td><td>"+ex.subjects+"</td><td>"+ex.spaceVector+"</td><td>"+question+"</td><td>"+answers+"</td><td>"+ans+"</td><td onclick=MoodRec.remove('"+ex._id.$oid+"','ariketa')><img width='30' height='30' src='/browse/icons/remove.png'></td></tr>";
       })
       html+="</table>";
       el.innerHTML = html;
       el.className="";
    });

 }
 var renderIkasleak = function (el){
    callBackend('/studentSkill/get/none/none/true/none/none/'+localStorage.getItem('token'),function(err,res){
      if (err) console.error("Error getting exercies");
      var html = `<span style='cursor:pointer' onclick=MoodRec.Panel.show('ikasleak')><img width='30' height='30' src='/browse/icons/addUser.png'>Gehitu Erabiltzailea</span>`;
       html +="<table  class='table'><tr><th>Id</th><th> Izena</th><th> Ezagupenak</th></tr>";
       res.result.forEach(function(ik){
          html+="<tr><td>"+ik._id.$oid+"</td><td>"+ik.name+"</td><td>";
          ik.skills.forEach(function(sk){
            html+="<p>"+sk.name+" pknown:"+sk.pknown+"</p>";
          })
          html+="</td><td onclick=MoodRec.remove('"+ik._id.$oid+"','ikaslea')><img width='30' height='30' src='/browse/icons/remove.png'></td>";
          html+="</td><td onclick=MoodRec.Panel.show('gm');MoodRec.showUserRecommendation('"+ik._id.$oid+"','gm')><img width='30' height='30' src='/browse/icons/recommendation.png'></td>";
          html+="</td><td onclick=MoodRec.Panel.show('sec');MoodRec.showSecData('"+ik._id.$oid+"','sec')><img width='30' height='30' src='/browse/icons/key.png'></td>";

       })
       html+="</table>";
       el.innerHTML = html;
       el.className="";
    });

 }
 var renderGaiak = function (el){
    callBackend('/subject/get/none/none/none/none/'+localStorage.getItem('token'),function(err,res){
      if (err) console.error("Error getting exercies");
      var html = "<span style='cursor:pointer' onclick=MoodRec.Panel.show('gaiak')><img width='30' height='30' src='/browse/icons/add.png'>Gehitu Gaia</span>";
       html +="<table  class='table'><tr><th>Izena</th><th> Doc</th><th> Ezagupenak</th><th> Bektorea</th></tr>";
       res.result.forEach(function(gaia){
          html+="<tr><td>"+gaia.id+"</td><td><a href='/browse/tutos/"+gaia.docs+"' target=_blanck>"+gaia.docs+"</a></td><td>"+gaia.skills+"</td><td>"+gaia.spaceVector+"</td><td onclick=MoodRec.remove('"+gaia._id.$oid+"','gaia')><img width='30' height='30' src='/browse/icons/remove.png'></td></tr>";
       })
       html+="</table>";
       el.innerHTML = html;
       el.className="";

    });

 }
 var renderGomendioak = function (el){
    callBackend('/studentSkill/getUserRecommendation/none/'+localStorage.getItem('user')+'/none/none/none/'+localStorage.getItem('token'),function(err,res){
      if (err) console.error("Error getting Recomendations");
      var html = "";
       html +="<table  class='table'><tr><th>Doc</th><th> Sim</th></tr>";
       res.docs.forEach(function(rc){
          html+="<tr><td><a href='/browse/tutos/"+rc.docs[0]+"' target=_blanck>"+rc.docs[0]+"</a></td><td>"+rc.sim+"</td></tr>";
       })
       html+="</table>";
       el.innerHTML = html;
       el.className="";

    });

 }
 var showSecData = function (id,el){
    var el = document.querySelector('#'+el);
    callBackend('/admin/get/'+id+'/true/'+localStorage.getItem('token'),function(err,res){
      if (err) console.error("Error getting Recomendations");
      var html = "<span style='position:relative;top:0px;left:90%;color:green;' onclick='MoodRec.Panel.hide()'> X </span>";
       html +="<table  class='table'><tr><th>Token</th><th> Admin</th></tr>";

          html+="<tr><td>"+res.token+"</td><td>"+res.admin+"</td></tr>";

       html+="</table>";
       el.innerHTML = html;
       el.className = el.className.replace("ikusezin","");

    });

 }
 var showUserRecommendation = function (id,el){
    var el = document.querySelector('#'+el);
    callBackend('/studentSkill/getUserRecommendation/none/'+id+'/none/none/none/'+localStorage.getItem('token'),function(err,res){
      if (err) console.error("Error getting Recomendations");
      var html = "<span style='position:relative;top:0px;left:90%;color:green;' onclick='MoodRec.Panel.hide()'> X </span>";
       html +="<table  class='table'><tr><th>Doc</th><th> Sim</th></tr>";
       res.docs.forEach(function(rc){
          html+="<tr><td><a href='/browse/tutos/"+rc.docs[0]+"' target=_blanck>"+rc.docs[0]+"</a></td><td>"+rc.sim+"</td></tr>";
       })
       html+="</table>";
       el.innerHTML = html;
       el.className = el.className.replace("ikusezin","");

    });

 }
 var renderLogin = function (el){
     el.className="";
     var html = `<section id="login">
                <div class="container">
                	<div class="row">
                	    <div class="col-xs-12">
                    	    <div class="form-wrap">
                            <h1>Erabiltzaile datuak sartu</h1>
                                <form role="form" action="javascript:;" method="post" id="login-form" autocomplete="off">
                                    <div class="form-group">
                                        <label for="email" class="sr-only">Erabiltzailea</label>
                                        <input type="email" name="email" id="erabiltzaile" class="form-control" placeholder="Erabiltzailea">
                                    </div>
                                    <div class="form-group">
                                        <label for="key" class="sr-only">Token</label>
                                        <input type="password" name="key" id="token" class="form-control" placeholder="token">
                                    </div>

                                    <input type="button" onclick="MoodRec.login()" id="btn-login" class="btn btn-custom btn-lg btn-block" value="Sartu">
                                </form>
                                <a href="javascript:;" class="forget" data-toggle="modal" data-target=".forget-modal">Tokena ahaztu zaizu ?</a>
                                <hr>
                    	    </div>
                		</div> <!-- /.col-xs-12 -->
                	</div> <!-- /.row -->
                </div> <!-- /.container -->
            </section>`;
      el.innerHTML = html;


 }
 var login = function(){
   var user = document.querySelector('#erabiltzaile').value;
   var token = document.querySelector('#token').value;
   MoodRec.callBackend('/admin/login/'+user+'/false/'+token,function(err,res){
      console.log("login",err,res);
      if (err) {
        alert("Ez da ondo identifikatu");
      }

      else {
      if (res.response && res.response=="invalid") return;
      console.log("admin",res.admin);
      if (res.admin){
        var els = document.querySelectorAll('[role=two]');
        for(el in els){
          els[el].className="ikusezin";
        }
        var els = document.querySelectorAll('[role=one]');
        for(el in els){
          els[el].className="";
        }
        var els = document.querySelectorAll('[role=session]');
        for(el in els){
          els[el].className="";
        }
      }
      else {
        var els = document.querySelectorAll('[role=one]');
        for(el in els){
          els[el].className="ikusezin";
        }
        var els = document.querySelectorAll('[role=two]');
        for(el in els){
          els[el].className="";
        }
        var els = document.querySelectorAll('[role=session]');
        for(el in els){
          els[el].className="";
        }
      }
      localStorage.setItem("user",res.id);
      localStorage.setItem("token",res.token);
      localStorage.setItem("admin",res.admin);
      document.querySelector('#login1').className="ikusezin";
    }

   });
 }
 var callBackend = function (url,cb){
    document.querySelector('#ariketak').className="ikusezin";
    if(url.indexOf('studentSkill')!=-1 || url.indexOf('admin')!=-1)
      document.querySelector('#ikasleak').className="";
    else
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
 var uploadDocument = function (url,cb){
       var xmlhttp = new XMLHttpRequest();
     var formData = new FormData(docs);
     xmlhttp.onreadystatechange = function() {
         console.log(this.readyState,this.status);
         if (this.readyState == 4 && this.status == 200) {
             var myArr = JSON.parse(this.responseText);
             if (cb) cb(null,myArr);
             MoodRec.Panel.hide();
             MoodRec.renderGaiak(document.querySelector('#gaiak'));
         }
         else if (this.status == 404 || this.status == 400) cb("Not good response",this.status);
     };
     xmlhttp.open("post", MoodRec.backend+url, true);
     xmlhttp.send(formData);
 }
sesioaItxi = function(){
  localStorage.user="";
  localStorage.token="";
  document.location.reload();
}
 var Panel = function(){
   return {
     ikasleEzagupenaTemplate:`<div class="panel" id="pIkasleak">
                      <span style='position:relative;top:0px;left:90%;color:green;' onclick='MoodRec.Panel.hide()'> X </span>
                       <fieldset>
                       <legend> Erabiltzaile Id-a</legend>
                        <input id="ikIzena" value="">
                       </fieldset>
                       <fieldset>
                       <legend> Ezagupena</legend>
                        <input id="ikSkill" value="">
                       </fieldset>
                       <button  onclick="MoodRec.Panel.save('ikasleEzagupena')"> Gehitu</button>
                       </div>`,
   ikasleakTemplate:`<div class="panel" id="pIkasleak">
                    <span style='position:relative;top:0px;left:90%;color:green' onclick='MoodRec.Panel.hide()'> X </span>
                     <fieldset>
                     <legend> Izena</legend>
                      <input id="ikIzena" value="">
                     </fieldset>
                     <fieldset>
                     <legend> Administradorea al da ?</legend>
                      <input id="admin" value="" placeholder="true/false">
                     </fieldset>
                     <fieldset>
                     <button  onclick="MoodRec.Panel.save('ikaslea')"> Gehitu</button>
                     </div>`,
     ariketakTemplate:`<div class="panel" id="pAriketak">
                      <span style='position:relative;top:0px;left:90%;color:green' onclick='MoodRec.Panel.hide()'> X </span>
                       <fieldset>
                       <legend> Id</legend>
                        <input id="arId" value="">
                       </fieldset>
                       <fieldset>
                       <legend> Galdera</legend>
                        <input id="question" value="" placeholder="Zein da ... ?" size="60">
                       </fieldset>
                       <fieldset>
                       <legend> Erantzu posibleak</legend>
                        <input id="answers" value="" placeholder="1.4,0.3,2.4" size="60">
                       </fieldset>
                       <fieldset>
                       <legend> Erantzu zuzena</legend>
                        <input id="answer" value="" placeholder="1.4">
                       </fieldset>
                       <fieldset>
                       <legend> Taldea</legend>
                        <input id="group" value="" placeholder="Ariketak1">
                       </fieldset>
                       <fieldset>
                       <legend> Ezagupenak</legend>
                        <input id="arSkill" value="" placeholder="biderkaketa,zatiketa,gehiketa" size="60">
                       </fieldset>
                        <fieldset>
                       <legend> Ezagupen Bektorea</legend>
                        <input id="arSpaceVector" value="" placeholder="0.1,0.5,0.4" size="60">
                       </fieldset>
                       <fieldset>
                      <legend> BKT Parametroak</legend>
                       <input id="bktP" value="" placeholder="pl0,plt,pls,plg" size="60">
                      </fieldset>
                       <button onclick="MoodRec.Panel.save('ariketa')"> Gorde</button>
                       </div>`,
     gaiakTemplate:`<div class="panel" id="pGaiak">
                    <form  name="docs" method="post" enctype="multipart/form-data" action="/subject/create/none/none/none/none/ripcpsrlro3mfdjsaieoppsaa">
                    <span style='position:relative;top:0px;left:90%;color:green' onclick='MoodRec.Panel.hide()'> X </span>
                       <fieldset>
                       <legend> Izena</legend>
                        <input id="gIzena" name="gIzena" value="" placeholder="Estadistika">
                       </fieldset>
                       <fieldset>
                       <legend> Doc</legend>
                        <input type="file" name="gDoc" id="gDoc" placeholder="doc.pdf" >
                        <input type="hidden" name="extradata" id="extradata" value="test.pdf"/>
                       </fieldset>
                        <fieldset>
                        <legend> Ezagupenak (Bek.)</legend>
                         <input id="gSkills" name="gSkills" placeholder="biderkaketa,zatiketa">
                        </fieldset>
                         <fieldset>
                       <legend> Doc Bektorea</legend>
                        <input id="gSpaceVector" name="gSpaceVector" placeholder="0.4,0.3,0.3">
                       </fieldset>
                       <button type="button" onclick="MoodRec.uploadDocument('/subject/create/none/none/none/none/ripcpsrlro3mfdjsaieoppsaa');"> Gehitu</button>
                       </form>
                       </div>`,
       gmTemplate:`<div class="panel" id="gm">
                         </div>`,
        secTemplate:`<div class="panel" id="sec">
                     </div>`,
      show:function(id){
          if (id=="ikasleak"){
             var x = document.querySelector('.panel');
             if (x) document.body.removeChild(x);
             document.body.innerHTML += this.ikasleakTemplate;
          }
          if (id=="ikasleEzagupena"){
             var x = document.querySelector('.panel');
             if (x) document.body.removeChild(x);
             document.body.innerHTML += this.ikasleEzagupenaTemplate;
          }
          if (id=="gaiak"){
             var x = document.querySelector('.panel');
             if (x) document.body.removeChild(x);
             document.body.innerHTML += this.gaiakTemplate;
             document.querySelector('#gDoc').onchange = function(event){
                var file =document.querySelector('#gDoc').value;
                document.querySelector('#extradata').value = file.split("\\")[file.split("\\").length-1];
             }

          }
          if (id=="ariketak"){
             var x = document.querySelector('.panel');
             if (x) document.body.removeChild(x);
             document.body.innerHTML += this.ariketakTemplate;
          }
          if (id=="gm"){
             var x = document.querySelector('.panel');
             if (x) document.body.removeChild(x);
             document.body.innerHTML += this.gmTemplate;
          }
          if (id=="sec"){
             var x = document.querySelector('.panel');
             if (x) document.body.removeChild(x);
             document.body.innerHTML += this.secTemplate;
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
          var question = document.querySelector('#question').value;
          question = question.replace(/\?/g,"");
          var answer = document.querySelector('#answer').value;
          var answers = document.querySelector('#answers').value;
          var group = document.querySelector('#group').value;
          var bktP = document.querySelector('#bktP').value || 'none';
          id = (id || 'none');
          callBackend('/exerciseAttr/create/'+id+'/'+sv+'/'+skill+'/'+question+'/'+answers+'/'+answer+'/'+group+'/'+bktP+'/'+localStorage.getItem('token'),function(err,result){
            if(err) console.error("Error saving",err);
            MoodRec.Panel.hide();
            MoodRec.renderArikerak(document.querySelector('#ariketak'));
          });
        }
        else if(type=="gaia"){
          var izena = document.querySelector('#gIzena').value;
          var doc = document.querySelector('#gDoc').value;
          var sv = document.querySelector('#gSpaceVector').value;
          var gs = document.querySelector('#gSkills').value;

          callBackend('/subject/create/'+izena+'/'+gs+'/'+sv+'/'+doc+'/'+localStorage.getItem('token'),function(err,result){
            if(err) console.error("Error saving",err);
            MoodRec.Panel.hide();
            MoodRec.renderGaiak(document.querySelector('#gaiak'));
          });
        }
        else if(type=="ikasleEzagupena"){
          var skill = document.querySelector('#ikSkill').value;
          var izena = document.querySelector('#ikIzena').value;
          callBackend('/studentSkill/add/'+skill+'/'+izena+'/none'+'/'+localStorage.getItem('token'),function(err,result){
            if(err) console.error("Error saving",err);
            MoodRec.Panel.hide();
            MoodRec.renderIkasleak(document.querySelector('#ikasleak'));
          });
        }
        else if(type=="ikaslea"){
          var izena = document.querySelector('#ikIzena').value;
          var admin = document.querySelector('#admin').value;
          callBackend('/student/create/'+izena+'/'+admin+'/'+localStorage.getItem('token'),function(err,result){
            if(err) console.error("Error saving",err);
            MoodRec.Panel.hide();
            MoodRec.renderIkasleak(document.querySelector('#ikasleak'));
          });
        }
      },
      selectMenu:function(el){
          var menus = Array.prototype.slice.call(document.querySelector('ul').children);
          for(m in menus){
             menus[m].querySelector('span').className =  menus[m].querySelector('span').className.replace(/selected/,'');
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
      "renderLogin":renderLogin,
      "renderGomendioak":renderGomendioak,
      "uploadDocument":uploadDocument,
      "showUserRecommendation":showUserRecommendation,
      "checkLogin":checkLogin,
      "login":login,
      "showSecData":showSecData,
      "SesioaItxi":sesioaItxi,
      "Panel": new Panel(),
      "remove":remove,
      "backend":"http://localhost:8888"
  }
  //document.addEventListener('DOMContentLoaded',mapExercises.bind(this));
  scope.MoodRec = API;
  document.addEventListener('DOMContentLoaded',checkLogin);
})(window);
