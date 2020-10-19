export const getTooltipStyles = (isError, followMouse, tooltipOffset, place) => {
  return {
    style: {
      background: isError ? '#BE6464' : 'rgb(0,0,0)',
      position: followMouse ? 'relative' : 'absolute',
      padding: '8px 21px',
      color: 'white',
      fontWeight: '300',
      fontFamily: 'HelveticaNeue, Helvetica, Arial',
      maxWidth: '180px',
      fontSize: '13px',
      marginTop: place === 'top' ? Math.abs(tooltipOffset.y) : tooltipOffset.y,
      pointerEvents: 'none',
      transition: 'none',
    },
    arrowStyle: {
      color: isError ? '#BE6464' : 'rgb(0,0,0)',
      borderColor: false,
      pointerEvents: 'none',
      transition: 'none',
    },
  };
};
