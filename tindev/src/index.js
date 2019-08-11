import React from 'react';
import { YellowBox } from 'react-native'; /*Import pra parar de aparecer o erro*/

YellowBox.ignoreWarnings([
  'Unrecognized WebSocket'
]);

import Routes from './routes';

export default function App() {
  return (
    <Routes />
  );
}
