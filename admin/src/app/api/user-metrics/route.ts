import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const metrics = await request.json();
    
    // Log user metrics (in production, save to database)
    console.log('User metrics received:', metrics);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving user metrics:', error);
    return NextResponse.json(
      { error: 'Failed to save user metrics' },
      { status: 500 }
    );
  }
}
