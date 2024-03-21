import BackGroundVideo from '@/assets/wavesBG.mp4';
import '@/style/page.scss';
const VideoBackground = () => {
  return (
    <div className="video-background">
      <video autoPlay muted loop>
        <source src={BackGroundVideo} type="video/mp4" />
      </video>
      <div
        className="bgvid-container aos-init aos-animate"
        data-aos="fade-in"
        data-aos-easing="ease"
        data-aos-delay="1700"
        data-aos-duration="500"
        data-aos-anchor="#bgvid-container"
      >
        <div className="social-flex-container">
          <div className="social-icon-container">
            <span><a
              href="https://www.facebook.com/Voyages-The-Trans-Atlantic-Slave-Trade-Database-125441173016/"
              target="_blank"
              rel="noopener"
            >
              <img
                data-src="https://www.slavevoyages.org/static/images/site/social-media/fb.svg"
                className="social-icon lazy initial loaded"
                alt="Facebook Logo"
                src="https://www.slavevoyages.org/static/images/site/social-media/fb.svg"
                data-was-processed="true"
              />
            </a>
              <a
                href="https://twitter.com/slavevoyages"
                target="_blank"
                rel="noopener"
              >
                <img
                  data-src="https://www.slavevoyages.org/static/images/site/social-media/twitter.svg"
                  className="social-icon lazy initial loaded"
                  alt="Twitter Logo"
                  src="https://www.slavevoyages.org/static/images/site/social-media/twitter.svg"
                  data-was-processed="true"
                />
              </a>
              <span className="separator">|</span>
              <a
                href="https://forms.gle/B1Q4Z3xA8oviNiJ4A"
                data-toggle="tooltip"
                data-placement="top"
                title=""
                className="social-icon lazy initial"
                target="_blank"
                rel="noopener"
                data-was-processed="true"
                data-original-title="Provide your thoughts and suggestions about the Slave Voyages site."
              >
                <img
                  className="legacy-icon"
                  src="https://www.slavevoyages.org/static/images/site/feedback.svg"
                  alt="Feedback Button"
                />
                <span className="separator">user feedback</span>
              </a>
              <a
                href="mailto:svopcom@googlegroups.com?subject=Report an Issue"
                data-toggle="tooltip"
                data-placement="top"
                title=""
                className="social-icon lazy initial"
                target="_blank"
                rel="noopener"
                data-was-processed="true"
                data-original-title="Report a specific issue/bug found on the site."
              >
                <img
                  className="legacy-icon"
                  src="https://www.slavevoyages.org/static/images/site/bug.svg"
                  alt="Issue Button"
                />
                <span className="separator">report issues</span>
              </a></span>


            <div className="scroll"> scroll down to learn more</div>
          </div>

          <div className="social-icon-container">
            <a
              target="_blank"
              rel="noopener"
              aria-label="Rice University"
              href="https://www.rice.edu"
            >
              <img
                className="cover-logo lazy initial loaded"
                data-src="https://www.slavevoyages.org/static/images/site/landing/Rice_Logo_Reverse_White.svg"
                alt="Rice University Logo"
                src="https://www.slavevoyages.org/static/images/site/landing/Rice_Logo_Reverse_White.svg"
                data-was-processed="true"
              />
            </a>
          </div>
        </div>
      </div>
    </div >
  );
};

export default VideoBackground;
