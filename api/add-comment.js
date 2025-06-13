const { createClient } = require('@supabase/supabase-js');

module.exports = async (request, response) => {
    // 1. Only allow POST requests
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // 2. Get Supabase credentials from Vercel Environment Variables
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

        if (!supabaseUrl || !supabaseKey) {
            return response.status(500).json({ error: 'Supabase credentials are not configured.' });
        }

        // 3. Initialize Supabase client with the secret key
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        // 4. Get name and text from the request body
        const { name, text } = request.body;
        if (!name || !text) {
            return response.status(400).json({ error: 'Name and text are required.' });
        }

        // 5. Insert the new comment into the database
        const { data, error } = await supabase
            .from('comments')
            .insert([{ name, text }])
            .select()
            .single(); // Use .single() to get a single object back

        if (error) {
            throw error; // Let the catch block handle it
        }

        // 6. Send a success response with the new comment data
        return response.status(200).json({ comment: data });

    } catch (error) {
        // 7. Handle any errors that occurred
        console.error('Serverless Function Error:', error);
        return response.status(500).json({ error: error.message });
    }
};
