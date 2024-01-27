import Header from 'components/header';

export default async function Page() {
  return (
    <>
      <Header headerText="Settings" />
      <div className="min-h-dvh border-r border-neutral-200 pb-24 flex flex-col gap-2 px-4 py-8"></div>
    </>
  );
}
