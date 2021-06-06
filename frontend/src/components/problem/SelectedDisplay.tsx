import React, { useState } from 'react';
import styled from 'styled-components';
import { ProblemTag, SelectableProblem } from '../../api/Problem';
import { InlineDifficultyDisplayButton } from '../core/Button';
import { displayNameFromDifficulty } from '../../api/Difficulty';
import { TextInput } from '../core/Input';
import { SelectedItemContainer } from '../core/Container';
import { SelectedItemText } from '../core/Text';

type SelectedProblemsDisplayProps = {
  problems: SelectableProblem[],
  onRemove: ((index: number) => void) | null,
}

type SelectedTagsDisplayProps = {
  tags: ProblemTag[],
  onRemove: ((index: number) => void) | null,
}

const Content = styled.div`
  margin: 5px 0;
`;

const RemoveText = styled.p`
  display: inline;
  padding: 5px;
  margin: 0 5px;
  color: ${({ theme }) => theme.colors.gray};
  line-height: 100%;

  &:hover {
    cursor: pointer;
  }
`;

const TextSearch = styled(TextInput)`
  display: block;
  width: 40%;
  margin: 5px 0;
`;

export function SelectedProblemsDisplay(props: SelectedProblemsDisplayProps) {
  const { problems, onRemove } = props;

  return (
    <Content>
      {problems.map((problem, index) => (
        <SelectedItemContainer key={problem.problemId}>
          <SelectedItemText>
            {problem.name}
          </SelectedItemText>
          <InlineDifficultyDisplayButton
            difficulty={problem.difficulty}
            enabled={false}
            active
          >
            {displayNameFromDifficulty(problem.difficulty)}
          </InlineDifficultyDisplayButton>
          {onRemove ? <RemoveText onClick={() => onRemove(index)}>✕</RemoveText> : null}
        </SelectedItemContainer>
      ))}

      { !problems.length ? <p>Selected problems will show here.</p> : null }
    </Content>
  );
}

export function SelectedTagsDisplay(props: SelectedTagsDisplayProps) {
  const { tags, onRemove } = props;

  return (
    <Content>
      {tags.map((tag, index) => (
        <SelectedItemContainer key={tag.tagId}>
          <SelectedItemText>
            {tag.name}
          </SelectedItemText>
          {onRemove ? <RemoveText onClick={() => onRemove(index)}>✕</RemoveText> : null}
        </SelectedItemContainer>
      ))}

      { !tags.length ? <p>Selected tags will show here.</p> : null }
    </Content>
  );
}

type TagProps = {
  tags: ProblemTag[],
};

export function FilterAllTagsDisplay(props: TagProps) {
  const { tags } = props;

  const [searchText, setSearchText] = useState('');

  const setSearchStatus = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  return (
    <Content>
      <TextSearch
        onChange={setSearchStatus}
        placeholder={tags.length ? 'Filter tags' : 'No tags found'}
      />

      {tags.map((tag) => {
        if (searchText && !tag.name.toLowerCase().includes(searchText.toLowerCase())) {
          return null;
        }

        return (
          <SelectedItemContainer key={tag.tagId}>
            <SelectedItemText>
              {tag.name}
            </SelectedItemText>
          </SelectedItemContainer>
        );
      })}
    </Content>
  );
}
