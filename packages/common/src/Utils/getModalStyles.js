import WixUtils from './wixUtils';
import merge from 'lodash/merge';

const mobileModalStyles = {
  overlay: {
    top: 0,
    left: 'auto',
    right: 0,
    bottom: 'auto',
    position: 'absolute',
    width: '100%',
    height: 'calc(100% + 5px)',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 5
  },
  content: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    right: 0,
    left: 0,
    bottom: 'auto',
    border: 'none',
    backgroundColor: 'white',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
    borderRadius: 0,
    padding: 0,
    width: 'calc(100% - 20px)',
    margin: '0 10px',
    direction: 'ltr',
    zIndex: 6
  }
};

const mobileFullScreenOverrideStyles = {
  overlay: {
    top: 0,
    left: 0,
    right: 'auto',
    bottom: 'auto',
    height: '100vh',
    width: '100vw',
    margin: 0,
    zIndex: 5
  },
  content: {
    top: 0,
    left: 0,
    right: 'auto',
    bottom: 'auto',
    backgroundColor: '#fff',
    height: '100vh',
    width: '100vw',
    margin: 0,
    transform: 'none',
    direction: 'ltr',
    zIndex: 6
  }
};

const desktopSideBarStyles = {
  overlay: {
    top: 0,
    left: 'auto',
    right: 0,
    bottom: 'auto',
    position: 'fixed',
    width: '100%',
    height: 'calc(100% + 85px)',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 5
  },
  content: {
    position: 'fixed',
    top: 0,
    left: 'auto',
    right: 0,
    bottom: 'auto',
    border: 'none',
    background: '#fff',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
    borderRadius: 0,
    padding: 0,
    height: '100%',
    width: '100%',
    maxWidth: '420px',
    direction: 'ltr',
    zIndex: 6
  }
};

const desktopModalOverrideStyles = {
  overlay: {
  },
  content: {
    top: 'calc(50%)',
    transform: 'translateY(-50%)',
    left: 0,
    right: 0,
    height: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto',
    direction: 'ltr'
  },
};

const desktopFlyOutModalStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    zIndex: 3
  },
  content: {
    width: '265px',
    boxSizing: 'border-box',
    height: '357px',
    overflow: 'visible',
    border: '1px solid #ccc',
    paddingRight: '8px',
    paddingLeft: '18px',
    display: 'block',
    position: 'absolute',
    zIndex: 6,
    paddingTop: '8px'
  },
  arrow: {
    border: 'solid #ccc',
    borderWidth: '0 1px 1px 0',
    display: 'inline - block',
    padding: '8px',
    position: 'absolute',
    background: '#fff',
    display: 'block',
  },
}

export const getModalStyles = ({ customStyles = null, fullScreen = true, isFlyOutModal = false } = {}) => {
  const overrideStyles = [];
  if (customStyles) {
    overrideStyles.push(customStyles);
  }

  if (WixUtils.isMobile()) {
    if (fullScreen) {
      overrideStyles.push(mobileFullScreenOverrideStyles);
    }
    return merge({}, mobileModalStyles, ...overrideStyles);
  } else {
    if (isFlyOutModal) {
      return merge({}, desktopFlyOutModalStyles, ...overrideStyles);
    }
    if (!fullScreen) {
      overrideStyles.push(desktopModalOverrideStyles);
    }
    return merge({}, desktopSideBarStyles, ...overrideStyles);
  }
};
