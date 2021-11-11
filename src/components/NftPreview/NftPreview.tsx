import styled from 'styled-components';
import breakpoints, { size } from 'components/core/breakpoints';
import Gradient from 'components/core/Gradient/Gradient';
import transitions from 'components/core/transitions';
import { useCallback, useMemo } from 'react';
import ShimmerProvider from 'contexts/shimmer/ShimmerContext';
import { Nft } from 'types/Nft';
import { navigateToUrl } from 'utils/navigate';
import { useBreakpoint } from 'hooks/useWindowSize';
import NftPreviewLabel from './NftPreviewLabel';
import NftPreviewAsset from './NftPreviewAsset';

type Props = {
  nft: Nft;
  collectionId: string;
  columns: number;
};

export const LAYOUT_GAP_BREAKPOINTS: Record<string, number> = {
  mobileLarge: 20,
  desktop: 40,
};

const LAYOUT_DIMENSIONS: Record<number, any> = {
  1: 600,
  2: 482,
  3: 310,
  4: 242,
  5: 170,
  6: 134,
};

function NftPreview({ nft, collectionId, columns }: Props) {
  const handleNftClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    navigateToUrl(`${window.location.pathname}/${collectionId}/${nft.id}`, event);
  }, [collectionId, nft.id]);
  const screenWidth = useBreakpoint();

  // width for rendering so that we request the apprpriate size image
  const assetSize = useMemo(() => screenWidth === size.mobile ? 288 : LAYOUT_DIMENSIONS[columns], []);

  return (
    <StyledNftPreview key={nft.id} columns={columns}>
      <StyledLinkWrapper onClick={handleNftClick}>
        <ShimmerProvider>
          <NftPreviewAsset nft={nft} size={assetSize}/>
          <StyledNftFooter>
            <StyledNftLabel nft={nft} />
            <StyledGradient type="bottom" direction="down" />
          </StyledNftFooter>
        </ShimmerProvider>
      </StyledLinkWrapper>
    </StyledNftPreview>
  );
}

const StyledLinkWrapper = styled.a`
  cursor: pointer;
  display: flex;
  width: 100%;
`;

const StyledGradient = styled(Gradient)<{ type: 'top' | 'bottom' }>`
  position: absolute;
  ${({ type }) => type}: 0;
`;

const StyledNftLabel = styled(NftPreviewLabel)`
  transition: transform ${transitions.cubic};
  transform: translateY(5px);
`;

const StyledNftFooter = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;

  transition: opacity ${transitions.cubic};

  opacity: 0;
`;

const StyledNftPreview = styled.div<{ columns: number }>`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: fit-content;
  overflow: hidden;

  &:hover ${StyledNftLabel} {
    transform: translateY(0px);
  }

  &:hover ${StyledNftFooter} {
    opacity: 1;
  }

  // use margin to create row-gap for now
  width: 100%;
  margin-bottom: 40px;

  // width looks nasty but it allows us to conditionally apply different width rules based on # columns:
  // - if single columm, use hardcoded width because the NFT isnt as wide as the whole page
  // - if more columns, use calc to automatically set width based on column #
  // this is important because while we *could* use hardcoded widths for desktop, we need to use dynamic widths for tablet
  @media only screen and ${breakpoints.mobileLarge} {
    width: ${({ columns }) => columns === 1
    ? (LAYOUT_DIMENSIONS[1] + 'px')
    : 'calc((100% - ' + LAYOUT_GAP_BREAKPOINTS.mobileLarge * columns + 'px) / ' + columns + ')'};
    margin: ${LAYOUT_GAP_BREAKPOINTS.mobileLarge / 2}px;
  }

  @media only screen and ${breakpoints.desktop} {
    width: ${({ columns }) => columns === 1
    ? (LAYOUT_DIMENSIONS[1] + 'px')
    : 'calc((100% - ' + LAYOUT_GAP_BREAKPOINTS.desktop * columns + 'px) / ' + columns + ')'};
    margin: ${LAYOUT_GAP_BREAKPOINTS.desktop / 2}px;
  }
`;

export default NftPreview;
