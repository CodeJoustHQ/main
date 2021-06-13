import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { getProblems, ProblemTag, SelectableProblem } from '../../api/Problem';
import ErrorMessage from '../core/Error';
import { displayNameFromDifficulty } from '../../api/Difficulty';
import { InlineDifficultyDisplayButton } from '../core/Button';
import { TextInput } from '../core/Input';
import { useAppDispatch, useAppSelector, useClickOutside } from '../../util/Hook';
import { User } from '../../api/User';
import { fetchAccount } from '../../redux/Account';
import { problemMatchesFilterText } from '../../util/Utility';

type ProblemSelectorProps = {
  selectedProblems: SelectableProblem[],
  onSelect: (newlySelected: SelectableProblem) => void,
};

type TagSelectorProps = {
  tags: ProblemTag[],
  selectedTags: ProblemTag[],
  onSelect: (newlySelected: ProblemTag) => void,
};

type SpectatorSelectorProps = {
  spectators: User[],
};

type ContentProps = {
  show: boolean,
};

const Content = styled.div`
  width: 65%;
  min-width: 250px;
  margin: 10px 0;
`;

const SpectatorContent = styled.div`
  position: relative;
  margin-left: 10px;
`;

const InnerContent = styled.div<ContentProps>`
  width: 100%;
  max-height: 200px;
  overflow-y: scroll;
  display: ${({ show }) => (show ? 'block' : 'none')};
  border-radius: 5px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.24);
`;

const SpectatorInnerContent = styled(InnerContent)`
  position: absolute;
  max-height: 100px;
  width: 8rem;
`;

const InlineElement = styled.div`
  width: 100%;
  padding: 8px 15px;
  display: flex;
  flex: auto;
  justify-content: space-between;
  box-sizing: border-box;
  border-bottom: solid 1px ${({ theme }) => theme.colors.background};

  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.colors.background};
  }
`;

const SpectatorInlineElement = styled(InlineElement)`
  background-color: ${({ theme }) => theme.colors.white};

  &:hover {
    cursor: default;
    background-color: ${({ theme }) => theme.colors.white};
  }
`;

const ClickableInlineDifficultyDisplayButton = styled(InlineDifficultyDisplayButton)`
  &:hover {
    cursor: pointer;
  }
`;

const TextSearch = styled(TextInput)`
  width: 100%;
  margin: 0;
`;

const SpectatorTextSearch = styled(TextSearch)`
  width: 8rem;
`;

const ElementName = styled.p`
  font-weight: bold;
  margin: 0;
`;

export function ProblemSelector(props: ProblemSelectorProps) {
  const { selectedProblems, onSelect } = props;

  const [error, setError] = useState('');
  const [verifiedProblems, setVerifiedProblems] = useState<SelectableProblem[]>([]);
  const [showProblems, setShowProblems] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [allProblems, setAllProblems] = useState<SelectableProblem[]>([]);

  const { account, token } = useAppSelector((state) => state.account);
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (token) {
      dispatch(fetchAccount());
    }
  }, [token, dispatch]);

  useEffect(() => {
    let accountProblems = account?.problems || [];
    accountProblems = accountProblems.filter((problem) => problem.testCases.length > 0);

    setAllProblems((accountProblems as SelectableProblem[]).concat(verifiedProblems));
  }, [account, verifiedProblems]);

  // Close list of problems if clicked outside of div
  useClickOutside(ref, () => setShowProblems(false));

  useEffect(() => {
    // If not logged in/no token provided, will only be able to view verified problems
    getProblems(token || '', true)
      .then((res) => {
        setVerifiedProblems(res);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [token]);

  const setSelectedStatus = (index: number) => {
    setShowProblems(false);
    onSelect(allProblems[index]);
  };

  const setSearchStatus = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  return (
    <Content>
      <TextSearch
        onClick={() => setShowProblems(!showProblems)}
        onChange={setSearchStatus}
        placeholder={allProblems.length ? 'Search by name, difficulty, etc.' : 'Loading...'}
      />

      <InnerContent show={showProblems} ref={ref}>
        {allProblems.map((problem, index) => {
          // Only show problems that haven't been selected yet
          if (selectedProblems.some((p) => p.problemId === problem.problemId)) {
            return null;
          }

          if (!problemMatchesFilterText(problem, searchText)) {
            return null;
          }

          return (
            <InlineElement
              key={problem.problemId}
              onClick={() => setSelectedStatus(index)}
            >
              <ElementName>
                {problem.name}
              </ElementName>
              <ClickableInlineDifficultyDisplayButton
                difficulty={problem.difficulty}
                enabled={false}
                active
              >
                {displayNameFromDifficulty(problem.difficulty)}
              </ClickableInlineDifficultyDisplayButton>
            </InlineElement>
          );
        })}
      </InnerContent>

      { error ? <ErrorMessage message={error} /> : null }
    </Content>
  );
}

export function TagSelector(props: TagSelectorProps) {
  const { tags, selectedTags, onSelect } = props;

  const [showTags, setShowTags] = useState(false);
  const [searchText, setSearchText] = useState('');

  const ref = useRef<HTMLDivElement>(null);

  // Close list of tags if clicked outside of div
  useClickOutside(ref, () => setShowTags(false));

  const setSelectedStatus = (index: number) => {
    setShowTags(false);
    onSelect(tags[index]);
  };

  const setSearchStatus = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  return (
    <Content>
      <TextSearch
        onClick={() => setShowTags(!showTags)}
        onChange={setSearchStatus}
        placeholder={tags.length ? 'Select tags (optional)' : 'No tags found'}
      />

      <InnerContent show={showTags} ref={ref}>
        {tags.map((tag, index) => {
          // Only show tags that haven't been selected yet
          if (selectedTags.some((t) => t.tagId === tag.tagId)) {
            return null;
          }

          if (searchText && !tag.name.toLowerCase().includes(searchText.toLowerCase())) {
            return null;
          }

          return (
            <InlineElement
              key={tag.tagId}
              onClick={() => setSelectedStatus(index)}
            >
              <ElementName>
                {tag.name}
              </ElementName>
            </InlineElement>
          );
        })}
      </InnerContent>
    </Content>
  );
}

export function SpectatorFilter(props: SpectatorSelectorProps) {
  const { spectators } = props;

  const [showSpectators, setShowSpectators] = useState(false);
  const [searchText, setSearchText] = useState('');

  const ref = useRef<HTMLDivElement>(null);

  // Close list of tags if clicked outside of div
  useClickOutside(ref, () => setShowSpectators(false));

  const setSearchStatus = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  return (
    <SpectatorContent>
      <SpectatorTextSearch
        onClick={() => setShowSpectators(!showSpectators)}
        onChange={setSearchStatus}
        placeholder={spectators !== null ? `Spectators (${spectators.length})` : 'Loading...'}
      />

      <SpectatorInnerContent show={showSpectators} ref={ref}>
        {spectators.map((spectator) => {
          if (searchText && !spectator.nickname.toLowerCase().includes(searchText.toLowerCase())) {
            return null;
          }

          return (
            <SpectatorInlineElement
              key={spectator.userId}
            >
              <ElementName>
                {spectator.nickname}
              </ElementName>
            </SpectatorInlineElement>
          );
        })}
      </SpectatorInnerContent>
    </SpectatorContent>
  );
}
