import com.mongodb.BasicDBObject;
import com.mongodb.BulkWriteOperation;
import com.mongodb.BulkWriteResult;
import com.mongodb.Cursor;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.MongoClient;
import com.mongodb.ParallelScanOptions;
import com.mongodb.ServerAddress;

import java.util.List;
import java.util.Set;
import org.ehu.Bkt;
import static java.util.concurrent.TimeUnit.SECONDS;
public class MoodRec{

  public static void main(String [ ] args){
    System.out.println("Initing BKT");
    MoodRec mr = new MoodRec();
    mr.init();
  }
  public int init (){
    DBInterface dbi = new DBInterface();
    return 1;
  }
  class DBInterface {
    DBCollection student;
    DBCollection studentSkills;

    public DBInterface(){
      try {
        MongoClient mongoClient = new MongoClient( "localhost" , 27017 );
        DB db = mongoClient.getDB( "mydb" );
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
    BasicDBObject doc = new BasicDBObject("id", "std01")
        .append("name", "iñigo tamayo")
        .append("skills", "multiplication")
        .append("correct", 0);
    studentSkills.insert(doc);
    this.prinStudentsData();
    return 1;
  }
  public void prinStudentsData (){
    Bkt bkt = new Bkt();
    DBCursor cursor = studentSkills.find();
      try {
         while(cursor.hasNext()) {
             DBObject c = cursor.next();
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
}
}
