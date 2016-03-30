import com.typesafe.sbteclipse.plugin.EclipsePlugin.EclipseKeys
//import play.PlayImport.PlayKeys._
import sbtbuildinfo.Plugin._


name := """kernkwaliteitenviewer"""

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayJava)

scalaVersion := "2.11.7"

lazy val viewer = (project in file("."))
	.enablePlugins(PlayJava)
	.settings (EclipseKeys.preTasks := Seq())

scriptClasspath := Seq("*")


libraryDependencies ++= Seq(
  cache,
 //Common.Dependencies.akkaRemote,
  
  //Common.Dependencies.geoideDomain,
  //Common.Dependencies.geoideRemote,
  
  Common.Dependencies.webjarsPlay,
  Common.Dependencies.webjarsBootstrap,
  Common.Dependencies.webjarsDojo,
  Common.Dependencies.webjarsOpenLayers,
  //Common.Dependencies.webjarsPutSelector,
  
  //Common.Dependencies.geoideViewerMapview,
  //Common.Dependencies.geoideViewerToc,
  //Common.Dependencies.geoideViewerPrintService,
  
  Common.Dependencies.webjarsFontAwesome
)  

javacOptions in Compile ++= Seq("-source", "1.8", "-target", "1.8")

includeFilter in (Assets, LessKeys.less) := "*.less"


// Setup Eclipse:
EclipseKeys.projectFlavor := EclipseProjectFlavor.Java           // Java project. Don't expect Scala IDE
EclipseKeys.createSrc := EclipseCreateSrc.ValueSet(EclipseCreateSrc.ManagedClasses, EclipseCreateSrc.ManagedResources)  // Use .class files instead of generated .scala files for views and routes 
//EclipseKeys.preTasks := Seq(compile in Compile)                  // Compile the project before generating Eclipse files, so that .class files for views and routes are present

publishTo := {
	val nexus = "http://nexus.idgis.eu/content/repositories/"
	if (isSnapshot.value)
		Some ("idgis-restricted-snapshots" at nexus + "restricted-snapshots")
	else
		Some ("idgis-restricted-releases" at nexus + "restricted-releases")
}





