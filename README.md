# Akio's Personal Script

Altough all of those scripts are for my personal use, most of them can be used by anyone. Just source the `.rc` file into your `.bashrc` or `.zshrc` and you're done.

To install:

```
git clone git@github.com:alexpado/personal-scripts.git ~/.scripts
```

If you don't use the default clone path provided, please make sure to update the `.rc` file once cloned.

### dtctl

This script allow to manage your docker-compose file faster, avoiding you to `cd` in the folder. Each service is stored into `~/.services/<service>/docker-compose.yml`.

| Command                           | Description                                                                                                                       |
|-----------------------------------|-----------------------------------------------------------------------------------------------------------------------------------|
| `dctl help`                       | Show the help menu                                                                                                                |
| `dctl start <service>`            | Equivalent of `docker compose upd -d`                                                                                             |
| `dctl stop <service>`             | Equivalent of `docker compose down`                                                                                               |
| `dctl restart <service>`          | Equivalent of `docker compose down && docker compose up -d` after optionally reviewing the `.env` file.                           |
| `dctl update <service>`           | Equivalent of `docker compose pull && docker compose down && docker compose up -d`                                                |
| `dctl logs <service> [container]` | Equivalent of `docker logs -f <service>-[container]-1`. If `[container]` is not given, the string `service` will be used instead. |
| `dctl list`                       | List all services available in `~/.services`                                                                                      |

### hostctl

This scripts contains a bunch of sutff, probably the most personalized scripts of all, which will not match your needs and requires custom configuration files for ufw.

| Command               | Description                                                                 |
|-----------------------|-----------------------------------------------------------------------------|
| `hostctl help`        | Show the help menu                                                          |
| `hostctl create user` | Run a wizard allowing to create a new user                                  |
| `hostctl ufw status`  | Show details about the ufw rules                                            |
| `hostctl ufw apply`   | Apply the custom ufw rules                                                  |
| `hostctl perms fix`   | Run a wizard allowing to define specific permission to a folder recursively |
| `hostctl jails`       | Show fail2ban jails and their content                                       |

### webctl

This scripts allow to quickly create nginx configuration, with SSL support

| Command                   | Description                                                 |
|---------------------------|-------------------------------------------------------------|
| `webctl help`             | Show the help menu                                          |
| `webctl create`           | Run a wizard allowing to create a nginx configuration       |
| `webctl remove <domain>`  | Remove all files related to the domain provided.            |
| `webctl enable <domain>`  | Enable the domain by creating a symlink into sites-enabled  |
| `webctl disable <domain>` | Disable the domain by removing the symlink in sites-enabled |

### minectl

This script is not ready yet, but will allow to manage minecraft server instances.

### nuc

This script is deprecated and will be stripped down more and more as I add content to other commands.

