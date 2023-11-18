import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js';
import { doc, getDoc, getFirestore } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js';

const firebaseConfig = {
    apiKey: "AIzaSyDyOXjT2mYo3g72q1NLSREZg9HX7bzDsCI",
    authDomain: "ecs-project-3a8d3.firebaseapp.com",
    projectId: "ecs-project-3a8d3",
    storageBucket: "ecs-project-3a8d3.appspot.com",
    messagingSenderId: "587479702485",
    appId: "1:587479702485:web:ccc1b75533437d281a7b5c",
    measurementId: "G-NTJ6F80SY5"
};

// Initialize Firebase app
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(firebaseApp);

document.addEventListener('DOMContentLoaded', async () => {
    const table = document.getElementById('dataTable');
    const maxEmotionContainer = document.getElementById('maxEmotionContainer');
    const maxEmotionElement = document.getElementById('maxEmotion');
    const singleEmotionContainer = document.getElementById('tonecontainer');
    const singleEmotionElement = document.getElementById('tone');
    
    const documentIdAllEmotions = 'complete_emotion_percentage';
    const documentIdSingleEmotion = 'voice';

    try {
        // Retrieve data for all emotions
        const docRefAllEmotions = doc(db, 'emotion', documentIdAllEmotions);
        const docSnapshotAllEmotions = await getDoc(docRefAllEmotions);

        if (docSnapshotAllEmotions.exists()) {
            const dataMap = docSnapshotAllEmotions.data().per;

            // Variables to track maximum emotion
            let maxEmotion = '';
            let maxValue = -Infinity;

            Object.entries(dataMap).forEach(([emotion, value]) => {
                var row = table.insertRow(-1);
                var emotionCell = row.insertCell(0);
                var valueCell = row.insertCell(1);

                emotionCell.innerHTML = emotion;
                valueCell.innerHTML = value;

                // Update maxEmotion if current value is greater
                if (value > maxValue) {
                    maxValue = value;
                    maxEmotion = emotion;
                }
            });

            // Display the emotion with the maximum value outside the table
            maxEmotionElement.textContent = maxEmotion;
        } else {
            console.log('No such document for all emotions!');
            table.innerHTML = '<tr><td colspan="2">No data found</td></tr>';
        }

        // Retrieve data for a single emotion
        const docRefSingleEmotion = doc(db, 'emotion', documentIdSingleEmotion);
        const docSnapshotSingleEmotion = await getDoc(docRefSingleEmotion);

        if (docSnapshotSingleEmotion.exists()) {
            // Document exists, extract data for the single emotion
            const singleEmotionData = docSnapshotSingleEmotion.data();

            // Check if the value is null before updating the HTML
            if (singleEmotionContainer !== null && singleEmotionElement !== null) {
                if (singleEmotionData.per !== null) {
                    // Display the single emotion data on the website
                    singleEmotionElement.textContent = singleEmotionData.per;
                } else {
                    // Display a specific sentence when the value is null
                    singleEmotionContainer.textContent = 'No emotion data available';
                }
            }
        } else {
            console.log('No such document for single emotion!');
            if (singleEmotionContainer !== null) {
                singleEmotionContainer.textContent = 'No data found for single emotion';
            }
        }

    } catch (error) {
        console.error('Error getting documents: ', error);
        if (table !== null) {
            table.innerHTML = '<tr><td colspan="2">Error retrieving data</td></tr>';
        }
        if (singleEmotionContainer !== null) {
            singleEmotionContainer.textContent = 'Error retrieving data for single emotion';
        }
    }
});