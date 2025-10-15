const admin = require('firebase-admin');

exports.handler = async function(event, context) {
    // Check 1: Is the environment variable present at all?
    if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Firebase service account environment variable is not set.' })
        };
    }

    let serviceAccount;
    try {
        // Check 2: Can the variable be parsed as JSON?
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } catch (e) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to parse Firebase service account JSON. Check if it was copied correctly.', details: e.message })
        };
    }

    // Check 3: Does the parsed JSON contain the project_id?
    if (!serviceAccount.project_id) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Parsed service account JSON does not contain a project_id.' })
        };
    }

    try {
        // Initialize Firebase Admin SDK if not already initialized
        if (admin.apps.length === 0) {
            const databaseURL = `https://${serviceAccount.project_id}.firebaseio.com`;
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                databaseURL: databaseURL
            });
        }

        const db = admin.firestore();
        
        // Get today's date in YYYY-MM-DD format (UTC)
        const now = new Date();
        const today_utc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
        const date_string = today_utc.toISOString().split('T')[0];

        const totalRef = db.collection('visits').doc('summary');
        const todayRef = db.collection('visits').doc(date_string);

        let newTotal = 0;
        let newToday = 0;

        await db.runTransaction(async (transaction) => {
            const totalDoc = await transaction.get(totalRef);
            const todayDoc = await transaction.get(todayRef);

            newTotal = (totalDoc.data()?.total_count || 0) + 1;
            newToday = (todayDoc.data()?.daily_count || 0) + 1;

            transaction.set(totalRef, { total_count: newTotal }, { merge: true });
            transaction.set(todayRef, { daily_count: newToday }, { merge: true });
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ total: newTotal, today: newToday })
        };

    } catch (error) {
        // Check 4: Catch any other errors during Firebase interaction
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'An error occurred during Firebase operation.', details: error.message })
        };
    }
};