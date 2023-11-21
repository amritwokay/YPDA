import React from 'react';
import './App.css';
import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';
import { withAuthenticator, useAuthenticator,components,defaultTheme} from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css'
import { Auth } from 'aws-amplify';

Amplify.configure(awsconfig);

function App() {
    const { signOut } = useAuthenticator()
    return (
        <div className="App">
            <header className="App-header">
                <h2>My App Content</h2>
                <button onClick={() => signOut()}>Sign Out</button>
            </header>
        </div>
    );
}

export default withAuthenticator(App, {
    // Render a sign out button once logged in
    includeGreetings: true,
    // Show only certain components
    authenticatorComponents: [components],
    // display federation/social provider buttons
    //federated: { myFederatedConfig },
    // customize the UI/styling
    theme: { defaultTheme }
  });
  