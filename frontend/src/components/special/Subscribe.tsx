import React from 'react';

function Subscribe() {
  return (
    <div>
      {/* Begin Mailchimp Signup Form */}
      <div id="mc_embed_signup">
        <form
          action="https://alanbi.us20.list-manage.com/subscribe/post?u=561bf2b7e08898f9277f2f7ac&amp;id=2036e534ed"
          method="post"
          id="mc-embedded-subscribe-form"
          name="mc-embedded-subscribe-form"
          className="validate"
          target="_blank"
          noValidate
        >
          <div id="mc_embed_signup_scroll">
            <h2>Subscribe</h2>
            <div className="indicates-required">
              <span className="asterisk">*</span>
              {' '}
              indicates required
            </div>
            <div className="mc-field-group">
              <label htmlFor="mce-EMAIL">
                Email Address
                {' '}
                <span className="asterisk">*</span>
              </label>
              <input type="email" defaultValue="" name="EMAIL" className="required email" id="mce-EMAIL" />
            </div>
            <div id="mce-responses" className="clear">
              <div className="response" id="mce-error-response" style={{ display: 'none' }} />
              <div className="response" id="mce-success-response" style={{ display: 'none' }} />
            </div>
            <div style={{ position: 'absolute', left: '-5000px' }} aria-hidden="true">
              <input type="text" name="b_561bf2b7e08898f9277f2f7ac_2036e534ed" tabIndex={-1} value="" />
            </div>
            <div className="clear">
              <input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" className="button" />
            </div>
          </div>
        </form>
      </div>
      {/* End mc_embed_signup */}
    </div>
  );
}

export default Subscribe;
