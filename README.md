# poc-back

This poc works with pnpm for the package manager. And bun for the build tool.

To install dependencies:

```bash
pnpm install
```

You will need to launch the docker compose file in the root of the project to launch the database.

```bash
docker-compose up -d 
```

To watch:

```bash
pnpm watch
```

To start:

```bash
pnpm start
```

To test:

Before, tou will need to launch the docker compose file in the root of the project.

```bash
pnpm test
```
