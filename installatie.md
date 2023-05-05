# Installatie

Dit is een meteor js applicatie.
Zie voor een algemene beschrijving om meteor te deployen en runnen de beschrijving in het project geoide-admin-deployment.

Hieronder wordt een aanvullende instructie gegeven voor het gebruik van IIS als reverse proxy server.

## Windows IIS als reverse proxy

Aan de volgende voorwaarden moet zijn voldaan:

* bij het opstarten van meteor moet de volgende omgevingsvariabele gedefinieerd zijn: `set ROOT_URL=http://HOST/handvat-admin/`
* In  route.js bestand van de applicatie moet het volgende zijn opgenomen:

```
Router.route('/handvat-admin/', {
	name: 'NAME-OF-COMPONENT'
});
```

* Installeer de URL-rewrite plugin voor IIS.
* Maak in IIS een Inbound Rule

Vul in bij:
* Pattern: `^handvat-admin/(.*)`
* Rewrite URL: `http://localhost:3030/handvat-admin/{R:1}`

## Een nieuwe versie neerzetten

* login als HandvatMeteor
* kopieer zip in deployment map
* stop service
* vervang bestanden
* voer `npm install` in deployment map uit
* start service
