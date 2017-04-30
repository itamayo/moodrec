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
              double pknow = 0.0;
              if (cmd.equals("add")){
                String _id = dbi.addSkill(id,skill);
                text = "{\"response\":\"skill added\",\"id\":\""+_id+"\"}";
              }
              else if (cmd.equals("update")){
                  Bkt bkt = new Bkt();
                  double savedPknow = dbi.getSkillPknow(id,skill);
                  if (correct.equals("true")) pknow = bkt.updateMastering(true,savedPknow);
                  else  pknow = bkt.updateMastering(false,savedPknow);
                  text = dbi.updateSkill(id,skill,pknow);
                  text = "{\"skill\":\""+skill+"\",\"pknow\":"+pknow+"}";
                  System.out.println(text);
              }
              else if (cmd.equals("get")){
                System.out.println("ID"+id);
                 if(id.compareTo("none")!=-1){
                    text = dbi.getAllStudent();
                    System.out.println(text);
                 }else
                  text = dbi.getStudent(id);
              }
              else if (cmd.equals("remove")){
                  text = dbi.removeStudent(id);
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
                return Response.newFixedLengthResponse(getStatus(), getMimeType(), inp, size);
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
            return Response.newFixedLengthResponse(getStatus(), getMimeType(), inp, size);
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
            if (cmd.equals("create")){
              String _id = dbi.addSubject(id,vector,doc);
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
            else if (cmd.equals("getRecommendation")){
                System.out.println(vector);
                String[] vect1 = urlParams.get("vector").split(",");
                double[] vec1 = Arrays.stream(vect1)
                        .mapToDouble(Double::parseDouble)
                        .toArray();

               String result = dbi.getRelatedSubject(vec1);
               text = result;

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
            return Response.newFixedLengthResponse(getStatus(), getMimeType(), inp, size);
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
            if (cmd.equals("create")){
              String _id = dbi.addExerciseAttr(id,vector,subjects);
              text = "{\"response\":\"exerciseAttr added\",\"id\":\""+_id+"\"}";
            }
            else if (cmd.equals("update")){
                //text = dbi.getStudent(id);
            }
            else if (cmd.equals("remove")){
                text = dbi.removeExercise(id);
            }
            else if (cmd.equals("get")){
                text = dbi.getExerciseAttr();
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
            return Response.newFixedLengthResponse(getStatus(), getMimeType(), inp, size);
        }

    }
    static public class StreamUrl extends DefaultStreamHandler {

        @Override
        public String getMimeType() {
            return "text/plain";
        }

        @Override
        public IStatus getStatus() {
            return Status.OK;
        }

        @Override
        public InputStream getData() {
            return new ByteArrayInputStream("a stream of data ;-)".getBytes());
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
        super(PORT);
        addMappings();
        System.out.println("\nRunning! Point your browers to http://localhost:" + PORT + "/ \n");
    }

    /**
     * Add the routes Every route is an absolute path Parameters starts with ":"
     * Handler class should implement @UriResponder interface If the handler not
     * implement UriResponder interface - toString() is used
     */
    @Override
    public void addMappings() {
        super.addMappings();
        addRoute("/student/:cmd/:id", StudentHandler.class);
        addRoute("/subject/:cmd/:id/:vector/:doc", SubjectHandler.class);
        addRoute("/exerciseAttr/:cmd/:id/:vector/:subjects", ExerciseAttributesHandler.class);
        addRoute("/studentSkill/:cmd/:skill/:id/:correct", StudentSkillHandler.class);
        addRoute("/stream", StreamUrl.class);
        addRoute("/browse/(.)+", StaticPageTestHandler.class, new File("./resources").getAbsoluteFile());
    }
    public static void run () {
          ServerRunner.run(HttpServer.class);
      }

}
