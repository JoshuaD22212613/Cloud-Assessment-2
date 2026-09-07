import ThemeControls from "../../components/ThemeControls";

export default function SettingsPage() {
  return (
    <div className="standard-page">
      <section className="page-heading">
        <p className="eyebrow">Preferences</p>
        <h2>Settings</h2>
        <p>
          Customise the appearance of the Phoneme Activity Builder.
          Your preferences are saved for future visits.
        </p>
      </section>

      <section className="info-card">
        <h3>Appearance</h3>
        <p>
          Choose between light and dark mode. Your selected theme will
          be stored in a cookie.
        </p>

        <ThemeControls />
      </section>
    </div>
  );
}