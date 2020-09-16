import React, {
  useState, useEffect, SetStateAction, Dispatch,
} from 'react';
import ErrorMessage from './Error';
import Loading from './Loading';
import { LargeText, Text } from './Text';
import { LargeCenterInputText, LargeInputButton } from './Input';
import { isValidNickname } from '../../api/Socket';

// The type of enter nickname page (create or join).
export const ENTER_NICKNAME_PAGE = Object.freeze({
  CREATE: 'create',
  JOIN: 'join',
});

type EnterNicknameProps = {
  nickname: string,
  setNickname: Dispatch<SetStateAction<string>>,
  enterNicknamePage: string,
  enterNicknameAction: any;
}

export function EnterNicknamePage(props: EnterNicknameProps) {
  // Grab props variables.
  const {
    nickname, setNickname, enterNicknamePage, enterNicknameAction,
  } = props;

  // Hold error text.
  const [error, setError] = useState('');

  // Hold loading boolean, triggered upon entering nickname.
  const [loading, setLoading] = useState(false);

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

  return (
    <div>
      <LargeText>
        Enter a nickname to
        {' '}
        {enterNicknamePage}
        {' '}
        the game!
      </LargeText>
      <LargeCenterInputText
        placeholder="Your nickname"
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
          if (event.key === 'Enter' && validNickname) {
            enterNicknameAction(setError, setLoading);
          }
        }}
      />
      <LargeInputButton
        onClick={() => {
          enterNicknameAction(setError, setLoading);
        }}
        value="Enter"
        // Input is disabled if no nickname exists, has a space, or is too long.
        disabled={!validNickname}
      />
      { focusInput && !validNickname ? (
        <Text>
          The nickname must be non-empty, have no spaces, and be less than 16 characters.
        </Text>
      ) : null}
      { loading ? <Loading /> : null }
      { error ? <ErrorMessage message={error} /> : null }
    </div>
  );
}
