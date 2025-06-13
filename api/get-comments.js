// This is a Vercel Serverless Function to securely fetch comments
const { createClient } = require('@supabase/supabase-js');

module.exports = async (request, response) => {
    if (request.method !== 'GET') {
        return response.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

        if (!supabaseUrl || !supabaseKey) {
            return response.status(500).json({ error: 'Supabase credentials are not configured.' });
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        const { data, error } = await supabase
            .from('comments')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            throw error;
        }

        return response.status(200).json({ comments: data });

    } catch (error) {
        console.error('Get Comments Error:', error);
        return response.status(500).json({ error: error.message });
    }
};
