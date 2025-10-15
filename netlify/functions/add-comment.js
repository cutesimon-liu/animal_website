const admin = require('firebase-admin');

// Initialization logic
function initializeFirebase() {
    if (admin.apps.length > 0) return;
    try {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        const databaseURL = `https://${serviceAccount.project_id}.firebaseio.com`;
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: databaseURL
        });
    } catch (e) {
        console.error('Firebase initialization error:', e);
    }
}

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { text, rating } = JSON.parse(event.body);

        if (!text || text.trim() === '' || typeof rating !== 'number' || rating < 1 || rating > 5) {
            return { statusCode: 400, body: JSON.stringify({ error: 'Invalid input.' }) };
        }

        initializeFirebase();
        const db = admin.firestore();

        const newComment = {
            text: text,
            rating: rating,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        };

        await db.collection('general_comments').add(newComment);

        return { statusCode: 200, body: JSON.stringify({ success: true }) };

    } catch (error) {
        console.error('Error adding comment:', error);
        return { statusCode: 500, body: JSON.stringify({ error: 'Failed to add comment.' }) };
    }
};