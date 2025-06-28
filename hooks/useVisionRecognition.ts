import { useState } from 'react';
import { visionService } from '../services/vision';

export function useVisionRecognition() {
  const [result, setResult] = useState<{ label: string; confidence: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recognize = async (imageData: any) => {
    setLoading(true);
    setError(null);
    try {
      const res = await visionService.recognizeObject(imageData);
      setResult(res);
    } catch (e) {
      setError('Recognition failed');
    } finally {
      setLoading(false);
    }
  };

  return { result, loading, error, recognize };
}
