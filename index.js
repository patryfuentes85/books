// *** FIREBASE SETUP ***:
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, deleteUser, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-auth.js";
import { getFirestore, collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, arrayUnion, arrayRemove } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js";

let firebaseConfig = {
    // Tu objeto de configuración aquí
    apiKey: "AIzaSyBBGkApEnuV4rYnGGEYVgr67YIvek1Pl-g",
    authDomain: "prueba-web-38722.firebaseapp.com",
    projectId: "prueba-web-38722",
    storageBucket: "prueba-web-38722.appspot.com",
    messagingSenderId: "284647282343",
    appId: "1:284647282343:web:8fc87db7353a628ec8ed82"
   };
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();
const provider = new GoogleAuthProvider();

// *** GLOBAL VARIABLES ***:
let signUpProcess = false;
let logInProcess = false;
let userLogged = false;
let userId = undefined;
let userName = undefined;

// *** GLOBAL FUNCTIONS ***
// Log Out Function:
const logOut = () => {
    auth.signOut()
        .then(() => { })
        .catch(error => {
            console.log(error)
        })
    document.querySelector('#index-welcome-page-section').classList.toggle('off');
    document.querySelector('#index-launch-page-section').classList.toggle('off');
    document.querySelector('#title').innerText = 'Books';

}

// Log In Observer Function:
const isUserLogged = () => {
    auth.onAuthStateChanged((user) => {
        if (user) {
            console.log('Logged user: ' + user.displayName);
            userLogged = true;
            userId = user.email;
            userName = user.displayName;
            domElement('#index-launch-page-section').classList.toggle('off');
            domElement('#index-welcome-page-section').classList.toggle('off');
            domElement('#title').innerText = `Welcome ${userName}`;
                }
        else {
            console.log('No logged user');
            userLogged = false;
            userId = undefined;
            userName = undefined;
        }

    })
}

// Fech DOM element function:
const domElement = (element) => {
    const retrievedElement = document.querySelector(`${element}`);
    return retrievedElement
}

//Log out button event:
domElement('#log-out-btn').addEventListener('click', () => {
    logOut();
})

isUserLogged()


//HOME page:
domElement('#sign-up-btn').addEventListener('click', () => {
    domElement('#index-launch-page-section').classList.toggle('off');
    domElement('#index-sign-up-page-section').classList.toggle('off');
    domElement('#title').innerText = 'Sign Up';
})
domElement('#log-in-btn').addEventListener('click', () => {
    domElement('#index-launch-page-section').classList.toggle('off');
    domElement('#index-log-in-page-section').classList.toggle('off');
    domElement('#title').innerText = 'Log In';
})

const buttons = document.querySelectorAll('.goback-btn');

[...buttons].map((item )=> item.addEventListener('click', () => {
    location.reload();

}));




//Sign Up Formulary event:
domElement('#sign-up-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const signUpName = event.target.signUpName.value;
    const signUpEmail = event.target.signUpEmail.value;
    const signUpPassword = event.target.signUpPassword.value;
    const signUpPassword2 = event.target.signUpPassword2.value;

    if (signUpPassword === signUpPassword2 /* aquí los regex*/) {
        try {
            // Sign Up Process
            await createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword)
                .then((userCredential) => {

                    console.log('User registered');
                })
                .then(() => updateProfile(auth.currentUser, {
                    displayName: signUpName
                }))
            //Create document in Firestore
            await setDoc(doc(db, 'users', signUpEmail), {
                userName: signUpName,
                email: signUpEmail,
                results: []
            })
            domElement('#index-launch-page-section').classList.toggle('off');
            domElement('#index-sign-up-page-section').classList.toggle('off');
            // domElement('#index-welcome-page-section').classList.toggle('off');
            domElement('#title').innerText = `Welcome ${auth.currentUser.displayName}`;
            domElement('#sign-up-form').reset();
        }
        catch (error) {
            console.log('Error: ', error)
        }


    }
    else {
        alert('Different passwords');
    }
})

// Sign Up with Google:
domElement('#sign-up-google-btn').addEventListener('click', () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
            return user
        })
        .then(user => {
            setDoc(doc(db, 'users', user.email),
                {
                    userName: user.displayName,
                    email: user.email,
                    results: []
                });
        })
        .then(() => {
            // domElement('#index-launch-page-section').classList.toggle('off');
            // domElement('#index-welcome-page-section').classList.toggle('off');
            domElement('#title').innerText = `Welcome ${userName.split(' ')[0]}`;
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.email;
            const credential = GoogleAuthProvider.credentialFromError(error);
        });
})

//Log in formulary event:
domElement('#log-in-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const logInEmail = event.target.logInEmail.value;
    const logInPassword = event.target.logInPassword.value;

    try {
        await signInWithEmailAndPassword(auth, logInEmail, logInPassword)
            .then(userCredential => {
                const user = userCredential.user;
                console.log('Usuario logado: ' + user.displayName);
            })
        domElement('#index-log-in-page-section').classList.toggle('off');
        domElement('#index-launch-page-section').classList.toggle('off');
        // domElement('#index-welcome-page-section').classList.toggle('off');
        // domElement('#title').innerText = `Welcome ${userName}`; // ${auth.currentUser.displayName}
        domElement('#log-in-form').reset();

        domElement('#back-my-profile-btn').addEventListener('click', () => {
    // This is why the chart had to be declared on global scope as undefined, so we could destroy it here
    //resultsChart.destroy()

    domElement('#index-welcome-page-section').classList.toggle('off');
    domElement('#index-my-profile-page-section').classList.toggle('off');
    domElement('#title').innerText = `Welcome ${userName}`;
})
    
    }
    catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode)
        console.log(errorMessage)
        alert('Incorrect user or password')
    }
})

