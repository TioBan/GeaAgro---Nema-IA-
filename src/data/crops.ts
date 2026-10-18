export interface CropInfo {
  id: string;
  name: string;
  category: string;
  defaultV: number;
}

export const AUTO_DETECT_CROP = "Detecção Automática pela IA";

export const CROPS_DATABASE: CropInfo[] = [
  // --- GRÃOS & CEREAIS ---
  { id: 'soja', name: 'Soja', category: 'Grãos & Cereais', defaultV: 65 },
  { id: 'milho', name: 'Milho', category: 'Grãos & Cereais', defaultV: 70 },
  { id: 'trigo', name: 'Trigo', category: 'Grãos & Cereais', defaultV: 65 },
  { id: 'algodao', name: 'Algodão', category: 'Grãos & Cereais', defaultV: 70 },
  { id: 'arroz_irrigado', name: 'Arroz Irrigado', category: 'Grãos & Cereais', defaultV: 60 },
  { id: 'arroz_sequeiro', name: 'Arroz de Sequeiro', category: 'Grãos & Cereais', defaultV: 55 },
  { id: 'sorgo_granifero', name: 'Sorgo Granífero', category: 'Grãos & Cereais', defaultV: 60 },
  { id: 'sorgo_forrageiro', name: 'Sorgo Forrageiro', category: 'Grãos & Cereais', defaultV: 60 },
  { id: 'aveia_branca', name: 'Aveia Branca', category: 'Grãos & Cereais', defaultV: 60 },
  { id: 'aveia_preta', name: 'Aveia Preta', category: 'Grãos & Cereais', defaultV: 55 },
  { id: 'cevada', name: 'Cevada', category: 'Grãos & Cereais', defaultV: 65 },
  { id: 'triticale', name: 'Triticale', category: 'Grãos & Cereais', defaultV: 60 },
  { id: 'centeio', name: 'Centeio', category: 'Grãos & Cereais', defaultV: 55 },
  { id: 'milheto', name: 'Milheto', category: 'Grãos & Cereais', defaultV: 50 },
  { id: 'girassol', name: 'Girassol', category: 'Grãos & Cereais', defaultV: 65 },
  { id: 'gergelim', name: 'Gergelim', category: 'Grãos & Cereais', defaultV: 60 },
  { id: 'canola', name: 'Canola', category: 'Grãos & Cereais', defaultV: 70 },
  { id: 'crambe', name: 'Crambe', category: 'Grãos & Cereais', defaultV: 60 },
  { id: 'trigo_sarraceno', name: 'Trigo Sarraceno', category: 'Grãos & Cereais', defaultV: 55 },
  { id: 'painco', name: 'Painço', category: 'Grãos & Cereais', defaultV: 55 },
  { id: 'chia', name: 'Chia', category: 'Grãos & Cereais', defaultV: 60 },
  { id: 'quinoa', name: 'Quinoa', category: 'Grãos & Cereais', defaultV: 65 },
  { id: 'amaranto', name: 'Amaranto', category: 'Grãos & Cereais', defaultV: 60 },

  // --- LEGUMINOSAS & PULSES ---
  { id: 'feijao_comum', name: 'Feijão Comum (Carioca/Preto)', category: 'Leguminosas & Pulses', defaultV: 65 },
  { id: 'feijao_caupi', name: 'Feijão Caupi (Macáçar/Fradinho)', category: 'Leguminosas & Pulses', defaultV: 60 },
  { id: 'feijao_guandu', name: 'Feijão Guandu', category: 'Leguminosas & Pulses', defaultV: 55 },
  { id: 'amendoim', name: 'Amendoim', category: 'Leguminosas & Pulses', defaultV: 60 },
  { id: 'grao_de_bico', name: 'Grão-de-Bico', category: 'Leguminosas & Pulses', defaultV: 65 },
  { id: 'lentilha', name: 'Lentilha', category: 'Leguminosas & Pulses', defaultV: 65 },
  { id: 'ervilha', name: 'Ervilha', category: 'Leguminosas & Pulses', defaultV: 65 },
  { id: 'tremoco_branco', name: 'Tremoço Branco', category: 'Leguminosas & Pulses', defaultV: 60 },
  { id: 'crotalaria_spectabilis', name: 'Crotalária spectabilis', category: 'Leguminosas & Pulses', defaultV: 50 },
  { id: 'crotalaria_ochroleuca', name: 'Crotalária ochroleuca', category: 'Leguminosas & Pulses', defaultV: 50 },
  { id: 'crotalaria_juncea', name: 'Crotalária juncea', category: 'Leguminosas & Pulses', defaultV: 50 },
  { id: 'mucuna_preta', name: 'Mucuna Preta', category: 'Leguminosas & Pulses', defaultV: 50 },
  { id: 'mucuna_cinzenta', name: 'Mucuna Cinzenta', category: 'Leguminosas & Pulses', defaultV: 50 },
  { id: 'feijao_de_porco', name: 'Feijão de Porco', category: 'Leguminosas & Pulses', defaultV: 50 },
  { id: 'estilosantes', name: 'Estilosantes', category: 'Leguminosas & Pulses', defaultV: 50 },

  // --- FRUTICULTURA ---
  { id: 'cafe_arabica', name: 'Café Arábica', category: 'Fruticultura', defaultV: 70 },
  { id: 'cafe_conilon', name: 'Café Conilon / Robusta', category: 'Fruticultura', defaultV: 60 },
  { id: 'laranja', name: 'Laranja', category: 'Fruticultura', defaultV: 70 },
  { id: 'limao_tahiti', name: 'Limão Tahití', category: 'Fruticultura', defaultV: 70 },
  { id: 'tangerina', name: 'Tangerina / Ponkan / Murcott', category: 'Fruticultura', defaultV: 70 },
  { id: 'manga', name: 'Manga', category: 'Fruticultura', defaultV: 60 },
  { id: 'banana', name: 'Banana', category: 'Fruticultura', defaultV: 70 },
  { id: 'uva_mesa', name: 'Uva de Mesa', category: 'Fruticultura', defaultV: 70 },
  { id: 'uva_vinifera', name: 'Uva Vinífera (Vinhos)', category: 'Fruticultura', defaultV: 65 },
  { id: 'maca', name: 'Maçã', category: 'Fruticultura', defaultV: 70 },
  { id: 'pera', name: 'Pêra', category: 'Fruticultura', defaultV: 65 },
  { id: 'pessego', name: 'Pêssego', category: 'Fruticultura', defaultV: 65 },
  { id: 'ameixa', name: 'Ameixa', category: 'Fruticultura', defaultV: 65 },
  { id: 'nectarina', name: 'Nectarina', category: 'Fruticultura', defaultV: 65 },
  { id: 'figo', name: 'Figo', category: 'Fruticultura', defaultV: 70 },
  { id: 'caqui', name: 'Caqui', category: 'Fruticultura', defaultV: 65 },
  { id: 'goiaba', name: 'Goiaba', category: 'Fruticultura', defaultV: 65 },
  { id: 'maracuja', name: 'Maracujá', category: 'Fruticultura', defaultV: 65 },
  { id: 'mamao', name: 'Mamão', category: 'Fruticultura', defaultV: 70 },
  { id: 'abacaxi', name: 'Abacaxi', category: 'Fruticultura', defaultV: 50 },
  { id: 'avocado_abacate', name: 'Abacate / Avocado', category: 'Fruticultura', defaultV: 65 },
  { id: 'coco', name: 'Coco Baiano / Anão', category: 'Fruticultura', defaultV: 60 },
  { id: 'acai', name: 'Açaí', category: 'Fruticultura', defaultV: 50 },
  { id: 'cacau', name: 'Cacau', category: 'Fruticultura', defaultV: 60 },
  { id: 'guaraná', name: 'Guaraná', category: 'Fruticultura', defaultV: 50 },
  { id: 'cupuacu', name: 'Cupuaçu', category: 'Fruticultura', defaultV: 50 },
  { id: 'graviola', name: 'Graviola / Coração de Boi', category: 'Fruticultura', defaultV: 60 },
  { id: 'atemoia', name: 'Atemóia / Pinha / Fruta do Conde', category: 'Fruticultura', defaultV: 65 },
  { id: 'pitaya', name: 'Pitaya', category: 'Fruticultura', defaultV: 65 },
  { id: 'mirtilo', name: 'Mirtilo (Blueberry)', category: 'Fruticultura', defaultV: 45 },
  { id: 'framboesa', name: 'Framboesa / Amora-preta', category: 'Fruticultura', defaultV: 60 },
  { id: 'kiwi', name: 'Kiwi', category: 'Fruticultura', defaultV: 70 },
  { id: 'romã', name: 'Romã', category: 'Fruticultura', defaultV: 65 },
  { id: 'jabuticaba', name: 'Jabuticaba', category: 'Fruticultura', defaultV: 60 },
  { id: 'carambola', name: 'Carambola', category: 'Fruticultura', defaultV: 60 },
  { id: 'acerola', name: 'Acerola', category: 'Fruticultura', defaultV: 65 },
  { id: 'lichia', name: 'Lichia', category: 'Fruticultura', defaultV: 65 },
  { id: 'noz_pecan', name: 'Noz Pecan', category: 'Fruticultura', defaultV: 65 },
  { id: 'macadâmia', name: 'Macadâmia', category: 'Fruticultura', defaultV: 60 },
  { id: 'castanha_de_caju', name: 'Castanha de Caju', category: 'Fruticultura', defaultV: 50 },

  // --- HORTALIÇAS, TUBÉRCULOS & OLERICULTURA ---
  { id: 'batata_inglesa', name: 'Batata Inglesa', category: 'Hortaliças & Tubérculos', defaultV: 70 },
  { id: 'batata_doce', name: 'Batata Doce', category: 'Hortaliças & Tubérculos', defaultV: 60 },
  { id: 'mandioca_mesa', name: 'Mandioca de Mesa (Aipim/Macaxeira)', category: 'Hortaliças & Tubérculos', defaultV: 50 },
  { id: 'mandioca_industria', name: 'Mandioca Industrial (Fécula)', category: 'Hortaliças & Tubérculos', defaultV: 50 },
  { id: 'cenoura', name: 'Cenoura', category: 'Hortaliças & Tubérculos', defaultV: 75 },
  { id: 'cebola', name: 'Cebola', category: 'Hortaliças & Tubérculos', defaultV: 75 },
  { id: 'alho', name: 'Alho', category: 'Hortaliças & Tubérculos', defaultV: 80 },
  { id: 'tomate_mesa', name: 'Tomate de Mesa', category: 'Hortaliças & Tubérculos', defaultV: 80 },
  { id: 'tomate_industrial', name: 'Tomate Industrial (Rasteiro)', category: 'Hortaliças & Tubérculos', defaultV: 75 },
  { id: 'pimentao', name: 'Pimentão', category: 'Hortaliças & Tubérculos', defaultV: 80 },
  { id: 'pimenta_doce', name: 'Pimentas (Dedo de Moça, Habanero, Jalapeño)', category: 'Hortaliças & Tubérculos', defaultV: 75 },
  { id: 'berinjela', name: 'Berinjela', category: 'Hortaliças & Tubérculos', defaultV: 75 },
  { id: 'jiló', name: 'Jiló', category: 'Hortaliças & Tubérculos', defaultV: 70 },
  { id: 'quiabo', name: 'Quiabo', category: 'Hortaliças & Tubérculos', defaultV: 70 },
  { id: 'abobora_cabotiá', name: 'Abóbora Cabotiá / Tetsukabuto', category: 'Hortaliças & Tubérculos', defaultV: 70 },
  { id: 'abobrinha_italiana', name: 'Abobrinha Italiana', category: 'Hortaliças & Tubérculos', defaultV: 75 },
  { id: 'melancia', name: 'Melancia', category: 'Hortaliças & Tubérculos', defaultV: 70 },
  { id: 'melao', name: 'Melão', category: 'Hortaliças & Tubérculos', defaultV: 75 },
  { id: 'pepino', name: 'Pepino (Conserva / Salada)', category: 'Hortaliças & Tubérculos', defaultV: 80 },
  { id: 'chuchu', name: 'Chuchu', category: 'Hortaliças & Tubérculos', defaultV: 70 },
  { id: 'alface_crespa', name: 'Alface (Crespa, Americana, Lisa)', category: 'Hortaliças & Tubérculos', defaultV: 80 },
  { id: 'rucula', name: 'Rúcula', category: 'Hortaliças & Tubérculos', defaultV: 80 },
  { id: 'agriao', name: 'Agrião', category: 'Hortaliças & Tubérculos', defaultV: 75 },
  { id: 'espinafre', name: 'Espinafre', category: 'Hortaliças & Tubérculos', defaultV: 80 },
  { id: 'couve_manteiga', name: 'Couve Manteiga', category: 'Hortaliças & Tubérculos', defaultV: 80 },
  { id: 'couve_flor', name: 'Couve-Flor', category: 'Hortaliças & Tubérculos', defaultV: 80 },
  { id: 'brocolis', name: 'Brócolis', category: 'Hortaliças & Tubérculos', defaultV: 80 },
  { id: 'repolho', name: 'Repolho (Verde / Roxo)', category: 'Hortaliças & Tubérculos', defaultV: 80 },
  { id: 'beteraba', name: 'Beterraba', category: 'Hortaliças & Tubérculos', defaultV: 75 },
  { id: 'rabinete', name: 'Rabanete', category: 'Hortaliças & Tubérculos', defaultV: 75 },
  { id: 'nabo', name: 'Nabo Forrageiro / Mesa', category: 'Hortaliças & Tubérculos', defaultV: 65 },
  { id: 'mandioquinha_salsa', name: 'Mandioquinha-Salsa (Batata Baroa)', category: 'Hortaliças & Tubérculos', defaultV: 70 },
  { id: 'inhame_cara', name: 'Inhame / Cará', category: 'Hortaliças & Tubérculos', defaultV: 65 },
  { id: 'taro', name: 'Taro', category: 'Hortaliças & Tubérculos', defaultV: 65 },
  { id: 'gengibre', name: 'Gengibre', category: 'Hortaliças & Tubérculos', defaultV: 70 },
  { id: 'urucum', name: 'Urucum', category: 'Hortaliças & Tubérculos', defaultV: 60 },
  { id: 'morango', name: 'Morango', category: 'Hortaliças & Tubérculos', defaultV: 75 },

  // --- CULTURAS INDUSTRIAIS, ENERGÉTICAS & FIBRA ---
  { id: 'cana_de_acucar', name: 'Cana-de-Açúcar', category: 'Industriais & Fibras', defaultV: 60 },
  { id: 'eucalipto', name: 'Eucalipto', category: 'Florestal & Madeira', defaultV: 40 },
  { id: 'pinus', name: 'Pinus', category: 'Florestal & Madeira', defaultV: 40 },
  { id: 'sereringueira', name: 'Seringueira (Borracha Natural)', category: 'Industriais & Fibras', defaultV: 50 },
  { id: 'dendê', name: 'Dendê / Palma de Óleo', category: 'Industriais & Fibras', defaultV: 50 },
  { id: 'mamona', name: 'Mamona', category: 'Industriais & Fibras', defaultV: 60 },
  { id: 'tabaco', name: 'Fumo / Tabaco', category: 'Industriais & Fibras', defaultV: 65 },
  { id: 'sisal', name: 'Sisal', category: 'Industriais & Fibras', defaultV: 55 },
  { id: 'juta', name: 'Juta / Malva', category: 'Industriais & Fibras', defaultV: 55 },
  { id: 'teca', name: 'Teca (Tectona grandis)', category: 'Florestal & Madeira', defaultV: 60 },
  { id: 'mogno_africano', name: 'Mogno Africano', category: 'Florestal & Madeira', defaultV: 60 },
  { id: 'cedro_australiano', name: 'Cedro Australiano', category: 'Florestal & Madeira', defaultV: 60 },
  { id: 'parica', name: 'Paricá', category: 'Florestal & Madeira', defaultV: 50 },
  { id: 'bambu', name: 'Bambu Gigante / Guadua', category: 'Florestal & Madeira', defaultV: 50 },
  { id: 'lúpulo', name: 'Lúpulo (Cervejeiro)', category: 'Industriais & Fibras', defaultV: 70 },
  { id: 'canhamo_industrial', name: 'Cânhamo Industrial', category: 'Industriais & Fibras', defaultV: 65 },

  // --- PASTAGENS, FORRAGENS & ZOOTECNIA ---
  { id: 'brachiaria_brizantha', name: 'Brachiaria brizantha (Marandu/Piatã)', category: 'Pastagens & Forragens', defaultV: 50 },
  { id: 'brachiaria_decumbens', name: 'Brachiaria decumbens (Basilisk)', category: 'Pastagens & Forragens', defaultV: 45 },
  { id: 'brachiaria_humidicola', name: 'Brachiaria humidicola', category: 'Pastagens & Forragens', defaultV: 40 },
  { id: 'brachiaria_ruziziensis', name: 'Brachiaria ruziziensis (Palhada)', category: 'Pastagens & Forragens', defaultV: 50 },
  { id: 'panicum_mombaça', name: 'Panicum maximum (Mombaça)', category: 'Pastagens & Forragens', defaultV: 60 },
  { id: 'panicum_zuri', name: 'Panicum maximum (Zuri)', category: 'Pastagens & Forragens', defaultV: 60 },
  { id: 'panicum_tanzania', name: 'Panicum maximum (Tanzânia)', category: 'Pastagens & Forragens', defaultV: 60 },
  { id: 'capim_vaquero', name: 'Capim Bermuda / Vaquero / Tifton 85', category: 'Pastagens & Forragens', defaultV: 65 },
  { id: 'capim_elefante', name: 'Capim Elefante / BRS Capiaçu / BRS Kurumi', category: 'Pastagens & Forragens', defaultV: 60 },
  { id: 'alfafa', name: 'Alfafa', category: 'Pastagens & Forragens', defaultV: 80 },
  { id: 'palma_forrageira', name: 'Palma Forrageira (Sertão)', category: 'Pastagens & Forragens', defaultV: 60 },

  // --- AROMÁTICAS, MEDICINAIS & CONDIMENTOS ---
  { id: 'pimenta_do_reino', name: 'Pimenta-do-Reino', category: 'Condimentos & Medicinais', defaultV: 60 },
  { id: 'pimenta_rosa', name: 'Pimenta Rosa (Aroeira)', category: 'Condimentos & Medicinais', defaultV: 50 },
  { id: 'noz_moscada', name: 'Noz Moscada', category: 'Condimentos & Medicinais', defaultV: 60 },
  { id: 'cravo_da_india', name: 'Cravo-da-Índia', category: 'Condimentos & Medicinais', defaultV: 60 },
  { id: 'canela', name: 'Canela', category: 'Condimentos & Medicinais', defaultV: 60 },
  { id: 'baunilha', name: 'Baunilha (Orquídea)', category: 'Condimentos & Medicinais', defaultV: 65 },
  { id: 'cardamomo', name: 'Cardamomo', category: 'Condimentos & Medicinais', defaultV: 60 },
  { id: 'açafrão_da_terra', name: 'Açafrão-da-Terra (Cúrcuma)', category: 'Condimentos & Medicinais', defaultV: 65 },
  { id: 'salsa_salsinha', name: 'Salsa / Salsinha', category: 'Condimentos & Medicinais', defaultV: 75 },
  { id: 'cebolinha', name: 'Cebolinha', category: 'Condimentos & Medicinais', defaultV: 75 },
  { id: 'coentro', name: 'Coentro', category: 'Condimentos & Medicinais', defaultV: 75 },
  { id: 'manjericão', name: 'Manjericão', category: 'Condimentos & Medicinais', defaultV: 75 },
  { id: 'alecrim', name: 'Alecrim', category: 'Condimentos & Medicinais', defaultV: 65 },
  { id: 'hortelã_menta', name: 'Hortelã / Menta', category: 'Condimentos & Medicinais', defaultV: 70 },
  { id: 'oregano', name: 'Orégano', category: 'Condimentos & Medicinais', defaultV: 70 },
  { id: 'tomilho', name: 'Tomilho', category: 'Condimentos & Medicinais', defaultV: 70 },
  { id: 'salvia', name: 'Sálvia', category: 'Condimentos & Medicinais', defaultV: 70 },
  { id: 'capim_cidreira', name: 'Capim-Cidreira / Capanema', category: 'Condimentos & Medicinais', defaultV: 60 },
  { id: 'erva_cidreira_melissa', name: 'Erva-Cidreira (Melissa)', category: 'Condimentos & Medicinais', defaultV: 65 },
  { id: 'camomila', name: 'Camomila', category: 'Condimentos & Medicinais', defaultV: 65 },
  { id: 'erva_mate', name: 'Erva-Mate (Chimarrão/Tereré)', category: 'Condimentos & Medicinais', defaultV: 45 },
  { id: 'chá_da_india', name: 'Chá da Índia (Camellia sinensis)', category: 'Condimentos & Medicinais', defaultV: 45 },

  // --- FLORICULTURA & ORNAMENTAIS ---
  { id: 'orquideas', name: 'Orquídeas', category: 'Floricultura & Ornamentais', defaultV: 60 },
  { id: 'rosas', name: 'Rosas de Corte', category: 'Floricultura & Ornamentais', defaultV: 70 },
  { id: 'crisantemo', name: 'Crisântemo', category: 'Floricultura & Ornamentais', defaultV: 70 },
  { id: 'girassol_ornamental', name: 'Girassol Ornamental', category: 'Floricultura & Ornamentais', defaultV: 65 },
  { id: 'anturio', name: 'Antúrio', category: 'Floricultura & Ornamentais', defaultV: 60 },
  { id: 'copo_de_leite', name: 'Copo de Leite', category: 'Floricultura & Ornamentais', defaultV: 65 },
  { id: 'gérbera', name: 'Gérbera', category: 'Floricultura & Ornamentais', defaultV: 70 },
  { id: 'lírio', name: 'Lírio', category: 'Floricultura & Ornamentais', defaultV: 65 },
  { id: 'lisianthus', name: 'Lisianthus', category: 'Floricultura & Ornamentais', defaultV: 70 },
  { id: 'grama_esmeralda', name: 'Grama Esmeralda / Bermudas (Gramados)', category: 'Floricultura & Ornamentais', defaultV: 65 },
];

/** Helper function to find a crop by name or fuzzy string matching */
export function findCropByName(cropName: string): CropInfo | undefined {
  if (!cropName || cropName === AUTO_DETECT_CROP) return undefined;
  const clean = cropName.toLowerCase().trim();
  
  // Exact or contains match
  return CROPS_DATABASE.find(
    (c) => c.name.toLowerCase() === clean || c.name.toLowerCase().includes(clean) || clean.includes(c.name.toLowerCase())
  );
}

/** Group crops by category for organized dropdown menus */
export function getCropsByCategory(): Record<string, CropInfo[]> {
  const groups: Record<string, CropInfo[]> = {};
  for (const crop of CROPS_DATABASE) {
    if (!groups[crop.category]) {
      groups[crop.category] = [];
    }
    groups[crop.category].push(crop);
  }
  return groups;
}
