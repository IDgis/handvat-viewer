package controllers;

import play.mvc.*;
import views.html.*;

public class Index extends Controller {
	public Result index() {
		return ok(index.render());
	}
}