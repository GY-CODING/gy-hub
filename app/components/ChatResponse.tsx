"use client";
import { ScryfallCard } from "@/app/api/assistants/mtg/types";
import { Check, Copy } from "lucide-react";
import * as React from "react";
import ReactMarkdown from "react-markdown";
import { AnimateAvatar } from "./AnimateAvatar";
import { MagicCard } from "./MagicCard";

interface ChatResponseProps {
  response:
    | string
    | { type: string; card?: ScryfallCard; content?: string; text?: string };
  copied: boolean;
  onCopy: () => void;
  assistantName?: string;
  assistantAvatar?: string;
}

export function ChatResponse({
  response,
  copied,
  onCopy,
  assistantName = "IA",
  assistantAvatar,
}: ChatResponseProps) {
  // Detecta si es una respuesta estructurada de carta
  const structuredData = React.useMemo(() => {
    if (typeof response === "object" && response !== null) {
      return response;
    }
    try {
      // Intentar parsear si viene como string JSON
      if (typeof response === "string" && response.trim().startsWith("{")) {
        return JSON.parse(response);
      }
    } catch (e) {
      // No es JSON válido
    }
    return null;
  }, [response]);

  // Detecta si hay URLs de imágenes en formato markdown o Scryfall IDs (Legacy support)
  const imageData = React.useMemo(() => {
    // Si es datos estructurados, no procesamos markdown de imágenes de la forma antigua
    if (structuredData && structuredData.type === "card_data") {
      return {
        userImage: null,
        cardImages: [],
        text: structuredData.content || "",
      };
    }

    let userImage = null;
    let cardImages: string[] = [];
    let text = typeof response === "string" ? response : response.text || "";

    // Si es un objeto con texto, usamos ese texto
    if (structuredData && structuredData.text) {
      text = structuredData.text;
    }

    // Buscar Scryfall IDs y construir URLs
    const scryfallIdRegex = /\*\*SCRYFALL_ID:\*\*\s*([a-f0-9-]+)/gi;
    const scryfallIdMatches = [...text.matchAll(scryfallIdRegex)];

    if (scryfallIdMatches.length > 0) {
      cardImages = scryfallIdMatches.map((match) => {
        const id = match[1];
        // Construir URL usando el formato de Scryfall: /normal/front/[primer-char]/[segundo-char]/[id].jpg
        const firstChar = id.charAt(0);
        const secondChar = id.charAt(1);
        return `https://cards.scryfall.io/normal/front/${firstChar}/${secondChar}/${id}.jpg`;
      });
      // Eliminar las líneas de SCRYFALL_ID del texto
      text = text.replace(scryfallIdRegex, "");
    }

    // Buscar imágenes en formato markdown ![alt](url) como fallback
    const markdownImageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    const markdownMatches = [...text.matchAll(markdownImageRegex)];

    if (markdownMatches.length > 0 && cardImages.length === 0) {
      cardImages = markdownMatches.map((match) => match[2]);
      // Eliminar las imágenes markdown del texto
      text = text.replace(markdownImageRegex, "");
    }

    // Fallback: buscar URLs directas de imágenes
    const imageUrlMatch = text.match(
      /https?:\/\/[\w\-.]+(?:\/[\w\-.]+)*\.(?:jpg|jpeg|png|webp|gif)(\?[^\s]*)?/i
    );

    if (imageUrlMatch && cardImages.length === 0) {
      userImage = imageUrlMatch[0];
    }

    return { userImage, cardImages, text };
  }, [response, structuredData]);

  const markdownComponents = React.useMemo(
    () => ({
      h1: ({
        children,
        ...props
      }: React.HTMLAttributes<HTMLHeadingElement>) => (
        <h1
          className="text-3xl font-bold mt-6 mb-4 pb-2 border-b border-border"
          {...props}
        >
          {children}
        </h1>
      ),
      h2: ({
        children,
        ...props
      }: React.HTMLAttributes<HTMLHeadingElement>) => (
        <h2
          className="text-2xl font-semibold mt-5 mb-3 text-foreground"
          {...props}
        >
          {children}
        </h2>
      ),
      h3: ({
        children,
        ...props
      }: React.HTMLAttributes<HTMLHeadingElement>) => (
        <h3
          className="text-xl font-semibold mt-4 mb-2 text-foreground"
          {...props}
        >
          {children}
        </h3>
      ),
      h4: ({
        children,
        ...props
      }: React.HTMLAttributes<HTMLHeadingElement>) => (
        <h4
          className="text-lg font-semibold mt-3 mb-2 text-foreground/90"
          {...props}
        >
          {children}
        </h4>
      ),
      p: ({
        children,
        ...props
      }: React.HTMLAttributes<HTMLParagraphElement>) => (
        <p className="mb-4 leading-relaxed text-foreground/90" {...props}>
          {children}
        </p>
      ),
      ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
        <ul
          className="mb-4 ml-6 space-y-2 list-disc marker:text-primary"
          {...props}
        >
          {children}
        </ul>
      ),
      ol: ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
        <ol
          className="mb-4 ml-6 space-y-2 list-decimal marker:text-primary"
          {...props}
        >
          {children}
        </ol>
      ),
      li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
        <li className="leading-relaxed text-foreground/90" {...props}>
          {children}
        </li>
      ),
      blockquote: ({
        children,
        ...props
      }: React.HTMLAttributes<HTMLQuoteElement>) => (
        <blockquote
          className="border-l-4 border-primary pl-4 py-2 my-4 italic bg-muted/30 rounded-r"
          {...props}
        >
          {children}
        </blockquote>
      ),
      strong: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
        <strong className="font-bold text-foreground" {...props}>
          {children}
        </strong>
      ),
      em: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
        <em className="italic text-foreground/80" {...props}>
          {children}
        </em>
      ),
      hr: ({ ...props }: React.HTMLAttributes<HTMLHRElement>) => (
        <hr className="my-6 border-border" {...props} />
      ),
      code({
        inline,
        children,
        ...props
      }: React.HTMLAttributes<HTMLElement> & { inline?: boolean }) {
        if (inline) {
          return (
            <code
              className="relative rounded bg-primary/10 px-[0.4rem] py-[0.2rem] font-mono text-sm text-primary font-semibold"
              {...props}
            >
              {children}
            </code>
          );
        }
        return (
          <pre
            className="rounded-lg bg-muted p-4 overflow-x-auto my-4 border border-border"
            {...props}
          >
            <code className="font-mono text-sm text-foreground">
              {children}
            </code>
          </pre>
        );
      },
      img: ({
        src,
        alt,
        ...props
      }: React.ImgHTMLAttributes<HTMLImageElement>) => (
        <img
          src={src}
          alt={alt || "Card image"}
          className="rounded-lg border border-primary/30 shadow-lg my-4 max-w-md w-full object-contain"
          loading="lazy"
          {...props}
        />
      ),
      a: ({
        href,
        children,
        ...props
      }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:text-primary/80 underline transition-colors"
          {...props}
        >
          {children}
        </a>
      ),
    }),
    []
  );

  return (
    <div className="w-full mt-6 space-y-4">
      <div className="flex items-start gap-4">
        {imageData.userImage ? (
          <div className="flex-shrink-0 mt-1">
            <AnimateAvatar
              src={imageData.userImage}
              fallback={assistantName}
              tooltip={assistantName}
            />
          </div>
        ) : assistantAvatar && assistantAvatar.startsWith("http") ? (
          <div className="flex-shrink-0 mt-1">
            <img
              src={assistantAvatar}
              alt={assistantName}
              className="size-10 rounded-full object-cover border-2 border-primary/20"
            />
          </div>
        ) : assistantAvatar ? (
          <div className="flex-shrink-0 mt-1">
            <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-2xl">
              {assistantAvatar}
            </div>
          </div>
        ) : (
          <div className="flex-shrink-0 mt-1">
            <div className="size-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
              {assistantName.slice(0, 2).toUpperCase()}
            </div>
          </div>
        )}
        <div className="flex-1">
          <div className="text-xs font-medium text-muted-foreground mb-2">
            {assistantName}
          </div>
          <div className="rounded-lg border bg-white/5 backdrop-blur-sm p-6 relative">
            <button
              onClick={onCopy}
              className="absolute top-4 right-4 p-2 rounded-md hover:bg-accent transition-colors z-10"
              title="Copiar respuesta"
            >
              {copied ? (
                <Check className="size-4 text-green-500" />
              ) : (
                <Copy className="size-4 text-muted-foreground" />
              )}
            </button>

            {/* Renderizar carta estructurada si existe */}
            {structuredData &&
              structuredData.type === "card_data" &&
              structuredData.card && (
                <div className="mb-4">
                  <MagicCard card={structuredData.card} />
                  {structuredData.totalFound &&
                    structuredData.totalFound > 1 && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Se encontraron {structuredData.totalFound} cartas.
                        Mostrando la más relevante.
                      </p>
                    )}
                  {/* Explicación de la IA */}
                  {structuredData.explanation && (
                    <div className="mt-4 pt-4 border-t border-border/30">
                      <div className="prose prose-invert max-w-none">
                        <ReactMarkdown components={markdownComponents}>
                          {structuredData.explanation}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>
              )}

            {/* Render card images separately before text (Legacy) */}
            {imageData.cardImages.length > 0 && (
              <div className="mb-6 flex flex-wrap gap-4">
                {imageData.cardImages.map((imageUrl, idx) => (
                  <img
                    key={idx}
                    src={imageUrl}
                    alt={`Magic card ${idx + 1}`}
                    className="rounded-lg border-2 border-primary/40 shadow-xl max-w-sm w-full object-contain hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                ))}
              </div>
            )}

            {imageData.text && (
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown components={markdownComponents}>
                  {imageData.text}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
