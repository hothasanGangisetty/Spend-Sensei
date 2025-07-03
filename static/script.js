document.addEventListener('DOMContentLoaded', () => {
    const uploadButton = document.getElementById('upload-button');
    const receiptUpload = document.getElementById('receipt-upload');
    const chatWindow = document.querySelector('.chat-window');
    const totalSpendEl = document.querySelector('.total-spend');
    const financialTipEl = document.querySelector('.financial-tip p');
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');
    const modal = document.getElementById('chartModal');
    const modalChartCanvas = document.getElementById('modalChartCanvas');
    const closeButton = document.querySelector('.close-button');
    let currentChartData = null; // To store the latest chart data

    // Initially disable chat
    chatInput.disabled = false;
    sendButton.disabled = false;

    uploadButton.addEventListener('click', () => receiptUpload.click());

    sendButton.addEventListener('click', handleSendMessage);
    chatInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    });

    receiptUpload.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        displayUserMessage(`Uploaded: ${file.name}`);
        showProcessingIndicator();

        const formData = new FormData();
        formData.append('receipt', file);

        try {
            const response = await fetch('/analyze', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            hideProcessingIndicator();

            if (data.error) {
                displayErrorMessage(data.error);
            } else {
                displaySenseiResponse(data);
                updateWisdomCorner(data);
                // Enable chat after first analysis
                chatInput.disabled = false;
                sendButton.disabled = false;
            }

        } catch (error) {
            hideProcessingIndicator();
            displayErrorMessage('Could not connect to the server. Please try again.');
        }
        
        // Reset the file input
        receiptUpload.value = '';
    });

    document.addEventListener('paste', (event) => {
        const items = (event.clipboardData || event.originalEvent.clipboardData).items;
        for (const item of items) {
            if (item.type.indexOf('image') === 0) {
                const blob = item.getAsFile();
                handleFile(blob);
            }
        }
    });

    async function handleFile(file) {
        if (!file) return;

        displayUserMessage(`Uploaded: ${file.name || 'pasted image'}`);
        showProcessingIndicator();

        const formData = new FormData();
        formData.append('receipt', file);

        try {
            const response = await fetch('/analyze', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            hideProcessingIndicator();

            if (data.error) {
                displayErrorMessage(data.error);
            } else {
                displaySenseiResponse(data);
                updateWisdomCorner(data);
                // Enable chat after first analysis
                chatInput.disabled = false;
                sendButton.disabled = false;
            }

        } catch (error) {
            hideProcessingIndicator();
            displayErrorMessage('Could not connect to the server. Please try again.');
        }
    }

    async function handleSendMessage() {
        const question = chatInput.value.trim();
        if (!question) return;

        displayUserMessage(question);
        chatInput.value = '';
        showTypingIndicator();

        try {
            const response = await fetch('/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question }),
            });

            const data = await response.json();
            hideTypingIndicator();

            if (data.error) {
                displayErrorMessage(data.error);
            } else {
                displaySenseiTextMessage(data.answer);
            }

        } catch (error) {
            hideTypingIndicator();
            displayErrorMessage('Could not connect to the server. Please try again.');
        }
    }

    function displayUserMessage(message) {
        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble user';
        bubble.textContent = message;
        chatWindow.appendChild(bubble);
        scrollToBottom();
    }

    function showProcessingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'chat-bubble sensei processing-indicator';
        indicator.innerHTML = '<div class="spinner"></div><span>Processing receipt...</span>';
        chatWindow.appendChild(indicator);
        scrollToBottom();
    }

    function hideProcessingIndicator() {
        const indicator = document.querySelector('.processing-indicator');
        if (indicator) {
            chatWindow.removeChild(indicator);
        }
    }

    function showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'chat-bubble sensei sensei-typing-indicator';
        indicator.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div>';
        chatWindow.appendChild(indicator);
        scrollToBottom();
    }

    function hideTypingIndicator() {
        const indicator = document.querySelector('.sensei-typing-indicator');
        if (indicator) {
            chatWindow.removeChild(indicator);
        }
    }

    function displayErrorMessage(message) {
        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble sensei';
        bubble.style.backgroundColor = 'var(--carnation-pink)'; // Use theme color for errors
        bubble.style.color = 'white';
        bubble.textContent = `Error: ${message}`;
        chatWindow.appendChild(bubble);
        scrollToBottom();
    }

    function displaySenseiTextMessage(message) {
        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble sensei';
        bubble.textContent = message;
        chatWindow.appendChild(bubble);
        scrollToBottom();
    }

    function displaySenseiResponse(data) {
        currentChartData = data; // Store data for modal
        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble sensei';

        const chartContainer = document.createElement('div');
        chartContainer.className = 'chart-container';
        const canvas = document.createElement('canvas');
        chartContainer.appendChild(canvas);
        
        bubble.innerHTML = '<h4>Expense Breakdown</h4><p><small>Click chart to enlarge</small></p>';
        bubble.appendChild(chartContainer);

        chatWindow.appendChild(bubble);

        const chartColors = ['#cdb4db', '#ffc8dd', '#ffafcc', '#bde0fe', '#a2d2ff'];

        new Chart(canvas, {
            type: 'bar',
            data: {
                labels: data.summary.categorySpends.map(c => c.category),
                datasets: [{
                    label: 'Spend',
                    data: data.summary.categorySpends.map(c => c.amount),
                    backgroundColor: data.summary.categorySpends.map((_, i) => chartColors[i % chartColors.length]),
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    borderWidth: 1
                }]
            },
            options: {
                onClick: () => openModalChart(),
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: 'var(--text-light)' },
                        grid: { color: 'var(--border-color)' }
                    },
                    x: {
                        ticks: { color: 'var(--text-light)' },
                        grid: { color: 'var(--border-color)' }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
        scrollToBottom();
    }

    function openModalChart() {
        if (!currentChartData) return;
        modal.style.display = 'block';
        const chartColors = ['#cdb4db', '#ffc8dd', '#ffafcc', '#bde0fe', '#a2d2ff'];

        new Chart(modalChartCanvas, {
            type: 'bar',
            data: {
                labels: currentChartData.summary.categorySpends.map(c => c.category),
                datasets: [{
                    label: 'Spend',
                    data: currentChartData.summary.categorySpends.map(c => c.amount),
                    backgroundColor: currentChartData.summary.categorySpends.map((_, i) => chartColors[i % chartColors.length]),
                    borderRadius: 5,
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                     y: {
                        beginAtZero: true,
                        ticks: { color: 'var(--text-dark)', font: { size: 14 } },
                        grid: { color: 'var(--border-color)' }
                    },
                    x: {
                        ticks: { color: 'var(--text-dark)', font: { size: 14 } },
                        grid: { display: false }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            color: 'var(--text-dark)',
                            font: { size: 16 }
                        }
                    }
                }
            }
        });
    }

    function closeModal() {
        modal.style.display = 'none';
        // Destroy the chart instance to prevent memory leaks
        const chart = Chart.getChart(modalChartCanvas);
        if (chart) {
            chart.destroy();
        }
    }

    closeButton.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            closeModal();
        }
    });

    function updateWisdomCorner(data) {
        // Animate the total spend
        const currencySymbol = data.summary.currencySymbol || '₹';
        animateValue(totalSpendEl, 0, data.summary.totalSpend, 1000, currencySymbol);

        // Update the financial tip
        financialTipEl.textContent = data.savingTip;
    }

    function animateValue(element, start, end, duration, currencySymbol) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            element.textContent = `${currencySymbol}${(progress * (end - start)).toFixed(2)}`;
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    function scrollToBottom() {
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }
});
