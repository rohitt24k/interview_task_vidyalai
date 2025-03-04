const axios = require('axios').default;

async function fetchAllUsers() {
  const { data: users } = await axios.get(
    'https://jsonplaceholder.typicode.com/users',
  );

  return users;
}
// Route to fetch user are https://jsonplaceholder.typicode.com/users/:userId
async function fetchUserById(userId) {
  const { data: user } = await axios.get(
    `https://jsonplaceholder.typicode.com/users/${(userId % 10) + 1}`,
  );
  if (user) {
    const [firstName, lastName] = user.name.split(' ');
    return {
      ...user,
      shortName: `${firstName} ${lastName ? lastName + '.' : ''}`,
    };
  }
  return null;
}

module.exports = { fetchAllUsers, fetchUserById };
