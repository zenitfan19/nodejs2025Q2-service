import { authRoutes } from '../endpoints';

const createUserDto = {
  login: 'TEST_AUTH_LOGIN',
  password: 'Tu6!@#%&',
};

const getTokenAndUserId = async (request) => {
  let mockUserId;

  try {
    const signupResponse = await request
      .post(authRoutes.signup)
      .set('Accept', 'application/json')
      .send(createUserDto);

    mockUserId = signupResponse.body.id;
  } catch {
    // User might already exist, we'll get the ID from the JWT token
  }

  const {
    body: { accessToken, refreshToken },
  } = await request
    .post(authRoutes.login)
    .set('Accept', 'application/json')
    .send(createUserDto);

  if (accessToken === undefined) {
    throw new Error('Authorization is not implemented');
  }

  // If we didn't get the userId from signup, extract it from the JWT token
  if (!mockUserId && accessToken) {
    try {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      mockUserId = payload.userId;
    } catch {
      // If we can't decode the token, that's an error
      throw new Error('Authorization is not implemented');
    }
  }

  const token = `Bearer ${accessToken}`;

  return {
    token,
    accessToken,
    refreshToken,
    mockUserId,
    login: createUserDto.login,
  };
};

export default getTokenAndUserId;
