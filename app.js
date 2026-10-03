// Aether 2027 – Polished Prototype Logic

function startApp() {
  document.getElementById('splash').classList.remove('active');
  document.getElementById('app').classList.add('active');
  updateTime();
  updateGreeting();
  updateDateLine();
  populateKnowledge();
  setInterval(updateTime, 30000);
}

function updateTime() {
  const now = new Date();
  const h = now.getHours().toString().padStart(2, '0');
  const m = now.getMinutes().toString().padStart(2, '0');
  const el = document.getElementById('current-time');
  if (el) el.textContent = `${h}:${m}`;
}

function updateGreeting() {
  const hour = new Date().getHours();
  let text = 'Good evening';
  if (hour < 12) text = 'Good morning';
  else if (hour < 17) text = 'Good afternoon';
  const el = document.getElementById('greeting-text');
  if (el) el.textContent = text;
}

function updateDateLine() {
  const el = document.getElementById('date-line');
  if (!el) return;
  const opts = { weekday: 'long', day: 'numeric', month: 'long' };
  el.textContent = new Date().toLocaleDateString(undefined, opts);
}

function showScreen(id) {
  document.querySelectorAll('.view').forEach(v => {
    v.classList.remove('active');
    v.style.display = '';
  });
  const target = document.getElementById(id);
  if (target) {
    target.classList.add('active');
    if (id === 'agent') target.style.display = 'flex';
  }
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === id);
  });
  // Special handling
  if (id === 'research') {
    const result = document.getElementById('research-result');
    const empty = document.getElementById('research-empty');
    if (result && !result.classList.contains('hidden')) {
      if (empty) empty.classList.add('hidden');
    } else {
      if (empty) empty.classList.remove('hidden');
    }
  }
}

function toggleTheme() {
  const body = document.body;
  const current = body.getAttribute('data-theme');
  body.setAttribute('data-theme', current === 'light' ? '' : 'light');
}

function toggleLargeText() {
  document.body.classList.toggle('large-text', document.getElementById('large-text').checked);
}

function toggleHighContrast() {
  document.body.classList.toggle('high-contrast', document.getElementById('high-contrast').checked);
}

function togglePriority(el) {
  el.classList.toggle('done');
  const check = el.querySelector('.check');
  if (check) check.textContent = el.classList.contains('done') ? '●' : '○';
}

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2400);
}

// ===== AGENT =====
const responses = {
  'Research careers in renewable energy and create a 30-day learning plan': `Here's a focused 30-day plan based on your existing Climate Systems knowledge:

**Week 1 – Foundations**
• Review your current notes on energy systems (already 68% complete)
• Read: IRENA Renewable Energy Outlook (key chapters)
• Output: 1-page summary of top 5 career pathways

**Week 2 – Skills Mapping**
• Identify transferable skills from your background
• Free courses: Coursera “Solar Energy Basics” + edX “Wind Energy”
• Output: Personal skill gap list

**Week 3 – Real-world Exposure**
• Informational interviews (I can draft outreach messages)
• Local renewable projects or virtual open days
• Output: 3 contact notes added to Knowledge Graph

**Week 4 – Decision & Next Steps**
• Budget comparison of certificate programs
• Draft 90-day action plan after the 30 days
• Schedule deep-work blocks in your peak focus window (10:00–13:00)

Would you like me to add these as calendar tasks and create a new Learning Path?`,

  'Summarize my recent notes on sleep and suggest schedule changes': `From your last 14 days of health + capture data:

**Key patterns**
• Average sleep: 7.2 h (deep sleep +12% vs previous period)
• Best cognitive days follow nights with >1.5 h deep sleep
• Afternoon energy dip is consistent around 14:30–16:00

**Recommended schedule adjustments**
1. Protect 10:00–13:30 as “Deep Work” (your peak window)
2. Move lighter tasks (email, admin) to 14:30–16:00
3. Aim for consistent wind-down by 22:15 to protect deep sleep
4. Short 10-min walk after lunch improves afternoon focus by ~18% in your data

I can update your priorities and create recurring focus blocks. Shall I proceed?`,

  'Help me budget for an online course next month': `Based on your recent finance captures and typical monthly patterns:

**Suggested approach**
• Target course budget: $80–150 (most highly-rated renewable/Spanish courses fall here)
• Current estimated discretionary: ~$210 after essentials
• Recommendation: Allocate $120 this month → leaves buffer

**Actions I can take**
1. Create a “Course Fund” sinking category
2. Set a gentle weekly reminder to transfer $30
3. Flag any new subscriptions that appear
4. Link this to your Climate Systems or Spanish path automatically

Would you like me to set up the sinking fund and reminders?`
};

function sendPrompt(text) {
  const input = document.getElementById('chat-input');
  if (input) {
    input.value = text;
    sendMessage();
  }
}

