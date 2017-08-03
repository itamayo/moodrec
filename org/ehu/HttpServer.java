package org.ehu;

/*
 * #%L
 * NanoHttpd-Samples
 * %%
 * Copyright (C) 2012 - 2015 nanohttpd
 * %%
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the nanohttpd nor the names of its contributors
 *    may be used to endorse or promote products derived from this software without
 *    specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
 * IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
 * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
 * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 * LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE
 * OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 * #L%
 */

/**
 * Created by vnnv on 7/17/15.
 * Simple httpd server based on NanoHTTPD
 * Read the source. Everything is there.
 */

import java.io.BufferedInputStream;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.Map;
import java.util.*;
import java.util.Properties;

import org.nanohttpd.protocols.http.IHTTPSession;
import org.nanohttpd.protocols.http.response.IStatus;
import org.nanohttpd.protocols.http.response.Response;
import org.nanohttpd.protocols.http.response.Status;
import org.nanohttpd.router.RouterNanoHTTPD;
import org.nanohttpd.router.RouterNanoHTTPD.DefaultHandler;
import org.nanohttpd.router.RouterNanoHTTPD.DefaultStreamHandler;
import org.nanohttpd.router.RouterNanoHTTPD.GeneralHandler;
import org.nanohttpd.router.RouterNanoHTTPD.StaticPageHandler;
import org.nanohttpd.router.RouterNanoHTTPD.UriResource;
import org.nanohttpd.router.RouterNanoHTTPD.UriResponder;
import org.nanohttpd.util.ServerRunner;
import org.ehu.DBInterface;
import org.ehu.Bkt;

public class HttpServer extends RouterNanoHTTPD {

        private static final int PORT = 8080;
        private DBInterface dbi = new DBInterface();
        private static Properties config;
        public static void setProperties(Properties prop){
           config = prop;
        }
        public static class StudentSkillHandler extends DefaultHandler {

            @Override
            public String getText() {
                return "not implemented";
            }

            public String getText(Map<String, String> urlParams, IHTTPSession session) {
              DBInterface dbi = new DBInterface();
              String text = "";
              System.out.println("ID"+urlParams.get("id"));
              System.out.println("CMD"+urlParams.get("cmd"));
              System.out.println("CMD"+urlParams.get("skill"));
              String id = urlParams.get("id");
              String cmd = urlParams.get("cmd");
              String skill = urlParams.get("skill");
              String correct = urlParams.get("correct");
              String exId = urlParams.get("exId");
              String token = urlParams.get("token");

              double pknow = 0.0;
              System.out.println(token);
              String auth = dbi.authByToken(token);
              if (auth.equals("admin")  || auth.equals("user")){
                  if (cmd.equals("add")){
                    String _id = dbi.addSkill(id,skill);
                    text = "{\"response\":\"skill added\",\"id\":\""+_id+"\"}";
                  }
                  else if (cmd.equals("update")){
                      Bkt bkt = new Bkt();
                      double savedPknow = dbi.getSkillPknow(id,skill);
                      if (!exId.equals("none")){
                         correct = dbi.getAnswer(exId,correct);
                         System.out.println("exId"+exId);
                      }
                      if (correct.equals("true")) pknow = bkt.updateMastering(true,savedPknow);
                      else  pknow = bkt.updateMastering(false,savedPknow);
                      text = dbi.updateSkill(id,skill,pknow);
                      text = "{\"skill\":\""+skill+"\",\"pknow\":"+pknow+"}";
                      System.out.println(text);


                  }
                  else if (cmd.equals("get")){
                    System.out.println("ID"+id);
                     if(id.equals("none")){
                        text = dbi.getAllStudent();
                        System.out.println(text);
                     }else
                      text = dbi.getStudent(id);
                  }
                  else if (cmd.equals("remove")){
                      text = dbi.removeStudent(id);
                  }
                  else if (cmd.equals("getUserRecommendation")){

                      String[] vect1 = dbi.getStudentSkills(id);
                      System.out.println("student SKILLS "+vect1[0]+vect1[1]);
                    /* Get user pknow, and create low pknown vector */
                    double[] vec1 = new double[1];
                    for (int i =0; i<vect1.length;i++){
                      double pknown = dbi.getSkillPknow(id,vect1[i]);
                      if (pknown<0.5){
                        vec1 = push(vec1,pknown);
                      }
                      else {
                        /** remove skill whether knowns **/
                        final List<String> list =  new ArrayList<String>();
                        Collections.addAll(list, vect1);
                        list.remove(vect1[i]);
                        vect1 = list.toArray(new String[list.size()]);
                      }
                    }
                    /* Normalize vector before send */

                     String result = dbi.getRelatedSubjectByPknows(vec1,vect1);
                     text = result;

                  }
                }
                return text;
            }

