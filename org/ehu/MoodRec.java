package org.ehu;
import java.util.List;
import java.util.Set;
import java.io.IOException;
import org.ehu.Bkt;
import org.ehu.DBInterface;
import org.ehu.HttpServer;
import java.io.InputStream;
import java.util.Properties;
import java.io.FileInputStream;

import static java.util.concurrent.TimeUnit.SECONDS;
public class MoodRec{

  public static void main(String [ ] args){
    System.out.println("Initing BKT");
    MoodRec mr = new MoodRec();
    mr.init();
  }
  public int init (){
    Properties prop = new Properties();
    InputStream config = null;
    try {

      config = new FileInputStream("config.properties");
      prop.load(config);
    } 	 catch (IOException ex) {
      ex.printStackTrace();
    } finally {
      if (config != null) {
        try {
          config.close();
        } catch (IOException e) {
          e.printStackTrace();
        }
      }
    }

    DBInterface dbi = new DBInterface();
    HttpServer.setProperties(prop);
    HttpServer.run();
    return 1;
  }

}
