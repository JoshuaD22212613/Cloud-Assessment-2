import ThemeControls from "../../components/ThemeControls";
import WordManager from "../../components/WordManager";

export default function SettingsPage() {
  return (
    <div className="standard-page">
      <section className="page-heading">
        <p className="eyebrow">Preferences & Data</p>

        <h2>Settings</h2>

        <p>
          Customise the appearance of the Phoneme Activity Builder
          and manage the words used to create classroom activities.
        </p>
      </section>

      <section className="info-card">
        <h3>Appearance</h3>

        <p>
          Choose between light and dark mode. Your selected theme
          will be stored in a cookie.
        </p>

        <ThemeControls />
      </section>

      <section className="info-card">
        <h3>Manage Words</h3>

        <p>
          Add, edit and delete words stored in the PostgreSQL
          database. Each word can contain an ordered list of
          phonemes used by the Wordle and Word Search activities.
        </p>

        <WordManager />
      </section>
    </div>
  );
}