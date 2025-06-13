document.addEventListener('DOMContentLoaded', function () {
    // --- SUPABASE CLIENT SETUP ---
    //  !!! استبدل هذه القيم بالقيم الخاصة بك من إعدادات مشروع Supabase
    const supabaseUrl = 'https://xhvpwcuemxrcxfsmffqs.supabase.co'; // الصق رابط المشروع هنا
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhodnB3Y3VlbXhyY3hmc21mZnFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4MjUxMzksImV4cCI6MjA2NTQwMTEzOX0.NuBvEfmZSMITAFsusfAYh1jI8Q99rEhssTQ2lD-BFcg'; // الصق مفتاح anon public هنا

    const supabase = supabase.createClient(supabaseUrl, supabaseKey);
    console.log('Supabase client initialized');

    // --- ANIMATIONS AND UI ---
    // On-scroll fade-in animation
    const fadeElements = document.querySelectorAll('.fade-in-section');
    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    fadeElements.forEach(el => scrollObserver.observe(el));

    // Scrollspy for nav links
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href').substring(1) === entry.target.id);
                });
            }
        });
    }, { rootMargin: '-30% 0px -70% 0px' });
    sections.forEach(section => navObserver.observe(section));

    // --- GEMINI API FUNCTIONALITY ---
    async function callGemini(prompt) {
        const apiKey = ""; // اترك هذا الحقل فارغاً
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        const payload = { contents: [{ parts: [{ text: prompt }] }] };
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const result = await response.json();
            if (result.candidates && result.candidates[0] && result.candidates[0].content.parts[0]) {
                return result.candidates[0].content.parts[0].text;
            } else { return "لم يتمكن الذكاء الاصطناعي من إنشاء رد."; }
        } catch (error) {
            console.error("Error calling Gemini API:", error);
            return "حدث خطأ أثناء الاتصال بالذكاء الاصطناعي.";
        }
    }
    
    // Summary button
    const generateSummaryButton = document.getElementById('generate-summary-button');
    const summaryLoader = document.getElementById('summary-loader');
    const summaryOutput = document.getElementById('summary-output');
    generateSummaryButton.addEventListener('click', async () => {
        summaryLoader.classList.remove('hidden');
        summaryOutput.classList.add('hidden');
        generateSummaryButton.disabled = true;
        generateSummaryButton.textContent = 'جاري التوليد...';
        const textContent = document.body.innerText;
        const prompt = `بناءً على المحتوى التالي الذي يصف مبادرات المساعدات إلى غزة، قم بإنشاء ملخص محايد وموضوعي في 3 جمل قصيرة. ركز على الحقائق الرئيسية وتجنب الآراء. المحتوى هو:\n\n${textContent}`;
        const summary = await callGemini(prompt);
        summaryOutput.innerHTML = summary.replace(/\n/g, '<br>');
        summaryLoader.classList.add('hidden');
        summaryOutput.classList.remove('hidden');
        generateSummaryButton.disabled = false;
        generateSummaryButton.textContent = 'إعادة توليد الملخص';
    });

    // Dialect toggle functionality
    const dialectOptionsContainer = document.getElementById('dialect-options');
    const analysisTextElement = document.getElementById('analysis-text');
    const analysisLoader = document.getElementById('analysis-loader');
    const dialectsCache = { formal: analysisTextElement.innerHTML };
    dialectOptionsContainer.addEventListener('click', async (event) => {
        if (event.target.tagName !== 'BUTTON') return;
        const button = event.target;
        const dialect = button.dataset.dialect;
        dialectOptionsContainer.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        const allButtons = dialectOptionsContainer.querySelectorAll('button');
        allButtons.forEach(btn => btn.disabled = true);
        if (dialectsCache[dialect]) {
            analysisTextElement.innerHTML = dialectsCache[dialect];
        } else {
            analysisLoader.classList.remove('hidden');
            analysisTextElement.classList.add('hidden');
            let dialectName = '';
            if (dialect === 'egyptian') dialectName = 'المصرية';
            else if (dialect === 'saudi') dialectName = 'السعودية (الحجازية)';
            else if (dialect === 'algerian') dialectName = 'الجزائرية';
            else if (dialect === 'tunisian') dialectName = 'التونسية';
            const prompt = `حوّل النص التالي من العربية الفصحى إلى لهجة ${dialectName} العامية البسيطة والمفهومة، كأنك تشرح الفكرة لصديق:\n\n"${dialectsCache.formal}"`;
            const translatedText = await callGemini(prompt);
            dialectsCache[dialect] = translatedText.replace(/\n/g, '<br>');
            analysisTextElement.innerHTML = dialectsCache[dialect];
            analysisLoader.classList.add('hidden');
            analysisTextElement.classList.remove('hidden');
        }
        allButtons.forEach(btn => btn.disabled = false);
    });

    // Q&A Functionality
    const qaButton = document.getElementById('qa-button');
    const qaInput = document.getElementById('qa-input');
    const qaLoader = document.getElementById('qa-loader');
    const qaOutput = document.getElementById('qa-output');
    qaButton.addEventListener('click', async () => {
        const question = qaInput.value.trim();
        if (!question) return;
        qaLoader.classList.remove('hidden');
        qaOutput.classList.add('hidden');
        qaButton.disabled = true;
        const pageContext = document.body.innerText;
        const prompt = `استناداً إلى السياق التالي فقط، أجب عن سؤال المستخدم. إذا كانت الإجابة غير موجودة في السياق، قل "المعلومات المطلوبة غير متوفرة في هذا النص". كن موجزاً ومباشراً.\n\nالسياق:\n${pageContext}\n\nسؤال المستخدم:\n${question}`;
        const answer = await callGemini(prompt);
        qaOutput.innerHTML = answer.replace(/\n/g, '<br>');
        qaLoader.classList.add('hidden');
        qaOutput.classList.remove('hidden');
        qaButton.disabled = false;
    });

    // --- COMMENTS SECTION FUNCTIONALITY (WITH SUPABASE) ---
    const commentForm = document.getElementById('comment-form');
    const commentsContainer = document.getElementById('comments-container');

    // Function to fetch and display comments from the database
    async function loadComments() {
        const { data, error } = await supabase
            .from('comments')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching comments:', error);
            return;
        }

        commentsContainer.innerHTML = ''; // Clear existing comments
        data.forEach(comment => {
            addCommentToDOM(comment.name, comment.text);
        });
    }

    // Function to handle form submission
    commentForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const nameInput = document.getElementById('comment-name');
        const commentInput = document.getElementById('comment-text');
        const name = nameInput.value.trim();
        const commentText = commentInput.value.trim();

        if (name && commentText) {
            // Insert the new comment into the database
            const { error } = await supabase
                .from('comments')
                .insert([{ name: name, text: commentText }]);

            if (error) {
                console.error('Error saving comment:', error);
            } else {
                // If successful, add it to the top of the list and clear the form
                addCommentToDOM(name, commentText);
                nameInput.value = '';
                commentInput.value = '';
            }
        }
    });

    // Function to add a comment element to the page
    function addCommentToDOM(name, text) {
        const commentDiv = document.createElement('div');
        commentDiv.className = 'p-4 bg-stone-50 rounded-lg border border-stone-200 transition-opacity duration-500 opacity-0';
        
        const nameElement = document.createElement('h4');
        nameElement.className = 'font-bold text-stone-800';
        nameElement.textContent = name;

        const textElement = document.createElement('p');
        textElement.className = 'text-stone-600 mt-1';
        textElement.textContent = text;
        
        commentDiv.appendChild(nameElement);
        commentDiv.appendChild(textElement);
        commentsContainer.prepend(commentDiv);
        
        // Trigger the fade-in animation
        setTimeout(() => {
            commentDiv.style.opacity = '1';
        }, 10);
    }

    // Initial load of comments when the page loads
    loadComments();
});
