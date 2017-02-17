package org.ehu;
import java.util.List;
import java.util.Set;
import java.io.IOException;
import org.ehu.Bkt;
import org.ehu.DBInterface;
import org.ehu.HttpServer;

import static java.util.concurrent.TimeUnit.SECONDS;
public class MoodRec{

  public static void main(String [ ] args){
    System.out.println("Initing BKT");
    MoodRec mr = new MoodRec();
    mr.init();
  }
  public int init (){
    DBInterface dbi = new DBInterface();
    HttpServer.run();
    dbi.addStudentData();
    dbi.prinStudentsData();
    return 1;
  }

}
