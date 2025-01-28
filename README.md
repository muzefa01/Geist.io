# **Geist.io (Multiplayer)**
A real-time multiplayer game built using **Vite + Phaser** for the front-end and **Socket.io + Node.js** for the backend, deployed on **Render**. The game allows two players to join a room and battle in a **1v1 spirit combat system**.

You can view the hosted application here: [Geist.io](https://geist-io.onrender.com/).

---

## **Tech Stack**
- **Front-end:** Vite, Phaser
- **Back-end:** Node.js, Express, Socket.io
- **Deployment:** Render

---

## **Features**
- 🎮 **Real-time Multiplayer:** Players can create or join rooms and compete in battles.
- 🛠 **Custom Physics & Combat System:** Turn-based mechanics where spirits attack based on speed-based ticker logic.
- 🔄 **Socket.io WebSockets:** Real-time updates ensure smooth synchronization between players.
- 🎨 **Dynamic Character Generation:** Each spirit is uniquely generated with randomized attributes.
- 📡 **Server-Side Game State Management:** Ensures fair battles and consistency across sessions.

---

## **How to Run Locally**
### **1. Clone the Repository**
```sh
git clone https://github.com/your-username/spirits-game.git
cd spirits-game
```

### **2. Install Dependencies**
```sh
npm install
```

### **3. Run the Server**
```sh
node server.js
```

### **4. Start the Client**
```sh
npm run dev
```
The game will be available at **http://localhost:3000**

---

## **Project Development**
This project was created as part of a collaborative **Software Development Bootcamp**, where our team followed an **agile workflow**. We used **Slack, Zoom, Discord, and Google Docs** to ensure effective communication.

### **Collaboration Workflow**
- 🏗 **Daily Stand-Ups** – Every morning, we held a stand-up session via video call to update each other on progress.
- 🎯 **Round-Down Sessions** – Each afternoon, we had a review meeting to summarize the day's work.
- 🔀 **GitHub Branching Strategy** – Each team member cloned the same repository, worked on feature branches, and merged changes through pull requests.

### **Minimum Viable Product (MVP)**
The MVP we devised is an **online multiplayer spirit battle game**. Players **create a room** or **join an existing room**, **select a spirit**, and **battle using a real-time combat system**.

---

## **Deployment**
The game was hosted on **Render**, making it accessible online. If you'd like to run the project locally using Vite, follow the commands in the **How to Run Locally** section.

---

## **Contributing**
If you'd like to contribute, feel free to fork the repository, make changes, and submit a pull request.

---

## **License**
This project is licensed under the MIT License.
