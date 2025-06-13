// --- SUPABASE CLIENT SETUP ---
//  !!! تأكد من أن هذه القيم صحيحة ومطابقة لحسابك
const supabaseUrl = 'https://xhvpwcucmrxcxfsmffqs.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhodnB3Y3VjbXJ4Y3hmc21mZnFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgzNDk0MTIsImV4cCI6MjAzMzkyNTQxMn0.JpYJhbgGcI0I3OlU1ZWI5cCI6IkpXVCJ9';

const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// --- MAIN LOGIC WRAPPER ---
document.addEventListener('DOMContentLoaded', function () {

    // --- COMMENTS SECTION FUNCTIONALITY ---
    const commentForm = document.getElementById('comment-form');
    const commentsContainer = document.getElementById('comments-container');
    
    // Function to add a comment element to the page
    function addCommentToDOM(name, text) {
        const commentDiv = document.createElement('div');
        commentDiv.className = 'p-4 bg-stone-50 rounded-lg border border-stone-200';
        
        const nameElement = document.createElement('h4');
        nameElement.className = 'font-bold text-stone-800';
        nameElement.textContent = name;

        const textElement = document.createElement('p');
        textElement.className = 'text-stone-600 mt-1';
        textElement.textContent = text;
        
        commentDiv.appendChild(nameElement);
        commentDiv.appendChild(textElement);
        commentsContainer.prepend(commentDiv);
    }

    // Function to fetch and display comments from the database
    async function loadComments() {
        const { data, error } = await supabase
            .from('comments')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching comments:', error);
            alert('حدث خطأ أثناء تحميل التعليقات.');
            return;
        }

        commentsContainer.innerHTML = ''; 
        data.forEach(comment => {
            addCommentToDOM(comment.name, comment.text);
        });
    }

    // Function to handle form submission
    commentForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // منع إعادة تحميل الصفحة

        const nameInput = document.getElementById('comment-name');
        const commentInput = document.getElementById('comment-text');
        const submitButton = commentForm.querySelector('button[type="submit"]');
        
        const name = nameInput.value.trim();
        const commentText = commentInput.value.trim();

        if (name && commentText) {
            submitButton.disabled = true;
            submitButton.textContent = 'جاري الإضافة...';

            const { data, error } = await supabase
                .from('comments')
                .insert([{ name: name, text: commentText }])
                .select();

            if (error) {
                console.error('Error saving comment:', error.message);
                alert('حدث خطأ أثناء حفظ التعليق: ' + error.message);
            } else {
                addCommentToDOM(data[0].name, data[0].text);
                nameInput.value = '';
                commentInput.value = '';
            }

            submitButton.disabled = false;
            submitButton.textContent = 'إضافة تعليق';
        }
    });

    // Initial load of comments when the page loads
    loadComments();
});
