(() => {
  "use strict";

  // Prevent duplicate initialization if this script is loaded twice.
  if (window.__portfolioChatInitialized) return;
  window.__portfolioChatInitialized = true;

  const form = document.getElementById("chatForm");
  const input = document.getElementById("chatInput");
  const messages = document.getElementById("chatMessages");
  const statusText = document.getElementById("chatStatus");
  const sendButton = document.getElementById("chatSend");

  if (!form || !input || !messages || !statusText || !sendButton) {
    console.error("Chatbot initialization failed: required HTML elements are missing.");
    return;
  }

  const conversationHistory = [];
  let isSending = false;
  let typingNode = null;

  function scrollToLatest() {
    messages.scrollTop = messages.scrollHeight;
  }
function isChatConfigured() {
  return typeof CONFIG !== "undefined" &&
    !!CONFIG.apiKey &&
    CONFIG.apiKey !== "YOUR_PRIVATE_GROQ_KEY";
}

function applyChatAvailability() {
  if (!isChatConfigured()) {
    chatButton.disabled = true;
    chatStatus.textContent =
      "AI chat is available in the local demonstration only.";
    return;
  }

  chatButton.disabled = false;
  if (chatStatus.textContent ===
      "AI chat is available in the local demonstration only.") {
    chatStatus.textContent = "";
  }
}

applyChatAvailability();

if (typeof CONFIG !== "undefined" && CONFIG.ready) {
  CONFIG.ready.then(applyChatAvailability);
}
  function showMessage(text, kind) {
    const bubble = document.createElement("div");
    bubble.className = `chat-message chat-message--${kind === "user" ? "user" : "bot"}`;
    bubble.textContent = text;
    messages.appendChild(bubble);
    scrollToLatest();
  }

  function showTyping() {
    if (typingNode) return;

    typingNode = document.createElement("div");
    typingNode.className = "chat-typing";
    typingNode.setAttribute("role", "status");
    typingNode.setAttribute("aria-label", "Assistant is typing");

    for (let index = 0; index < 3; index += 1) {
      typingNode.appendChild(document.createElement("span"));
    }

    messages.appendChild(typingNode);
    scrollToLatest();
  }

  function hideTyping() {
    if (!typingNode) return;
    typingNode.remove();
    typingNode = null;
  }

  function setStatus(message, isError = false) {
    statusText.textContent = message;
    if (message) {
      statusText.dataset.state = isError ? "error" : "info";
    } else {
      delete statusText.dataset.state;
    }
  }

  function getPortfolioContext() {
    return ["#about", "#skills", "#projects"]
      .map((selector) => {
        const section = document.querySelector(selector);
        if (!section) return "";

        const copy = section.cloneNode(true);

        copy.querySelectorAll("li").forEach((item) => {
          if (/placeholder/i.test(item.textContent)) {
            item.remove();
          }
        });

        return copy.innerText.replace(/\s+/g, " ").trim();
      })
      .filter(Boolean)
      .join("\n\n");
  }

  function isSimpleGreeting(text) {
    return /^(hi|hello|hey|hii|hiii|yo|good morning|good afternoon|good evening|howdy)[!.?,\s]*$/i.test(
      text.trim()
    );
  }

  function saveHistory(question, answer) {
    conversationHistory.push(
      { role: "user", content: question },
      { role: "assistant", content: answer }
    );

    // Keep only the latest user/assistant pair.
    if (conversationHistory.length > 2) {
      conversationHistory.splice(0, conversationHistory.length - 2);
    }
  }

  function describeError(error) {
    if (window.location.protocol === "file:") {
      return "AI replies need the site server. Run `vercel dev` (or open the deployed site) and try again.";
    }

    return error?.message || "Chat is unavailable right now. Please try again.";
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (isSending) return;

    const question = input.value.trim();

    if (!question) {
      setStatus("Please type a question.", true);
      input.focus();
      return;
    }

    isSending = true;
    sendButton.disabled = true;
    sendButton.textContent = "Sending\u2026";

    showMessage(question, "user");
    input.value = "";
    setStatus("");

    if (isSimpleGreeting(question)) {
      const greeting = "Hi! \u{1F44B} Ask me about my skills, projects, or background.";

      showMessage(greeting, "bot");
      saveHistory(question, greeting);

      isSending = false;
      sendButton.disabled = false;
      sendButton.textContent = "Send";
      return;
    }

    showTyping();
    setStatus("Thinking\u2026");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
          portfolioContext: getPortfolioContext(),
          history: conversationHistory.slice(-2),
        }),
      });

      let data = null;
      try {
        data = await response.json();
      } catch (parseError) {
        data = null;
      }

      if (!response.ok) {
        throw new Error(data?.error || `Chat request failed (${response.status}).`);
      }

      const answer = data?.answer;

      if (typeof answer !== "string" || !answer.trim()) {
        throw new Error("The AI returned an empty answer.");
      }

      saveHistory(question, answer);

      hideTyping();
      showMessage(answer, "bot");
      setStatus("");
    } catch (error) {
      console.error("Chat error:", error);
      hideTyping();
      setStatus(describeError(error), true);
    } finally {
      isSending = false;
      sendButton.disabled = false;
      sendButton.textContent = "Send";
    }
  });
})();
