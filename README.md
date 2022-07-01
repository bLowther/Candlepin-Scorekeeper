# Candlepin Scorekeeper - Interview Exercise

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). The requirements and description for this exercise were added to the `docs` directory for convenience.

Overview:

* Update the LICENSE to either be open source OR to be copyrighted to you. This exercise is solely for us to review your code and skills.
* Create a new repo with this code as the base. There should be two branches: `main` and `devel`.
* Create a branch from `devel` and create the application there.
* Use the provided 'dev-tool' in the UI to progress through the app's states. The dev-tool has instructions, but the basic idea is that you may: "activate" a lane, define
  bowlers, and "bowl" for each player
* Once done, create a pull request (from your dev branch -> devel), assign stone.ejoseph@protonmail.com or sreekar.siddula@dataductus.com to it, and notify us of the code.

## Dependencies

* NPM v16+

## API Client

An API client was automatically generated via [Swagger](http://editor.swagger.io). The client is already configured in `src/App.tsx`. See the swagger file (`/server/swagger.yaml`) for endpoint definitions. Here's the general flow:

  1. Use `GET /games` to retrieve the currently active games (only 1)
    - Display that game per the wireframes
  2. EXTRA: use Postman to progress the game by sending `PUT /game/0c39b11a-1123-44b5-ba74-72de7d5922fc/roll` with `{ "downed": NUMBER }` to specify the number of "downed" pins in the current roll. BE SURE to set the `content-type: application/json` header

### Data Models

See `src/swagger-generated-client/api.ts` for detailed models.

- `interface Game` contains the full game information. The most important property is the `Game.currentFrame` which is a reference to the current frame
- `interface Frame` contains information about the current frame. The two most important properties are:
  - `Frame.active` - this will be true if the frame is currently active
  - `Frame.players` - `Array<FramePlayers>` an array of players for the frame
- `interface FramePlayers` describes the players' information for the frame. Important properties:
  - `FramePlayers.downed` - the number of downed pins
  - `FramePlayers.ball` - the _completed_ ball. E.G. the current ball is `FramePlayers.ball + 1`
  - `FramePlayers.mark` - the "mark", if any. This will be "strike", "spare", or "ten". Please see the `enum Mark` that defines these values

### Sample Game

The sample game defined in `games.start.json` starts at frame 4, with player "Brandon" finishing his turn (one more roll left). To restart the game data, either:

1. Restart the `nodemon` server by saving _any_ file in the `server` directory
2. Send a `DELETE /game/0c39b11a-1123-44b5-ba74-72de7d5922fc` request via cURL, Postman, etc.

## Available Scripts

In the project directory, you can run:

### `npm install`

To install all project dependencies.

### `npm start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

This will also start the dev server (`./server/index.ts`) on port `3123`

### `npm test`

Launches the test runner in the interactive watch mode.
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.