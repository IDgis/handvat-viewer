import sbt._
import Keys._
//import play.PlayImport.PlayKeys._
import com.typesafe.sbt.web.Import._
import com.typesafe.sbt.web.Import.WebKeys._
import com.typesafe.sbt.rjs.Import._
import com.typesafe.sbt.less.Import._

object Common {
	//val geoideCommonsVersion = "1.0.3"
	
	object Dependencies {
    //val akkaRemote = "com.typesafe.akka" %% "akka-remote" % "2.3.4"
    
    //val geoideDomain = "nl.idgis.geoide" % "geoide-domain" % "1.0.4-SNAPSHOT"
    //val geoideUtil = "nl.idgis.geoide" % "geoide-util" % "1.0.4-SNAPSHOT"
    //val geoideRemote = "nl.idgis.geoide" % "geoide-remote" % "1.0.4-SNAPSHOT"
		
	//val geoideViewerMapview = "nl.idgis.geoide" %% "geoide-mapview" % geoideCommonsVersion changing ()
	//val geoideViewerToc = "nl.idgis.geoide" %% "geoide-toc" % geoideCommonsVersion changing ()
    //val geoideViewerPrintService = "nl.idgis.geoide" %% "geoide-print-service" % geoideCommonsVersion changing ()
		
    val webjarsPlay = "org.webjars" %% "webjars-play" % "2.5.0"
    val webjarsBootstrap = "org.webjars" % "bootstrap" % "3.3.5"
    val webjarsDojo = "nl.idgis.webjars" % "dojo-base" % "1.10.0-1"
    val webjarsOpenLayers = "org.webjars" % "openlayers" % "3.8.2"
   //val webjarsPutSelector = "org.webjars" % "put-selector" % "0.3.5"
    val webjarsFontAwesome = "org.webjars" % "font-awesome" % "4.2.0"
  		
	}
}