import { ANIMATED_COMPONENT_TRANSITION_MS } from 'components/core/transitions';
import {
  ReactElement,
  ReactNode,
  createContext,
  useContext,
  memo,
  useState,
  useCallback,
  useMemo,
} from 'react';
import ReactTooltip from 'react-tooltip';
import AnimatedModal from './AnimatedModal';

type ModalActions = {
  showModal: (content: ReactElement) => void;
  hideModal: () => void;
};

const ModalContext = createContext<ModalActions | undefined>(undefined);

export const useModal = (): ModalActions => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('Attempted to use ModalContext without a provider!');
  }

  return context;
};

type Props = { children: ReactNode };

function ModalProvider({ children }: Props) {
  // Whether node is actually on the DOM
  const [isMounted, setIsMounted] = useState(false);
  // Pseudo-state for signaling animations. this will allow us
  // to display an animation prior to unmounting
  const [isActive, setIsActive] = useState(false);
  const [content, setContent] = useState<ReactElement | null>(null);

  const showModal = useCallback(providedContent => {
    setIsActive(true);
    setIsMounted(true);
    setContent(providedContent);
  }, []);

  // Trigger fade-out that takes X seconds
  // schedule unmount in X seconds
  const hideModal = useCallback(() => {
    setIsActive(false);
    setTimeout(() => {
      setIsMounted(false);
      setContent(null);
      // Unmount a bit sooner to avoid race condition of
      // elements flashing before they're removed from view
    }, ANIMATED_COMPONENT_TRANSITION_MS - 30);
  }, []);

  const actions = useMemo(
    () => ({
      showModal,
      hideModal,
    }),
    [showModal, hideModal],
  );

  return (
    <ModalContext.Provider value={actions}>
      {children}
      {isMounted && content && (
        <AnimatedModal
          isActive={isActive}
          hideModal={hideModal}
          content={content}
        />
      )}
    </ModalContext.Provider>
  );
}

export default memo(ModalProvider);
