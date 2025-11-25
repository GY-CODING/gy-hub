export interface ScryfallCard {
  id: string;
  oracle_id: string;
  name: string;
  lang: string;
  uri: string;
  scryfall_uri: string;
  image_uris?: {
    small: string;
    normal: string;
    large: string;
    png: string;
    art_crop: string;
    border_crop: string;
  };
  mana_cost?: string;
  type_line: string;
  oracle_text?: string;
  power?: string;
  toughness?: string;
  colors?: string[];
  color_identity: string[];
  keywords: string[];
  legalities: Record<string, string>;
  set_name: string;
  rarity: string;
  flavor_text?: string;
  artist?: string;
  prices?: {
    usd?: string;
    eur?: string;
  };
}
