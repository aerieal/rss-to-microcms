// app/page.tsx
import { getArticles } from '@/lib/getArticles';

type Article = {
  id: string;
  title: string;
  url: string;
  publishedAt: string;
  source: string;
};

export default async function HomePage() {
  const articles: Article[] = await getArticles();

  // source ごとに分類
  const grouped = articles.reduce((acc: Record<string, Article[]>, article) => {
    const key = article.source || 'others';
    if (!acc[key]) acc[key] = [];
    acc[key].push(article);
    return acc;
  }, {});

  const serviceColors: Record<string, string> = {
    qiita: 'bg-green-100 border-green-300',
    devto: 'bg-purple-100 border-purple-300',
    zenn: 'bg-blue-100 border-blue-300',
    others: 'bg-gray-100 border-gray-300',
  };

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-8">最新DEVニュース</h1>
      {Object.entries(grouped).map(([source, items]) => (
        <section
          key={source}
          className={`rounded-2xl border p-6 shadow ${serviceColors[source] || serviceColors['others']}`}
        >
          <h2 className="text-2xl font-semibold capitalize mb-4 text-gray-800">
            {source}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {items.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white rounded-xl border p-4 hover:shadow-md transition"
              >
                <h3 className="text-lg font-medium text-gray-900 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(item.publishedAt).toLocaleDateString()}
                </p>
              </a>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
