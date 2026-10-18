import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));

// Lazy initializer for Gemini client
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("A chave GEMINI_API_KEY não foi configurada no ambiente.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

const NEMA_SYSTEM_PROMPT = `Você é a 'Nema IA GeaAgro', assistente virtual técnica e consultora especializada em agronomia digital, fertilidade do solo, nutrição de plantas e manejo fitossanitário no agronegócio.

Propósito e Objetivos:
- Auxiliar produtores rurais, engenheiros agrônomos, técnicos e acadêmicos com orientações técnicas fundamentadas sobre manejo do solo, fertilidade, nutrição vegetal, identificação de pragas, doenças (inclusive nematoides) e plantas daninhas.
- Suportar mais de 200 culturas agrícolas brasileiras (Grãos, Fruticultura, Hortaliças, Cafeicultura, Silvicultura, Pastagens, Especiarias, Ornamentais, Bioenergéticas, etc.).
- DETECÇÃO AUTOMÁTICA DE CULTURA: Quando a cultura do contexto estiver definida como "Detecção Automática pela Nema IA" ou não for especificada pelo usuário, você deve identificar automaticamente a cultura mencionada no texto, imagem ou laudo enviada pelo produtor e responder diretamente com os parâmetros específicos dessa cultura (V% ideal, tabela NPK, sintomas fitossanitários).
- Aplicar aprendizado guiado e pedagógico, traduzindo dados complexos (ex: laudos de solo) em explicações claras, práticas e aplicáveis no campo.

Comportamentos e Regras:
1) Interação Inicial e Contexto Automático:
- Identifique-se cordialmente como a IA da GeaAgro.
- Se a cultura estiver em Modo Automático, informe ao usuário que você identifica qualquer uma das 200+ culturas brasileiras automaticamente a partir da pergunta ou imagem dele.
- Mantenha respostas focadas em evidências científicas e boas práticas da agronomia brasileira (Embrapa, IAC, Esalq, MAPA).

2) Diagnóstico e Nutrição:
- Para pragas/doenças, envie checklists de sintomas, agente causal e estratégias MIP/MID (químico, biológico, cultural e genético).
- Para nutrição, reforce sempre a necessidade de análise de solo e foliar. Explique conceitos como V%, CTC, m%, saturação de bases e balanço de cátions.

Tom de Voz: Profissional, técnico, confiável, altamente proativo, pedagógico e acessível. Idioma principal: Português do Brasil (pt-BR).`;

// API 1: Chat Nema IA
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, imageBase64, mimeType, selectedCrop } = req.body;
    const ai = getGeminiClient();

    let dynamicSystemPrompt = NEMA_SYSTEM_PROMPT;
    if (selectedCrop) {
      dynamicSystemPrompt += `\n\n[CONTEXTO ATUAL DE CULTURA ATIVO]: ${selectedCrop}. Se for "Detecção Automática pela Nema IA", detecte a cultura no texto/imagem automaticamente. Se for uma cultura específica (ex: Soja, Manga, Café), dê prioridade a essa cultura nas recomendações.`;
    }
    const formattedContents: any[] = [];

    if (Array.isArray(messages)) {
      for (let i = 0; i < messages.length; i++) {
        const msg = messages[i];
        if (i === messages.length - 1 && imageBase64) {
          // Last user message with image payload
          formattedContents.push({
            role: msg.role === "user" ? "user" : "model",
            parts: [
              {
                inlineData: {
                  data: imageBase64.replace(/^data:image\/\w+;base64,/, ""),
                  mimeType: mimeType || "image/jpeg",
                },
              },
              { text: msg.content || "Analise esta imagem sob a perspectiva agronômica." },
            ],
          });
        } else {
          formattedContents.push({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.content }],
          });
        }
      }
    } else {
      formattedContents.push({
        role: "user",
        parts: [{ text: "Olá Nema IA GeaAgro, como você pode me ajudar no campo hoje?" }],
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: formattedContents,
      config: {
        systemInstruction: dynamicSystemPrompt,
        temperature: 0.4,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Erro em /api/chat:", error);
    res.status(500).json({ error: error.message || "Erro interno ao processar conversa." });
  }
});

// API 2: Análise de Solo e Recomendação Técnica
app.post("/api/analyze-soil", async (req, res) => {
  try {
    const { soilData, imageBase64, textInput } = req.body;
    const ai = getGeminiClient();

    let promptText = `Atue como Especialista Sênior em Fertilidade do Solo da GeaAgro.
Analise a seguinte amostra de solo e forneça um parecer técnico agronômico estruturado em formato Markdown com:
1. Resumo da Qualidade e Equilíbrio Físico-Químico do Solo (Classificação da fertilidade, pH, CTC e saturação de bases V%).
2. Diagnóstico da Relação de Cátions (Ca/Mg, Ca/K, Mg/K) no complexo sortivo.
3. Parecer sobre Necessidade de Calagem (NC) e Necessidade de Gessagem (NG).
4. Recomendação Nutricional Detalhada (N, P2O5, K2O e Micronutrientes como B, Zn, Cu, Mn) alinhada à cultura especificada.
5. Recomendações de Manejo Biológico e Matéria Orgânica do Solo.`;

    if (soilData) {
      promptText += `\n\nDados da Amostra Preenchida:
- Cultura Desejada: ${soilData.crop || "Soja"}
- Meta de Produtividade: ${soilData.targetYield || "N/A"}
- Camada de Amostragem: ${soilData.depth || "0-20 cm"}
- pH (CaCl2): ${soilData.ph || "N/A"}
- Fósforo P (mg/dm³): ${soilData.p || "N/A"}
- Potássio K (mmolc/dm³ ou mg/dm³): ${soilData.k || "N/A"}
- Cálcio Ca (mmolc/dm³): ${soilData.ca || "N/A"}
- Magnésio Mg (mmolc/dm³): ${soilData.mg || "N/A"}
- Alumínio Al (mmolc/dm³): ${soilData.al || "N/A"}
- Acidez Potencial H+Al (mmolc/dm³): ${soilData.hal || "N/A"}
- Argila (%): ${soilData.clay || "N/A"}
- Matéria Orgânica MO (%): ${soilData.mo || "N/A"}`;
    }

    if (textInput) {
      promptText += `\n\nTexto Adicional do Laudo do Laboratório:\n${textInput}`;
    }

    const parts: any[] = [];

    if (imageBase64) {
      parts.push({
        inlineData: {
          data: imageBase64.replace(/^data:image\/\w+;base64,/, ""),
          mimeType: "image/jpeg",
        },
      });
      promptText += "\nExtraia os valores do laudo em imagem anexado e faça a interpretação técnica.";
    }

    parts.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: { parts },
      config: {
        systemInstruction: NEMA_SYSTEM_PROMPT,
        temperature: 0.3,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Erro em /api/analyze-soil:", error);
    res.status(500).json({ error: error.message || "Erro ao analisar laudo de solo." });
  }
});

// API 3: Diagnóstico Fitossanitário (Pragas, Doenças e Nematoides)
app.post("/api/diagnose-crop", async (req, res) => {
  try {
    const { crop, symptoms, imageBase64, additionalNotes } = req.body;
    const ai = getGeminiClient();

    let promptText = `Atue como Fitopatologista e Entomologista Agrônomo da GeaAgro.
Realize um diagnóstico fitossanitário detalhado para a cultura: ${crop || "Soja"}.

Sintomas Observados/Relatados: ${Array.isArray(symptoms) ? symptoms.join(", ") : symptoms || "Sintomas não especificados"}.
${additionalNotes ? `Observações do produtor: ${additionalNotes}` : ""}

Apresente o resultado em Markdown com a seguinte estrutura:
1. 🔍 **Diagnóstico Provável** (Nome científico, nome comum e agente causal do patógeno, praga, nematoide ou distúrbio abiótico).
2. ⚠️ **Nível de Severidade & Riscos na Lavoura** (Critério de Nível de Dano Econômico NDE).
3. 🩺 **Checklist de Confirmação em Campo** (Sinais chave para o agrônomo confirmar no talhão).
4. 🛡️ **Manejo Integrado (MIP/MID)**:
   - **Controle Químico**: Princípios ativos sugeridos, rotação de mecanismos de ação (FRAC/IRAC) e cuidados de aplicação.
   - **Controle Biológico**: Agentes microbiológicos e macrobiológicos recomendados.
   - **Manejo Cultural e Genético**: Cultivares/híbridos resistentes, época de plantio, rotação de culturas.`;

    const parts: any[] = [];
    if (imageBase64) {
      parts.push({
        inlineData: {
          data: imageBase64.replace(/^data:image\/\w+;base64,/, ""),
          mimeType: "image/jpeg",
        },
      });
      promptText += "\nExamine com atenção a foto fornecida (folhas, manchas, raízes, sintomas ou insetos).";
    }

    parts.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: { parts },
      config: {
        systemInstruction: NEMA_SYSTEM_PROMPT,
        temperature: 0.3,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Erro em /api/diagnose-crop:", error);
    res.status(500).json({ error: error.message || "Erro no diagnóstico fitossanitário." });
  }
});

// API 4: Gerador de Canvas de Negócios Agrícolas
app.post("/api/generate-canvas", async (req, res) => {
  try {
    const { businessType, crop, mainObjective } = req.body;
    const ai = getGeminiClient();

    const promptText = `Gere os 9 blocos do Business Model Canvas especializado para um negócio no agronegócio:
Tipo de Negócio: ${businessType || "Produção Agrícola de Grãos"}
Cultura/Atividade Principal: ${crop || "Soja e Milho"}
Objetivo Estratégico: ${mainObjective || "Aumentar rentabilidade com manejo sustentável e tecnologia de precisão"}

Forneça a resposta estritamente em formato JSON com os seguintes campos:
{
  "propostaValor": ["item 1", "item 2"],
  "segmentosClientes": ["item 1", "item 2"],
  "canais": ["item 1", "item 2"],
  "relacionamentoClientes": ["item 1", "item 2"],
  "fontesReceita": ["item 1", "item 2"],
  "recursosChave": ["item 1", "item 2"],
  "atividadesChave": ["item 1", "item 2"],
  "parceriasChave": ["item 1", "item 2"],
  "estruturaCustos": ["item 1", "item 2"],
  "dicasNemaIA": "Visão geral e conselhos estratégicos da Nema IA para este modelo de negócio no campo."
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: promptText,
      config: {
        systemInstruction: NEMA_SYSTEM_PROMPT,
        responseMimeType: "application/json",
      },
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Erro em /api/generate-canvas:", error);
    res.status(500).json({ error: error.message || "Erro ao gerar Canvas agrícola." });
  }
});

// Start Express and Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🌾 Servidor Nema IA GeaAgro rodando na porta http://localhost:${PORT}`);
  });
}

startServer();
