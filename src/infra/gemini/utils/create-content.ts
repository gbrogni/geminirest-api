import { Content, Part } from '@google/generative-ai';

export function createContent(text: string, base64Image: string): Content[] {
  const imagePart: Part = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64Image,
    },
  };

  return [
    {
      role: 'user',
      parts: [
        imagePart,
        {
          text,
        },
      ],
    },
  ];
}