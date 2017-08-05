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
   MoodRec.callBackend('/exerciseAttr/get/none/none/none/none/none/none/none/tri70f9g8trtegq8rif7bth93n',function(err,res){
       console.log(res);
       var exs = res.result;
       var container = document.querySelector('.modal-dialog')
       exs.forEach(function(e,i){
          if (e.group =="Ariketak1"){
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
          ex1.ans = target.value;
        }
     });
    getResults(ex1)
   }


 }

 var getResults = function (ex){
        var div = document.querySelector('.console');
        MoodRec.callBackend("/studentSkill/update/"+ex.skill+"/597a1e78564430786468c875/"+ex.ans+"/"+ex.id+"/none/tri70f9g8trtegq8rif7bth93n",function(err,res){
        if (err) {console.warn(err);}
        else {

          div.innerHTML+="<p> Probability of know it:"+res.pknow+"</p>";
          if (parseFloat(res.pknow)<0.55){
            div.innerHTML+="<p> Recomendation based of low known of "+ex.skill+"</p>";
            MoodRec.callBackend('/studentSkill/getUserRecommendation/none/597a1e78564430786468c875/none/none/none/tri70f9g8trtegq8rif7bth93n',function(err,res){
                div.innerHTML+="<div>Recommended documentation:"+JSON.stringify(res.docs);
            });

          }
        }
      });




 }
 var getExercices = function (){
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
      "getResults":getResults,
      "backend":"http://localhost:8888"
  }
  document.addEventListener('DOMContentLoaded',getTest.bind(this));
  scope.MoodRec = API;
})(window);
