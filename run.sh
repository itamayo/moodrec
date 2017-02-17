javac org/ehu/Bkt.java
javac -cp .:./libs/nanohttpd-2.3.2-SNAPSHOT.jar:./libs/nanohttpd-nanolets-2.3.2-SNAPSHOT.jar -Xlint:deprecation org/ehu/HttpServer.java
javac -cp .:./libs/mongo-java-driver-2.13.3.jar:org.ehu.Bkt org/ehu/DBInterface.java
javac -cp .:./libs/mongo-java-driver-2.13.3.jar:org.ehu.Bkt:org.ehu.DBInterface:./libs/nanohttpd-2.3.2-SNAPSHOT.jar:./libs/nanohttpd-nanolets-2.3.2-SNAPSHOT.jar org/ehu/MoodRec.java
java -cp .:./libs/mongo-java-driver-2.13.3.jar:org.ehu.Bkt:org.ehu.DBInterface:./libs/nanohttpd-2.3.2-SNAPSHOT.jar:./libs/nanohttpd-nanolets-2.3.2-SNAPSHOT.jar org.ehu.MoodRec -Xms264m -Xmx2G
