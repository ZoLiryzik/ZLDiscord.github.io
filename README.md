# ZLDiscord

A Minecraft server plugin (Paper/Spigot/Purpur) for powerful Discord integration. Built by ZoLiryzik.  
🌐 Docs: [plugin.zoliryzik.su/docs](https://plugin.zoliryzik.su/docs)

> 💡 This is a **Minecraft server plugin** (Java 17+), not a Discord client plugin. It runs on the server and bridges Minecraft with Discord for admins.

## ✨ Core Features (TL;DR)

| Feature | What it does | Where to read |
|---------|---------------|---------------|
| **Discord Voting** | Create polls in Discord; when the vote passes, run Minecraft console commands safely. | `/zevent` + docs |
| **Custom Commands** | Template engine with embeds, buttons, cooldowns, permissions, and conditional logic. | `/zcc` + docs |
| **PlaceholderAPI** | Use `%zoliryzik_in_vc%`, `%zoliryzik_role_<role_id>%` in tablist, scoreboard, chat prefixes. | Placeholders docs |
| **LuckPerms Sync** | Auto-assign Discord roles based on LuckPerms groups (and vice versa). | Sync docs |
| **DataStore** | Store player data (donations, warnings, XP) and use it in templates. | DataStore docs |
| **LongPoll** | Connect your own endpoint for custom events and triggers. | LongPoll docs |

All logic runs on your server; no user tokens are collected.

## 📋 Compatibility & Requirements

| Platform | Status | Notes |
|----------|--------|-------|
| Paper | ✅ Yes | 1.16.5–1.21.x |
| Spigot | ✅ Yes | Most features work |
| Purpur | ✅ Yes | Fully supported |
| Forge/Fabric | ❌ No | Not supported |

**Requirements:**
- Java 17 or higher
- PlaceholderAPI (mandatory)
- LuckPerms (optional, for role sync)
- Basic admin knowledge

## 🚀 Quick Start

1. Download `ZoLiryzik.jar` from Releases.
2. Drop it into `plugins/` on your server.
3. Restart the server (avoid `/reload` for plugin load).
4. Configure `config.yml` (token, guildId, etc.).
5. Run `/zreload` to apply config.
6. Check docs for advanced setup: [plugin.zoliryzik.su/docs](https://plugin.zoliryzik.su/docs).

## 🧪 Example Workflow (Admin Use Case)

**Goal:** Let players vote for a map change; if majority agrees, execute a command.

```bash
/zevent "Vote for new map" "map switch-to new_map" 10m 123456789012345678
• Discord embed appears in the channel.
• Players vote ✅/❌.
• When timer ends, if ✅ wins, the server runs map switch-to new_map.
• Use placeholders like %zoliryzik_in_vc% in chat prefixes or tablist.
