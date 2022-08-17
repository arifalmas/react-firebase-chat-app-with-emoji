import { auth } from '../utils/firebase';
import firebase from 'firebase';

function Login() {

    const continueWithGoogle = async () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider)
            .catch(err => alert(err.message));
    }

    return (
        <div>
            <button
                type="button"
                className="flex items-center justify-center w-full p-3 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 bg-opacity-10 hover:bg-opacity-20"
                onClick={continueWithGoogle}
            >
                <span className="ml-3 text-indigo-700 font-semibold">Continue with Google</span>
            </button>
        </div>
    )
}

export default Login