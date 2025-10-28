import { client } from '@/sanity/lib/client';
import { NAVIGATION_QUERY } from '@/sanity/queries/navigation';
import type { NAVIGATION_QUERYResult } from '@/sanity.types';

export default async function DebugNavPage() {
  const navigation =
    await client.fetch<NAVIGATION_QUERYResult>(NAVIGATION_QUERY);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Navigation Debug</h1>

      <div className="bg-muted p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Raw Navigation Data</h2>
        <pre className="overflow-auto text-xs bg-background p-4 rounded">
          {JSON.stringify(navigation, null, 2)}
        </pre>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">
          Navigation Links Analysis
        </h2>
        {navigation?.[0]?.links?.map((link, idx: number) => (
          <div key={idx} className="mb-4 p-4 border rounded">
            <h3 className="font-bold">{link.title || 'No Title'}</h3>
            <div className="mt-2 text-sm space-y-1">
              <p>
                <strong>Is External:</strong> {String(link.isExternal)}
              </p>
              <p>
                <strong>href:</strong> {link.href || 'N/A'}
              </p>
              <p>
                <strong>Resolved Link:</strong>{' '}
                <span className="text-blue-600">{link.resolvedLink}</span>
              </p>
              <p>
                <strong>Internal Link Type:</strong>{' '}
                {link.internalLink?._type || 'N/A'}
              </p>
              <p>
                <strong>Internal Link Slug:</strong>{' '}
                {link.internalLink?.slug?.current || 'N/A'}
              </p>

              {link.subLinks && link.subLinks.length > 0 && (
                <div className="mt-2 ml-4 border-l-2 pl-4">
                  <p className="font-semibold">Sub Links:</p>
                  {link.subLinks.map((subLink, subIdx: number) => (
                    <div key={subIdx} className="mt-2 text-xs">
                      <p>
                        <strong>Title:</strong> {subLink.title || 'No Title'}
                      </p>
                      <p>
                        <strong>Resolved:</strong>{' '}
                        <span className="text-blue-600">
                          {subLink.resolvedLink}
                        </span>
                      </p>
                      <p>
                        <strong>Type:</strong>{' '}
                        {subLink.internalLink?._type || 'N/A'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
