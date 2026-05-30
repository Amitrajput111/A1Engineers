const mongoose = require('mongoose');
const AIChat = require('../models/AIChat');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { chats } = require('../utils/memoryDb');

// Get chat history
exports.getChatHistory = async (req, res, next) => {
  try {
    let messages = [];

    if (mongoose.connection.readyState === 1) {
      let chat = await AIChat.findOne({ userId: req.user.id });
      if (!chat) {
        chat = await AIChat.create({ userId: req.user.id, messages: [] });
      }
      messages = chat.messages;
    } else {
      let chat = chats.get(req.user.id);
      if (!chat) {
        chat = { userId: req.user.id, messages: [] };
        chats.set(req.user.id, chat);
      }
      messages = chat.messages;
    }

    res.status(200).json({ success: true, messages });
  } catch (error) {
    next(error);
  }
};

// Clear chat history
exports.clearChatHistory = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const chat = await AIChat.findOne({ userId: req.user.id });
      if (chat) {
        chat.messages = [];
        await chat.save();
      }
    } else {
      const chat = chats.get(req.user.id);
      if (chat) {
        chat.messages = [];
        chats.set(req.user.id, chat);
      }
    }
    res.status(200).json({ success: true, message: 'Chat history cleared successfully' });
  } catch (error) {
    next(error);
  }
};

// Send message to AI Study Assistant
exports.chat = async (req, res, next) => {
  try {
    const { prompt, mode } = req.body; // mode can be: 'explain', 'quiz', 'study-plan', 'suggest-next', 'doubts'

    if (!prompt) {
      return res.status(400).json({ success: false, error: 'Please specify your prompt query' });
    }

    let chat;
    if (mongoose.connection.readyState === 1) {
      chat = await AIChat.findOne({ userId: req.user.id });
      if (!chat) {
        chat = new AIChat({ userId: req.user.id, messages: [] });
      }
    } else {
      chat = chats.get(req.user.id);
      if (!chat) {
        chat = {
          userId: req.user.id,
          messages: [],
          save: async function() {
            chats.set(this.userId, this);
            return this;
          }
        };
      }
    }

    // Add user message
    chat.messages.push({ role: 'user', content: prompt });

    let responseText = '';
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && apiKey !== 'your_gemini_api_key_here') {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        // Build context from previous messages
        const contextMessages = chat.messages.slice(-8).map(msg => {
          return `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`;
        }).join('\n');

        const systemInstruction = `You are "A1 Study Assistant", a clean, expert computer science tutor on A1 Learner.
You assist engineering students with technical prep.
Answer in clear Markdown format.
Avoid animations, placeholders, and chat gimmicks.
The student is interacting using one of these core modes:
1. "Explain Topic": Provide a brief summary, detailed technical explanation, and O(n) space/time complexities.
2. "Generate Quiz": Output a 3-question multiple-choice check with answers at the bottom.
3. "Create Study Plan": Formulate a structured study calendar for the topic.
4. "Suggest Next Topic": Based on their prompt, suggest what engineering concept to master next.
5. "Solve Doubts": Answer doubts regarding code compile errors or design bugs.
Provide structured, handcrafted, engineering-focused outputs.`;

        const finalPrompt = `${systemInstruction}\n\n[Active Mode: ${mode || 'General Doubts'}]\nChat History:\n${contextMessages}\n\nAssistant:`;
        
        const result = await model.generateContent(finalPrompt);
        const response = await result.response;
        responseText = response.text();
      } catch (geminiError) {
        console.error('Gemini Assistant SDK error, loading local engine:', geminiError.message);
        responseText = getOfflineAssistantResponse(prompt, mode);
      }
    } else {
      responseText = getOfflineAssistantResponse(prompt, mode);
    }

    // Add model response
    chat.messages.push({ role: 'model', content: responseText });

    // Keep history capped at 50 messages for database optimization
    if (chat.messages.length > 50) {
      chat.messages = chat.messages.slice(-50);
    }

    if (mongoose.connection.readyState === 1) {
      await chat.save();
    } else {
      chats.set(req.user.id, chat);
    }

    res.status(200).json({
      success: true,
      reply: responseText,
      messages: chat.messages,
    });
  } catch (error) {
    next(error);
  }
};

// Fallback logic for local CS tutoring responses
function getOfflineAssistantResponse(prompt, mode) {
  const query = prompt.toLowerCase();
  const baseHeader = `> **A1 Study Assistant (Offline Mode)**: *Tutor offline. Serving structural guidelines.* \n\n`;

  if (mode === 'quiz' || query.includes('quiz') || query.includes('test')) {
    return baseHeader + `### Quiz: Concept Verification Check

#### Question 1: In a binary search tree (BST), which traversal visit order retrieves elements in sorted ascending sequence?
- A) Pre-order
- B) In-order
- C) Post-order
*Answer: B (In-order traversal visits left-root-right).*

#### Question 2: Which HTTP status code represents an unauthorized request that lacks valid credentials?
- A) 400 Bad Request
- B) 401 Unauthorized
- C) 403 Forbidden
*Answer: B (401 is unauthorized, whereas 403 is forbidden due to role rules).*`;
  }

  if (mode === 'study-plan' || query.includes('plan') || query.includes('study plan')) {
    return baseHeader + `### Structured 3-Day Study Plan: ${prompt}

- **Day 1: Theory Foundations**
  - Read core documentation definitions and identify contiguous layouts or structures.
  - Review time complexity bounds for standard access and insertions.
- **Day 2: Manual Implementations**
  - Implement the structure from scratch in JavaScript or Python without external libraries.
  - Trace node pointer modifications or memory indexes.
- **Day 3: Practice & Edge Cases**
  - Solve at least two standard practice problems (e.g. reversing a list, checking boundaries).
  - Consult the AI assistant to clear edge cases.`;
  }

  if (mode === 'suggest-next' || query.includes('suggest') || query.includes('next topic')) {
    return baseHeader + `### Suggested Next Topic Milestone
If you have finished learning **${prompt}**, I recommend mastering the following sequence next:
1. **Pointers & Nodes**: Essential for understanding how Linked Lists allocate memory dynamically.
2. **Linked Lists**: Navigating node elements using reference pointers.
3. **Stacks & Queues**: Restricting insertion and deletion access states (LIFO/FIFO).`;
  }

  if (mode === 'explain' || query.includes('explain') || query.includes('what is')) {
    return baseHeader + `### Technical Explanation: Arrays
An **Array** is a linear collection of homogeneous elements stored in contiguous blocks.

* **Time Complexity**:
  * Index Lookup: \`O(1)\`
  * Element Search: \`O(n)\`
  * Insertion at beginning: \`O(n)\` (requires shifting remaining elements)
  
* **Example JavaScript Traversal**:
\`\`\`javascript
const arr = [10, 20, 30];
for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]);
}
\`\`\``;
  }

  // Solve Doubts
  return baseHeader + `### Code Debugging & Solutions
I am ready to help resolve your doubts. Please paste your error traceback or code snippet below.

*Engineering Tip: When debug troubleshooting, always confirm scope references and check index boundaries.*`;
}
