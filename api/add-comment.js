// هذا الملف يعمل على خادم Vercel كوسيط آمن
import { createClient } from '@supabase/supabase-js';

export default async function handler(request, response) {
    // التأكد من أن الطلب هو من نوع POST
    if (request.method !== 'POST') {
        return response.status(405).json({ message: 'Method Not Allowed' });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY; // استخدام المفتاح السري هنا

    // التحقق من وجود المفاتيح
    if (!supabaseUrl || !supabaseKey) {
        return response.status(500).json({ message: 'Supabase credentials are not configured.' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { name, text } = request.body;

    // التحقق من وجود الاسم والنص
    if (!name || !text) {
        return response.status(400).json({ message: 'Name and text are required.' });
    }

    try {
        const { data, error } = await supabase
            .from('comments')
            .insert([{ name, text }])
            .select();

        if (error) {
            throw error;
        }

        return response.status(200).json({ message: 'Comment added successfully', comment: data[0] });

    } catch (error) {
        return response.status(500).json({ message: 'Error saving comment', error: error.message });
    }
}
