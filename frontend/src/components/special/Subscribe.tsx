import React from 'react';
import styled from 'styled-components';

const Content = styled.div`
  margin: 40px;

  label {
    display: block;
    font-family: ${({ theme }) => theme.font};
    font-size: ${({ theme }) => theme.fontSize.default};
    color: ${({ theme }) => theme.colors.text};
    margin: 2px;
  }
  
  .email {
    display: inline-block;
    text-align: left;
    width: 16rem;
    height: 3rem;
    box-sizing: border-box;
    font-family: ${({ theme }) => theme.font};
    font-size: ${({ theme }) => theme.fontSize.default};
    color: ${({ theme }) => theme.colors.text};
    border: 2px solid ${({ theme }) => theme.colors.blue};
    border-radius: 5px;
    padding: 5px;
    margin: 5px;
  }
  
  .button {
    font-family: ${({ theme }) => theme.font};
    font-size: ${({ theme }) => theme.fontSize.mediumLarge};
    background: ${({ theme }) => theme.colors.gradients.blue};
    color: ${({ theme }) => theme.colors.white};
    width: 16rem;
    height: 3rem;
    margin: 5px;
    box-sizing: border-box;
    box-shadow: 0 1px 8px rgba(0, 0, 0, 0.24);
    border: none !important;
    border-radius: 5px;
    cursor: pointer;
  
    &:hover {
      cursor: pointer;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.24);
    }
    
    &:focus {
      outline: none;
    }
  }
`;

function Subscribe() {
  return (
    <Content>
      {/* Begin Mailchimp Signup Form */}
      <div id="mc_embed_signup">
        <form
          action="https://codejoust.us1.list-manage.com/subscribe/post?u=c19418c0e793a0cdc3bf7cb40&amp;id=09d32a049d"
          method="post"
          id="mc-embedded-subscribe-form"
          name="mc-embedded-subscribe-form"
          className="validate"
          target="_blank"
          noValidate
        >
          <div id="mc_embed_signup_scroll">
            <div className="mc-field-group">
              <label htmlFor="mce-EMAIL">
                Email Address
              </label>
              <input type="email" defaultValue="" name="EMAIL" className="required email" id="mce-EMAIL" />
            </div>
            <div id="mce-responses" className="clear">
              <div className="response" id="mce-error-response" style={{ display: 'none' }} />
              <div className="response" id="mce-success-response" style={{ display: 'none' }} />
            </div>
            <div style={{ position: 'absolute', left: '-5000px' }} aria-hidden="true">
              <input type="text" name="b_c19418c0e793a0cdc3bf7cb40_09d32a049d" tabIndex={-1} value="" />
            </div>
            <div className="clear">
              <input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" className="button" />
            </div>
          </div>
        </form>
      </div>
      {/* End mc_embed_signup */}
    </Content>
  );
}

export default Subscribe;
