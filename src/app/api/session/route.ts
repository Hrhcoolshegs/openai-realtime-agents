import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is not set in environment variables");
      return NextResponse.json(
        { error: "OpenAI API key is not configured. Please set OPENAI_API_KEY in your .env file and restart the server." },
        { status: 500 }
      );
    }

    // Check if API key is just the placeholder
    if (process.env.OPENAI_API_KEY === 'your_openai_api_key_here' || process.env.OPENAI_API_KEY === 'your_api_key') {
      console.error("OPENAI_API_KEY is set to placeholder value");
      return NextResponse.json(
        { error: "Please replace the placeholder API key in your .env file with your actual OpenAI API key and restart the server." },
        { status: 500 }
      );
    }

    // Validate API key format (should start with sk-)
    if (!process.env.OPENAI_API_KEY.startsWith('sk-')) {
      console.error("OPENAI_API_KEY appears to be invalid format");
      return NextResponse.json(
        { error: "Invalid OpenAI API key format. API keys should start with 'sk-'. Please check your .env file." },
        { status: 500 }
      );
    }

    const response = await fetch(
      "https://api.openai.com/v1/realtime/sessions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-realtime-preview-2025-06-03",
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenAI API error: ${response.status} ${response.statusText}`, errorText);
      
      // Provide specific error messages for common issues
      if (response.status === 401) {
        return NextResponse.json(
          { error: "Invalid OpenAI API key. Please check your API key in the .env file." },
          { status: 401 }
        );
      }
      
      if (response.status === 403) {
        return NextResponse.json(
          { error: "Access denied. Your API key may not have access to the Realtime API." },
          { status: 403 }
        );
      }
      
      return NextResponse.json(
        { error: `OpenAI API error: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in /session:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    // Handle specific network errors
    if (errorMessage.includes('fetch failed') || errorMessage.includes('SocketError')) {
      return NextResponse.json(
        { error: "Failed to connect to OpenAI API. Please check your API key and network connection." },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: `Failed to connect to OpenAI API: ${errorMessage}` },
      { status: 500 }
    );
  }
}