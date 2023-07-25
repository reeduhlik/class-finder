import React from "react";
import "animate.css";

const IntroScreen = (props) => {
  return (
    <div className="introscreen-bg">
      <div className="introscreen animate__animated animate__zoomIn">
        <h2>Introducing Georgetown Course Finder!</h2>
        <h5>
          The newest way to find the perfect classes for you. Built by Reed
          Uhlik.
        </h5>
        <div className="introscreen-features">
          <div className="introscreen-feature animate__animated animate__zoomInUp animate__delay-1s">
            <img src="/icons/seats.svg" alt="search" />
            <div className="introscreen-feature-text">
              <h4>View Seats Remaining</h4>
              <p>
                See how many seats are left in a class before you register.
                Don't waste your time searching for courses already full.
              </p>
            </div>
          </div>
          <div className="introscreen-feature animate__animated animate__zoomInUp animate__delay-1s">
            <img src="/icons/star.svg" alt="search" />
            <div className="introscreen-feature-text">
              <h4>RateMyProfessor Ratings</h4>
              <p>
                See a professor's RMP rating directly next to their name. No
                more multiple tabs.
              </p>
            </div>
          </div>
          <div className="introscreen-feature animate__animated animate__zoomInUp animate__delay-1s">
            <img src="/icons/fast.svg" alt="search" />
            <div className="introscreen-feature-text">
              <h4>Blazingly Fast</h4>
              <p>
                All interactions are instant. No more waiting for pages to load.
              </p>
            </div>
          </div>
          <div className="introscreen-feature animate__animated animate__zoomInUp animate__delay-1s">
            <img src="/icons/search.svg" alt="search" />
            <div className="introscreen-feature-text">
              <h4>Powerful Search</h4>
              <p>
                Search that just makes sense. No more struggling to find the
                right course for you. Built with useful filters and a powerful
                search engine.
              </p>
            </div>
          </div>
          <div className="introscreen-feature animate__animated animate__zoomInUp animate__delay-1s">
            <img src="/icons/link.svg" alt="search" />
            <div className="introscreen-feature-text">
              <h4>Professor & RMP Links</h4>
              <p>
                Click on any professor name or RMP rating to be taken to their
                webpage.
              </p>
            </div>
          </div>
          <div className="introscreen-feature animate__animated animate__zoomInUp coming-soon animate__delay-1s">
            <img src="/icons/calendar.svg" alt="search" />
            <div className="introscreen-feature-text">
              <h4>Calendar View</h4>
              <p>Visualize your schedule with a calendar view. Coming soon.</p>
            </div>
          </div>
        </div>
        <h6>
          Finding it useful? Venmo @reed-uhlik to say thanks and help support
          development!
        </h6>
        <button onClick={props.closeModal}>Get Started!</button>
      </div>
    </div>
  );
};

export default IntroScreen;
