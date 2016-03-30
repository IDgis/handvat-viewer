package controllers;
import java.lang.reflect.Array;
import model.TextObject;
import play.mvc.Action;
import play.mvc.Controller;
import play.mvc.Result;
import play.routing.JavaScriptReverseRouter;
import views.html.layout;
import views.html.viewer;




public class Viewer extends Controller {

	 public Result layout() {
		 
		 //maak een paar tekstobjecten en stuur die naar de viewer
		 TextObject test = new TextObject("Handvat kernkwaliteiten", "Het handvat kernkwaliteiten is een hulpmiddel blabla");
		 TextObject test2 = new TextObject("Nationaal Landschap Zuid-Limburg", "Nationaal Landschap Zuid-Limburg bie ba boe");
		 
		 TextObject[] textObjects = new TextObject[2];
		 textObjects[0] = test;
		 textObjects[1] = test2;
		 
	     System.out.println( textObjects[1].getTitle());
		 return ok(layout.render(textObjects));
	    }
	
	 
	 public Result nextLevel (String level) {

		 //return ok(viewer.render("images/15621_Deelgebied Margraten-230316.jpg"));
		 return ok(viewer.render(level));
	 }
	 
	 
	 public Result jsRoutes() {
		    return ok(
		    		JavaScriptReverseRouter.create("jsRoutes",
							controllers.routes.javascript.Viewer.nextLevel()
		        )
		    );
		}
	 
	 
}


