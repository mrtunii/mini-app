import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Game from '../pages/Game';
import Leaderboard from '../pages/Leaderboard';
import Tasks from '../pages/Tasks';
import Friends from '../pages/Friends';
import Spin from '../pages/Spin';
import Aviator from '../pages/Aviator';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/up-down" element={<Game />} />
      <Route path="/aviator" element={<Aviator />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/tasks" element={<Tasks />} />
      <Route path="/spin" element={<Spin />} />
      <Route path="/friends" element={<Friends />} />
    </Routes>
  );
};

export default AppRoutes;