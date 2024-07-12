import React from 'react';
import { Bookshelf, NavigationBar } from '../../components';

const BookshelfPage = ({ books }) => {
  return (
    <div>
      <NavigationBar />
      <Bookshelf items={books} />
    </div>
  );
};

export default BookshelfPage;
