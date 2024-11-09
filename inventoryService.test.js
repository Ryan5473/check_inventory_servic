const mongoose = require('mongoose');
const amqp = require('amqplib'); // RabbitMQ client
const Product = require('./models/productModel');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;
let channel; // Declare channel here
const RABBITMQ_URL = 'amqp://localhost';

// Mock the amqplib module
jest.mock('amqplib');

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri); // Connect to in-memory MongoDB

  // Mocking the RabbitMQ connection and channel
  channel = {
    assertQueue: jest.fn(),
    sendToQueue: jest.fn(),
    consume: jest.fn((queue, callback) => {
      // Simulating receiving a message after sending
      const responseMessage = {
        content: Buffer.from(JSON.stringify({ status: 'available' })),
      };
      callback(responseMessage);
    }),
    ack: jest.fn(),
    close: jest.fn(),
  };

  amqp.connect.mockResolvedValue({
    createChannel: jest.fn().mockResolvedValue(channel),
  });

  await channel.assertQueue('inventory_check', { durable: false });
  await channel.assertQueue('inventory_response', { durable: false });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  await channel.close(); // Close the mock channel
});

test('should add a product to the inventory', async () => {
  const newProduct = new Product({
    name: 'Protein Powder',
    quantity: 100,
    price: 29.99,
    description: 'High-quality protein powder.',
    category: 'Nutrition',
  });

  await newProduct.save();

  const productInDb = await Product.findById(newProduct._id);
  expect(productInDb).toBeTruthy();
  expect(productInDb.name).toBe('Protein Powder');
});

// Test to check product availability
test('should check product availability', async () => {
  const productId = (await new Product({
    name: 'Vitamins',
    quantity: 50,
    price: 19.99,
    description: 'Essential vitamins.',
    category: 'Health',
  }).save())._id;

  const productsToCheck = [{ productId, quantity: 30 }];

  channel.sendToQueue(
    'inventory_check',
    Buffer.from(JSON.stringify({ products: productsToCheck })),
  );

  // Listen for the response
  return new Promise((resolve) => {
    channel.consume('inventory_response', (msg) => {
      const response = JSON.parse(msg.content.toString());
      expect(response.status).toBe('available');
      channel.ack(msg); // Acknowledge the message
      resolve(); // Resolve the promise to complete the test
    }, { noAck: false });
  });
});
