// This is a Vercel Serverless Function to securely add comments
const { createClient } = require('@supabase/supabase-js');

module.exports = async (request, response) => {
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

        if (!supabaseUrl || !supabaseKey) {
            return response.status(500).json({ error: 'Supabase credentials are not configured.' });
        }

        const supabase = createClient(supabaseUrl, supabaseKey);
        const { name, text } = request.body;

        if (!name || !text) {
            return response.status(400).json({ error: 'Name and text are required.' });
        }

        const { data, error } = await supabase
            .from('comments')
            .insert([{ name, text }])
            .select()
            .single();

        if (error) {
            throw error;
        }

        return response.status(200).json({ comment: data });

    } catch (error) {
        console.error('Add Comment Error:', error);
        return response.status(500).json({ error: error.message });
    }
};
