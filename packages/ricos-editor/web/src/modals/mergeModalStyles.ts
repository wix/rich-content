const modalStyleDefaults = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const mergeModalStyles = (modalStyles, theme) => {
  // Render modal below top toolbar of BM sites
  const headerHeight = document.querySelector('[data-hook=bsm-main-container] [data-hook=header]')
    ?.clientHeight;
  return {
    content: Object.assign(
      {},
      (modalStyles || modalStyleDefaults).content,
      { zIndex: 20001, ...((headerHeight && { paddingTop: headerHeight }) || {}) },
      theme?.modalTheme?.content || {}
    ),
    overlay: Object.assign(
      {},
      (modalStyles || modalStyleDefaults).overlay,
      { zIndex: 666666 },
      theme?.modalTheme?.overlay || {}
    ),
  };
};

export default mergeModalStyles;
