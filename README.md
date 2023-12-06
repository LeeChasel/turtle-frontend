# Turtle Frontend

Frontend page of lazyTurtle e-commerce site.

## Useful links

- [Online website](https://turtle.turtlelazy.com)
- [Gitea repository](https://gitea.turtlelazy.com/Turtle/Turtle_React)
- [DroneCI](https://drone.turtlelazy.com)
- [Swagger API](https://turtle.turtlelazy.com/api/swagger)
- [Google cloud](https://console.cloud.google.com/welcome?project=lazyturtle-393117)
- [Redmine](https://redmine.turtlelazy.com/projects/turtlelazy)
- [Google analytics](https://analytics.google.com/analytics/web/#/p404402597/reports/reportinghub)

## How to use

### Installation

```bash
git clone https://gitea.turtlelazy.com/Turtle/Turtle_React.git
```

### Install dependencies

```bash
npm install
```

### Start develop

```bash
npm run dev
```

Default it will run application at port 3000

## VSCode Setting for ESLint and Prettier

1. Install VSCode extensions

   - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
   - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

2. To open the Settings editor, navigate to `File` > `Preferences` > `Settings`

3. Search `formatter` and change the following settings
   - Editor: Default Formatter: `Prettier - Code formatter`
   - Editor: Format On Paste: `Enable`
   - Editor: Format On Save: `Enable`

## Tech Stack

- React
- Typescript
- Vite
- React-Hook-Form

### Manage State

- React-Query: Server state
- Zustand: Client state

[Difference between server state and client state](https://dev.to/jeetvora331/server-state-vs-client-state-in-react-for-beginners-3pl6)

### CSS frame

- TailwindCSS
- DaisyUI

### Testing

- [ ] Vitest

## Project Architecture

```
src
 |-- actions
 |-- components
 |-- hooks
 |-- pages
 |-- Provider
 |-- types
 |-- utils
```

- actions: Fetch backend resource functions
- components: Shared and independent components
- hooks: Custom hook can be used in component function
- pages: Route pages
- Provider: Some provider settings and Context provider (_will be replace by zustand_)
- types: Sharable object types

## ESLint Rules

Use this command to scan eslint in whole prject

```bash
npm run lint
```

- Warn: Can ignore it
- Error: Must be fixed
