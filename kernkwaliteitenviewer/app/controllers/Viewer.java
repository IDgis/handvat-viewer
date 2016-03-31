package controllers;
import java.lang.reflect.Array;
import model.TextObject;
import play.mvc.Action;
import play.mvc.Controller;
import play.mvc.Result;
import play.routing.JavaScriptReverseRouter;
import views.html.layout;
import views.html.mapviewer;
import views.html.textviewer;




public class Viewer extends Controller {
	
	
	String testText = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui."; 
	
	
	 public Result layout() {
		 
		 //maak een paar tekstobjecten en stuur die naar de viewer

		 TextObject[] textObjectsLevel1 = new TextObject[4];
		 textObjectsLevel1[0] = new TextObject("Handvat kernkwaliteiten", testText);
		 textObjectsLevel1[1] = new TextObject("Nationaal Landschap Zuid-Limburg", testText);
		 textObjectsLevel1[2] = new TextObject("Kernkwaliteiten", testText);
		 textObjectsLevel1[3] = new TextObject("Deelgebieden", testText);

		 String title = "";
		 return ok(layout.render(textObjectsLevel1, title));
	    }
	
	 
	 public Result getMapHtml (String level) {
		 //return ok(viewer.render("images/15621_Deelgebied Margraten-230316.jpg"));
		 return ok(mapviewer.render(level));
	 }
	 
	 public Result getTextHtml (String level) {
		 
		//maak een paar tekstobjecten en stuur die naar de viewer
		 TextObject test = new TextObject("Gebiedsprofiel" , testText);
		 TextObject test2 = new TextObject("Leidende beginselen", testText);
		 
		 TextObject[] textObjects = new TextObject[2];
		 textObjects[0] = test;
		 textObjects[1] = test2;
		 
		 String mainTitle = "Deelgebied Margraten";
		 
		 //return ok(viewer.render("images/15621_Deelgebied Margraten-230316.jpg"));
		 return ok (textviewer.render  (textObjects,mainTitle, level));
	 }
	 
	 
	 public Result jsRoutes() {
		    return ok(
		    		JavaScriptReverseRouter.create("jsRoutes",
							controllers.routes.javascript.Viewer.getMapHtml(),
							controllers.routes.javascript.Viewer.getTextHtml()
							
		        )
		    );
		}
	 
	 
}


