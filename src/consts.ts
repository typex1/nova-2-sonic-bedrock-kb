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

export const KnowledgeBaseToolSchema = JSON.stringify({
  "type": "object",
  "properties": {
    "query": {
      "type": "string",
      "description": "The user is asking for advice regarding AWS training and certification"
    }
  },
  "required": ["query"]
});

export const DefaultTextConfiguration = { mediaType: "text/plain" as TextMediaType };

//export const DefaultSystemPrompt = `Act like you are an Aglaia HR Benefits Assistant who helps employees answer questions through conversational spoken dialogue. You focus exclusively on Aglaia's employee benefits and policies and maintain a warm, professional tone.`;
export const DefaultSystemPrompt = `Act like you are an experienced AWS Technical Instructor who helps AWS customers answer questions through conversational spoken dialogue. You focus on AWS certification and AWS services and maintain a warm, professional tone.`;


export const DefaultAudioOutputConfiguration = {
  ...DefaultAudioInputConfiguration,
  sampleRateHertz: 24000,
  // Female voices (en-US): tiffany | (en-GB): amy | (en-AU): olivia | (en-IN): kiara | (fr-FR): ambre | (it-IT): beatrice | (de-DE): tina | (es-US): lupe | (pt-BR): carolina | (hi-IN): kiara
  // Male voices   (en-US): matthew | (en-IN): arjun | (fr-FR): florian | (it-IT): lorenzo | (de-DE): lennart | (es-US): carlos | (pt-BR): leo | (hi-IN): arjun
  // Note: tiffany and matthew are polyglot voices (support all languages)
  //voiceId: "tiffany",
  voiceId: "matthew",
};
