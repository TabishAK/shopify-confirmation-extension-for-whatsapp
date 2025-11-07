import { readCreationOrder } from '@services/storage';
import { createLogger } from '@utils/logger';

const logger = createLogger('background');

chrome.runtime.onInstalled.addListener(async () => {
  logger.info('Extension installed, verifying stored data');

  try {
    const existingRecord = await readCreationOrder();

    if (existingRecord) {
      logger.info('Existing creation order detected', existingRecord);
    } else {
      logger.info('No creation order data initialised yet');
    }
  } catch (error) {
    logger.error('Failed to read creation order during install', error);
  }
});

