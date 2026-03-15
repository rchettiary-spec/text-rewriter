import { NextRequest, NextResponse } from 'next/server';

type RewriteStyle = 'formal' | 'casual' | 'concise' | 'expanded';

const stylePrompts: Record<RewriteStyle, string> = {
  formal: 'Rewrite the following text in a formal, professional tone. Make it polished and appropriate for business communication. Keep the core meaning but elevate the language.',
  casual: 'Rewrite the following text in a casual, friendly, and conversational tone. Make it approachable and easy to read, as if talking to a friend.',
  concise: 'Rewrite the following text to be as concise and brief as possible while preserving the essential meaning. Remove any unnecessary words or redundancy.',
  expanded: 'Rewrite the following text to be more detailed and comprehensive. Add relevant context, explanations, and examples to make it more thorough and informative.',
};

export async function POST(req: NextRequest) {
  try {
    const { text, style } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    if (!style || !stylePrompts[style as RewriteStyle]) {
      return NextResponse.json(
        { error: 'Invalid style' },
        { status: 400 }
      );
    }

    const prompt = `${stylePrompts[style as RewriteStyle]}

Text to rewrite:
"""
${text}
"""

Provide only the rewritten text without any additional commentary or explanation.`;

    const apiUrl = `${process.env.ANTHROPIC_BASE_URL}/v1/messages`;
    const apiToken = process.env.ANTHROPIC_API_KEY;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiToken}`,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5',
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('API Error:', response.status, errorData);
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const rewrittenText = data.content?.[0]?.type === 'text'
      ? data.content[0].text
      : '';

    return NextResponse.json({ rewrittenText });
  } catch (error) {
    console.error('Error rewriting text:', error);
    return NextResponse.json(
      { error: 'Failed to rewrite text' },
      { status: 500 }
    );
  }
}
