(function(scope){
 var exercises = [];
 var debug = true;
 var mapExercises = function(){
    var execs = document.querySelectorAll('[skill]');
    for (ex in execs){
      if (execs[ex].nodeName){
       var item = {"skill":execs[ex].getAttribute('skill'),"elem":execs[ex]};
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
            div.innerHTML+="<h2>Ariketa "+i +" skill: " +ex.skill +" Hit: " +ex.correctAnswer + " </h2>";
        });
        document.body.appendChild(div);
    }
 }
 var getExercices = function (){
   return exercises;
 }
  var API = {
      "getExercices":getExercices
  }
  document.addEventListener('DOMContentLoaded',mapExercises.bind(this));
  scope.MoodRec = API;
})(window);
