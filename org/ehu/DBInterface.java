package org.ehu;

import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;
import com.mongodb.ServerAddress;
import com.mongodb.DBRef;
import com.mongodb.client.AggregateIterable;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.MongoCollection;

import org.bson.Document;
import org.bson.types.ObjectId;
import java.util.Arrays;
import java.util.*;
import com.mongodb.Block;
import java.security.SecureRandom;
import java.math.BigInteger;

import com.mongodb.client.MongoCursor;
import static com.mongodb.client.model.Filters.*;
import com.mongodb.client.result.DeleteResult;
import static com.mongodb.client.model.Updates.*;
import com.mongodb.client.result.UpdateResult;
import java.util.ArrayList;
import java.util.List;
import java.util.Iterator;



public  class DBInterface {
  MongoCollection<Document> student;
  MongoCollection<Document> studentSkills;
  MongoCollection<Document> subject;
  MongoCollection<Document> exerciseAttr;
  MongoCollection<Document> skillParameters;
  MongoCollection<Document> Security;
  public DBInterface(){
    try {
      MongoClient mongoClient = new MongoClient( "localhost" , 27017 );
      MongoDatabase db = mongoClient.getDatabase("mydb");
      System.out.println("Connected to DB");
      student = db.getCollection("student");
      subject = db.getCollection("subject");
      studentSkills = db.getCollection("StudentSkills");
      exerciseAttr = db.getCollection("exerciseAttr");
      skillParameters = db.getCollection("skillParameters");
      Security = db.getCollection("security");

    }
    catch (Exception e){}
  }

  /*
    create a new user token

  */
  public String createNewToken (String id,String admin){
    SecureRandom random = new SecureRandom();
    Document query = new Document();
    query.put("_id", new ObjectId(id));
    MongoCursor<Document> cursor = Security.find(query).iterator();
    if (cursor!=null && cursor.hasNext()) return "user all ready exists";
    Document doc = new Document("id", id);
    doc.put("token",new BigInteger(130, random).toString(32));
    if (admin.equals("true")){
        doc.put("admin",true);
    }
    else
      doc.put("admin",false);

    Security.insertOne(doc);
    return doc.toJson();
  }

