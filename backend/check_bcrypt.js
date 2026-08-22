const bcrypt = require('bcryptjs');

const run = async () => {
  const plainText = 'password123';
  const dbHash = '$2b$10$vM6QfO2c5E5nQOspzBfNbeL2eD1hRkL6n0VrnM7fF3e7N1JEuF93G';

  console.log('Testing bcrypt library behavior...');
  const isMatchDefault = await bcrypt.compare(plainText, dbHash);
  console.log('Bcrypt comparison with seeded hash:', isMatchDefault);

  // Generate a fresh hash
  const salt = await bcrypt.genSalt(10);
  const newHash = await bcrypt.hash(plainText, salt);
  console.log('Freshly generated hash:', newHash);

  const isMatchNew = await bcrypt.compare(plainText, newHash);
  console.log('Bcrypt comparison with fresh hash:', isMatchNew);
};

run();
