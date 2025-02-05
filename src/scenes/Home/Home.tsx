import { navigate, RouteComponentProps } from '@reach/router';
import { memo, useCallback } from 'react';
import styled from 'styled-components';
import Button from 'components/core/Button/Button';
import Page from 'components/core/Page/Page';
import GalleryIntro from 'components/GalleryTitleIntro/GalleryTitleIntro';

function Home(_: RouteComponentProps) {
  const handleEnterGallery = useCallback(() => {
    // If the user is already authenticated, /auth will handle forwarding
    // them directly to their profile
    void navigate('/auth');
  }, []);

  return (
    <Page centered>
      <GalleryIntro />
      <StyledButton text="Enter" onClick={handleEnterGallery} />
    </Page>
  );
}

const StyledButton = styled(Button)`
  width: 200px;
`;

export default memo(Home);
