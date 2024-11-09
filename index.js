/*const mongoose = require('mongoose');
const amqp = require('amqplib/callback_api'); // RabbitMQ client
require('dotenv').config();
const Product = require('./models/productModel');

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Inventory service connected to MongoDB');
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// RabbitMQ connection
amqp.connect(process.env.RABBITMQ_URL, (error0, connection) => {
  if (error0) {
    console.error('RabbitMQ connection error:', error0);
    process.exit(1);
  }

  connection.createChannel((error1, channel) => {
    if (error1) {
      console.error('Channel creation error:', error1);
      process.exit(1);
    }

    // Listen for messages from Order Service
    const inventoryCheckQueue = 'inventory_check';
    const inventoryResponseQueue = 'inventory_response';

    channel.assertQueue(inventoryCheckQueue, { durable: false });
    channel.assertQueue(inventoryResponseQueue, { durable: false });

    channel.consume(inventoryCheckQueue, async (msg) => {
      try {
        const { products } = JSON.parse(msg.content.toString());

        if (!Array.isArray(products)) {
          console.error('Received message is not an array:', products);
          channel.ack(msg);
          return;
        }

        let allAvailable = true;

        // Check each product's stock availability
        for (const product of products) {
          const foundProduct = await Product.findOne({ name: product.name });
          if (!foundProduct || foundProduct.quantity < product.quantity) {
            allAvailable = false;
            break;
          }
        }

        // Send response back to Order Service
        channel.sendToQueue(
          inventoryResponseQueue,
          Buffer.from(JSON.stringify({ status: allAvailable ? 'available' : 'out_of_stock' })),
          { persistent: false }
        );

        // Acknowledge the message
        channel.ack(msg);
      } catch (error) {
        console.error('Error processing message:', error);
        channel.ack(msg); // Acknowledge even if there's an error to prevent re-delivery
      }
    });

    console.log(`Inventory service is listening for messages on queue: ${inventoryCheckQueue}`);
  });
});
*/
/*
const mongoose = require('mongoose');
const amqp = require('amqplib/callback_api'); // RabbitMQ client
require('dotenv').config();
const Product = require('./models/productModel');

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Inventory service connected to MongoDB');
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// RabbitMQ connection
amqp.connect(process.env.RABBITMQ_URL, (error0, connection) => {
  if (error0) {
    console.error('RabbitMQ connection error:', error0);
    process.exit(1);
  }

  connection.createChannel((error1, channel) => {
    if (error1) {
      console.error('Channel creation error:', error1);
      process.exit(1);
    }

    // Listen for messages from Order Service
    const inventoryCheckQueue = 'inventory_check';
    const inventoryResponseQueue = 'inventory_response';

    channel.assertQueue(inventoryCheckQueue, { durable: false });
    channel.assertQueue(inventoryResponseQueue, { durable: false });

    channel.consume(inventoryCheckQueue, async (msg) => {
      try {
        const { products } = JSON.parse(msg.content.toString());

        if (!Array.isArray(products)) {
          console.error('Received message is not an array:', products);
          channel.ack(msg);
          return;
        }

        let allAvailable = true;

        // Check each product's stock availability
        for (const product of products) {
          const foundProduct = await Product.findOne({ name: product.name });

          // If the product does not exist or if there is insufficient quantity
          if (!foundProduct || foundProduct.quantity < product.quantity) {
            allAvailable = false;
            break;
          }
        }

        // Send response back to Order Service
        channel.sendToQueue(
          inventoryResponseQueue,
          Buffer.from(JSON.stringify({ status: allAvailable ? 'available' : 'out_of_stock' })),
          { persistent: false }
        );

        // Acknowledge the message
        channel.ack(msg);
      } catch (error) {
        console.error('Error processing message:', error);
        channel.ack(msg); // Acknowledge even if there's an error to prevent re-delivery
      }
    });

    console.log(`Inventory service is listening for messages on queue: ${inventoryCheckQueue}`);
  });
});
*/
/*
const mongoose = require('mongoose');
const amqp = require('amqplib/callback_api'); // RabbitMQ client
require('dotenv').config();
const Product = require('./models/productModel'); // Product model

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Inventory service connected to MongoDB');
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Connect to RabbitMQ
amqp.connect(process.env.RABBITMQ_URL, (error0, connection) => {
  if (error0) {
    console.error('RabbitMQ connection error:', error0);
    process.exit(1);
  }

  connection.createChannel((error1, channel) => {
    if (error1) {
      console.error('Channel creation error:', error1);
      process.exit(1);
    }

    // Define the queues
    const inventoryCheckQueue = 'inventory_check';
    const inventoryResponseQueue = 'inventory_response';

    channel.assertQueue(inventoryCheckQueue, { durable: false });
    channel.assertQueue(inventoryResponseQueue, { durable: false });

    channel.consume(inventoryCheckQueue, async (msg) => {
      try {
        const { products } = JSON.parse(msg.content.toString());

        // Check if the received products is an array
        if (!Array.isArray(products)) {
          console.error('Received message is not an array:', products);
          channel.ack(msg);
          return;
        }

        // Check product availability
        const availabilityPromises = products.map(async (product) => {
          const foundProduct = await Product.findOne({ _id: product.productId });
          return foundProduct && foundProduct.quantity >= product.quantity;
        });

        const availabilityResults = await Promise.all(availabilityPromises);
        const allAvailable = availabilityResults.every(available => available);

        // Send the availability response back to the Order Service
        channel.sendToQueue(
          inventoryResponseQueue,
          Buffer.from(JSON.stringify({ status: allAvailable ? 'available' : 'out_of_stock' })),
          { persistent: false }
        );

        // Acknowledge the message
        channel.ack(msg);
      } catch (error) {
        console.error('Error processing message:', error);
        channel.ack(msg); // Acknowledge even on error to prevent redelivery
      }
    });

    console.log(`Inventory service listening for messages on queue: ${inventoryCheckQueue}`);
  });
});
*/const mongoose = require('mongoose');
const amqp = require('amqplib/callback_api'); // RabbitMQ client
require('dotenv').config();
const Product = require('./models/productModel'); // Ensure this path is correct

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Inventory service connected to MongoDB');
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Connect to RabbitMQ
amqp.connect(process.env.RABBITMQ_URL, (error0, connection) => {
  if (error0) {
    console.error('RabbitMQ connection error:', error0);
    process.exit(1);
  }

  connection.createChannel((error1, channel) => {
    if (error1) {
      console.error('Channel creation error:', error1);
      process.exit(1);
    }

    // Define the queues
    const inventoryCheckQueue = 'inventory_check';
    const inventoryResponseQueue = 'inventory_response';

    channel.assertQueue(inventoryCheckQueue, { durable: false });
    channel.assertQueue(inventoryResponseQueue, { durable: false });

    channel.consume(inventoryCheckQueue, async (msg) => {
      try {
        const { products } = JSON.parse(msg.content.toString());

        // Log the list of products received
        console.log('Products received:', products);

        // Check product availability
        const availabilityPromises = products.map(async (product) => {
          console.log(`Checking availability for product: ${product.productId}`);
          const foundProduct = await Product.findById(product.productId);
          
          // Log the found product
          if (foundProduct) {
            console.log(`Found product: ${foundProduct.name}, Quantity in stock: ${foundProduct.quantity}`);
          } else {
            console.error(`Product not found: ${product.productId}`);
            return false; // Product not found
          }

          return foundProduct.quantity >= product.quantity; // Check quantity
        });

        const availabilityResults = await Promise.all(availabilityPromises);
        const allAvailable = availabilityResults.every(available => available);

        // Send the availability response back to the Order Service
        channel.sendToQueue(
          inventoryResponseQueue,
          Buffer.from(JSON.stringify({ status: allAvailable ? 'available' : 'out_of_stock' })),
          { persistent: false }
        );

        // Log the final status
        console.log(`All products available: ${allAvailable}`);

        // Acknowledge the message after processing
        channel.ack(msg);
      } catch (error) {
        console.error('Error processing message:', error);
        channel.ack(msg); // Acknowledge to prevent redelivery on error
      }
    });

    console.log(`Inventory service listening for messages on queue: ${inventoryCheckQueue}`);
  });
});

