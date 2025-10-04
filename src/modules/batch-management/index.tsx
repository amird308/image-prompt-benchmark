'use client';

import { useEffect, useState, useCallback } from 'react';
import { BatchList } from './components/batch-list';
import { BatchDetails } from './components/batch-details';
import { Batch } from '@/shared/types/batch.types';

export function BatchManagement() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBatches = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/batches');
      const data = await response.json();
      setBatches(data);
    } catch (error) {
      console.error('Failed to fetch batches:', error);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchBatches();
  }, [fetchBatches]);

  const handleBack = () => {
    setSelectedBatch(null);
  };


  const handleSelectBatch = async (batchId: string | null) => {
    try {
      const response = await fetch(`/api/batches/${batchId}`);
      const data = await response.json();
      console.log('Selected batch:', data);
      setSelectedBatch(data);
    } catch (error) {
      console.error('Failed to fetch batch details:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (selectedBatch) {
    return <BatchDetails onSelectBatch={handleBack} batch={selectedBatch} />;
  }

  return <BatchList batches={batches} onSelectBatch={handleSelectBatch} refreshBatches={fetchBatches} />;
}
