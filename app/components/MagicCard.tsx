"use client";

import { ScryfallCard } from "@/app/api/assistants/mtg/types";
import { Coins, ExternalLink, Shield } from "lucide-react";
import { ManaCost } from "./ManaCost";

interface MagicCardProps {
  card: ScryfallCard;
}

export function MagicCard({ card }: MagicCardProps) {
  // Determinar color del acento basado en la identidad de color
  const getAccentColor = () => {
    if (!card.colors || card.colors.length === 0) return "border-l-stone-400"; // Incoloro/Artifact
    if (card.colors.length > 1) return "border-l-yellow-500"; // Multicolor/Gold

    const color = card.colors[0];
    switch (color) {
      case "W":
        return "border-l-yellow-200";
      case "U":
        return "border-l-blue-400";
      case "B":
        return "border-l-purple-600";
      case "R":
        return "border-l-red-500";
      case "G":
        return "border-l-green-500";
      default:
        return "border-l-stone-400";
    }
  };

  const imageUrl =
    card.image_uris?.normal || card.image_uris?.large || card.image_uris?.png;
  const artCropUrl = card.image_uris?.art_crop;

  return (
    <div className={`border-l-4 ${getAccentColor()} pl-4 -ml-2 mb-4`}>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Imagen de la carta */}
        <div className="flex-shrink-0">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={card.name}
              className="rounded-lg shadow-xl max-w-[280px] w-full object-contain hover:scale-[1.02] transition-transform duration-300 border border-white/10"
            />
          ) : (
            <div className="w-[280px] h-[390px] bg-stone-800/50 rounded-lg flex items-center justify-center text-stone-500 border border-white/10">
              Sin imagen
            </div>
          )}
        </div>

        {/* Detalles de la carta */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          {/* Header con arte */}
          <div className="flex gap-3">
            {artCropUrl && (
              <div className="flex-shrink-0">
                <img
                  src={artCropUrl}
                  alt={`${card.name} artwork`}
                  className="w-20 h-20 rounded-lg object-cover border border-white/20 shadow-md"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                <h3 className="text-2xl font-bold text-foreground">
                  {card.name}
                </h3>
                {card.mana_cost && (
                  <div className="bg-primary/10 px-3 py-1.5 rounded-md border border-primary/20">
                    <ManaCost manaCost={card.mana_cost} size={18} />
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                {card.type_line}
              </p>
            </div>
          </div>

          {/* Oracle Text */}
          <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
            <p className="whitespace-pre-wrap leading-relaxed text-foreground/90 text-sm">
              {card.oracle_text || "Sin texto de oráculo"}
            </p>
            {card.flavor_text && (
              <p className="mt-3 pt-3 italic text-xs text-muted-foreground border-t border-border/30">
                <em>"{card.flavor_text}"</em>
              </p>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {card.power && card.toughness && (
              <div className="flex items-center gap-2 bg-muted/20 px-3 py-2 rounded-md border border-border/30">
                <Shield className="size-4 text-primary" />
                <span className="font-bold text-sm">
                  {card.power}/{card.toughness}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2 bg-muted/20 px-3 py-2 rounded-md border border-border/30">
              <div
                className={`size-2 rounded-full ${
                  card.rarity === "mythic"
                    ? "bg-orange-500"
                    : card.rarity === "rare"
                    ? "bg-yellow-500"
                    : card.rarity === "uncommon"
                    ? "bg-gray-400"
                    : "bg-stone-500"
                }`}
              />
              <span className="capitalize text-sm">{card.rarity}</span>
            </div>

            {card.set_name && (
              <div className="flex items-center gap-2 bg-muted/20 px-3 py-2 rounded-md border border-border/30 col-span-2 sm:col-span-1">
                <span className="text-xs text-muted-foreground truncate">
                  {card.set_name}
                </span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border/30">
            {card.prices?.usd && (
              <div className="flex items-center gap-1.5 text-green-400 bg-green-950/20 px-2.5 py-1 rounded-md text-xs border border-green-900/30">
                <Coins className="size-3.5" />
                <span className="font-medium">${card.prices.usd}</span>
              </div>
            )}
            {card.prices?.eur && (
              <div className="flex items-center gap-1.5 text-blue-400 bg-blue-950/20 px-2.5 py-1 rounded-md text-xs border border-blue-900/30">
                <Coins className="size-3.5" />
                <span className="font-medium">€{card.prices.eur}</span>
              </div>
            )}

            <a
              href={card.scryfall_uri}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors group"
            >
              <span>Ver en Scryfall</span>
              <ExternalLink className="size-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
