# PROJECT REPORT: Spend Sensei - A Conversational AI Expense Tracker

| | |
|---|---|
| **Project Title** | Spend Sensei: A Conversational AI Expense Tracker |
| **Author** | Gangisetty Satya Rama Naga Hothasan |
| **Email** | hothasan.22bcb7300@vitapstudent.ac.in |
| **Institution** | Vellore Institute of Technology - Andhra Pradesh |
| **Date** | July 3, 2025 |

---

## 1. Abstract

"Spend Sensei" is an innovative web application that redefines personal expense tracking by leveraging the power of conversational AI. Users can interact with the application by uploading or pasting receipt images, from which the system automatically extracts, analyzes, and categorizes expenses using the Google Gemini Pro Vision API. The application features a dynamic dashboard that visualizes spending patterns, supports multi-currency transactions, and offers personalized financial insights through a chat-based interface. Built with a Flask backend and a modern JavaScript frontend, Spend Sensei provides an engaging, intuitive, and "Fairy Tale FinTech" themed user experience, making financial management more accessible and less intimidating.

---

## 2. Introduction

### 2.1. Problem Statement

In today's fast-paced world, managing personal finances is crucial yet often tedious. Traditional expense tracking methods involve manual data entry, which is time-consuming, prone to errors, and lacks engagement. This administrative burden can deter individuals from maintaining a clear picture of their financial health. There is a need for a smarter, automated, and more interactive way to manage expenses.

### 2.2. Project Objectives

The primary objective of "Spend Sensei" is to address the shortcomings of traditional expense tracking by creating a seamless and intelligent solution. The key goals are:

*   **Automate Expense Entry**: Eliminate manual data entry by allowing users to upload or paste receipt images for analysis.
*   **Intelligent Data Extraction**: Utilize a powerful AI model (Google Gemini) to accurately extract key information like total amount, items purchased, and currency.
*   **Automatic Categorization**: Intelligently categorize expenses based on the items listed on the receipt.
*   **Visual Insights**: Provide users with a clear, visual representation of their spending habits through dynamic charts and dashboards.
*   **Conversational Interface**: Enable users to "talk" to their data, asking follow-up questions to gain deeper insights into their spending.
*   **Engaging User Experience**: Design a modern, mobile-friendly, and aesthetically pleasing interface to make finance management an enjoyable activity.

---

## 3. System Architecture and Design

The application follows a robust client-server architecture, integrating a powerful third-party AI service.

