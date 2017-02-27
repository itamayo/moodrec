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
import com.mongodb.Block;

import com.mongodb.client.MongoCursor;
import static com.mongodb.client.model.Filters.*;
import com.mongodb.client.result.DeleteResult;
import static com.mongodb.client.model.Updates.*;
import com.mongodb.client.result.UpdateResult;
import java.util.ArrayList;
import java.util.List;


public  class DBInterface {
  MongoCollection<Document> student;
  MongoCollection<Document> studentSkills;

  public DBInterface(){
    try {
      MongoClient mongoClient = new MongoClient( "localhost" , 27017 );
      MongoDatabase db = mongoClient.getDatabase("mydb");
      System.out.println("Connected to DB");
      student = db.getCollection("student");
      studentSkills = db.getCollection("StudentSkills");

    }
    catch (Exception e){}
  }
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
           bkt.updateMastering(correct);
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
/* add
   Subject
*/
public String addSubject (String subjectid,String vector){
  /* TODO */
  return " ";
}
/* add
   Subject
*/
public String getSubject (String subjectid){
  /* TODO */
  return " ";
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
     studentSkills.updateOne(std,new Document("$set",new Document("skills",Arrays.asList(_skill))));
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
      studentSkills.updateOne(c,new Document("$set",new Document("pknown",pknow)));
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
}
