import './pre-start'; // Must be the first import
import app from '@server';
import logger from '@shared/Logger';
import producer from '@kafka/producer';

// Start the server
const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
    producer.run()
    logger.info('Express server started on port: ' + port);
});
