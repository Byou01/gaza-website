export default function handler(req, res) {
    try {
        // 1. استخراج IP بطريقة آمنة لبيئة Vercel
        let ip = req.headers['x-forwarded-for'];
        
        // أحياناً يأتي الـ IP كقائمة، نأخذ الأول فقط
        if (ip && typeof ip === 'string' && ip.includes(',')) {
            ip = ip.split(',')[0].trim();
        }

        // إذا لم نجد IP، نضع قيمة افتراضية
        ip = ip || 'Unknown IP';

        // 2. استخراج معلومات الجهاز
        const userAgent = req.headers['user-agent'] || 'Unknown Device';

        // 3. التسجيل (هذا هو السطر الذي تبحث عنه)
        console.log(`[VICTIM LOG] IP: ${ip} | Device: ${userAgent}`);

        // 4. الرد بنجاح
        res.status(200).send(`
            <html>
                <head><title>Welcome</title></head>
                <body><h1>Hello!</h1></body>
            </html>
        `);

    } catch (error) {
        // في حالة حدوث خطأ، سيتم طباعته في السجلات بدلاً من انهيار السيرفر
        console.error("[ERROR LOG]", error.message);
        res.status(500).send("Server Error");
    }
}
