const generateTileElement = (rootElement) => () => {
  const tileElement = document.createElement('div');
  const contentElement = document.createElement('div');

  tileElement.classList.add('tile');

  tileElement.appendChild(contentElement);
  rootElement.appendChild(tileElement);
};

const generateTileElements = () => {
  const rootElement = document.querySelector('#root');

  Array(16 * 16)
    .fill()
    .forEach(generateTileElement(rootElement));
};

const getTileElementCenterCoordinates = ({ top, left, bottom, right }) => ({
  centerX: left + 0.5 * (right - left),
  centerY: top + 0.5 * (bottom - top),
});

const getContentElementRotationTangent = ({
  top,
  left,
  bottom,
  right,
  clientX,
  clientY,
}) => {
  const { centerX, centerY } = getTileElementCenterCoordinates({
    top,
    left,
    bottom,
    right,
  });

  if (centerX > clientX && centerY > clientY) {
    return (bottom - clientY) / (right - clientX);
  }

  if (centerX > clientX && centerY < clientY) {
    return (right - clientX) / (clientY - top);
  }

  if (centerX < clientX && centerY > clientY) {
    return (clientX - left) / (bottom - clientY);
  }

  return (clientY - top) / (clientX - left);
};

const rotateContentElement =
  ({ clientX, clientY }) =>
  (tileElement) => {
    const contentElement = tileElement.querySelector('div');

    const { top, left, bottom, right } = tileElement.getBoundingClientRect();
    const { centerX, centerY } = getTileElementCenterCoordinates({
      top,
      left,
      bottom,
      right,
    });
    const contentElementRotationTangent = getContentElementRotationTangent({
      top,
      left,
      bottom,
      right,
      clientX,
      clientY,
    });

    const [horizontalOrigin, horizontalPositionToReset] =
      centerX - clientX > 0 ? ['right', 'left'] : ['left', 'right'];
    const [verticalOrigin, verticalPositionToReset] =
      centerY - clientY > 0 ? ['bottom', 'top'] : ['top', 'bottom'];

    contentElement.style[horizontalPositionToReset] = 'auto';
    contentElement.style[verticalPositionToReset] = 'auto';
    contentElement.style[horizontalOrigin] = 0;
    contentElement.style[verticalOrigin] = 0;
    contentElement.style.transformOrigin = `${verticalOrigin} ${horizontalOrigin}`;
    contentElement.style.transform = `rotate(${Math.atan(
      contentElementRotationTangent
    )}rad)`;
  };

const mouseMoveEventListener = ({ clientX, clientY }) => {
  const tileElements = document.querySelectorAll('.tile');

  tileElements.forEach(rotateContentElement({ clientX, clientY }));
};

document.addEventListener('mousemove', mouseMoveEventListener);

generateTileElements();
