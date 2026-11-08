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
          <p>Find official congressional contact channels, write your own message, and explore public petitions. Nothing is submitted automatically.</p>
        </div>
      </header>
      <main className="wrap">
        <MessageComposer campaign={campaign} officials={officials} state={state} initialOfficialId="bonamici"/>
        <DelegationDirectory officials={officials} state={state}/>
        <PetitionDirectory petitions={campaign.petitions}/>
      </main>
      <footer className="wrap">Independent civic information tool · No affiliation with Congress or petition platforms · No submissions or personal data storage</footer>
    </div>
  );
}
