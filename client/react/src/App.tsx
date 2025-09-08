import { useState } from 'react';
import EmbeddedWidget from './EmbeddedWidget';
import HostedWidget from './HostedWidget';

import './style.css';

function App() {
    const [mode, setMode] = useState('embed');

    return (
        <main>
            <h1>Your website</h1>
            <p>
                <strong>Fully Customizable Triggering.</strong> You have complete
                control over when and how the Transactionlink widget appears. It can be
                triggered by a button click, a specific event in your app, or any other
                condition that fits your scenario.
            </p>
            <h2>Transactionlink widget</h2>

            <p style={{ display: 'flex', flexDirection: 'column' }}>
                <label>
                    <input
                        type="radio"
                        name="integration"
                        value="embed"
                        checked={mode === 'embed'}
                        onChange={(e) => setMode(e.target.value)}
                    />
                    <span>Embed mode</span>
                </label>
                <label>
                    <input
                        type="radio"
                        name="integration"
                        value="link"
                        checked={mode === 'link'}
                        onChange={(e) => setMode(e.target.value)}
                    />
                    <span>Link mode</span>
                </label>
            </p>

            {/* Select one method of integration */}
            {mode === 'embed' ? <EmbeddedWidget /> : <HostedWidget />}
        </main>
    );
}

export default App;
