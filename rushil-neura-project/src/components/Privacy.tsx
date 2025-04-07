const Privacy = () => {
  return (
    <div className="privacy-container">
      <header className="privacy-header">
        <h1>Neura Privacy Policy</h1>
      </header>
      <section className="privacy-content">


        <h2 style = {{color: 'black'}}>Introduction</h2>
        <p>
        Hey there 👋
        We at Neura care about your privacy and data. This is not a legal document, but more of a personal promise from us to you.
        Here's how we handle your data:
        </p>


        <h2 style = {{color: 'black'}}>What We Collect</h2>
          <ul>
          <li> <b> Journal Entries:</b> This is the text that you enter in <a href="neura-inc.com/home">/home</a> as part of your journal entries. </li>

          <li> <b> Strava Data: </b> If you choose to link your Strava account, we'll pull in your activity data, only with your permission.</li>

          <li> <b> Basic Info: </b> Email address and password which are encrypted and never shared with anyone. </li>
          </ul>

        <h2 style = {{color: 'black'}}>What We Do With It</h2> 
        <ul>
          <li> We store all your data securely with MongoDB Cloud </li>
          <li> We use your journal entries to generate mental health graphs (like happiness or anxiety scores), and create time-based models to help build conversation agents that reflects You. </li>
          <li> For this, we use a bunch of open-source text processing tools and large language models (GPT-3.5) via a Retrieval-Augmented Generation (RAG) system, besides other models, which is powered by a managed vector database. </li>
          </ul>

        <h2 style = {{color: 'black'}}>What We Don't Do</h2>
        <ul>
          <li> We don't sell your data. </li>
          <li> We don't make anything mandatory, everything is opt-in.</li>
          <li> We don't recommend sharing sensitive personal information (like your name, address, phone number, or passwords) in your journal entries or conversations. The platform is designed to be a private space, but it's always good to be cautious.</li>
        </ul>

        <h2  style = {{color: 'black'}}>What We're Working On</h2>
        <ul>
          <li> Building stronger safeguards against misuse. </li>
          <li> Improving data masking and user-level protections.</li>
          <li> Making encryption more robust across all data touchpoints. </li>
        </ul>

        <p>
          If you ever have concerns or questions, you can contact us at <a href="mailto:neurajournal@gmail.com" style = {{color: 'black'}}>neurajournal@gmail.com </a> This platform is built for you, and your trust means everything to us.
          Thanks for reading this 🥳 — The Team </p>
      </section>
    </div>
  );
};

export default Privacy;
