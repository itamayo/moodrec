package org.ehu;

import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;
import com.mongodb.ServerAddress;

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
      this.addStudentData();
    }
    catch (Exception e){}
  }
public int addStudentData (){
/*
Mongo m = new Mongo("localhost", 27017);
DB db = m.getDB("test");
DBCollection myColl = db.getCollection("myCollection");

BasicDBObject docToInsert = new BasicDBObject("resourceID", "3");
docToInsert.put("resourceName", "Foo Test3");

BasicDBObject updateQuery = new BasicDBObject("_id", "1");
updateQuery.put("itemList.itemID", "1");

BasicDBObject updateCommand = new BasicDBObject("$push", new BasicDBObject("itemList.$.resources", docToInsert));

myColl.update(updateQuery, updateCommand);
System.out.println(myColl.findOne().toString());*/
  Document doc = new Document("id", "std01")
      .append("name", "iñigo tamayo")
      .append("skills", "multiplication")
      .append("correct", 0)
      .append("pknown", 0.3);
  studentSkills.insertOne(doc);
  this.prinStudentsData();
  return 1;
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

/* add or update
   Student skill known
*/
public String addSkillStudent (String id,String skill,Double pknow){
  System.out.println("adding skill student "+id);
  String tnp = new String("");
  Document query = new Document();
  query.put("_id", new ObjectId(id));
  query.put("skills", skill);
  studentSkills.updateOne(query,new Document("$set", new Document("pknown", pknow)));
  System.out.println("updating know of student");
  return tnp;
}
}
