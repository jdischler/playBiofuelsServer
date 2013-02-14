import sbt._
import Keys._
import PlayProject._

object ApplicationBuild extends Build {

    val appName         = "playBiofuelsServer"
    val appVersion      = "1.0-SNAPSHOT"

    val appDependencies = Seq(
      //javaCore
    )

    val main = PlayProject(appName, appVersion, appDependencies, mainLang = JAVA).settings(
      // Add your own project settings here      
    )

}
