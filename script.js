const FEATURES = [
  "User authentication (signup/login)",
  "Daily goal setting and completion",
  "Public progress dashboard",
  "Streak counter with longest streak",
  "Weekly consistency score",
  "Friend system / accountability partner",
  "Public progress feed",
  "Missed-goal penalty (optional)",
  "Monthly performance analytics",
  "Dark mode-first interface"
];

const ROADMAP = [
  { phase: "Phase 1 · MVP Loop", points: ["Auth + profile", "Daily goals", "Streak + weekly score", "Public profile + feed"] },
  { phase: "Phase 2 · Social Accountability", points: ["Friend requests", "Accountability partners", "Likes/comments", "Reminder nudges"] },
  { phase: "Phase 3 · Gamification", points: ["XP + rank", "Badges", "Leaderboards", "Soft penalty logic"] },
  { phase: "Phase 4 · Scale + Monetize", points: ["Premium analytics", "Verified groups", "Mentorship circles", "Platform integrations"] }
];

const SCHEMA = {
  users: ["email", "passwordHash", "rank", "xp", "currentStreak", "privacy"],
  goals: ["userId", "title", "targetCount", "achievedCount", "status", "date"],
  progress_posts: ["userId", "content", "tags", "visibility", "likesCount"],
  friendships: ["requesterId", "receiverId", "status"],
  weekly_scores: ["userId", "goalsSet", "goalsCompleted", "consistencyScore"],
  badges: ["code", "name", "xpReward"],
  monthly_analytics: ["userId", "month", "totalGoals", "totalCompleted", "bestStreak"]
};

const demoState = {
  goals: [
    { id: 1, text: "Solve 2 LeetCode medium problems", done: false },
    { id: 2, text: "Revise binary search and sliding window", done: false }
  ],
  posts: ["Day 6: Finished arrays revision and 2 easy problems ✅"],
  streak: 6,
  xp: 320,
  consistency: 78
};

function tile(title, list) {
  const article = document.createElement("article");
  article.className = "tile";
  const h4 = document.createElement("h4");
  h4.textContent = title;
  const ul = document.createElement("ul");
  list.forEach((value) => {
    const li = document.createElement("li");
    li.textContent = value;
    ul.appendChild(li);
  });
  article.append(h4, ul);
  return article;
}

function renderInfoSections() {
  const featuresGrid = document.getElementById("featuresGrid");
  FEATURES.forEach((feature) => featuresGrid.appendChild(tile(feature, ["Focused on consistency"])));

  const roadmapGrid = document.getElementById("roadmapGrid");
  ROADMAP.forEach((entry) => roadmapGrid.appendChild(tile(entry.phase, entry.points)));

  const schemaGrid = document.getElementById("schemaGrid");
  Object.entries(SCHEMA).forEach(([name, fields]) => schemaGrid.appendChild(tile(name, fields)));
}

function updateMetrics() {
  const completed = demoState.goals.filter((g) => g.done).length;
  const pending = demoState.goals.length - completed;

  document.getElementById("completedToday").textContent = String(completed);
  document.getElementById("pendingToday").textContent = String(pending);
  document.getElementById("demoStreak").textContent = `${demoState.streak} days`;
  document.getElementById("demoXp").textContent = String(demoState.xp);
  document.getElementById("demoConsistency").textContent = `${demoState.consistency}%`;

  document.getElementById("heroStreak").textContent = String(demoState.streak);
  document.getElementById("heroXp").textContent = String(demoState.xp);
  document.getElementById("heroConsistency").textContent = `${demoState.consistency}%`;
}

function renderGoals() {
  const goalList = document.getElementById("goalList");
  goalList.innerHTML = "";

  demoState.goals.forEach((goal) => {
    const li = document.createElement("li");
    li.className = "goal-item";

    const top = document.createElement("div");
    top.className = "goal-top";

    const text = document.createElement("span");
    text.textContent = goal.text;

    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = goal.done ? "Completed" : "Pending";

    const actions = document.createElement("div");
    actions.className = "goal-actions";

    const toggleBtn = document.createElement("button");
    toggleBtn.className = "small-btn";
    toggleBtn.textContent = goal.done ? "Undo" : "Done";
    toggleBtn.addEventListener("click", () => {
      goal.done = !goal.done;
      if (goal.done) {
        demoState.xp += 20;
        demoState.consistency = Math.min(100, demoState.consistency + 2);
      } else {
        demoState.xp = Math.max(0, demoState.xp - 20);
        demoState.consistency = Math.max(0, demoState.consistency - 2);
      }
      renderDemo();
    });

    const removeBtn = document.createElement("button");
    removeBtn.className = "small-btn";
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", () => {
      demoState.goals = demoState.goals.filter((g) => g.id !== goal.id);
      renderDemo();
    });

    actions.append(toggleBtn, removeBtn);
    top.append(text, badge);
    li.append(top, actions);
    goalList.appendChild(li);
  });
}

function renderPosts() {
  const postList = document.getElementById("postList");
  postList.innerHTML = "";
  demoState.posts.slice().reverse().forEach((post) => {
    const li = document.createElement("li");
    li.className = "post-item";
    li.textContent = post;
    postList.appendChild(li);
  });
}

function renderDemo() {
  renderGoals();
  renderPosts();
  updateMetrics();
}

document.getElementById("goalForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.getElementById("goalInput");
  const text = input.value.trim();
  if (!text) return;
  demoState.goals.push({ id: Date.now(), text, done: false });
  input.value = "";
  renderDemo();
});

document.getElementById("postForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.getElementById("postInput");
  const text = input.value.trim();
  if (!text) return;
  demoState.posts.push(text);
  demoState.xp += 5;
  input.value = "";
  renderDemo();
});

document.getElementById("simulateDayBtn").addEventListener("click", () => {
  demoState.goals.forEach((g) => { g.done = true; });
  demoState.streak += 1;
  demoState.xp += 60;
  demoState.consistency = Math.min(100, demoState.consistency + 5);
  demoState.posts.push(`Day ${demoState.streak}: Completed all daily goals 🔥`);
  renderDemo();
});

document.getElementById("resetDemoBtn").addEventListener("click", () => {
  demoState.goals = [
    { id: 1, text: "Solve 2 LeetCode medium problems", done: false },
    { id: 2, text: "Revise binary search and sliding window", done: false }
  ];
  demoState.posts = ["Day 6: Finished arrays revision and 2 easy problems ✅"];
  demoState.streak = 6;
  demoState.xp = 320;
  demoState.consistency = 78;
  renderDemo();
});

document.getElementById("themeToggle").addEventListener("click", () => {
  document.documentElement.classList.toggle("light");
});

renderInfoSections();
renderDemo();
