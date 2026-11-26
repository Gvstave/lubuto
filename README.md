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

## Electron desktop executable

Build the Windows executable from the repository root:

```powershell
npm run dist
```

The packaged backend scans a sibling folder named `LUBUTO LITERACY LESSONS`;
place the lesson folder beside the executable for it to be served. The reader
also stores the last selected language and lesson in the device's browser local
storage, so it can resume the learner's most recent lesson after being reopened.

The folder must contain the `Language/Lesson/index.html` structure. It can be
updated or replaced without rebuilding the executable.

The development app uses the three-lesson demo set in
`client/public/LUBUTO LITERACY LESSONS` (Bemba, Kaonde, and Lozi).