            @Override
            public String getMimeType() {
                return "text/html";
            }

            @Override
            public IStatus getStatus() {
                return Status.OK;
            }

            public Response get(UriResource uriResource, Map<String, String> urlParams, IHTTPSession session) {
                String text = getText(urlParams, session);
                ByteArrayInputStream inp = new ByteArrayInputStream(text.getBytes());
                int size = text.getBytes().length;
                Response response = Response.newFixedLengthResponse(getStatus(), getMimeType(), inp, size);
                response.addHeader("Access-Control-Allow-Methods", "DELETE, GET, POST, PUT");
                response.addHeader("Access-Control-Allow-Origin",  "*");
                response.addHeader("Access-Control-Allow-Headers", "X-Requested-With");
                return response;
            }

        }
    public static class StudentHandler extends DefaultHandler {

        @Override
        public String getText() {
            return "not implemented";
        }

        public String getText(Map<String, String> urlParams, IHTTPSession session) {
            DBInterface dbi = new DBInterface();
            String text = "";
            System.out.println("ID"+urlParams.get("id"));
            System.out.println("CMD"+urlParams.get("cmd"));
            String id = urlParams.get("id");
            String cmd = urlParams.get("cmd");
            String vector = urlParams.get("vector");
            String token = urlParams.get("token");
            String auth = dbi.authByToken(token);
            if (auth.equals("admin")  || auth.equals("user")){
                if (cmd.equals("create")){
                  String _id = dbi.addStudent(id);
                  text = "{\"response\":\"student added\",\"id\":\""+_id+"\"}";
                }
                else if (cmd.equals("update")){
                  //  text = dbi.getStudent(id);
                }
                else if (cmd.equals("get")){
                    text = dbi.getStudent(id);
                }
                else if (cmd.equals("remove")){
                    text = dbi.removeStudent(id);
                }
          }

            return text;
        }
        @Override
        public String getMimeType() {
            return "text/html";
        }

        @Override
        public IStatus getStatus() {
            return Status.OK;
        }

        public Response get(UriResource uriResource, Map<String, String> urlParams, IHTTPSession session) {
            String text = getText(urlParams, session);
            ByteArrayInputStream inp = new ByteArrayInputStream(text.getBytes());
            int size = text.getBytes().length;
            Response response = Response.newFixedLengthResponse(getStatus(), getMimeType(), inp, size);
            response.addHeader("Access-Control-Allow-Methods", "DELETE, GET, POST, PUT");
            response.addHeader("Access-Control-Allow-Origin",  "*");
            response.addHeader("Access-Control-Allow-Headers", "X-Requested-With");
            return response;
        }

    }
    public static class SubjectHandler extends DefaultHandler {

        @Override
        public String getText() {
            return "not implemented";
        }

        public String getText(Map<String, String> urlParams, IHTTPSession session) {
            DBInterface dbi = new DBInterface();
            String text = "";
            System.out.println("ID "+urlParams.get("id"));
            System.out.println("CMD "+urlParams.get("cmd"));
            System.out.println("Vector "+urlParams.get("vector"));
            System.out.println("DOC "+urlParams.get("doc"));
            String id = urlParams.get("id");
            String cmd = urlParams.get("cmd");
            String vector = urlParams.get("vector");
            String doc = urlParams.get("doc");
            String skills = urlParams.get("skills");
            String token = urlParams.get("token");
            String auth = dbi.authByToken(token);
            if (auth.equals("admin")  || auth.equals("user")){
                if (cmd.equals("create")){
                  String _id = dbi.addSubject(id,skills,vector,doc);
                  text = "{\"response\":\"subject added\",\"id\":\""+_id+"\"}";
                }
                else if (cmd.equals("update")){
                    //text = dbi.getStudent(id);
                }
                else if (cmd.equals("remove")){
                    text = dbi.removeSubject(id);
                }
                else if (cmd.equals("get")){
                    if (id.equals("none")){
                        // get all subjects
                        text = dbi.getAllSubjects();
                    }else{
                      text = dbi.getStudent(id);
                    }
                }
                /* Recomendation by exercises result */
                else if (cmd.equals("getRecommendation")){
                    System.out.println(vector);
                    String[] vect1 = urlParams.get("vector").split(",");
                    double[] vec1 = Arrays.stream(vect1)
                            .mapToDouble(Double::parseDouble)
                            .toArray();

                   String result = dbi.getRelatedSubject(vec1);
                   text = result;

                }

              }

            return text;
        }
        @Override
        public String getMimeType() {
            return "text/html";
        }

