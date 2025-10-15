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
    try {
        initializeFirebase();
        const db = admin.firestore();

        const snapshot = await db.collection('general_comments')
                                 .orderBy('timestamp', 'desc')
                                 .limit(50)
                                 .get();

        if (snapshot.empty) {
            return { statusCode: 200, body: JSON.stringify([]) };
        }

        const comments = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                text: data.text,
                rating: data.rating,
                // Convert Firestore Timestamp to a simpler format (ISO string)
                timestamp: data.timestamp ? data.timestamp.toDate().toISOString() : new Date().toISOString()
            };
        });

        return { statusCode: 200, body: JSON.stringify(comments) };

    } catch (error) {
        console.error('Error getting comments:', error);
        return { statusCode: 500, body: JSON.stringify({ error: 'Failed to get comments.' }) };
    }
};