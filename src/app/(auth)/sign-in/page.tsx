import LoginForm from "./_components/login-form";

const LoginPage = () => {
  return (
    <div className="border p-5 rounded-lg shadow-sm space-y-8">
      <div>
        <h1 className="text-lg font-semibold">Sign In</h1>
        <p className="text-sm text-muted-foreground">
          Login to continue using this app.
        </p>
      </div>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
