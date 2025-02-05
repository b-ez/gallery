import colors from 'components/core/colors';
import useMouseUp from 'hooks/useMouseUp';
import styled from 'styled-components';
import { Collection } from 'types/Collection';
import CollectionRow from './CollectionRow';

type Props = {
  collection: Collection;
};

function CollectionRowDragging({ collection }: Props) {
  const isMouseUp = useMouseUp();
  return (
    <StyledCollectionRowDragging>
      <StyledCollectionRow collection={collection} isMouseUp={isMouseUp} />
    </StyledCollectionRowDragging>
  );
}

const StyledCollectionRowDragging = styled.div`
  display: flex;
  background-color: ${colors.white};
`;

const StyledCollectionRow = styled(CollectionRow)<{ isMouseUp: boolean }>`
  border-color: ${colors.green};
  transform: scale(1.025);
  box-shadow: 0px 0px 16px 8px rgb(0 0 0 / 14%);

  cursor: ${({ isMouseUp }) => (isMouseUp ? 'grab' : 'grabbing')};
`;

export default CollectionRowDragging;
