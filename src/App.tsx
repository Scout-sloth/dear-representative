import MessageComposer from './components/MessageComposer';
import DelegationDirectory from './components/DelegationDirectory';
import PetitionDirectory from './components/PetitionDirectory';
import {campaigns} from './campaigns';
import {states, legislators} from './data/states';

export default function App() {
  const state = states[0];
  const campaign = campaigns[0];
  const officials = legislators.filter(official => official.state === state.code);

  return (
    <div className="site">
      <header className="hero">
        <div className="wrap">
          <div className="eyebrow">{state.name.toUpperCase()} · CIVIC CONTACT</div>
          <h1>Make your voice heard.</h1>
          <p>Find official congressional contact channels, write your own message, and explore public petitions. Your message stays in your browser. Nothing is submitted automatically.</p>
        </div>
      </header>
      <main className="wrap">
        <MessageComposer campaign={campaign} officials={officials} state={state} initialOfficialId="bonamici"/>
        <DelegationDirectory officials={officials} state={state}/>
        <PetitionDirectory petitions={campaign.petitions}/>
      </main>
      <footer className="wrap">
        <section className="privacy-disclosure" aria-labelledby="privacy-title">
          <h2 id="privacy-title">Your privacy</h2>
          <p>Messages are composed locally in your browser. The application does not intentionally collect, transmit, or save the names, locations, or message contents you enter; they remain in browser memory while you use the composer. Copying places text on your device clipboard.</p>
          <p>External congressional and petition websites have their own privacy practices. GitHub Pages, which hosts this site, may process ordinary technical request information and access logs. See <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener noreferrer">GitHub’s privacy statement</a>.</p>
        </section>
        <p>Independent civic information tool · No affiliation with Congress or petition platforms · No automatic submissions</p>
      </footer>
    </div>
  );
}
