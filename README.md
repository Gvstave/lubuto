# Lubuto Reader

Lubuto Reader is an offline literacy lesson reader. The web interface is built with React and Vite. A small Express backend discovers lessons from the `LUBUTO LITERACY LESSONS` folder and serves the lesson files and the built interface.

## Project layout

```text
lubuto/
	client/                    React + Vite source
		dist/                    Production client build
	server/                    Express backend
		app.js                   API, lesson, and static-file routes
		server.js                Starts the backend on port 5000
		services/scanLesson.js   Builds the language and lesson tree
		config.json              Lesson folder configuration
	LUBUTO LITERACY LESSONS/   Lesson content grouped by language
	README.md
```

Each lesson is a folder containing an `index.html` file. For example:

```text
LUBUTO LITERACY LESSONS/
	Bemba/
		01_Icibemba/
			index.html
```

## Development

Install dependencies in both application parts:

```powershell
cd client
npm install

cd ../server
npm install
```

Start the client and backend in separate terminals:

```powershell
# Terminal 1
cd client
npm run dev

# Terminal 2
cd server
node server.js
```

The Vite client normally runs at `http://localhost:5173`. The backend runs at `http://localhost:5000`.

## Backend routes

- `GET /api/tree` returns the available languages and lessons.
- `/lessons/...` serves lesson files from the configured lessons folder.
- `/` serves the production client from `server/dist` when that folder exists.

The client currently requests the lesson tree from `http://localhost:5000/api/tree`.

## Build the client

```powershell
cd client
npm run build
```

Copy the generated `client/dist` folder into the desktop bundle as `dist` so the backend can serve it.

## NW.js desktop offshoot

The operational desktop app is the separate NW.js bundle, currently located at `Lubuto Reader/`. It contains:

```text
Lubuto Reader/
	nw.exe                    NW.js runtime
	package.json              NW.js window and Node entry configuration
	server.js                 Starts the embedded Express backend
	app.js                    Desktop backend routes
	dist/                     Built React client
	LUBUTO LITERACY LESSONS/  Desktop lesson content
```

The desktop application starts `server.js` through the `node-main` setting in `package.json`. The embedded backend serves both `dist` and the local lessons folder, so the app can operate without an internet connection or a separate Node.js installation.

To update the desktop app:

1. Build the client with `npm run build` from `client`.
2. Replace the NW.js bundle's `dist` folder with the generated `client/dist` folder.
3. Copy or update `LUBUTO LITERACY LESSONS` in the NW.js bundle.
4. Confirm `config.json` contains:

	 ```json
	 {
		 "lessonDirectory": "LUBUTO LITERACY LESSONS"
	 }
	 ```

5. Start the NW.js bundle with `nw.exe` or open the packaged desktop executable.

The NW.js bundle is the deployable desktop application. The `client` and `server` folders in this repository are the source used to develop and produce that bundle.