  /*
  Get user ID by user name

  */
  public String getUserID (String name){
    Document query = new Document();
    query.put("name", name);
    MongoCursor<Document> cursor = studentSkills.find(query).iterator();
    if (cursor==null || !cursor.hasNext()) {
      System.out.println("here fails !");
      System.out.println(cursor.hasNext());
      return "none";
    }
    else {
      Document c = cursor.next();
      return c.get("_id").toString();
    }
    //return "none";
  }
  /*
    Ensure user and token; also priviliges

  */
  public String auth (String id,String token){
    Document query = new Document();
    query.put("id", id);
    MongoCursor<Document> cursor = Security.find(query).iterator();
    if (cursor==null || !cursor.hasNext()) {
      System.out.println("here fails !");
      System.out.println(cursor.hasNext());
      return "none";
    }
    else {
      Document c = cursor.next();
      String tnp = c.get("token").toString();
      String admin = c.get("admin").toString();
      if (tnp.equals(token)){
         if (admin.equals("true")){
            return "admin";
         }
         else return "user";
      }
      else return "none";
    }
    //return "none";
  }
  /*
    Ensure user and token; also priviliges

  */
  public String authByToken (String token){
    Document query = new Document();
    query.put("token", token);
    MongoCursor<Document> cursor = Security.find(query).iterator();
    if (cursor==null || !cursor.hasNext()) {
      System.out.println("here fails ! token used: "+token);
      return "none";
    }
    else {
      Document c = cursor.next();
      String tnp = c.get("token").toString();
      String admin = c.get("admin").toString();
      if (tnp.equals(token)){
         if (admin.equals("true")){
            return "admin";
         }
         else return "user";
      }
      else return "none";
    }
    //return "none";
  }
/*
  add student data

*/
public String addStudent (String name,String admin){
  Document doc = new Document("name", name);
  doc.put("skills",Arrays.asList());
  studentSkills.insertOne(doc);
  this.createNewToken(doc.get("_id").toString(),admin);
  return doc.get("_id").toString();
}
/*
  remove student data

*/
public String removeStudent (String id){
  studentSkills.deleteOne(new Document("_id", new ObjectId(id)));
  Security.deleteOne(new Document("id", id));
  return "{\"result\":\"ok\"}";
}
public void prinStudentsData (){
  Bkt bkt = new Bkt();
  MongoCursor<Document> cursor = studentSkills.find().iterator();
    try {
       while(cursor.hasNext()) {
           Document c = cursor.next();
          // System.out.println(cursor);
           System.out.println(c.get("correct"));
           boolean correct = false;
           String tnp = c.get("correct").toString();

           int ans = Integer.parseInt(tnp);
           if (ans == 1) correct = true;
           else correct = false;
           System.out.println(correct);
           //bkt.updateMastering(correct);
       }
    } finally {
       cursor.close();
    }
}
/*
  Get student info by id
*/
public String getStudent (String id){
  System.out.println("gettin student "+id);
  String tnp = new String("");
  Document query = new Document();
  query.put("_id", new ObjectId(id));
  MongoCursor<Document> cursor = studentSkills.find(query).iterator();
    try {
       while(cursor.hasNext()) {
           Document c = cursor.next();
           System.out.println(c);
           tnp = c.toString();


       }
    } finally {
       cursor.close();
    }
    return tnp;
}
/*
  get all student
*/
public String getAllStudent (){
  MongoCursor<Document> cursor = studentSkills.find().iterator();
  String json = "{\"result\":[";
  while (cursor.hasNext()){
    Document c = (Document)cursor.next();
    json +=c.toJson()+",";

  }
  json = json.substring(0,json.length()-1);
  json+="]}";
  return json;
}
/*
  get secutiry info
*/
public String getAuthData (String stdId){
  String tnp = new String("");
  Boolean ad = false;

  Document query = new Document();
  query.put("id",stdId);
  System.out.println("SECURITY GETTIN USER INFO");

  MongoCursor<Document> cursor = Security.find(query).iterator();
    try {
       while(cursor.hasNext()) {
           System.out.println("SECURITY GETTIN USER INFO");
           Document c = cursor.next();
           tnp =(String) c.get("token");
           ad =(Boolean) c.get("admin");

       }
    } finally {
       cursor.close();
    }
    return "{\"token\":\""+tnp+"\",\"admin\":"+ad+"}";
}

/* add
   Subject
*/
public String getSubject (String subjectid){
  /* TODO */
  return " ";
}
/*
  Get similarity docs related user skills
*/
public String getRelatedSubjectByPknows (double [] vector,String[] knowns){
  VectorSpaceModel vectorSpaceModel = new VectorSpaceModel();
  MongoCursor<Document> cr = subject.find().iterator();
  class similarities implements Comparable<similarities>{
    double sim = 0.0;
    ArrayList<String>  docs;
    String skills;

    public similarities(double s,ArrayList<String> d,String sk){
      this.sim =s;
      this.docs = d;
      this.skills = sk;
    }
    @Override
    public int compareTo(similarities s1) {
        if (this.sim < s1.sim) return 1;
        else return -1;
    }
  }
  ArrayList<similarities> sims = new ArrayList<similarities>();
  ArrayList<Double> knowns_vector =new ArrayList<Double>() ;

  try {
    while (cr.hasNext()){
        Document sbj = cr.next();
        String tnp = (String)sbj.get("spaceVector");
        String skills = (String)sbj.get("skills");
        String []  doc_skills = skills.split(",");
        System.out.println("doc_skills"+doc_skills[0]);
        /* check length of docs knows and user skills in other having same vector length*/
        if (knowns.length>=doc_skills.length){
          /* Init ouput vector to need dimension */
          for (int i=0;i<knowns.length;i++){
            knowns_vector.add(i,new Double(0.0));
          }
        /* get skills of doc related to pknows */
          System.out.println("knows larger");
          for (int i = 0; i<knowns.length;i++){
            if (knowns[i]!=null){

                int ind = Arrays.asList(doc_skills).indexOf(knowns[i]);
                if (ind!=-1){
                    System.out.println("knows checking "+knowns[i]+" "+skills);
                    System.out.println("barruan "+ind+" "+vector[i]);
                    knowns_vector.add(ind,new Double(vector[i]));
                }
                else knowns_vector.add(new Double(0.0));
          }
        }
       }
       else {
         /* Init ouput vector to need dimension */
         for (int j=0;j<doc_skills.length;j++){
           knowns_vector.add(j,new Double(0.0));
         }
         for (int i = 0; i<doc_skills.length;i++){
           int ind = Arrays.asList(knowns).indexOf(doc_skills[i]);
           if ( ind!=-1){
               knowns_vector.add(ind,new Double(vector[ind]));
           }
           else knowns_vector.add(new Double(0.0));
         }
       }
        ArrayList<String> docs = (ArrayList<String>) sbj.get("docs");
        String [] vct = tnp.split(",");
        double[] vec1 = Arrays.stream(vct)
                .mapToDouble(Double::parseDouble)
                .toArray();
        double[] knowns_vector1 = knowns_vector.stream().mapToDouble(Double::doubleValue).toArray();

        double sim = vectorSpaceModel.getSimilarity(vec1,knowns_vector1);
        System.out.println(sim);
        if (sim>0.09){
           sims.add(new similarities(sim,docs,skills));

        }
    }

}
 finally {
  //  cr.close();
 }
 Collections.sort(sims);
 String result = "{\"docs\":[";
 for(similarities sim:sims){
   System.out.println(sim.docs);
   System.out.println(sim.sim);
   result+="{\"sim\":"+sim.sim+",\"skills\":\""+sim.skills+"\",\"docs\":[";
   for(String doc:sim.docs){
     result+="\""+doc+"\",";
   }
   result = result.substring(0,result.length()-1);
   result+="]},";
 }
 result = result.substring(0,result.length()-1);
 result+="]}";
 if (sims.size() ==0) return "{\"docs\":[]}";
  return result;
}
/*
  Get similarity docs related with spaceVector
*/
public String getRelatedSubject (double [] vector){
  VectorSpaceModel vectorSpaceModel = new VectorSpaceModel();
  MongoCursor<Document> cr = subject.find().iterator();
  class similarities implements Comparable<similarities>{
    double sim = 0.0;
    ArrayList<String>  docs;
    public similarities(double s,ArrayList<String> d){
      this.sim =s;
      this.docs = d;
    }
    @Override
    public int compareTo(similarities s1) {
        if (this.sim < s1.sim) return 1;
        else return -1;
    }
  }
  ArrayList<similarities> sims = new ArrayList<similarities>();
  try {
    while (cr.hasNext()){
        Document sbj = cr.next();
        String tnp = (String)sbj.get("spaceVector");
        ArrayList<String> docs = (ArrayList<String>) sbj.get("docs");
        String [] vct = tnp.split(",");
        double[] vec1 = Arrays.stream(vct)
                .mapToDouble(Double::parseDouble)
                .toArray();
        double sim = vectorSpaceModel.getSimilarity(vec1,vector);
        if (sim>0.55){
           sims.add(new similarities(sim,docs));

        }
    }

}
 finally {
  //  cr.close();
 }
 Collections.sort(sims);
 String result = "{\"docs\":[";
 for(similarities sim:sims){
   System.out.println(sim.docs);
   System.out.println(sim.sim);
   result+="{\"sim\":"+sim.sim+",\"docs\":[";
   for(String doc:sim.docs){
     result+="\""+doc+"\",";
   }
   result = result.substring(0,result.length()-1);
   result+="]},";
 }
 result = result.substring(0,result.length()-1);
 result+="]}";
  return result;
}
/* add
   Student skill known
*/
public String addSkill (String studentid,String skill,String params){
  System.out.println("adding skill "+skill+ " student "+studentid);
  String tnp = new String("");
  Document query = new Document();
  query = new Document("_id", new ObjectId(
           studentid)).append("skills.name",skill);
   MongoCursor<Document> cursor = studentSkills.find(query).iterator();
  try {
    // SKill already exists
    if (cursor.hasNext()){
      System.out.println("Skill all ready exists !");
   }
   // SKill is new for student
   else{
     System.out.println("query not working ");
     Document _skill = new Document();
     _skill.append("name",skill);
     _skill.append("pknown",0.3);
     _skill.append("subject","math");
     _skill.append("answer",Arrays.asList());
     if (!params.equals("none")){
         _skill.append("bktParams",params);
     }
     // Insert to student skills
     Document std = new Document();
     std.append("_id",new ObjectId(studentid));
     studentSkills.updateOne(std,new Document("$push",new Document("skills",_skill)));
   }
  } finally {
     cursor.close();
  }
/*  try {
  studentSkills.updateOne(query,new Document("$set", new Document("pknown", 0.3)));
}
catch (Exception e){
  System.out.println(e);
}*/
  System.out.println("updating know of student");
  return tnp;
}
/*
  get correct answer
*/

public String getAnswer (String exId,String ans1){
  String ans ="";
  Document query = new Document();
  query.put("id",exId);
   MongoCursor<Document> cursor = exerciseAttr.find(query).iterator();
  try {
    // SKill already exists
    if (cursor.hasNext()){
      Document c = cursor.next();
       ans = (String)c.get("response");
       System.out.println("ans "+ans+" "+ans1);
      if (ans.equals(ans1)){
         ans = "true";
      }
      else ans ="false";

   }
   // SKill is new for student
   else{
     System.out.println("Warning exerciseAttr does not exists, please add before !");

   }
  } finally {
     cursor.close();
  }
  return ans;
}

/*
  get skill bkt parameters
*/

public String getSkillBktParams (String stdId, String skill){
  String p = new String("");
  Iterator<Document> cr;
  Document query = new Document();
  query = new Document("_id", new ObjectId(stdId));
   MongoCursor<Document> cursor = studentSkills.find(query).iterator();
  try {
    // SKill already exists
    if (cursor.hasNext()){
      Document c = cursor.next();
      List<Document> skills = (List<Document>)c.get("skills");
      cr = skills.iterator();

      try {
        int i =0 ;
        while (cr.hasNext()){
            Document sk = cr.next();
            String name = (String)sk.get("name");
            if (name!=null && name.equals(skill)){
              p = (String)sk.get("bktParams");
            }
            else return "";

        }
    //    System.out.println(c.toJson(),skills);


    }
     finally {
        cursor.close();
     }
   }
   // SKill is new for student
   else{
     return "";

   }
  } finally {
     cursor.close();
  }
  if (p==null) return "";
  return p;
}

/*
  get skills filtered by group
*/

public String[] getSkillOfGroup (String exId){
  String[] sks = new String[100];
  Iterator<Document> cr;
  Document query = new Document();
  query = new Document("id", new ObjectId(exId));
   MongoCursor<Document> cursor = exerciseAttr.find(query).iterator();
  try {
    // SKill already exists
    if (cursor.hasNext()){
      Document c = cursor.next();
      String group = (String)c.get("group");



   }
   // SKill is new for student
   else{
     System.out.println(">>>>> ERROR getting group <<<<<");

   }
  } finally {
     cursor.close();
  }
  return sks;
}
/*
  get student skills filtere
*/

public String[] getStudentSkills (String stdId,String exId){
  String[] sks = new String[100];
  Iterator<Document> cr;
  Document query = new Document();
/*  if (!exId.equals('none')){
    dbi.getSkillOfGroup(exId);
  }
  */
  query = new Document("_id", new ObjectId(stdId));
   MongoCursor<Document> cursor = studentSkills.find(query).iterator();
  try {
    // SKill already exists
    if (cursor.hasNext()){
      Document c = cursor.next();
      List<Document> skills = (List<Document>)c.get("skills");
      cr = skills.iterator();

      try {
        int i =0 ;
        while (cr.hasNext()){
            Document sk = cr.next();
            String name = (String)sk.get("name");
            sks[i] = name;
            System.out.println("getting skill");
            System.out.println(name);
            i++;
        }
    //    System.out.println(c.toJson(),skills);


    }
     finally {
        cursor.close();
     }
   }
   // SKill is new for student
   else{
     /*System.out.println("Adding no existing skill for user, with default values");
     this.addSkill(stdId,skill);
     return 0.3;*/

   }
  } finally {
     cursor.close();
  }
  return sks;
}
/*
  get student skills
*/

public String[] getStudentSkills (String stdId){
  String[] sks = new String[100];
  Iterator<Document> cr;
  Document query = new Document();
  query = new Document("_id", new ObjectId(stdId));
   MongoCursor<Document> cursor = studentSkills.find(query).iterator();
  try {
    // SKill already exists
    if (cursor.hasNext()){
      Document c = cursor.next();
      List<Document> skills = (List<Document>)c.get("skills");
      cr = skills.iterator();

      try {
        int i =0 ;
        while (cr.hasNext()){
            Document sk = cr.next();
            String name = (String)sk.get("name");
            sks[i] = name;
            System.out.println("getting skill");
            System.out.println(name);
            i++;
        }
    //    System.out.println(c.toJson(),skills);


    }
     finally {
        cursor.close();
     }
   }
   // SKill is new for student
   else{
     /*System.out.println("Adding no existing skill for user, with default values");
     this.addSkill(stdId,skill);
     return 0.3;*/

   }
  } finally {
     cursor.close();
  }
  return sks;
}

/*
  get saved pknow of student skill
*/

public double getSkillPknow (String stdId,String skill){
  double pknow = 0.0;
  Iterator<Document> cr;
  Document query = new Document();
  query = new Document("_id", new ObjectId(stdId)).append("skills.name",skill);
   MongoCursor<Document> cursor = studentSkills.find(query).iterator();
  try {
    // SKill already exists
    if (cursor.hasNext()){
      Document c = cursor.next();
      List<Document> skills = (List<Document>)c.get("skills");
      cr = skills.iterator();
      try {
        while (cr.hasNext()){
            Document sk = cr.next();
            String name = (String)sk.get("name");
            System.out.println(name);
            if (name!=null && name.equals(skill)){
                pknow = (double)sk.get("pknown");
                System.out.println(pknow);
            }
        }
    //    System.out.println(c.toJson(),skills);


    }
     finally {
        cursor.close();
     }
   }
   // SKill is new for student
   else{
     System.out.println("Adding no existing skill for user, with default values");
     this.addSkill(stdId,skill,"none");
     return 0.3;

   }
  } finally {
     cursor.close();
  }
  return pknow;
}

/* update
   Student skill known
*/
public String updateSkill (String studentid,String skill,Double pknow){
  System.out.println("updating skill "+skill+ " student "+studentid + " pknow "+pknow);
  String tnp = new String("");
  Document query = new Document();
  query = new Document("_id", new ObjectId(
           studentid)).append("skills.name",skill);
   MongoCursor<Document> cursor = studentSkills.find(query).iterator();
  try {
    // SKill already exists
    if (cursor.hasNext()){
      Document c = cursor.next();
      c.put("skills.name",skill);
      studentSkills.updateOne(c,new Document("$set",new Document("skills.$.pknown",pknow)));
   }
   // SKill is new for student
   else{
     System.out.println("Warning Skill does not exists, please add before !");
   }
  } finally {
     cursor.close();
  }

  System.out.println("updating know of student");
  return tnp;
}
/*
  add subject
*/
public String addSubject (String name,String skills,String vector,String doc){
  Document subj = new Document("id", name);
  subj.put("docs",Arrays.asList(doc));
  subj.put("spaceVector",vector);
  subj.put("skills",skills);
  subject.insertOne(subj);
  return subj.get("_id").toString();
}
/*
  remove subject
*/
public String removeSubject (String id){
  subject.deleteOne(new Document("_id", new ObjectId(id)));
  return "{\"result\":\"ok\"}";
}
/*
  get all subject
*/
public String getAllSubjects (){
  MongoCursor<Document> cursor = subject.find().iterator();
  String json = "{\"result\":[";
  while (cursor.hasNext()){
    Document c = (Document)cursor.next();
    json +=c.toJson()+",";

  }
  json = json.substring(0,json.length()-1);
  json+="]}";
  return json;
}

/*
  add exerciseAttr
*/
public String addExerciseAttr (String id,String vector,String subjects,String response,String question,
String answers,String group,String bktP){
  Document subj = new Document();
  subj.put("subjects",Arrays.asList(subjects));
  subj.put("id",id);
  subj.put("spaceVector",vector);
  subj.put("response",response);
  subj.put("question",question);
  subj.put("answers",answers);
  subj.put("group",group);
  subj.put("bktParameters",bktP);
  exerciseAttr.insertOne(subj);
  return subj.get("_id").toString();
}

/*
  remove exerciseAttr
*/
public String removeExercise (String id){

  exerciseAttr.deleteOne(new Document("_id", new ObjectId(id)));
  return "{\"result\":\"ok\"}";
}
/*
  get exerciseAttr
*/
public String getExerciseAttr (){
  MongoCursor<Document> cursor = exerciseAttr.find().iterator();
  String json = "{\"result\":[";
  while (cursor.hasNext()){
    Document c = (Document)cursor.next();
    json +=c.toJson()+",";

  }
  json = json.substring(0,json.length()-1);
  json+="]}";
  return json;
}
/*
get exercises by id
*/
public String getExercicesById (String id){
  String json ="";
  Document query = new Document();
  query.put("id",id);
   MongoCursor<Document> cursor = exerciseAttr.find(query).iterator();
  try {
    // SKill already exists
    if (cursor.hasNext()){
       Document c = cursor.next();
       List<String> subjects = (List<String>)c.get("subjects");
       String spaceVector = (String)c.get("spaceVector");
       json = "{\"skill\":"+"\""+subjects.get(0)+"\",\"spaceVector\":"+"\""+spaceVector+"\"}";


   }
   // SKill is new for student
   else{
     System.out.println("Warning Ids exerciseAttr does not exists, please add before !");
   }
  } finally {
     cursor.close();
  }
  return json;
}
}
