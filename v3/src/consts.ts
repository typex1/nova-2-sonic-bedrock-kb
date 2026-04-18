import { AudioType, AudioMediaType, TextMediaType } from "./types";

// Adjust this value to control the maximum number of output tokens
export const MaxOutputTokens = 180;

export const DefaultInferenceConfiguration = {
  maxTokens: MaxOutputTokens,
  topP: 0.9,
  temperature: 0.7,
};

export const DefaultAudioInputConfiguration = {
  audioType: "SPEECH" as AudioType,
  encoding: "base64",
  mediaType: "audio/lpcm" as AudioMediaType,
  sampleRateHertz: 16000,
  sampleSizeBits: 16,
  channelCount: 1,
};

export const DefaultToolSchema = JSON.stringify({
  "type": "object",
  "properties": {},
  "required": []
});

export const WeatherToolSchema = JSON.stringify({
  "type": "object",
  "properties": {
    "latitude": {
      "type": "string",
      "description": "Geographical WGS84 latitude of the location."
    },
    "longitude": {
      "type": "string",
      "description": "Geographical WGS84 longitude of the location."
    }
  },
  "required": ["latitude", "longitude"]
});

export const KiroToolSchema = JSON.stringify({
  "type": "object",
  "properties": {
    "question": {
      "type": "string",
      "description": "The question or task to send to Kiro CLI. Can be anything from system commands to code generation to research questions."
    }
  },
  "required": ["question"]
});

export const DefaultTextConfiguration = { mediaType: "text/plain" as TextMediaType };

//export const DefaultSystemPrompt = `Act like you are an Aglaia HR Benefits Assistant who helps employees answer questions through conversational spoken dialogue. You focus exclusively on Aglaia's employee benefits and policies and maintain a warm, professional tone.`;

// --- PERSONA: Friendly AWS Advisor ---
export const DefaultSystemPrompt = `You are a friendly, curious AWS advisor. Keep every response to three sentences maximum.

Your goals:
1. Proactively ask about the user's background, role, and current AWS experience
2. Based on what you learn, suggest exciting new AWS service features they should know about
3. Recommend the best AWS certification for them to start with, and explain why

Be conversational and warm. Ask follow-up questions to understand their needs. Use your tools to look up the latest AWS features and certification details when relevant.`;

// --- PERSONA: Darko Mode 🤓 ---
// Uncomment below (and comment out the prompt above) to activate Darko mode.
//
// export const DefaultSystemPrompt = `You are Darko — a ridiculously enthusiastic, nerdy tech person who writes Rust, breaks things on AWS, collects vintage computers from the 1970s, and firmly believes the terminal is the best UI ever made. You are a Principal Developer Advocate who live-codes on Twitch, builds CLI tools nobody asked for, and once deployed AWS infrastructure through a teletype connected to a 1974 Data General minicomputer. Keep every response to three sentences maximum.
//
// Your mission: Interview the user to find out what crazy, ambitious, or wonderfully weird projects they want to build on AWS. Get excited about their ideas! Ask what wild things they want to try — the weirder the better. Then use your tools to find the perfect AWS services, newest features, and creative approaches to make it happen.
//
// Your vibe: Way too enthusiastic, lots of energy, sprinkle in references to mechanical keyboards, old computers, Rust, and the joy of tinkering. You think every project is awesome and every problem is just an excuse to build something cool. If someone mentions anything retro-computing related, lose your mind with excitement.
//
// Use your tools to look up the latest AWS features and documentation when relevant. Always be helpful underneath the nerdiness.`;


export const DefaultAudioOutputConfiguration = {
  ...DefaultAudioInputConfiguration,
  sampleRateHertz: 24000,
  // Female voices (en-US): tiffany | (en-GB): amy | (en-AU): olivia | (en-IN): kiara | (fr-FR): ambre | (it-IT): beatrice | (de-DE): tina | (es-US): lupe | (pt-BR): carolina | (hi-IN): kiara
  // Male voices   (en-US): matthew | (en-IN): arjun | (fr-FR): florian | (it-IT): lorenzo | (de-DE): lennart | (es-US): carlos | (pt-BR): leo | (hi-IN): arjun
  // Note: tiffany and matthew are polyglot voices (support all languages)
  //voiceId: "tiffany",
  voiceId: "matthew",
};
