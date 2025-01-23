import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { CaptureCard } from './components/CaptureCard';
import { EditMyInfo } from './components/EditMyInfo';
import { CapturePartnerCard } from './components/CapturePartnerCard';
import { EditPartnerInfo } from './components/EditPartnerInfo';
import { ComposeEmail } from './components/ComposeEmail';
import { ConfirmEmail } from './components/ConfirmEmail';
import { InputMeetingInfo } from './components/InputMeetingInfo';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<CaptureCard />} />
          <Route path="edit-my-info" element={<EditMyInfo />} />
          <Route path="input-meeting" element={<InputMeetingInfo />} />
          <Route path="capture-partner" element={<CapturePartnerCard />} />
          <Route path="edit-partner-info" element={<EditPartnerInfo />} />
          <Route path="compose-email" element={<ComposeEmail />} />
          <Route path="confirm-email" element={<ConfirmEmail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;