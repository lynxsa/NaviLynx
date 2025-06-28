import React from 'react';

interface TestProps {
  venueId: string;
  onClose: () => void;
}

const TestChatScreen: React.FC<TestProps> = ({ venueId, onClose }) => {
  return <div>Test {venueId}</div>;
};

export default TestChatScreen;
