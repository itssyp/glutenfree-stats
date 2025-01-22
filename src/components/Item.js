import React, { useState } from 'react';

const Item = ({ item }) => {
  const [count, setCount] = useState(item.count);

  const incrementCounter = () => {
    setCount(count + 1);
    // Add logic to update the count in the database/server here if needed
  };

  return (
    <li>
      {item.name}: {count} <button onClick={incrementCounter}>Increase</button>
    </li>
  );
};

export default Item;