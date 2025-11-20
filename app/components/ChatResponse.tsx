"use client";
import { Copy, Check } from "lucide-react";
import * as React from "react";
import ReactMarkdown from "react-markdown";
import { AnimateAvatar } from "./AnimateAvatar";

interface ChatResponseProps {
  response: string;
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
  // Detecta si hay una URL de imagen en la respuesta
  const imageData = React.useMemo(() => {
    let userImage = null;
    let text = response;

    const imageUrlMatch = response.match(
      /https?:\/\/[\w\-.]+(?:\/[\w\-.]+)*\.(?:jpg|jpeg|png|webp|gif)(\?[^\s]*)?/i
    );

    if (imageUrlMatch) {
      userImage = imageUrlMatch[0];
    } else {
      try {
        const parsed = JSON.parse(response);
        if (
          parsed &&
          typeof parsed === "object" &&
          parsed.userImage &&
          parsed.text
        ) {
          userImage = parsed.userImage;
          text = parsed.text;
        }
      } catch {
        // No es JSON, continuar con texto plano
      }
    }

    return { userImage, text };
  }, [response]);

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
            <div className="pr-12 prose prose-invert max-w-none">
              <ReactMarkdown components={markdownComponents}>
                {imageData.text}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
