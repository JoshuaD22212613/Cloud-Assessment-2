export default function AboutPage() {
  return (
    <div className="standard-page">
      <section className="page-heading">
        <p className="eyebrow">About the Project</p>
        <h2>Phoneme Activity Builder</h2>
        <p>
          The Phoneme Activity Builder is designed for teachers preparing
          classroom activities for Speech Pathology students.
        </p>
      </section>

      <section className="info-card">
        <h3>Assessment 1</h3>
        <p>
          Assessment 1 focuses on frontend design, usability, accessibility
          and responsive design. The application allows teachers to create,
          preview and download phoneme-based activities without requiring a
          database.
        </p>
      </section>

      <div className="info-grid">
        <section className="info-card">
          <h3>Phoneme Wordle</h3>
          <p>
            The Wordle builder creates a Wordle-style classroom activity using
            phoneme symbols instead of standard spelling. Teachers can adjust
            difficulty and hints, preview the activity, and download it as a
            standalone HTML file.
          </p>
        </section>

        <section className="info-card">
          <h3>Phoneme Word Search</h3>
          <p>
            The Word Search builder creates an interactive puzzle using a small
            collection of phoneme-based words. Teachers can change difficulty
            and hint settings before generating the final HTML activity.
          </p>
        </section>
      </div>

      <section className="info-card">
        <h3>Student Information</h3>
        <p>
          <strong>Name:</strong> Joshua Downie
        </p>
        <p>
          <strong>Student Number:</strong> 22212613
        </p>
      </section>

      <section className="info-card">
        <h3>Website Walkthrough</h3>
        <p>
          The video below demonstrates how to navigate the website, configure
          the Wordle and Word Search activities, preview the games, and generate
          standalone HTML files.
        </p>

        <div className="video-container">
          <video
            className="walkthrough-video"
            controls
            preload="metadata"
          >
            <source
              src="/videos/assessment-walkthrough.mp4"
              type="video/mp4"
            />
            Your browser does not support the video element.
          </video>
        </div>
      </section>
    </div>
  );
}