(function(scope){
 var exercises = [];
 var debug = true;
 var getTest = function(){
   MoodRec.callBackend('/exerciseAttr/get/none/none/none/none/none/none/none/tri70f9g8trtegq8rif7bth93n',function(err,res){
       console.log(res);
       var exs = res.result;
       exs.forEach(function(e){
          if (e.group =="Ariketak1"){
             var h2 = document.createElement('h2');
             h2.innerHTML = e.question;
             var sel = document.createElement('select');
             var opts = e.answers.split(',');
             opts.forEach(function(o){
                var opt = document.createElement('option');
                opt.value = o;
                opt.innerHTML = o;
                opt.setAttribute("exId",e.id);
                opt.setAttribute("skills",e.subjects);
                sel.appendChild(opt);
             });
             document.querySelector('div').appendChild(h2);
             document.querySelector('div').appendChild(sel);
             exercises.push(sel);
          }

       });
   });
 }
 var getResults = function (ev){
    exercises.forEach(function(ex){
        ex.id = ex.selectedOptions[0].getAttribute("exId");
        ex.skill = ex.selectedOptions[0].getAttribute("skills");
        ex.ans = ex.value;
    });
    if (debug) {
        var div = document.createElement('div');
        exercises.forEach(function(ex,i){
            div.innerHTML+="<h2 id='ans"+i+"'>Ariketa "+i +" skill: " +ex.skill +" Hit: " +ex.correctAnswer + " </h2>";
            (function(i){
              MoodRec.callBackend("/studentSkill/update/"+ex.skill+"/597a1e78564430786468c875/"+ex.ans+"/"+ex.id+"/tri70f9g8trtegq8rif7bth93n",function(err,res){
              if (err) {console.warn(err);}
              else {

                document.querySelector("#ans"+i).innerHTML+=" Probability of know it:"+res.pknow;
                if (parseFloat(res.pknow)<0.55){
                  document.body.innerHTML+="<p> Recomendation based of low known of "+ex.skill+"</p>";
                  MoodRec.callBackend("/subject/getRecommendation/none/none/"+MoodRec.getExercices()[i].sv+"/none",function(err,res){
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
      "getResults":getResults,
      "backend":"http://localhost:8888"
  }
  document.addEventListener('DOMContentLoaded',getTest.bind(this));
  scope.MoodRec = API;
})(window);
