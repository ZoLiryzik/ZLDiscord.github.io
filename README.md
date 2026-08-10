# ZLDiscord

Minecraft server plugin (Paper/Spigot/Purpur) by ZoLiryzik.  
🌐 Docs: [plugin.zoliryzik.su/docs](https://plugin.zoliryzik.su/docs)

> 💡 Server-side plugin (Java 17+), not a Discord client plugin.

## ✨ Key features

- **Discord voting** → auto-run Minecraft commands (`/zevent`)
- **Custom commands** with embeds, buttons, cooldowns (`/zcc`)
- **PlaceholderAPI** support: `%zoliryzik_in_vc%`, `%zoliryzik_role_<id>%`
- **LuckPerms sync**: roles ↔ groups
- **DataStore**: player data (XP, warnings, etc.)
- **LongPoll**: custom triggers via your endpoint

All logic runs on the server; no user tokens collected.

## 📋 Requirements

- Java 17+
- PlaceholderAPI (mandatory)
- LuckPerms (optional)
- Paper/Spigot/Purpur (1.16.5–1.21.x)

## 🚀 Quick install

1. Drop `ZoLiryzik.jar` into `plugins/`.
2. Restart server (no `/reload`).
3. Edit `config.yml` (token, guildId).
4. Run `/zreload`.

## 🧪 Example

```bash
/zevent "Vote for new map" "map switch-to new_map" 10m 123456789012345678```

What happens next:

• A Discord embed appears in the configured channel.
• Players vote with ✅/❌ reactions.
• When the timer ends, if “yes” votes win, the server safely executes map switch-to new_map.
• You can use placeholders like %zoliryzik_in_vc% in chat prefixes, tablist, or scoreboard.
