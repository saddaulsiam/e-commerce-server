
const RegisterService = async (data: any) => {
  const userData = {
    email: data.email,
    displayName: data.displayName,
    emailVerified: data.emailVerified,
  };

  return await User.create(userData);
};


export const AuthServices = {
  registerService,
  loginService,
};
