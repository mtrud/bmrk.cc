'use client';

import { ClipboardEvent, SyntheticEvent, useState } from 'react';

import { UploadIcon } from '@radix-ui/react-icons';
import { toast } from 'sonner';

import { createBookmark } from 'app/actions/bookmarks';
import { getOg } from 'app/actions/og';

import Loader from 'components/loader';
import UploadModal from 'components/modal/upload';
import { Input } from 'components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from 'components/ui/tooltip';

import { refreshInChromeExt } from 'lib/chrome-extension';
import { cn, isValidUrl } from 'lib/utils';

import { BookmarkInsertModified, MetaTags } from 'types/data';

type AddBookmarkInputProps = {
  className?: string;
  btnClassname?: string;
  onHide?: () => void;
  showUpload?: boolean;
};

export default function AddBookmarkInput({
  className,
  btnClassname = '',
  onHide,
  showUpload,
}: AddBookmarkInputProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onSubmit = async (inputUrl: string) => {
    setLoading(true);
    try {
      const ogData: MetaTags = await getOg(inputUrl);
      const payload = {
        url: inputUrl,
        description: ogData.description?.trim(),
        title: ogData.title?.trim(),
        metadata: {
          image: ogData.image,
        },
      } as BookmarkInsertModified;
      await createBookmark(payload);
      toast.success(`Bookmark added.`);
      refreshInChromeExt();
      setUrl('');
    } catch (error) {
      toast.error(`Unable to add bookmark, try again.`);
    } finally {
      setLoading(false);
      onHide?.();
    }
  };

  const onPaste = async (event: ClipboardEvent<HTMLInputElement>) => {
    const pastedText = event.clipboardData?.getData('text');
    if (isValidUrl(pastedText)) {
      await onSubmit(pastedText);
    }
  };

  return (
    <div
      className={cn(
        'h-26 flex flex-col px-1 sm:border-border sm:border-r border-b',
        className,
      )}
    >
      <form
        className="h-full"
        onSubmit={async (event: SyntheticEvent<HTMLFormElement>) => {
          event.preventDefault();
          await onSubmit(url);
        }}
      >
        <div className="flex flex-col items-center justify-center w-full">
          <Input
            className={cn(
              `mt-2 bg-transparent focus-visible:ring-0 w-full pt-0 px-2 pb-1 !outline-none !focus:outline-none !focus:border-none !border-none !shadow-none placeholder:text-stone-500 text-lg font-normal`,
            )}
            autoComplete="off"
            inputMode="text"
            type="url"
            pattern="https://.*|http://.*"
            placeholder="Just paste or type here."
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setUrl(event.target.value);
            }}
            onPaste={onPaste}
            value={url}
            data-1p-ignore
          />
        </div>
        <div
          className={cn(`flex mb-2 items-center justify-between`, btnClassname)}
        >
          <div>
            {showUpload ? (
              <button
                className="w-8 h-8 group transition-colors duration-200 rounded-full hover:bg-accent hover:border hover:border-input active:bg-accent -left-1.5 relative top-2 inline-flex items-center justify-center"
                type="button"
                onClick={() => setOpen(true)}
              >
                <Tooltip delayDuration={500}>
                  <TooltipTrigger asChild>
                    <UploadIcon className="w-[19px] h-[19px] transition-colors duration-200 text-muted-foreground group-hover:text-primary group-active:text-primary" />
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    className="flex items-center mt-2 text-white dark:text-black"
                  >
                    Upload bookmarks
                  </TooltipContent>
                </Tooltip>
              </button>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={loading || !isValidUrl(url)}
            className={cn(
              `rounded-full w-[72px] h-[40px] transition-colors font-medium items-center bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-700 disabled:opacity-40 disabled:active:bg-blue-600 disabled:hover:bg-blue-600 disabled:focus:bg-blue-600 border-0 flex justify-center py-2 px-5 text-white`,
              {
                '!opacity-50 cursor-not-allowed': loading,
              },
            )}
          >
            {loading ? <Loader /> : 'Add'}
          </button>
        </div>
      </form>

      {open ? <UploadModal open={open} onHide={setOpen} /> : null}
    </div>
  );
}
