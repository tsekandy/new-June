import React, { useMemo, useEffect, useState } from 'react';
import { ArrowLeft, Share2, Clock, User, Calendar, ChevronLeft, ChevronRight, Link2, Twitter, Facebook, CheckCircle } from 'lucide-react';
import { ARTICLES, Article } from '../data/articles';

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-neutral-900">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

interface ArticleDetailProps {
  slug: string;
  onBack: () => void;
  onArticleChange?: (slug: string) => void;
}

export default function ArticleDetail({ slug, onBack, onArticleChange }: ArticleDetailProps) {
  const article = useMemo(() => ARTICLES.find((a) => a.slug === slug), [slug]);
  const currentIndex = useMemo(() => ARTICLES.findIndex((a) => a.slug === slug), [slug]);
  const prevArticle = useMemo(() => (currentIndex > 0 ? ARTICLES[currentIndex - 1] : null), [currentIndex]);
  const nextArticle = useMemo(() => (currentIndex < ARTICLES.length - 1 ? ARTICLES[currentIndex + 1] : null), [currentIndex]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!article) return;
    const shareUrl = `${window.location.origin}${window.location.pathname}?article=${article.slug}`;
    const setMeta = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', property);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };
    const setNameMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };
    document.title = `${article.title} | Happy Pills Pharmacy`;
    setMeta('og:title', article.title);
    setMeta('og:description', article.excerpt);
    setMeta('og:image', article.featured_image.startsWith('http') ? article.featured_image : `${window.location.origin}${article.featured_image}`);
    setMeta('og:url', shareUrl);
    setMeta('og:type', 'article');
    setMeta('og:site_name', 'Happy Pills Pharmacy');
    setNameMeta('twitter:card', 'summary_large_image');
    setNameMeta('twitter:title', article.title);
    setNameMeta('twitter:description', article.excerpt);
    setNameMeta('description', article.excerpt);
    return () => {
      document.title = 'Happy Pills Pharmacy';
    };
  }, [article]);

  if (!article) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-600 mb-4">Article not found</p>
          <button onClick={onBack} className="btn-primary">
            Back to Articles
          </button>
        </div>
      </div>
    );
  }

  const shareUrl = `${window.location.origin}${window.location.pathname}?article=${article.slug}`;

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => { setCopied(false); setShowShareMenu(false); }, 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: article.title, text: article.excerpt, url: shareUrl });
      } catch {
        // user cancelled or share failed — do nothing
      }
    } else {
      setShowShareMenu((v) => !v);
    }
  };

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${article.title}\n${shareUrl}`)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-neutral-50 border-b border-neutral-200">
        <div className="section-container py-6">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Articles
          </button>

          {/* Article Meta */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-primary-100 text-primary-700 text-xs font-semibold px-3 py-1 rounded-full">
                {article.category}
              </span>
              <span className="text-sm text-neutral-500">{article.read_time} min read</span>
            </div>

            <h1 className="heading-lg text-neutral-900 mb-4">{article.title}</h1>

            <div className="flex flex-wrap gap-6 text-sm text-neutral-600">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(article.published_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <a
                href={shareUrl}
                onClick={async (e) => {
                  if (navigator.share) {
                    e.preventDefault();
                    try {
                      await navigator.share({ title: article.title, text: article.excerpt, url: shareUrl });
                    } catch { /* cancelled */ }
                  }
                }}
                className="flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors font-medium"
              >
                <Share2 className="w-4 h-4" />
                Share
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {article.featured_image && (
        <div className="w-full h-96 overflow-hidden bg-neutral-100">
          <img
            src={article.featured_image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Article Content */}
      <article className="section-container max-w-3xl py-12">
        <div className="prose prose-lg max-w-none text-neutral-700 leading-relaxed">
          {article.content.split('\n\n').map((paragraph, index) => {
            // Handle headings
            if (paragraph.startsWith('# ')) {
              return (
                <h1 key={index} className="heading-lg text-neutral-900 mt-10 mb-4">
                  {paragraph.replace(/^# /, '')}
                </h1>
              );
            }
            if (paragraph.startsWith('## ')) {
              return (
                <h2 key={index} className="heading-md text-neutral-900 mt-8 mb-3">
                  {paragraph.replace(/^## /, '')}
                </h2>
              );
            }
            if (paragraph.startsWith('### ')) {
              return (
                <h3 key={index} className="heading-sm text-neutral-900 mt-6 mb-2">
                  {paragraph.replace(/^### /, '')}
                </h3>
              );
            }

            // Handle lists
            if (paragraph.trim().startsWith('- ')) {
              const items = paragraph.split('\n').filter((item) => item.trim().startsWith('- '));
              return (
                <ul key={index} className="list-disc list-inside space-y-2 my-4 ml-2">
                  {items.map((item, i) => (
                    <li key={i} className="text-neutral-700">
                      {renderInline(item.replace(/^- /, ''))}
                    </li>
                  ))}
                </ul>
              );
            }

            // Regular paragraphs
            if (paragraph.trim()) {
              return (
                <p key={index} className="mb-4 text-justify">
                  {renderInline(paragraph)}
                </p>
              );
            }

            return null;
          })}
        </div>

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-neutral-200">
            <p className="text-sm font-semibold text-neutral-600 mb-3">TAGS</p>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-neutral-100 text-neutral-700 text-sm rounded-full hover:bg-primary-100 hover:text-primary-700 transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Share Box */}
        <div className="mt-10 pt-8 border-t border-neutral-200">
          <p className="text-sm font-semibold text-neutral-700 mb-4">Share this article</p>
          <div className="flex items-center gap-3 mb-4 p-3 bg-neutral-50 rounded-xl border border-neutral-200">
            <span className="text-xs text-neutral-500 flex-1 truncate">{shareUrl}</span>
            <button
              onClick={handleCopyLink}
              className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors"
            >
              {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Link2 className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="flex gap-3">
            <a
              href={shareLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 bg-[#25D366] text-white text-sm font-semibold rounded-lg hover:bg-[#1ebe5d] transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </a>
            <a
              href={shareLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 text-white text-sm font-semibold rounded-lg hover:bg-neutral-700 transition-colors"
            >
              <Twitter className="w-4 h-4" />
              X
            </a>
            <a
              href={shareLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 bg-[#1877F2] text-white text-sm font-semibold rounded-lg hover:bg-[#1565d4] transition-colors"
            >
              <Facebook className="w-4 h-4" />
              Facebook
            </a>
          </div>
        </div>
      </article>

      {/* Navigation */}
      <section className="bg-neutral-50 border-t border-neutral-200 py-12">
        <div className="section-container max-w-3xl">
          <h3 className="heading-sm text-neutral-900 mb-6">More Articles</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {prevArticle && (
              <button
                onClick={() => onArticleChange?.(prevArticle.slug)}
                className="card p-6 text-left hover:shadow-lg transition-shadow group"
              >
                <div className="flex items-start gap-4">
                  <ChevronLeft className="w-5 h-5 text-primary-600 shrink-0 mt-1" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-neutral-500 uppercase mb-1">Previous</p>
                    <p className="font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {prevArticle.title}
                    </p>
                  </div>
                </div>
              </button>
            )}

            {nextArticle && (
              <button
                onClick={() => onArticleChange?.(nextArticle.slug)}
                className="card p-6 text-left hover:shadow-lg transition-shadow group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-neutral-500 uppercase mb-1">Next</p>
                    <p className="font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {nextArticle.title}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-primary-600 shrink-0 mt-1" />
                </div>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="section-padding bg-white">
        <div className="section-container max-w-3xl">
          <h3 className="heading-sm text-neutral-900 mb-6">Related Articles</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ARTICLES.filter((a) => a.category === article.category && a.id !== article.id)
              .slice(0, 2)
              .map((relatedArticle) => (
                <button
                  key={relatedArticle.id}
                  onClick={() => onArticleChange?.(relatedArticle.slug)}
                  className="card overflow-hidden hover:shadow-lg transition-all group"
                >
                  <div className="h-40 overflow-hidden bg-neutral-100">
                    <img
                      src={relatedArticle.featured_image}
                      alt={relatedArticle.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-primary-600 font-semibold mb-2">{relatedArticle.category}</p>
                    <h4 className="font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-2">
                      {relatedArticle.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                      <Clock className="w-3 h-3" />
                      {relatedArticle.read_time} min read
                    </div>
                  </div>
                </button>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}