        @Override
        public IStatus getStatus() {
            return Status.OK;
        }

        public Response get(UriResource uriResource, Map<String, String> urlParams, IHTTPSession session) {
            String text = getText(urlParams, session);
            ByteArrayInputStream inp = new ByteArrayInputStream(text.getBytes());
            int size = text.getBytes().length;
            Response response = Response.newFixedLengthResponse(getStatus(), getMimeType(), inp, size);
            response.addHeader("Access-Control-Allow-Methods", "DELETE, GET, POST, PUT");
            response.addHeader("Access-Control-Allow-Origin",  "*");
            response.addHeader("Access-Control-Allow-Headers", "X-Requested-With");
            return response;
        }

    }
    public static class ExerciseAttributesHandler extends DefaultHandler {

        @Override
        public String getText() {
            return "not implemented";
        }

        public String getText(Map<String, String> urlParams, IHTTPSession session) {
            DBInterface dbi = new DBInterface();
            String text = "";
            System.out.println("ID "+urlParams.get("id"));
            System.out.println("CMD "+urlParams.get("cmd"));
            System.out.println("Vector "+urlParams.get("vector"));
            System.out.println("subjects "+urlParams.get("subjects"));
            String id = urlParams.get("id");
            String cmd = urlParams.get("cmd");
            String vector = urlParams.get("vector");
            String subjects = urlParams.get("subjects");
            String answer = urlParams.get("answer");
            String answers = urlParams.get("answers");
            String question = urlParams.get("question");
            String group = urlParams.get("group");
            String token = urlParams.get("token");
            String auth = dbi.authByToken(token);
            if (auth.equals("admin")  || auth.equals("user")){
                if (cmd.equals("create")){
                  String _id = dbi.addExerciseAttr(id,vector,subjects,answer,question,answers,group);
                  text = "{\"response\":\"exerciseAttr added\",\"id\":\""+_id+"\"}";
                }
                else if (cmd.equals("update")){
                    //text = dbi.getStudent(id);
                }
                else if (cmd.equals("remove")){
                    text = dbi.removeExercise(id);
                }
                else if (cmd.equals("get")){
                   if (id.equals("none"))
                    text = dbi.getExerciseAttr();
                   else
                     text = dbi.getExercicesById(id);
                   System.out.println(text);
                }
                else if (cmd.equals("compare")){
                    String[] vect1 = urlParams.get("subjects").split(",");
                    double[] vec1 = Arrays.stream(vect1)
                            .mapToDouble(Double::parseDouble)
                            .toArray();
                    double[] vec2 = Arrays.stream(vector.split(","))
                                    .mapToDouble(Double::parseDouble)
                                    .toArray();
                    double result = new VectorSpaceModel().getSimilarity(vec1,vec2);
                    System.out.println("Similarity;"+result);
                }
          }

            return text;
        }
        @Override
        public String getMimeType() {
            return "text/html";
        }

        @Override
        public IStatus getStatus() {
            return Status.OK;
        }

        public Response get(UriResource uriResource, Map<String, String> urlParams, IHTTPSession session) {
            String text = getText(urlParams, session);
            ByteArrayInputStream inp = new ByteArrayInputStream(text.getBytes());
            int size = text.getBytes().length;
            Response response = Response.newFixedLengthResponse(getStatus(), getMimeType(), inp, size);
            response.addHeader("Access-Control-Allow-Methods", "DELETE, GET, POST, PUT");
            response.addHeader("Access-Control-Allow-Origin",  "*");
            response.addHeader("Access-Control-Allow-Headers", "X-Requested-With");
            return response;
        }

    }
    /* Security manager */
    public static class AuthManagerHandler extends DefaultHandler {

