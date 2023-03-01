const colorizeContentElement = (contentElement) => {
  contentElement.style.backgroundColor = `hsl(${Math.floor(
    Math.random() * 360
  )}, 100%, 80%)`;
};

const colorizeContentElements = () => {
  const contentElements = document.querySelectorAll('.tile div');

  contentElements.forEach(colorizeContentElement);
};

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

  setInterval(colorizeContentElements, 1000);
};

const getContentElementRotationAngle = ({ top, left, clientX, clientY }) => {
  const baseAngle = Math.atan((top - clientY) / (left - clientX));

  if (left > clientX) {
    return baseAngle - Math.PI / 4;
  }

  return baseAngle + (3 * Math.PI) / 4;
};

const rotateContentElement =
  ({ clientX, clientY }) =>
  (tileElement) => {
    const contentElement = tileElement.querySelector('div');

    const { top, left } = tileElement.getBoundingClientRect();

    const contentElementRotationAngle = getContentElementRotationAngle({
      top,
      left,
      clientX,
      clientY,
    });

    if (clientX !== left) {
      contentElement.style.transform = `rotate(${contentElementRotationAngle}rad)`;
    }
  };

const mouseMoveEventListener = ({ clientX, clientY }) => {
  const tileElements = document.querySelectorAll('.tile');

  tileElements.forEach(rotateContentElement({ clientX, clientY }));
};

generateTileElements();
document.addEventListener('mousemove', mouseMoveEventListener);
