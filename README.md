# ⚙️ Server Setup Bot

A powerful and minimal Discord bot built with [discord.js](https://discord.js.org) to instantly wipe and set up servers using ready-made templates like **Bot Support**, **Community**, and **FiveM**.

---

## 📦 Features

- 🔧 Instant server wiping  
- 🏗️ Template-based server setup  
- 🧱 Auto role and channel creation  
- ✅ Slash command-based (modern)  
- 🟢 Easy to deploy and customize  

---

## 🚀 Setup

### 1. Clone the repo

```bash
git clone https://github.com/milohhh/server-setup-bot.git
cd server-setup-bot
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a `.env` file

```env
TOKEN=your-bot-token
```

> Get your token from the [Discord Developer Portal](https://discord.com/developers/applications)

### 4. Deploy slash commands

Create a `deploy-commands.js` file and run it once to register your global commands.  
(Ask in Issues if you need help setting this up.)

---

## ✅ Running the Bot

```bash
node index.js
```

Bot will go online with a custom status: `🔗 Setting up servers`

---

## 💡 Commands

| Command     | Description                        |
|-------------|------------------------------------|
| `/setup`    | Set up the server with a template  |
| `/rolesetup`| (Optional) Run custom role setup   |

---

## 🧱 Templates

- **bot-support** — Channels for ticketing and help  
- **community** — General-purpose community layout  
- **fivem-server** — FiveM RP server category structure  

---

## 📂 Project Structure

```
.
├── commands/
│   ├── setup.js
│   └── rolesetup.js
├── .env
├── index.js
└── README.md
```

---

## 🛡 License

MIT — Free to use, share, and modify. Star the repo if you find it useful ⭐

---

## ✨ Author

Made by [Milo](https://github.com/milohhh)
