// gestureMapping.js

const gestureToAction = (gesture) => {
  switch (gesture) {
    case '1':
      return 'OPEN_CHROME';
    case '2':
      return 'OPEN_FILE_EXPLORER';
    case '3':
      return 'OPEN_YOUTUBE';
    case '4':
      return 'CLOSE_TAB';
    case '5':
      return 'SHUT_DOWN_WINDOW'; // Corrected spelling mistake here

    default:
      return 'UNKNOWN_ACTION';
  }
};

export default gestureToAction;
