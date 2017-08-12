(function(scope){
  var exercises = [];
  var debug = true;
  var getTest = function(){
    MoodRec.getGalderaTempate= function (qid){
      return `<div class="modal-content">
      <div class="modal-header">
      <h3><span class="label label-warning" id="qid_`+qid+`">`+qid+`</span> <span id="title_`+qid+`">THREE is CORRECT</span></h3>
      </div>
      <div class="modal-body">
      <div class="col-xs-3 col-xs-offset-5">
      <div id="loadbar" style="display: none;">
      <div class="blockG" id="rotateG_01"></div>
      <div class="blockG" id="rotateG_02"></div>
      <div class="blockG" id="rotateG_03"></div>
      <div class="blockG" id="rotateG_04"></div>
      <div class="blockG" id="rotateG_05"></div>
      <div class="blockG" id="rotateG_06"></div>
      <div class="blockG" id="rotateG_07"></div>
      <div class="blockG" id="rotateG_08"></div>
      </div>
      </div>

      <div class="quiz" id="quiz" data-toggle="buttons">
      <label class="element-animation1 btn btn-lg btn-primary btn-block"><span class="btn-label" id="label_answer_`+qid+`_0"><i class="glyphicon glyphicon-chevron-right"></i></span> <input onclick="MoodRec.ansChange(event)" type="radio" id="q_answer_`+qid+`_0" name="q_answer_`+qid+`_0" value="1"></label>
      <label class="element-animation2 btn btn-lg btn-primary btn-block"><span class="btn-label" id="label_answer_`+qid+`_1"><i class="glyphicon glyphicon-chevron-right"></i></span> <input onclick="MoodRec.ansChange(event)" type="radio" id="q_answer_`+qid+`_1" name="q_answer_`+qid+`_1"  value="2"></label>
      <label class="element-animation3 btn btn-lg btn-primary btn-block"><span class="btn-label" id="label_answer_`+qid+`_2"><i class="glyphicon glyphicon-chevron-right"></i></span> <input onclick="MoodRec.ansChange(event)" type="radio" id="q_answer_`+qid+`_2" name="q_answer_`+qid+`_2"  value="3"></label>
      <label class="element-animation4 btn btn-lg btn-primary btn-block"><span class="btn-label" id="label_answer_`+qid+`_3"><i class="glyphicon glyphicon-chevron-right"></i></span> <input onclick="MoodRec.ansChange(event)" type="radio" id="q_answer_`+qid+`_3" name="q_answer_`+qid+`_3"  value="4"></label>
      </div>
      </div>
      <div class="modal-footer text-muted">
      <span id="answer"></span>
      </div>
      </div>`;
    }
    MoodRec.callBackend('/exerciseAttr/get/none/none/none/none/none/none/none/none/'+localStorage.getItem('token'),function(err,res){
      console.log(res);
      var exs = res.result;
      var container = document.querySelector('.modal-dialog')
      exs.forEach(function(e,i){
        if (e.group ==localStorage.getItem('ariketa')){
          container.innerHTML+=MoodRec.getGalderaTempate(i);
          var h2 = document.querySelector('#title_'+i);
          h2.innerHTML = e.question;
          var sel = document.createElement('select');
          var opts = e.answers.split(',');
          opts.forEach(function(o,x){
            var opt = document.querySelector('#q_answer_'+i+"_"+x);
            opt.value = o;
            var txt = document.querySelector('#label_answer_'+i+"_"+x);
            txt.parentNode.innerHTML+=o;
            opt.setAttribute("exId",e.id);
            opt.setAttribute("skills",e.subjects);
            opt.setAttribute("bktP",e.bktParameters || 'none');
            exercises.push(opt);
          });
          var len = 4 - (4 - opts.length);
          for (l = len; l <4; l++){
            try{
              document.querySelector('#q_answer_'+i+"_"+l).parentNode.style.display = "none";
            }
            catch(e){
              debugger;
            }
          }
          //   document.querySelector('div').appendChild(h2);
          // document.querySelector('div').appendChild(sel);

        }

      });
    });
    MoodRec.ansChange = function(ev){
      console.log(ev,exercises);
      var target = ev.target || ev.srcElement;
      var ex1 = {};
      exercises.forEach(function(ex){
        if (ex.id == target.id){
          ex1.skill = ex.getAttribute('skills');
          ex1.id = ex.getAttribute('exId');
          ex1.bktP = ex.getAttribute('bktP');
          ex1.ans = target.value;
        }
      });
      getResults(ex1)
    }


  }

  var getResults = function (ex){
    var div = document.querySelector('.console');
    MoodRec.callBackend("/studentSkill/update/"+ex.skill+"/"+localStorage.getItem('user')+"/"+ex.ans+"/"+ex.id+"/"+ex.bktP+"/"+localStorage.getItem('token'),function(err,res){
      if (err) {console.warn(err);}
      else {
        var skills = res;
        for (var i =0; i<skills.length ;i++){
          div.innerHTML+="<p> Probability of know "+ ex.skill.split(',')[i]+":"+skills[i].pknow+" </p>";
          if (parseFloat(skills[i].pknow)<0.55){
            div.innerHTML+="<p> Recomendation based of low known of user general skills</p>";
            MoodRec.callBackend('/studentSkill/getUserRecommendation/none/'+localStorage.getItem('user')+'/none/none/none/'+localStorage.getItem('token'),function(err,res){
              div.innerHTML+="<div>Recommended documentation:"+JSON.stringify(res.docs)+"</div>";
              var objs = res.docs;
              objs = objs.filter(function(o){
                var listSkills = ex.skill.split(',');
                for (i=0;i<listSkills.length;i++){
                  if (o.skills.split(',').indexOf(listSkills[i])!=-1){
                    return true;
                  }
                }
                return false;
              })
              div.innerHTML+="<div style='font-weight:bold;'>Filtered by skills of the exercises,Recommended documentation:"+JSON.stringify(objs)+"</div>";
            });
          }
        }
      }
    });




  }
  var login = function(){
    var user = document.querySelector('#erabiltzaile').value;
    var token = document.querySelector('#token').value;
    var ariketa = document.querySelector('#ariketa').value;

    MoodRec.callBackend('/admin/login/'+user+'/false/'+token,function(err,res){
      console.log("login",err,res);
      if (err) {
        alert("Ez da ondo identifikatu");

      }
      else {
        if (res.response && res.response=="invalid") return;
        var c = document.querySelector('#container')
        c.className = c.className.replace("ikusezin","");
        localStorage.setItem("user",res.id);
        localStorage.setItem("token",res.token);
        localStorage.setItem("admin",res.admin);
        localStorage.setItem("ariketa",ariketa);
        document.querySelector('#login1').className="ikusezin";
        getTest.apply(this);
      }

    });
  }
  var closeSession = function(){
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    localStorage.removeItem("ariketa");
    document.location.reload();
  }
  var getExercices = function (){
    return exercises;
  }
  var getExercicesGroups = function (){
    return exercises;
  }
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
  }
  var API = {
    "getExercices":getExercices,
    "callBackend":callBackend,
    "login":login,
    "getResults":getResults,
    "closeSession":closeSession,
    "getExercicesGroups":getExercicesGroups,
    "backend":"http://localhost:8888"
  }

  scope.MoodRec = API;
})(window);
