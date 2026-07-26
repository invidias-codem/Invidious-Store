import { GothicButton } from '@/components/UI';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
      <h1 className="font-display text-5xl sm:text-7xl">404</h1>
      <p className="text-sm text-gray-500">This artifact is not indexed.</p>
      <GothicButton label="Return to archive" href="/products" />
    </div>
  );
}
