import { useMemo } from 'react';

import AddBookmarkInput from 'components/bookmark/add-input';
import Card from 'components/card';
import Header from 'components/header';

import { groupByDate, groupByKey } from 'lib/data';
import { cn } from 'lib/utils';

import { BookmarkModifiedType } from 'types/data';

import { getBookmarks } from './actions/bookmarks';
import { getTags } from './actions/tags';

export default async function Page() {
  const bookmarks = await getBookmarks();
  const tags = await getTags();
  const bookmarksByDate = groupByDate(bookmarks);

  return (
    <>
      <Header />
      <AddBookmarkInput btnClassname="mx-2" />
      <div className="h-full border-r border-neutral-200 pb-24">
        {Object.values(bookmarksByDate)
          .reverse()
          .map((bookmarksData: BookmarkModifiedType[], index: number) => {
            return (
              <div
                className={cn(`flex flex-col w-full`, {
                  'border-b border-neutral-200': bookmarksData.length > 1,
                })}
                key={index}
              >
                {bookmarksData.map((bookmark: BookmarkModifiedType) => (
                  <Card key={bookmark.id} tags={tags} data={bookmark} />
                ))}
              </div>
            );
          })}
      </div>
    </>
  );
}