![System Architecture Diagram](https://i.imgur.com/eB3bX0s.png)

*   **Frontend (Client-Side)**: A single-page application (SPA) built with **HTML5**, **CSS3**, and **vanilla JavaScript**. It is responsible for all user interactions, including the file upload/paste mechanism, rendering the chat interface, and dynamically updating the dashboard with data from the backend. The Chart.js library is used for data visualization.

*   **Backend (Server-Side)**: A lightweight and powerful web server built using the **Flask** framework in **Python**. It serves the frontend application and provides a RESTful API for the client to communicate with.
    *   `/analyze`: This endpoint accepts image data (receipts), sends it to the Gemini API for analysis, processes the structured JSON response, and returns it to the frontend.
    *   `/ask`: This endpoint handles conversational queries from the user. It maintains context from previous interactions to provide relevant, persona-driven answers.

*   **AI Core (Google Gemini API)**: The core intelligence of the application. The backend communicates with the **Google Gemini Pro Vision** model. This multimodal AI is capable of understanding both text and images, making it perfect for extracting structured data from unstructured receipt images and for powering the natural language Q&A feature.

---

## 4. Implementation Details

### 4.1. Frontend Development

The user interface was crafted to be intuitive and visually appealing, following a "Fairy Tale FinTech" theme.

*   **`index.html`**: The main HTML file that defines the structure of the web application, including the chat window, the dashboard area ("Wisdom Corner"), and input elements.
*   **`style_v2.css`**: The stylesheet that brings the application to life. It uses modern CSS features like custom properties (variables) for the color palette, Flexbox for layout, and media queries for mobile responsiveness. It also includes animations for a smoother user experience.
*   **`script.js`**: This file contains all the client-side logic.
    *   **Event Handling**: Manages events for file uploads, pasting from the clipboard, sending chat messages, and clearing the session.
    *   **API Communication**: Uses the `fetch()` API to make asynchronous POST requests to the Flask backend endpoints (`/analyze` and `/ask`).
    *   **DOM Manipulation**: Dynamically creates and appends new elements to the chat window and updates the dashboard (total spend, categories, chart) based on the data received from the backend.
    *   **State Management**: Maintains the session's total spending and category data, allowing for the aggregation of expenses from multiple receipts.
    *   **Chart Visualization**: Integrates with **Chart.js** to render and update a doughnut chart that visually represents the spending distribution across different categories.

### 4.2. Backend Development

The backend is powered by Flask and Python.

*   **`app.py`**: The main Flask application file.
    *   **Routing**: Defines the API endpoints and the HTTP methods they respond to.
    *   **Gemini Integration**: Uses the `google-generativeai` Python library to interact with the Gemini API. It constructs carefully engineered prompts to ensure the AI returns data in a reliable, structured JSON format.
    *   **Business Logic**: Handles the logic for parsing the AI's response, managing conversation history for the Q&A feature, and ensuring multi-currency support by passing currency information between the analysis and chat contexts.
    *   **CORS Handling**: Implements Cross-Origin Resource Sharing (CORS) to allow the frontend to make requests to the backend, as they are served on the same origin but treated as separate entities by the browser.

### 4.3. AI and Prompt Engineering

The success of the application hinges on the quality of the interaction with the Google Gemini model. This was achieved through meticulous **prompt engineering**.

*   **For Receipt Analysis (`/analyze`)**: The prompt instructs the AI to act as a "JSON-only expense analysis engine." It specifies the exact output format required: a JSON object containing `currency_symbol`, `total_amount`, and a `categories` object with expense types and their corresponding amounts. This structured approach ensures predictable and easily parsable responses.
*   **For Conversational Q&A (`/ask`)**: The prompt establishes the "Spend Sensei" persona—a wise, friendly, and slightly whimsical financial guide. It provides the AI with the context of the analyzed expenses and the user's question, enabling it to provide insightful and in-character responses.

---

## 5. Features

*   **Receipt Upload & Paste**: Users can either click to upload a receipt image file or simply paste an image from their clipboard directly into the app.
*   **Automated Expense Analysis**: Extracts total amount, currency, and itemized expenses from the receipt image.
*   **Dynamic Dashboard**: Displays the aggregated total spend and a doughnut chart showing the breakdown of expenses by category for the current session.
*   **Multi-Receipt Aggregation**: Totals and categories are accumulated across multiple receipt uploads within a single session.
*   **Multi-Currency Support**: Automatically detects the currency from the receipt and displays it correctly.
*   **Conversational Q&A**: A chat interface allows users to ask natural language questions about their spending.
*   **Engaging UI/UX**: A beautiful, responsive "Fairy Tale FinTech" design that works seamlessly on both desktop and mobile devices.
*   **Random Financial Tips**: Provides users with a random, helpful financial tip on the dashboard to encourage good financial habits.

---

## 6. Conclusion and Future Work

"Spend Sensei" successfully demonstrates the potential of modern AI APIs to create powerful, user-friendly applications that solve real-world problems. By combining a sophisticated multimodal AI with a well-designed user interface, the project achieves its goal of making expense tracking automated, insightful, and engaging.

### Future Work

The project has a solid foundation that can be extended with several features:

*   **User Accounts and Data Persistence**: Implement a database (like PostgreSQL or MongoDB) and user authentication to allow users to save their expense history over time.
*   **Budgeting and Goal Setting**: Allow users to set monthly budgets for different categories and track their progress.
*   **Trend Analysis**: With persistent data, the application could provide weekly, monthly, and yearly spending trends.
*   **Subscription Management**: Add a feature to detect and track recurring subscriptions from bank statements or receipts.
*   **Deployment to Cloud**: Deploy the application to a cloud platform like Heroku, Vercel, or AWS for public access.

---

## 7. Appendix: Code Snippets

### 7.1. Python: Backend Gemini API Interaction (`app.py`)

'''python
# ... (imports and setup) ...

@app.route('/analyze', methods=['POST'])
def analyze_receipt():
    # ... (error handling) ...
    image_data = request.files['image']
    image_bytes = image_data.read()

    model = genai.GenerativeModel('gemini-pro-vision')
    
    prompt = """
    Analyze the receipt image and provide a JSON response.
    You are a JSON-only expense analysis engine.
    Your response must be only the JSON object, with no other text or explanation.
    The JSON object should have:
    1. A "currency_symbol" (e.g., "$", "₹", "€").
    2. A "total_amount" as a number.
    3. A "categories" object, where keys are expense categories (e.g., "Food", "Transport") and values are the amounts.
    
    Example:
    {
      "currency_symbol": "₹",
      "total_amount": 125.50,
      "categories": {
        "Groceries": 85.50,
        "Snacks": 40.00
      }
    }
    """
    
    response = model.generate_content([prompt, Image.open(io.BytesIO(image_bytes))])
    
    # ... (response parsing and return) ...
'''

### 7.2. JavaScript: Frontend API Call and Dashboard Update (`script.js`)

'''javascript
// ... (variable declarations) ...

async function handleImage(imageFile) {
    // ... (display user image, show spinner) ...
    
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
        const response = await fetch('/analyze', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();

        // Update global state
        totalSpend += data.total_amount;
        currentCurrency = data.currency_symbol;
        for (const category in data.categories) {
            if (spendCategories[category]) {
                spendCategories[category] += data.categories[category];
            } else {
                spendCategories[category] = data.categories[category];
            }
        }
        
        updateDashboard();
        addMessageToChat('sensei', `I've analyzed your receipt! Your total for this receipt is ${currentCurrency}${data.total_amount.toFixed(2)}. I've updated your dashboard.`);

    } catch (error) {
        // ... (error handling) ...
    } finally {
        // ... (hide spinner) ...
    }
}

function updateDashboard() {
    totalSpendEl.textContent = `${currentCurrency}${totalSpend.toFixed(2)}`;
    updateChart();
}

function updateChart() {
    const chartData = {
        labels: Object.keys(spendCategories),
        datasets: [{
            data: Object.values(spendCategories),
            // ... (chart styling) ...
        }]
    };
    // ... (update or create chart with Chart.js) ...
}
'''