        @Override
        public String getText() {
            return "not implemented";
        }

        public String getText(Map<String, String> urlParams, IHTTPSession session) {
            DBInterface dbi = new DBInterface();
            String text = "";
            System.out.println("ID "+urlParams.get("id"));
            System.out.println("CMD "+urlParams.get("cmd"));
            String id = urlParams.get("id");
            String cmd = urlParams.get("cmd");
            String admin = urlParams.get("admin");
            String token = urlParams.get("token");

            if (cmd.equals("create")){
              String _id = dbi.createNewToken(id,admin);
              text = "{\"response\":\"token added\",\"id\":\""+_id+"\"}";
            }
            else if (cmd.equals("update")){
                //text = dbi.getStudent(id);
            }
            else if (cmd.equals("remove")){
                text = dbi.removeExercise(id);
            }
            else if (cmd.equals("login")){
                System.out.println(id);
                System.out.println(token);
                String auth = dbi.auth(id,token);
                System.out.println(auth);
                if (auth.equals("admin")  || auth.equals("user")){
                    if (auth.equals("admin")){
                      text ="{\"admin\":true,\"id\":\""+id+"\",\"token\":\""+token+"\"}";
                    }
                    else {
                      text ="{\"admin\":false,\"id\":\""+id+"\",\"token\":\""+token+"\"}";
                    }
                }
                else {
                    text = "{\"response\":\"invalid\",\"id\":\""+id+"\"}";
                }
            }
            else if (cmd.equals("get")){
               if (id.equals("none"))
                text = dbi.getExerciseAttr();
               else
                 text = dbi.getExercicesById(id);
               System.out.println(text);
            }



            return text;
        }
        @Override
        public String getMimeType() {
            return "text/html";
        }

        @Override
        public IStatus getStatus() {
            return Status.OK;
        }

        public Response get(UriResource uriResource, Map<String, String> urlParams, IHTTPSession session) {
            String text = getText(urlParams, session);
            ByteArrayInputStream inp = new ByteArrayInputStream(text.getBytes());
            int size = text.getBytes().length;
            Response response = Response.newFixedLengthResponse(getStatus(), getMimeType(), inp, size);
            response.addHeader("Access-Control-Allow-Methods", "DELETE, GET, POST, PUT");
            response.addHeader("Access-Control-Allow-Origin",  "*");
            response.addHeader("Access-Control-Allow-Headers", "X-Requested-With");
            return response;
        }

    }
    public static class StaticPageTestHandler extends StaticPageHandler {

        @Override
        protected BufferedInputStream fileToInputStream(File fileOrdirectory) throws IOException {
            if ("exception.html".equals(fileOrdirectory.getName())) {
                throw new IOException("trigger something wrong");
            }
            return super.fileToInputStream(fileOrdirectory);
        }
    }

    /**
     * Create the server instance
     */
    public HttpServer() throws IOException {
        super(Integer.parseInt(config.getProperty("port")));
        addMappings();
        System.out.println("\nRunning! Point your browers to http://localhost:" + config.getProperty("port") + "/ \n");
    }

    /**
     * Add the routes Every route is an absolute path Parameters starts with ":"
     * Handler class should implement @UriResponder interface If the handler not
     * implement UriResponder interface - toString() is used
     */
    @Override
    public void addMappings() {
        super.addMappings();
        addRoute("/student/:cmd/:id:/:token", StudentHandler.class);
        addRoute("/subject/:cmd/:id/:skills/:vector/:doc/:token", SubjectHandler.class);
        addRoute("/exerciseAttr/:cmd/:id/:vector/:subjects/:question/:answers/:answer/:group/:token", ExerciseAttributesHandler.class);
        addRoute("/studentSkill/:cmd/:skill/:id/:correct/:exId/:token", StudentSkillHandler.class);
        addRoute("/admin/:cmd/:id/:admin/:token", AuthManagerHandler.class);
        addRoute("/browse/(.)+", StaticPageTestHandler.class, new File("./resources").getAbsoluteFile());
    }
    public static void run () {
          ServerRunner.run(HttpServer.class);
      }
  private static double[] push(double[] array, double push) {
      double[] longer = new double[array.length + 1];
      for (int i = 0; i < array.length; i++)
          longer[i] = array[i];
      longer[array.length] = push;
      return longer;
  }

}
