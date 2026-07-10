import { Container } from "../components/Container"
import { CONTACTS } from "../lib/site"

export function PrivacyPolicyPage() {
  return (
    <main className="pt-32 pb-24">
      <Container>
        <div className="legal mx-auto max-w-3xl">
          <div className="muted text-xs uppercase tracking-[0.24em]">BNS Studio</div>
          <h1 className="mt-3">Privacy Policy</h1>
          <p>
            La presente informativa descrive come BNS Studio tratta i dati personali degli utenti
            che navigano su questo sito o che ci contattano tramite i canali indicati.
          </p>

          <h2>Titolare del trattamento</h2>
          <p>
            Il titolare del trattamento è BNS Studio. Per qualsiasi richiesta puoi scriverci a{" "}
            <a href={`mailto:${CONTACTS.email}`}>{CONTACTS.email}</a>.
          </p>

          <h2>Dati raccolti</h2>
          <p>
            Raccogliamo solo i dati che ci fornisci volontariamente, ad esempio quando ci
            contatti via email, WhatsApp o Instagram (nome, indirizzo email e contenuto del
            messaggio). Non vendiamo né cediamo i tuoi dati a terzi.
          </p>

          <h2>Finalità del trattamento</h2>
          <ul>
            <li>Rispondere alle richieste di contatto e ai preventivi.</li>
            <li>Gestire eventuali collaborazioni e rapporti professionali.</li>
            <li>Garantire il corretto funzionamento e la sicurezza del sito.</li>
          </ul>

          <h2>Cookie</h2>
          <p>
            Questo sito utilizza cookie tecnici necessari al suo funzionamento. Eventuali cookie
            non essenziali vengono utilizzati solo previo consenso.
          </p>

          <h2>Diritti dell&apos;utente</h2>
          <p>
            Puoi richiedere in qualsiasi momento l&apos;accesso, la rettifica o la cancellazione dei
            tuoi dati scrivendo a <a href={`mailto:${CONTACTS.email}`}>{CONTACTS.email}</a>.
          </p>

          <hr />
          <p className="muted">Ultimo aggiornamento: {new Date().getFullYear()}.</p>
        </div>
      </Container>
    </main>
  )
}
