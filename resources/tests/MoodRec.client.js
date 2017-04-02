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
      "backend":"http://localhost:8080"
  }
  document.addEventListener('DOMContentLoaded',mapExercises.bind(this));
  scope.MoodRec = API;
})(window);
