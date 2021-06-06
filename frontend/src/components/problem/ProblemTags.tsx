import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  createProblemTag,
  getAllProblemTags,
  ProblemTag,
} from '../../api/Problem';
import {
  TextInput,
} from '../core/Input';
import {
  GrayTextButton,
  SmallButton,
} from '../core/Button';
import {
  LowMarginMediumText,
} from '../core/Text';
import Loading from '../core/Loading';
import ErrorMessage from '../core/Error';
import { FilterAllTagsDisplay, SelectedTagsDisplay } from './SelectedDisplay';
import { TagSelector } from './Selector';
import Modal from '../core/Modal';
import { useAppSelector } from '../../util/Hook';

const LargeTextInput = styled(TextInput)`
  width: 40%;
  margin: 5px 0;
`;

type ProblemTagsParams = {
  problemTags: ProblemTag[],
  addTag: (problemTag: ProblemTag) => void,
  removeTag: (index: number) => void,
  viewOnly: boolean,
};

function ProblemTags(props: ProblemTagsParams) {
  const {
    problemTags, addTag, removeTag, viewOnly,
  } = props;

  const [allTags, setAllTags] = useState<ProblemTag[]>([]);
  const [tagModal, setTagModal] = useState<boolean>(false);
  const [tagName, setTagName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { token } = useAppSelector((state) => state.account);

  const fetchTags = useCallback(() => {
    if (!token) {
      return;
    }

    getAllProblemTags(token!)
      .then((res) => {
        setAllTags(res);
        setError('');
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [token]);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  // Make request to create a new tag, refresh tag list
  const createNewTag = (newTagName: string) => {
    if (!token) {
      return;
    }

    const tag: ProblemTag = {
      name: newTagName,
    };
    setLoading(true);
    createProblemTag(tag, token!).then(() => {
      // If the tag was created, refresh all problem tags.
      fetchTags();
      setTagName('');
    }).catch((err) => setError(err))
      .finally(() => setLoading(false));
  };

  return (
    <>
      <LowMarginMediumText>Tags</LowMarginMediumText>
      <SelectedTagsDisplay
        tags={problemTags}
        onRemove={!viewOnly ? removeTag : null}
      />
      {
        !viewOnly ? (
          <>
            <TagSelector
              tags={allTags}
              selectedTags={problemTags}
              onSelect={addTag}
            />
            <GrayTextButton
              onClick={() => setTagModal(true)}
            >
              Create New Tag +
            </GrayTextButton>
            <Modal show={tagModal} onExit={() => setTagModal(false)} fullScreen>
              <LowMarginMediumText>Create New Tag</LowMarginMediumText>
              <LargeTextInput
                value={tagName}
                placeholder="Enter new tag name"
                onChange={(e) => setTagName(e.target.value)}
              />
              <SmallButton
                onClick={() => createNewTag(tagName)}
              >
                Create Tag
              </SmallButton>
              {loading ? <Loading /> : null}
              {error ? <ErrorMessage message={error} /> : null}
              <LowMarginMediumText>Filter Tags</LowMarginMediumText>
              <FilterAllTagsDisplay
                tags={allTags}
              />
            </Modal>
          </>
        ) : null
      }
    </>
  );
}

export default ProblemTags;
