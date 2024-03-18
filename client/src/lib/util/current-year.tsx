import React from 'react';

const CurrentYear: React.FC = () => {
  const getCurrentYear = (): number => {
    return new Date().getFullYear();
  };

  return (
    <>
      {getCurrentYear()}
    </>
  );
};

export default CurrentYear;