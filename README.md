# ZLDiscord v1.4

![Java](https://img.shields.io/badge/Java-17%2B-brightgreen) ![Paper](https://img.shields.io/badge/Server-Paper%2FSpigot%2FPurpur-blue) ![License-MIT-yellow)

**ZLDiscord** is a universal Minecraft server plugin (Paper 1.16.5–1.21.x) that bridges Minecraft and Discord with advanced automation: voting system, custom embeds, template engine, PlaceholderAPI integration, DataStore, and LongPoll.

🌐 **Full docs & examples:** [plugin.zoliryzik.su/docs](https://plugin.zoliryzik.su/docs)  
🧑‍💻 **Developer:** ZoLiryzik

> 💡 This is a **server-side plugin**. All logic runs on your server. No user tokens are collected or transmitted.

---

## ✨ Core Features

- **Discord Voting** — create timed polls; if “✅” wins, the server auto-executes a Minecraft command (`/zevent`).
- **Custom Commands** — YAML-based commands with embeds, buttons, cooldowns, conditions, loops, HTTP calls, and PAPI (`/zcc`).
- **PlaceholderAPI Integration** — use voice status, role checks, and DataStore attributes in chat, tablist, scoreboard.
- **LuckPerms Sync** — bidirectional sync between Discord roles and LuckPerms groups.
- **DataStore** — persistent attributes for players/members/bot (XP, warnings, donations, balances).
- **LongPoll** — custom triggers via HTTP endpoints (Node.js bot included); integrate with external scripts.
- **Role Management** — give/remove/toggle roles, open role menu in Discord.

All data stays on your server; no external tokens or user data are involved.

---

## 📋 Requirements

| Component | Requirement | Notes |
|-----------|-------------|-------|
| Java | 17 or higher | Mandatory |
| Minecraft Server | Paper/Spigot/Purpur 1.16.5–1.21.x | Required |
| PlaceholderAPI | Installed & enabled | Mandatory for placeholders |
| LuckPerms | Optional | Required only for role sync |
| Node.js | Only if using LongPoll | Not required otherwise |

---

## 🚀 Quick Install

1. Drop `ZoLiryzik.jar` into `plugins/`.
2. If using LongPoll, run: `node longpoll-server.js &`.
3. **Restart the server** (stop → start; do not use `/reload` for initial load).
4. Configure `config.yml`: Discord token, guild ID, roles, embed color, prefix, storage type.
5. Run `/zreload` to apply config.

For detailed setup, config reference, and examples, see: [plugin.zoliryzik.su/docs](https://plugin.zoliryzik.su/docs).

---

## 🎮 In-Game Commands

| Command | Description | Permission |
|---------|-------------|------------|
| `/zlink` | Link your account to Discord | `zoliryzik.link` |
| `/zunlink` | Unlink your account from Discord | `zoliryzik.unlink` |
| `/zevent "title" "command" "time" "channel_id" [resolve-now]` | Create a new poll | `zoliryzik.event` |
| `/zembed "name" "title" "description" "channel_id" [...]` | Create an embed in Discord | `zoliryzik.embed` |
| `/zembedmanage [...]` | Manage embeds (delete, edit title/description) | `zoliryzik.embed_manage` |
| `/zcc [...]` | Manage custom commands | `zoliryzik.cc` |
| `/zattr [...]` | Get/set/increment DataStore attributes | `zoliryzik.attr` |
| `/zlongpoll [...]` | Manage LongPoll connections | `zoliryzik.longpoll` |
| `/zsync` | Sync Discord roles with LuckPerms | `zoliryzik.sync` |
| `/rolegive / /roleremove / /roletoggle / /rolemenu` | Role management in Discord | Varies (see perms list) |
| `/zprefix` | View or change command prefix | `zoliryzik.prefix` |
| `/zreload` | Reload plugin configuration | `zoliryzik.reload` |

---

## 💬 Discord Commands

### Slash Commands
- `/zevent` — Create a new poll (Admin roles required).
- `/zcc reload` — Reload custom commands.
- `/zcc list` — List all custom commands.
- `/zcc prefix` — Manage prefix settings.

### Text Commands
- `z!link <code>` — Link your account to Discord (Bot DMs).

---

## 🔑 Permissions Reference

| Permission | Description |
|------------|-------------|
| `zoliryzik.link` / `unlink` | Account linking/unlinking |
| `zoliryzik.event` | Create polls |
| `zoliryzik.embed` / `embed_manage` | Create and manage embeds |
| `zoliryzik.cc` | Custom commands |
| `zoliryzik.attr` | DataStore attributes |
| `zoliryzik.longpoll` | LongPoll connections |
| `zoliryzik.status` | Check bot/plugin status |
| `zoliryzik.rolegive` / `roleremove` / `rolemenu` / `roletoggle` | Role management |
| `zoliryzik.sync` | Role synchronization |
| `zoliryzik.prefix` | Prefix management |
| `zoliryzik.reload` | Reload config |
| `zoliryzik.admin` | All permissions |

---

## 🏷️ PlaceholderAPI Integration

ZLDiscord integrates with PlaceholderAPI to display voice chat status, role information, and DataStore attributes.

| Placeholder | Description |
|-------------|-------------|
| `%zoliryzik_in_vc%` | Returns “In voice chat”, “Not in voice chat”, or “Not linked” |
| `%zoliryzik_role_<role_id>%` | `true` if player has ANY of the specified Discord role IDs (OR logic) |
| `%zoliryzik_roles_<role_id>%` | `true` if player has ALL of the specified Discord role IDs (AND logic) |
| `%zoliryzik_attr_member_<key>%` | DataStore attribute for the linked Discord member |
| `%zoliryzik_attr_player_<key>%` | DataStore attribute for the player |
| `%zoliryzik_attr_bot_<key>%` | DataStore attribute for the bot |

> ⚠️ Make sure you have PlaceholderAPI installed and enabled.

---

## 🧪 Example Use Cases

### Create a Poll for an Event

```bash
/zevent "Siege of the ship" "say &aSiege of the ship is starting!" "20m" 0000000000000000000
```

- Title is fixed at creation.
- Command executes when voting ends.
Poll with Teleport
```bash
/zevent "PvP Tournament" "tp %player_name% 500 65 -300" "30m" 0000000000000000000
```
- Placeholder %player_name% is resolved at creation.
- Teleport happens when voting ends.
- Poll with Placeholder in Title
```bash
/zevent "%player_name% invites to raid" "say &cRaid is starting!" "10m" 0000000000000000000
```
- Player name is resolved at creation; title is fixed.
- Poll with resolve-now=false
```bash
/zevent "Online: %server_online%" "say &aHello, %player_name%!" "20m" 0000000000000000000 false
```
- Title shows online count at creation.
- Placeholder in command is resolved when voting ends (may differ).
- Create an Embed Message in Discord
```bash
/zembed "Siege of the ship" "Siege of the ship" "The Siege of the Ship event is underway\nCords X: 0 Y: 0" "0000000000000000000"
```
- Players will see this message in the specified Discord channel.

DataStore Attributes
```bash
/zattr set player balance 100
/zattr get player balance
```
Custom Command Example
```bash
Create commands/heal.yml:
```

```yaml
<do mc.command('effect give ' + _player_name + ' regeneration 10 5')>
<do mc.broadcast('&a' + _player_name + ' has been healed!')>
```
```bash
Register in custom_commands.yml:
```
```yaml
commands:
  heal:
    file: "commands/heal.yml"
    description: "Heal a player"
    cooldown: 10
    enabled: true
    command_mc: heal
    permission: zoliryzik.heal
```
🔐 Security Notes

- The plugin never stores or transmits user tokens.
- All command executions happen on the server with server-level permissions.
- LongPoll uses Bearer token authentication (Authorization: Bearer <secret>).
- Sensitive fields (token, DB passwords) should be kept out of version control.