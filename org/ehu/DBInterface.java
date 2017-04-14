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

  public DBInterface(){
    try {
      MongoClient mongoClient = new MongoClient( "localhost" , 27017 );
      MongoDatabase db = mongoClient.getDatabase("mydb");
      System.out.println("Connected to DB");
      student = db.getCollection("student");
      subject = db.getCollection("subject");
      studentSkills = db.getCollection("StudentSkills");
      exerciseAttr = db.getCollection("exerciseAttr");


    }
    catch (Exception e){}
  }
/*
  add student data

*/
public String addStudent (String name){
  Document doc = new Document("name", name);
  doc.put("skills",Arrays.asList());
  studentSkills.insertOne(doc);
  return doc.get("_id").toString();
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

/* add
   Subject
*/
public String getSubject (String subjectid){
  /* TODO */
  return " ";
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
public String addSkill (String studentid,String skill){
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
            if (name.equals(skill)){
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
     System.out.println("Warning Skill does not exists, please add before !");
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
public String addSubject (String name,String vector,String doc){
  Document subj = new Document("id", name);
  subj.put("docs",Arrays.asList(doc));
  subj.put("spaceVector",vector);
  subject.insertOne(subj);
  return subj.get("_id").toString();
}

/*
  add exerciseAttr
*/
public String addExerciseAttr (String id,String vector,String subjects){
  Document subj = new Document();
  subj.put("subjects",Arrays.asList(subjects));
  subj.put("id",id);
  subj.put("spaceVector",vector);
  exerciseAttr.insertOne(subj);
  return subj.get("_id").toString();
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

}
