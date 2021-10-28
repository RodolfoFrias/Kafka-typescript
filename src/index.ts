import './pre-start'; // Must be the first import
import app from '@server';
import logger from '@shared/Logger';
import producer from '@kafka/producer';
import consumer from '@kafka/consumer';

// Start the server
const port = Number(process.env.PORT || 3000);
app.listen(port, async () => {
    await producer.run()
    await consumer.init()
    logger.info('Express server started on port: ' + port);
});