function sendMessage() {
  const input = document.getElementById('chat-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;

  const container = document.getElementById('chat-container');
  if (!container) return;

  // User message
  const userMsg = document.createElement('div');
  userMsg.className = 'message user';
  userMsg.innerHTML = `<div class="msg-bubble">${escapeHtml(text)}</div>`;
  container.appendChild(userMsg);

  input.value = '';
  container.scrollTop = container.scrollHeight;

  // Simulate thinking
  setTimeout(() => {
    const aiMsg = document.createElement('div');
    aiMsg.className = 'message ai';
    let reply = responses[text];
    if (!reply) {
      reply = `I understand you want help with: “${escapeHtml(text)}”.

In the full Aether app I would:
• Search your Personal Knowledge Graph for related notes
• Pull relevant health or schedule context
• Break the request into clear steps
• Offer concrete next actions you can accept or edit

This is a high-fidelity prototype showing the interaction pattern. In production every response is grounded in your private data and runs primarily on-device.

What would you like to refine or do next?`;
    }
    aiMsg.innerHTML = `<div class="msg-avatar">A</div><div class="msg-bubble">${reply.replace(/\n/g, '<br>')}</div>`;
    container.appendChild(aiMsg);
    container.scrollTop = container.scrollHeight;
  }, 650 + Math.random() * 400);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ===== CAPTURE =====
function simulateCapture(type) {
  const result = document.getElementById('capture-result');
  const textEl = document.getElementById('capture-text');
  if (!result || !textEl) return;

  result.classList.remove('hidden');

  const samples = {
    voice: '“I noticed that after 7+ hours of sleep with good deep sleep I can focus much better on complex climate models. Should protect mornings.”',
    photo: 'Photo of whiteboard notes on energy feedback loops — OCR extracted and linked to Climate Systems path.',
    text: 'Key insight: local renewable cooperatives may be a strong career entry point in my region.',
    link: 'Saved article: “IRENA 2026 Renewable Jobs Outlook” → auto-summarized and connected to Career Transition node.'
  };

  textEl.textContent = samples[type] || 'Captured successfully.';
  result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  showToast('Added to Knowledge Graph');
}

// ===== RESEARCH =====
function runResearch() {
  const queryEl = document.getElementById('research-query');
  if (!queryEl) return;
  const query = queryEl.value.trim();
  if (!query) {
    showToast('Enter a research question first');
    return;
  }

  const result = document.getElementById('research-result');
  const empty = document.getElementById('research-empty');
  if (result) result.classList.remove('hidden');
  if (empty) empty.classList.add('hidden');

  document.getElementById('research-findings').innerHTML = `
    <p><strong>Query:</strong> ${escapeHtml(query)}</p>
    <p style="margin-top:0.6rem">Top synthesized findings (demo):</p>
    <ul style="margin:0.5rem 0 0 1.1rem; color:var(--text-muted)">
      <li>Global renewable energy employment reached 13.7 million in recent data, with strong growth in solar and wind.</li>
      <li>Skills most in demand: systems thinking, project management, and basic data literacy.</li>
      <li>Certificate programs (3–6 months) often provide faster entry than full degrees for career switchers.</li>
    </ul>`;

  document.getElementById('research-notes').textContent = `• Career pathways: project development, policy analysis, community energy, technical sales
• Entry strategy: stack short certificates + demonstrable projects
• Regional advantage: cooperatives and municipal programs often hire locally
• Linked to your existing Climate Systems nodes (12 related notes)`;

  document.getElementById('research-actions').innerHTML = `
    <li class="priority-item"><span class="check">○</span><div class="p-content"><strong>Create 30-day learning sprint</strong><span>Already drafted in Agent</span></div></li>
    <li class="priority-item"><span class="check">○</span><div class="p-content"><strong>Identify 3 local contacts</strong><span>Outreach templates ready</span></div></li>
    <li class="priority-item"><span class="check">○</span><div class="p-content"><strong>Budget comparison of 2–3 programs</strong><span>Finance path</span></div></li>`;
}

function addToPlan() {
  showToast('Actions added to your priorities');
  showScreen('home');
}

// ===== KNOWLEDGE =====
const knowledgeData = [
  { name: 'Climate Systems', meta: 'Research · Active path', count: 42 },
  { name: 'Spanish Conversation', meta: 'Language · Active path', count: 28 },
  { name: 'Sleep & Energy Patterns', meta: 'Health · 14-day window', count: 19 },
  { name: 'Career Transition', meta: 'Goals · Linked to Climate', count: 15 },
  { name: 'Personal Finance', meta: 'Systems · Paused', count: 11 },
  { name: 'Daily Reflections', meta: 'Journal · Ongoing', count: 67 },
  { name: 'Renewable Jobs Outlook', meta: 'Research notes', count: 8 },
  { name: 'Focus Windows', meta: 'Productivity · Health linked', count: 14 }
];

function populateKnowledge() {
  const list = document.getElementById('kg-list');
  if (!list) return;
  list.innerHTML = knowledgeData.map(item => `
    <div class="kg-item" onclick="showToast('Opened: ${escapeHtml(item.name)}')">
      <div>
        <div class="k-name">${escapeHtml(item.name)}</div>
        <div class="k-meta">${escapeHtml(item.meta)}</div>
      </div>
      <span class="k-count">${item.count}</span>
    </div>
  `).join('');
}

function filterKnowledge() {
  const q = (document.getElementById('kg-search')?.value || '').toLowerCase();
  const list = document.getElementById('kg-list');
  if (!list) return;
  const filtered = knowledgeData.filter(item =>
    item.name.toLowerCase().includes(q) || item.meta.toLowerCase().includes(q)
  );
  list.innerHTML = filtered.map(item => `
    <div class="kg-item" onclick="showToast('Opened: ${escapeHtml(item.name)}')">
      <div>
        <div class="k-name">${escapeHtml(item.name)}</div>
        <div class="k-meta">${escapeHtml(item.meta)}</div>
      </div>
      <span class="k-count">${item.count}</span>
    </div>
  `).join('') || '<p class="empty-state" style="padding:1.5rem">No matching topics</p>';
}

// Enter key for research
document.addEventListener('DOMContentLoaded', () => {
  const rq = document.getElementById('research-query');
  if (rq) {
    rq.addEventListener('keydown', e => {
      if (e.key === 'Enter') runResearch();
    });
  }
  const ci = document.getElementById('chat-input');
  if (ci) {
    ci.addEventListener('keydown', e => {
      if (e.key === 'Enter') sendMessage();
    });
  }
});
