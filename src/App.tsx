import { Route, Routes } from 'react-router-dom';
import { Index } from './containers/index/Index';
import { Match } from './containers/match/Match';

export const App = () => {
  return (
    <Routes>
      <Route index element={<Index />} />
      <Route path=":matchId" element={<Match />} />
    </Routes>
  );
};
