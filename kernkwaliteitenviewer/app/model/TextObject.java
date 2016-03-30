package model;

public class TextObject {
	private String title;
	private String text;
	
	public TextObject (String title, String text){
		this.title = title;
		this.text = text;
	}
	
	public String getTitle() {
		return title;
	}
	
	public String getText() {
		return text;
	}

}
