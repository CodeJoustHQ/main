import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ErrorMessage from './Error';
import Loading from './Loading';
import { LargeText, Text } from './Text';
import { LargeCenterInputText, PrimaryInput } from './Input';
import { ErrorResponse } from '../../api/Error';
import { isValidNickname } from '../../api/Socket';

type EnterNicknameProps = {
  enterNicknameHeaderText: string,
  enterNicknameAction: (nickname: string) => Promise<void>;
}

const Content = styled.div`
  padding-top: 20px;
`;

export default function EnterNicknamePage(props: EnterNicknameProps) {
  // Grab props variables.
  const {
    enterNicknameHeaderText, enterNicknameAction,
  } = props;

  // Hold error text.
  const [error, setError] = useState('');

  // Hold loading boolean, triggered upon entering nickname.
  const [loading, setLoading] = useState(false);

  // Variable to hold the user's current nickname input.
  const [nickname, setNickname] = useState('');

  /**
   * The nickname is valid if it is non-empty, has no spaces, and
   * is <= 16 characters. This is updated whenever the nickname changes.
   */
  const [validNickname, setValidNickname] = useState(false);
  useEffect(() => {
    setValidNickname(isValidNickname(nickname));
  }, [nickname]);

  // Variable to hold whether the user is focused on the text input field.
  const [focusInput, setFocusInput] = useState(false);

  /**
   * Function to call upon user entering their nickname.
   * This calls the enterNicknameAction as well as updating the page
   * with loading or error messages as necessary.
   */
  const enterNicknameActionUpdatePage = (nicknameParam: string): void => {
    // Only perform action if previous action is not still running
    if (!loading) {
      setLoading(true);
      enterNicknameAction(nicknameParam).then(() => {
        setLoading(false);
      }).catch((err: ErrorResponse) => {
        setLoading(false);
        setError(err.message);
      });
    }
  };

  return (
    <Content>
      <LargeText>
        {enterNicknameHeaderText}
      </LargeText>
      <LargeCenterInputText
        placeholder="Your display name"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setNickname(event.target.value);
        }}
        onFocus={() => {
          setFocusInput(true);
        }}
        onBlur={() => {
          setFocusInput(false);
        }}
        onKeyPress={(event) => {
          setError('');
          if (event.key === 'Enter' && validNickname) {
            enterNicknameActionUpdatePage(nickname);
          }
        }}
      />
      <PrimaryInput
        onClick={() => {
          enterNicknameActionUpdatePage(nickname);
        }}
        value="Enter"
        // Input is disabled if no nickname exists, has a space, or is too long.
        disabled={!validNickname}
      />
      { focusInput && !validNickname ? (
        <Text>
          Your name must be non-empty, have no spaces, and be less than 16 characters.
        </Text>
      ) : null}
      { loading ? <Loading /> : null }
      { error ? <ErrorMessage message={error} /> : null }
    </Content>
  );
}
